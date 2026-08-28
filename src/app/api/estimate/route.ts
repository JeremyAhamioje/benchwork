import { NextResponse, type NextRequest } from "next/server";

import {
  DocumentError,
  MAX_UPLOAD_BYTES,
  extractDocumentText,
  sanitiseText,
} from "@/lib/server/extract-document";
import {
  AnalysisError,
  analyseBrief,
  isGeminiConfigured,
} from "@/lib/server/gemini";
import {
  checkEstimateAllowance,
  clientFingerprint,
  consumeEstimate,
  hasUsedEstimate,
  issueSession,
  readSessionId,
  sessionCookie,
} from "@/lib/server/rate-limit";
import { SAMPLE_NOTICE, sampleEstimate } from "@/lib/server/sample-estimate";
import type {
  EstimateError,
  EstimateErrorCode,
  EstimateResponse,
  EstimateStatus,
} from "@/lib/types";

export const runtime = "nodejs";

const MIN_DESCRIPTION_CHARS = 40;
const MAX_DESCRIPTION_CHARS = 6000;
const MAX_HINT_CHARS = 60;

function fail(code: EstimateErrorCode, message: string, status: number) {
  return NextResponse.json<EstimateError>(
    { error: message, code },
    { status },
  );
}

/** Resolves the caller's session, minting one if the cookie is absent or forged. */
function resolveSession(request: NextRequest) {
  const existing = readSessionId(request.cookies.get(sessionCookie.name)?.value);
  if (existing) return { id: existing, cookieValue: null as string | null };

  const issued = issueSession();
  return { id: issued.id, cookieValue: issued.cookieValue };
}

/* --------------------------------- status --------------------------------- */

export async function GET(request: NextRequest) {
  const session = resolveSession(request);
  const fingerprint = clientFingerprint(request.headers);

  const response = NextResponse.json<EstimateStatus>({
    used: hasUsedEstimate(session.id, fingerprint),
  });

  if (session.cookieValue) {
    response.cookies.set(
      sessionCookie.name,
      session.cookieValue,
      sessionCookie.options,
    );
  }
  return response;
}

/* -------------------------------- analysis -------------------------------- */

export async function POST(request: NextRequest) {
  const session = resolveSession(request);
  const fingerprint = clientFingerprint(request.headers);

  const verdict = checkEstimateAllowance(session.id, fingerprint);
  if (!verdict.allowed) {
    return fail(
      verdict.reason,
      verdict.reason === "LIMIT_REACHED"
        ? "You have already used your free project estimate."
        : "Too many requests. Please wait a few minutes and try again.",
      429,
    );
  }

  // Reject oversized bodies before buffering them into memory.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_UPLOAD_BYTES + 64 * 1024) {
    return fail(
      "FILE_TOO_LARGE",
      `Project briefs must be under ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`,
      413,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("INVALID_INPUT", "That request could not be read.", 400);
  }

  const rawHint = form.get("projectType");
  const hint =
    typeof rawHint === "string" ? rawHint.slice(0, MAX_HINT_CHARS) : undefined;

  const file = form.get("file");
  const description = form.get("description");

  let brief: string;
  try {
    if (file instanceof File && file.size > 0) {
      brief = (await extractDocumentText(file)).text;
    } else if (typeof description === "string") {
      const cleaned = sanitiseText(description.slice(0, MAX_DESCRIPTION_CHARS));
      if (cleaned.length < MIN_DESCRIPTION_CHARS) {
        return fail(
          "INVALID_INPUT",
          `Tell us a bit more — at least ${MIN_DESCRIPTION_CHARS} characters so there is something to work from.`,
          400,
        );
      }
      brief = cleaned;
    } else {
      return fail(
        "INVALID_INPUT",
        "Upload a project brief or describe the project.",
        400,
      );
    }
  } catch (error) {
    if (error instanceof DocumentError) {
      return fail(
        error.code,
        error.message,
        error.code === "FILE_TOO_LARGE" ? 413 : 400,
      );
    }
    console.error("[estimate] document intake failed:", error);
    return fail("UNREADABLE_DOCUMENT", "We could not read that file.", 400);
  }

  let payload: EstimateResponse;
  if (isGeminiConfigured()) {
    try {
      payload = { estimate: await analyseBrief(brief, hint), source: "gemini" };
    } catch (error) {
      if (!(error instanceof AnalysisError)) {
        console.error("[estimate] unexpected analysis failure:", error);
      }
      return fail(
        "ANALYSIS_FAILED",
        "The analysis could not be completed right now. Send your brief over directly and we will break it down personally.",
        502,
      );
    }
  } else {
    // No key configured: serve the clearly-labelled sample so the flow still works.
    payload = {
      estimate: sampleEstimate,
      source: "sample",
      notice: SAMPLE_NOTICE,
    };
  }

  consumeEstimate(session.id, fingerprint);

  const response = NextResponse.json<EstimateResponse>(payload);
  if (session.cookieValue) {
    response.cookies.set(
      sessionCookie.name,
      session.cookieValue,
      sessionCookie.options,
    );
  }
  return response;
}
