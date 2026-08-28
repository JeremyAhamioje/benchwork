import { siteConfig } from "@/lib/site-config";
import type { BookingDetails } from "@/lib/types";

/**
 * Turns onboarding form state into pre-filled WhatsApp and email messages.
 * Empty fields are rendered as a dash so the recipient can see what is missing.
 */

const value = (input: string | undefined) => {
  const trimmed = input?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "—";
};

export function buildEnquiryMessage(details: Partial<BookingDetails>): string {
  const lines = [
    "Hello, I'd like to discuss my final-year project.",
    "",
    `Name: ${value(details.fullName)}`,
    `Phone: ${value(details.phone)}`,
    `Email: ${value(details.email)}`,
    `University: ${value(details.university)}`,
    `Department: ${value(details.department)}`,
    `Matric Number: ${value(details.matricNumber)}`,
    "",
    `Project Title: ${value(details.projectTitle)}`,
    `Project Type: ${value(details.projectType)}`,
    `Complexity: ${value(details.complexity)}`,
    `Service Required: ${
      details.services?.length ? details.services.join(", ") : "—"
    }`,
    `Deadline: ${value(details.deadline)}`,
    `Estimated Budget: ${value(details.budget)}`,
    "",
    "Additional Details:",
    value(details.projectDescription),
  ];

  if (details.fileName) {
    lines.push("", `(I have a project brief to send: ${details.fileName})`);
  }

  return lines.join("\n");
}

export function whatsappLink(details: Partial<BookingDetails>): string {
  const text = encodeURIComponent(buildEnquiryMessage(details));
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}

export function emailLink(details: Partial<BookingDetails>): string {
  const subject = encodeURIComponent(
    `Final-year project enquiry — ${value(details.projectTitle)}`,
  );
  const body = encodeURIComponent(buildEnquiryMessage(details));
  return `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
}

/** Link used by the header / hero CTAs, before any form has been filled in. */
export function quickWhatsappLink(): string {
  const text = encodeURIComponent(
    "Hello, I'd like to discuss my final-year project.",
  );
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`;
}
