/**
 * Single source of truth for brand, contact and intake configuration.
 *
 * Everything a non-developer might need to change lives here or in `.env.local`.
 * Values read from `NEXT_PUBLIC_*` are inlined into the client bundle at build
 * time, so they must be referenced statically (never `process.env[key]`).
 */

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Reads a public env var, falling back to a placeholder when unset. */
function publicValue(raw: string | undefined, fallback: string) {
  const trimmed = raw?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export const siteConfig = {
  name: "BENCHWORK",
  legalName: "Benchwork Engineering Studio",
  tagline: "Research. Design. Build. Test.",
  shortDescription:
    "An engineering studio that helps university students turn difficult final-year projects into designed, fabricated, tested prototypes.",

  /**
   * Contact routes. Replace via .env.local — do not hard-code real numbers here.
   * WHATSAPP_NUMBER must be international format, digits only (e.g. 2348012345678).
   */
  whatsappNumber: digitsOnly(
    publicValue(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, "0000000000000"),
  ),
  email: publicValue(
    process.env.NEXT_PUBLIC_PROJECT_EMAIL,
    "hello@example.com",
  ),

  links: {
    linkedin: publicValue(
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
      "https://www.linkedin.com/in/your-profile",
    ),
    devPortfolio: publicValue(
      process.env.NEXT_PUBLIC_DEV_PORTFOLIO_URL,
      "https://example.com/dev-portfolio",
    ),
    engPortfolio: publicValue(
      process.env.NEXT_PUBLIC_ENG_PORTFOLIO_URL,
      "https://example.com/engineering-portfolio",
    ),
  },

  /**
   * Intake capacity. Configurable so availability is never fabricated in code.
   * status: "accepting" | "limited" | "closed"
   * nextSlot: free text, e.g. "Week of 15 September". Empty string hides the line.
   */
  intake: {
    status: publicValue(process.env.NEXT_PUBLIC_INTAKE_STATUS, "accepting"),
    nextSlot: publicValue(process.env.NEXT_PUBLIC_NEXT_SLOT, ""),
  },

  /** Display currency for estimates. The API returns pre-formatted strings. */
  currencySymbol: publicValue(process.env.NEXT_PUBLIC_CURRENCY_SYMBOL, "₦"),
} as const;

export type IntakeStatus = "accepting" | "limited" | "closed";

export const intakeStatusCopy: Record<
  IntakeStatus,
  { label: string; note: string; dot: string }
> = {
  accepting: {
    label: "Accepting projects",
    note: "Projects are handled on a first-come, first-served basis.",
    dot: "bg-emerald-400",
  },
  limited: {
    label: "Limited capacity",
    note: "A small number of build slots remain for this intake.",
    dot: "bg-signal",
  },
  closed: {
    label: "Intake closed",
    note: "The current build queue is full. Send your brief to join the next intake.",
    dot: "bg-muted",
  },
};

export function resolveIntakeStatus(): IntakeStatus {
  const value = siteConfig.intake.status.toLowerCase();
  if (value === "limited" || value === "closed") return value;
  return "accepting";
}

/** True when contact details are still placeholders, so the UI can warn the owner. */
export const contactConfigured =
  siteConfig.whatsappNumber !== "0000000000000" &&
  siteConfig.email !== "hello@example.com";
