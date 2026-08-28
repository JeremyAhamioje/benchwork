import "server-only";

/**
 * Document intake: validate an uploaded brief, then pull plain text out of it.
 *
 * Nothing here trusts the client. The declared MIME type is only a hint — the
 * file is also checked by extension and by its magic bytes before it is parsed.
 */

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_EXTRACTED_CHARS = 24_000;
const MIN_USEFUL_CHARS = 120;

const ACCEPTED = {
  pdf: {
    ext: [".pdf"],
    /** "%PDF" */
    magic: [0x25, 0x50, 0x44, 0x46],
  },
  docx: {
    ext: [".docx"],
    /** DOCX is a ZIP container, so it opens with the "PK" local file header. */
    magic: [0x50, 0x4b, 0x03, 0x04],
  },
} as const;

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export type DocumentKind = keyof typeof ACCEPTED;

export class DocumentError extends Error {
  constructor(
    readonly code:
      | "FILE_TOO_LARGE"
      | "UNSUPPORTED_FILE"
      | "UNREADABLE_DOCUMENT",
    message: string,
  ) {
    super(message);
    this.name = "DocumentError";
  }
}

function startsWith(bytes: Uint8Array, magic: readonly number[]) {
  return magic.every((byte, index) => bytes[index] === byte);
}

/** Decides the file kind from extension + magic bytes, ignoring a spoofed MIME. */
function detectKind(fileName: string, bytes: Uint8Array): DocumentKind {
  const lower = fileName.toLowerCase();

  for (const [kind, spec] of Object.entries(ACCEPTED) as [
    DocumentKind,
    (typeof ACCEPTED)[DocumentKind],
  ][]) {
    const extensionMatches = spec.ext.some((ext) => lower.endsWith(ext));
    if (extensionMatches && startsWith(bytes, spec.magic)) return kind;
  }

  throw new DocumentError(
    "UNSUPPORTED_FILE",
    "Only PDF and DOCX project briefs are supported.",
  );
}

/**
 * Strips control characters (except tab and newline) and invisible formatting
 * characters. Written as a code-point filter rather than a regex, so this source
 * file never has to contain the literal characters it is guarding against.
 */
function stripUnsafeChars(input: string): string {
  let out = "";
  for (const char of input) {
    const code = char.codePointAt(0) ?? 0;
    const isControl = (code < 32 && code !== 9 && code !== 10) || code === 127;
    const isInvisible =
      (code >= 0x200b && code <= 0x200f) || // zero-width + directional marks
      (code >= 0x202a && code <= 0x202e) || // bidi overrides
      code === 0x2060 ||
      code === 0xfeff;

    if (isControl) out += " ";
    else if (!isInvisible) out += char;
  }
  return out;
}

/**
 * Normalises extracted text and caps its length. The result is handed to a
 * model, so it is quoted as data at the prompt boundary rather than trusted.
 */
export function sanitiseText(raw: string): string {
  const cleaned = stripUnsafeChars(raw)
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleaned.length > MAX_EXTRACTED_CHARS
    ? `${cleaned.slice(0, MAX_EXTRACTED_CHARS)}\n\n[brief truncated at ${MAX_EXTRACTED_CHARS} characters]`
    : cleaned;
}

export type ExtractedDocument = {
  kind: DocumentKind;
  fileName: string;
  text: string;
};

export async function extractDocumentText(
  file: File,
): Promise<ExtractedDocument> {
  if (file.size === 0) {
    throw new DocumentError("UNSUPPORTED_FILE", "That file is empty.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new DocumentError(
      "FILE_TOO_LARGE",
      `Project briefs must be under ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = detectKind(file.name, buffer);

  let raw = "";
  try {
    if (kind === "pdf") {
      const { extractText } = await import("unpdf");
      const result = await extractText(new Uint8Array(buffer), {
        mergePages: true,
      });
      raw = result.text;
    } else {
      const mammoth = (await import("mammoth")).default;
      const result = await mammoth.extractRawText({ buffer });
      raw = result.value;
    }
  } catch {
    // Deliberately opaque: parser internals must not reach the client.
    throw new DocumentError(
      "UNREADABLE_DOCUMENT",
      "We could not read that document. Try re-exporting it, or describe the project instead.",
    );
  }

  const text = sanitiseText(raw);
  if (text.length < MIN_USEFUL_CHARS) {
    throw new DocumentError(
      "UNREADABLE_DOCUMENT",
      "There was not enough readable text in that file — scanned or image-only documents cannot be analysed. Describe the project instead.",
    );
  }

  return { kind, fileName: file.name.slice(0, 120), text };
}
