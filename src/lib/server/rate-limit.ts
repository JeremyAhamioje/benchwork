import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Server-side limiting for the estimator.
 *
 * Two independent layers, because neither is sufficient on its own:
 *
 *  1. A signed, httpOnly session cookie the browser cannot forge. Clearing
 *     cookies defeats it, which is why layer 2 exists.
 *  2. An in-memory record keyed by a hash of the caller's IP, which survives a
 *     cookie wipe or a private window.
 *
 * The store is process-local, so it resets on redeploy and is not shared across
 * serverless instances. That is an acceptable MVP trade-off; swapping
 * `memoryStore` for Redis/Upstash is the only change needed to make it durable.
 */

const COOKIE_NAME = "bw_sid";
const ESTIMATE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const BURST_WINDOW_MS = 10 * 60 * 1000;
const BURST_MAX = 5;

function secret(): string {
  const configured = process.env.ESTIMATE_SECRET?.trim();
  if (configured && configured.length >= 16) return configured;

  if (process.env.NODE_ENV === "production") {
    // Fail loudly rather than signing cookies with a guessable key in prod.
    throw new Error(
      "ESTIMATE_SECRET is not set (needs at least 16 characters).",
    );
  }
  return "dev-only-insecure-estimate-secret";
}

/* ------------------------------ signed session ---------------------------- */

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/** Returns the session id carried by a valid cookie, or null. */
export function readSessionId(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const separator = cookieValue.lastIndexOf(".");
  if (separator <= 0) return null;

  const id = cookieValue.slice(0, separator);
  const signature = cookieValue.slice(separator + 1);
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(id)) return null;

  return safeEqual(signature, sign(id)) ? id : null;
}

export function issueSession(): { id: string; cookieValue: string } {
  const id = randomBytes(16).toString("base64url");
  return { id, cookieValue: `${id}.${sign(id)}` };
}

export const sessionCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(ESTIMATE_TTL_MS / 1000),
  },
};

/* -------------------------------- the store -------------------------------- */

type Entry = { expiresAt: number; hits: number };

const memoryStore = new Map<string, Entry>();

function prune(now: number) {
  if (memoryStore.size < 500) return;
  for (const [key, entry] of memoryStore) {
    if (entry.expiresAt <= now) memoryStore.delete(key);
  }
}

function isMarked(key: string, now: number): boolean {
  const entry = memoryStore.get(key);
  if (!entry) return false;
  if (entry.expiresAt <= now) {
    memoryStore.delete(key);
    return false;
  }
  return true;
}

function mark(key: string, ttlMs: number, now: number) {
  prune(now);
  memoryStore.set(key, { expiresAt: now + ttlMs, hits: 1 });
}

/** Sliding-window counter used for the per-IP burst guard. */
function countHit(key: string, windowMs: number, now: number): number {
  const entry = memoryStore.get(key);
  if (!entry || entry.expiresAt <= now) {
    memoryStore.set(key, { expiresAt: now + windowMs, hits: 1 });
    return 1;
  }
  entry.hits += 1;
  return entry.hits;
}

/* --------------------------------- callers -------------------------------- */

/** Hashes the client IP so raw addresses are never held in memory. */
export function clientFingerprint(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip =
    forwarded ||
    headers.get("x-real-ip")?.trim() ||
    headers.get("cf-connecting-ip")?.trim() ||
    "unknown";

  return createHmac("sha256", secret())
    .update(`${ip}|${headers.get("user-agent") ?? ""}`)
    .digest("base64url")
    .slice(0, 24);
}

/**
 * Development escape hatch: exercise the estimator repeatedly without spending
 * the one-per-visitor allowance or tripping the burst guard.
 *
 * Deliberately double-gated. The flag is only consulted outside production, so
 * setting ESTIMATE_UNLIMITED in a deployed environment does nothing. The limit
 * is what stops a public form from draining the API key, and no stray env var
 * should be able to switch that off.
 */
function unlimited(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const flag = process.env.ESTIMATE_UNLIMITED?.trim().toLowerCase();
  return flag === "1" || flag === "true" || flag === "yes";
}

export type LimitVerdict =
  | { allowed: true }
  | { allowed: false; reason: "LIMIT_REACHED" | "RATE_LIMITED" };

/** Checks whether this caller may spend an estimate. Does not consume it. */
export function checkEstimateAllowance(
  sessionId: string | null,
  fingerprint: string,
): LimitVerdict {
  if (unlimited()) return { allowed: true };

  const now = Date.now();

  if (sessionId && isMarked(`used:s:${sessionId}`, now)) {
    return { allowed: false, reason: "LIMIT_REACHED" };
  }
  if (isMarked(`used:f:${fingerprint}`, now)) {
    return { allowed: false, reason: "LIMIT_REACHED" };
  }
  if (countHit(`burst:${fingerprint}`, BURST_WINDOW_MS, now) > BURST_MAX) {
    return { allowed: false, reason: "RATE_LIMITED" };
  }

  return { allowed: true };
}

/** Read-only variant for the status endpoint — never touches the burst counter. */
export function hasUsedEstimate(
  sessionId: string | null,
  fingerprint: string,
): boolean {
  if (unlimited()) return false;

  const now = Date.now();
  return (
    (sessionId ? isMarked(`used:s:${sessionId}`, now) : false) ||
    isMarked(`used:f:${fingerprint}`, now)
  );
}

/** Called only after a successful analysis, so failures do not burn the quota. */
export function consumeEstimate(sessionId: string, fingerprint: string) {
  if (unlimited()) return;

  const now = Date.now();
  mark(`used:s:${sessionId}`, ESTIMATE_TTL_MS, now);
  mark(`used:f:${fingerprint}`, ESTIMATE_TTL_MS, now);
}
