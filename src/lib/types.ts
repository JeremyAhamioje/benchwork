/** Shared types for the estimator and the onboarding flow. */

export type EstimatePart = {
  name: string;
  quantity: string;
  notes: string;
};

/**
 * The structured breakdown returned by the estimator API.
 * Mirrors the Gemini response schema in `lib/gemini.ts`.
 */
export type ProjectEstimate = {
  project_summary: string;
  project_title: string;
  project_type: string;
  discipline: string;
  difficulty: string;
  parts: EstimatePart[];
  materials: string[];
  estimated_material_cost: string;
  estimated_engineering_cost: string;
  estimated_workmanship: string;
  estimated_total_cost: string;
  estimated_timeline: string;
  engineering_tasks: string[];
  tools_required: string[];
  risks: string[];
  assumptions: string[];
};

export type EstimateResponse = {
  estimate: ProjectEstimate;
  /** "gemini" for a live analysis, "sample" when running without an API key. */
  source: "gemini" | "sample";
  /** Present when the analysis is illustrative rather than model-generated. */
  notice?: string;
};

export type EstimateErrorCode =
  | "LIMIT_REACHED"
  | "RATE_LIMITED"
  | "INVALID_INPUT"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE"
  | "UNREADABLE_DOCUMENT"
  | "ANALYSIS_FAILED";

export type EstimateError = {
  error: string;
  code: EstimateErrorCode;
};

export type EstimateStatus = {
  /** True when this visitor has already spent their single free estimate. */
  used: boolean;
};

/** Payload assembled by the onboarding form and handed to WhatsApp / email. */
export type BookingDetails = {
  fullName: string;
  phone: string;
  email: string;
  matricNumber: string;
  university: string;
  department: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  complexity: string;
  deadline: string;
  services: string[];
  budget: string;
  fileName?: string;
};
