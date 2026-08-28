"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/cn";

/**
 * The stage labels shown while the brief is being analysed. These describe the
 * steps of our own analysis — nothing here searches the web or any external
 * source, and the UI says so explicitly rather than implying otherwise.
 */
export const analysisStages = [
  "Reading project requirements",
  "Identifying engineering discipline",
  "Extracting components",
  "Estimating material requirements",
  "Calculating fabrication requirements",
  "Estimating timeline",
  "Preparing project breakdown",
] as const;

/** Milliseconds each stage is displayed before advancing (the last one waits). */
export const stageDurations = [700, 750, 900, 900, 950, 800];

const pipeline = [
  "Document",
  "Engineering analysis",
  "Materials",
  "Fabrication",
  "Estimate",
];

export function AnalysisStages({
  activeIndex,
  fileName,
}: {
  activeIndex: number;
  fileName?: string;
}) {
  const reduced = useReducedMotion();

  // Map 7 stages onto the 5 pipeline nodes.
  const pipelineIndex = Math.min(
    pipeline.length - 1,
    Math.floor((activeIndex / (analysisStages.length - 1)) * pipeline.length),
  );

  return (
    <div className="relative overflow-hidden border border-line bg-steel">
      {/* Sweeping highlight along the top edge. */}
      {reduced ? null : (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px overflow-hidden"
        >
          <span className="animate-sweep block h-px w-1/3 bg-gradient-to-r from-transparent via-signal to-transparent" />
        </div>
      )}

      <div className="border-b border-line-soft px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <Spinner />
          <p className="text-base font-semibold tracking-tight">
            Analysing project brief
            <span className="text-signal">…</span>
          </p>
        </div>
        {fileName ? (
          <p className="tech mt-2 normal-case tracking-[0.08em]">{fileName}</p>
        ) : null}
      </div>

      {/* ------------------------------ pipeline ------------------------------ */}
      <div className="no-scrollbar overflow-x-auto border-b border-line-soft px-5 py-6 sm:px-7">
        <ol className="flex min-w-max items-center gap-2">
          {pipeline.map((node, index) => {
            const state =
              index < pipelineIndex
                ? "done"
                : index === pipelineIndex
                  ? "active"
                  : "todo";

            return (
              <li key={node} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-2.5 border px-3 py-2.5 transition-colors duration-500",
                    state === "active" &&
                      "border-signal/60 bg-signal/10 text-bone",
                    state === "done" && "border-line bg-ink text-muted",
                    state === "todo" && "border-line-soft bg-ink text-faint",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500",
                      state === "active" && "bg-signal animate-pulse-dot",
                      state === "done" && "bg-muted",
                      state === "todo" && "bg-line",
                    )}
                    aria-hidden
                  />
                  <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] whitespace-nowrap">
                    {node}
                  </span>
                </div>
                {index < pipeline.length - 1 ? (
                  <span
                    aria-hidden
                    className={cn(
                      "h-px w-5 transition-colors duration-500",
                      index < pipelineIndex ? "bg-signal/60" : "bg-line",
                    )}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      {/* ------------------------------- stages ------------------------------- */}
      <ul
        className="flex flex-col gap-0.5 px-5 py-5 sm:px-7"
        aria-live="polite"
        aria-busy="true"
      >
        {analysisStages.map((stage, index) => {
          const state =
            index < activeIndex
              ? "done"
              : index === activeIndex
                ? "active"
                : "todo";

          return (
            <motion.li
              key={stage}
              initial={reduced ? false : { opacity: 0, x: -6 }}
              animate={{
                opacity: state === "todo" ? 0.42 : 1,
                x: 0,
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 py-1.5"
            >
              <span
                className={cn(
                  "w-4 shrink-0 text-center font-mono text-sm leading-none",
                  state === "done" && "text-signal",
                  state === "active" && "text-bone",
                  state === "todo" && "text-faint",
                )}
                aria-hidden
              >
                {state === "done" ? "✓" : state === "active" ? "◉" : "○"}
              </span>
              <span
                className={cn(
                  "text-sm",
                  state === "todo" ? "text-faint" : "text-bone",
                )}
              >
                {stage}
              </span>
            </motion.li>
          );
        })}
      </ul>

      <p className="border-t border-line-soft px-5 py-3.5 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.1em] text-faint sm:px-7">
        Analysis runs on your brief only — no external sources are searched.
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="block h-4 w-4 shrink-0 animate-spin rounded-full border border-line border-t-signal"
      style={{ animationDuration: "0.9s" }}
    />
  );
}
