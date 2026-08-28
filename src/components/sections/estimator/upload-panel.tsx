"use client";

import { useId, useRef, useState, type DragEvent } from "react";

import { CtaButton } from "@/components/ui/cta";
import { cn } from "@/lib/cn";
import { buildFilters } from "@/lib/content";

export const MAX_CLIENT_BYTES = 8 * 1024 * 1024;
const ACCEPT = ".pdf,.docx";

export type EstimatorMode = "upload" | "describe";

function isAllowed(file: File) {
  const name = file.name.toLowerCase();
  return name.endsWith(".pdf") || name.endsWith(".docx");
}

export function UploadPanel({
  mode,
  onModeChange,
  file,
  onFileChange,
  description,
  onDescriptionChange,
  projectType,
  onProjectTypeChange,
  onSubmit,
  busy,
  error,
}: {
  mode: EstimatorMode;
  onModeChange: (mode: EstimatorMode) => void;
  file: File | null;
  onFileChange: (file: File | null, error?: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  projectType: string;
  onProjectTypeChange: (value: string) => void;
  onSubmit: () => void;
  busy: boolean;
  error: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const selectId = useId();
  const textareaId = useId();

  /** Client-side checks are for fast feedback only; the server re-validates. */
  const accept = (candidate: File | undefined) => {
    if (!candidate) return;
    if (!isAllowed(candidate)) {
      onFileChange(null, "Only PDF and DOCX files can be analysed.");
      return;
    }
    if (candidate.size > MAX_CLIENT_BYTES) {
      onFileChange(null, "That file is over the 8 MB limit.");
      return;
    }
    onFileChange(candidate);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files?.[0]);
  };

  const canSubmit =
    !busy && (mode === "upload" ? Boolean(file) : description.trim().length >= 40);

  return (
    <div className="border border-line bg-steel">
      {/* --------------------------------- tabs -------------------------------- */}
      <div
        role="tablist"
        aria-label="How to send your project"
        className="grid grid-cols-2 border-b border-line"
      >
        {(
          [
            ["upload", "Upload a brief"],
            ["describe", "Describe it instead"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            role="tab"
            type="button"
            aria-selected={mode === value}
            onClick={() => onModeChange(value)}
            className={cn(
              "relative px-4 py-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] transition-colors",
              mode === value
                ? "bg-ink text-bone"
                : "text-faint hover:text-muted",
            )}
          >
            {label}
            {mode === value ? (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px bg-signal"
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-7">
        {mode === "upload" ? (
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "relative flex flex-col items-center justify-center border border-dashed px-6 py-12 text-center transition-colors duration-300 sm:py-16",
              dragging
                ? "border-signal bg-signal/[0.06]"
                : "border-line bg-ink hover:border-muted",
            )}
          >
            <div className="blueprint-fine pointer-events-none absolute inset-0 opacity-40" />

            <div className="relative flex flex-col items-center">
              <DocumentGlyph active={Boolean(file) || dragging} />

              {file ? (
                <>
                  <p className="mt-6 max-w-full truncate px-2 text-base font-semibold">
                    {file.name}
                  </p>
                  <p className="tech mt-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · ready
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onFileChange(null);
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint underline-offset-4 transition-colors hover:text-signal hover:underline"
                  >
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-6 text-lg font-semibold tracking-tight">
                    Drop your project brief
                  </p>
                  <p className="tech mt-2.5">PDF or DOCX · max 8 MB</p>
                  <CtaButton
                    type="button"
                    variant="outline"
                    className="mt-6"
                    onClick={() => inputRef.current?.click()}
                  >
                    Upload Project
                  </CtaButton>
                </>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(event) => accept(event.target.files?.[0])}
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor={textareaId}
              className="text-base font-semibold tracking-tight"
            >
              Describe your project
            </label>
            <p className="tech mt-2 normal-case tracking-[0.06em]">
              What it is, what it should do, and anything your supervisor
              insisted on.
            </p>
            <textarea
              id={textareaId}
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              rows={7}
              maxLength={6000}
              placeholder="e.g. A motorised cassava grating machine for a 100 kg/hr throughput, mild steel frame, single-phase motor, with a stainless hopper…"
              className="mt-4 w-full resize-y border border-line bg-ink p-4 text-sm leading-relaxed text-bone placeholder:text-faint focus:border-signal focus:outline-none"
            />
            <p className="tech mt-2 text-right">
              {description.trim().length} / 6000
            </p>
          </div>
        )}

        {/* ---------------------------- project type ---------------------------- */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label
            htmlFor={selectId}
            className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted"
          >
            Project type (optional)
          </label>
          <div className="relative">
            <select
              id={selectId}
              value={projectType}
              onChange={(event) => onProjectTypeChange(event.target.value)}
              className="bare-select h-11 w-full min-w-[15rem] cursor-pointer border border-line bg-ink pl-4 pr-10 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-bone transition-colors hover:border-signal focus:border-signal"
            >
              <option value="">Not sure / other</option>
              {buildFilters
                .filter((option) => option !== "All")
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-signal"
            >
              ▼
            </span>
          </div>
        </div>

        {error ? (
          <p
            role="alert"
            className="mt-5 border border-signal/40 bg-signal/[0.07] px-4 py-3 text-sm text-bone"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CtaButton
            type="button"
            size="lg"
            onClick={onSubmit}
            disabled={!canSubmit}
          >
            {busy ? "Analysing…" : "Break Down My Project"}
          </CtaButton>
          <p className="text-xs leading-relaxed text-faint">
            One free estimate per visitor. Your brief is used for this analysis
            only.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Document glyph that fills in once a file is staged. */
function DocumentGlyph({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 48 56"
      className={cn(
        "h-14 w-12 transition-colors duration-300",
        active ? "text-signal" : "text-line",
      )}
      aria-hidden
    >
      <path
        d="M4 2h26l14 14v38H4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M30 2v14h14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M13 28h22M13 36h22M13 44h13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.55"
      />
    </svg>
  );
}
