"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { useProjectBrief } from "@/components/project-brief-context";
import {
  AnalysisStages,
  analysisStages,
  stageDurations,
} from "@/components/sections/estimator/analysis-stages";
import { EstimateReport } from "@/components/sections/estimator/estimate-report";
import {
  UploadPanel,
  type EstimatorMode,
} from "@/components/sections/estimator/upload-panel";
import { Arrow, CtaLink } from "@/components/ui/cta";
import { Container, SectionHeader } from "@/components/ui/section";
import { buildFilters, complexityOptions } from "@/lib/content";
import type {
  EstimateError,
  EstimateResponse,
  EstimateStatus,
  ProjectEstimate,
} from "@/lib/types";

/**
 * Floor on how quickly the report may appear. The sample path answers in
 * milliseconds; without this the stage sequence would flash past before anyone
 * could read it. The stages describe our own analysis and nothing else.
 */
const MIN_ANALYSIS_MS = 2400;

type Phase = "idle" | "analysing" | "done";

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * The booking form's project type is a fixed list. Gemini answers in free text,
 * so anything that is not one of the options is dropped rather than written to a
 * select that cannot display it.
 */
function toProjectType(value: string): string {
  const candidate = value.trim().toLowerCase();
  return (
    buildFilters.find(
      (option) => option !== "All" && option.toLowerCase() === candidate,
    ) ?? ""
  );
}

/** Maps Gemini's free-text difficulty onto the form's complexity options. */
function toComplexity(difficulty: string): string {
  const value = difficulty.trim().toLowerCase();
  const match = complexityOptions.find(
    (option) => option.toLowerCase() === value,
  );
  if (match) return match;
  if (value.includes("high") || value.includes("complex")) return "Very complex";
  if (value.includes("advanc")) return "Advanced";
  if (value.includes("inter") || value.includes("moder")) return "Moderate";
  if (value.includes("basic") || value.includes("begin") || value.includes("low"))
    return "Straightforward";
  return "Not sure yet";
}

export function Estimator() {
  const reduced = useReducedMotion();
  const { applyPrefill } = useProjectBrief();

  const [mode, setMode] = useState<EstimatorMode>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");

  const [phase, setPhase] = useState<Phase>("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [limitReached, setLimitReached] = useState(false);

  const busy = phase === "analysing";

  /* Ask the server whether this visitor has already spent their estimate. The
     client is never the authority here — the POST re-checks. */
  useEffect(() => {
    let cancelled = false;

    fetch("/api/estimate")
      .then((response) => (response.ok ? response.json() : null))
      .then((status: EstimateStatus | null) => {
        if (!cancelled && status?.used) setLimitReached(true);
      })
      .catch(() => {
        /* Status is a convenience; the POST still enforces the limit. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* Walk the stage list while the request is in flight. The final stage has no
     duration — it holds until the response lands. */
  useEffect(() => {
    if (phase !== "analysing") return;
    if (stageIndex >= analysisStages.length - 1) return;

    const duration = stageDurations[stageIndex] ?? 800;
    const timer = setTimeout(() => setStageIndex((index) => index + 1), duration);
    return () => clearTimeout(timer);
  }, [phase, stageIndex]);

  const handleFileChange = useCallback(
    (candidate: File | null, message?: string) => {
      setFile(candidate);
      setError(message ?? null);
    },
    [],
  );

  const submit = useCallback(async () => {
    if (busy || limitReached) return;

    setError(null);
    setStageIndex(0);
    setPhase("analysing");
    const startedAt = Date.now();

    const form = new FormData();
    if (mode === "upload" && file) {
      form.append("file", file);
    } else {
      form.append("description", description);
    }
    if (projectType) form.append("projectType", projectType);

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        body: form,
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const failure = payload as EstimateError | null;
        if (failure?.code === "LIMIT_REACHED") {
          setLimitReached(true);
          setPhase("idle");
          return;
        }
        setError(
          failure?.error ??
            "That analysis could not be completed. Send your brief over and we will break it down personally.",
        );
        setPhase("idle");
        return;
      }

      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_ANALYSIS_MS) await wait(MIN_ANALYSIS_MS - elapsed);
      setStageIndex(analysisStages.length - 1);
      await wait(reduced ? 0 : 320);

      setResult(payload as EstimateResponse);
      // The free estimate is spent — "Start over" now lands on the limit card.
      setLimitReached(true);
      setPhase("done");
    } catch {
      setError(
        "We could not reach the analyser. Check your connection and try again.",
      );
      setPhase("idle");
    }
  }, [busy, description, file, limitReached, mode, projectType, reduced]);

  const reset = useCallback(() => {
    setResult(null);
    setFile(null);
    setDescription("");
    setProjectType("");
    setStageIndex(0);
    setError(null);
    setPhase("idle");
  }, []);

  const discuss = useCallback(
    (estimate: ProjectEstimate) => {
      applyPrefill({
        projectTitle: estimate.project_title,
        projectDescription: estimate.project_summary,
        projectType: projectType || toProjectType(estimate.project_type),
        complexity: toComplexity(estimate.difficulty),
        budget: estimate.estimated_total_cost,
        fileName: file?.name,
      });
    },
    [applyPrefill, file, projectType],
  );

  return (
    <section id="estimate" className="relative scroll-mt-24 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-graphite/60"
      />
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />

      <Container className="relative">
        <SectionHeader
          index="04"
          eyebrow="AI estimator"
          title={
            <>
              Don&rsquo;t know what your
              <br className="hidden sm:block" /> project will cost?
            </>
          }
          lead="Upload your project brief and we'll break it down into the materials, engineering work and time required to bring it to life."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait" initial={false}>
              {limitReached && phase !== "done" ? (
                <Panel key="limit">
                  <LimitReached />
                </Panel>
              ) : phase === "analysing" ? (
                <Panel key="analysing">
                  <AnalysisStages
                    activeIndex={stageIndex}
                    fileName={mode === "upload" ? file?.name : undefined}
                  />
                </Panel>
              ) : phase === "done" && result ? (
                <Panel key="report">
                  <EstimateReport
                    result={result}
                    onDiscuss={discuss}
                    onReset={reset}
                  />
                </Panel>
              ) : (
                <Panel key="form">
                  <UploadPanel
                    mode={mode}
                    onModeChange={setMode}
                    file={file}
                    onFileChange={handleFileChange}
                    description={description}
                    onDescriptionChange={setDescription}
                    projectType={projectType}
                    onProjectTypeChange={setProjectType}
                    onSubmit={submit}
                    busy={busy}
                    error={error}
                  />
                </Panel>
              )}
            </AnimatePresence>
          </div>

          {/* ------------------------------ side notes ----------------------------- */}
          <aside className="flex flex-col gap-px self-start border border-line bg-line lg:col-span-4">
            <SideNote
              index="A"
              title="What you get back"
              body="A component list, the engineering work involved, a materials, workmanship and total figure, plus the assumptions behind them."
            />
            <SideNote
              index="B"
              title="Why workmanship is separate"
              body="Materials are the easy half. The hours behind the machining, welding, wiring and testing are what most estimates quietly leave out."
            />
            <SideNote
              index="C"
              title="It is preliminary"
              body="Numbers move once we confirm the scope, the market price of stock and what your supervisor actually requires."
            />
            <div className="bg-steel px-5 py-6">
              <p className="tech">Rather talk it through?</p>
              <CtaLink href="#book" variant="ghost" className="mt-3">
                Book a project instead <Arrow />
              </CtaLink>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

/** Cross-fade wrapper so the panel swap reads as one surface changing state. */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SideNote({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-steel px-5 py-6">
      <div className="flex items-center gap-3">
        <span className="tech text-signal">{index}</span>
        <span className="h-px w-6 bg-line" aria-hidden />
        <p className="text-sm font-semibold tracking-tight">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function LimitReached() {
  return (
    <div className="relative border border-line bg-steel px-5 py-10 sm:px-8 sm:py-14">
      <div
        aria-hidden
        className="blueprint-fine pointer-events-none absolute inset-0 opacity-30"
      />
      <div className="relative max-w-xl">
        <p className="tech text-signal">Estimate used</p>
        <h3 className="display mt-4 text-[clamp(1.5rem,3.6vw,2.2rem)]">
          You&rsquo;ve already used your free project estimate.
        </h3>
        <p className="mt-5 leading-relaxed text-muted">
          Want us to review your project personally? Send the brief across and we
          will go through it properly — scope, materials, workmanship and a firm
          price.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <CtaLink href="#book" size="lg">
            Book a Project
          </CtaLink>
          <CtaLink href="#work" variant="ghost" className="px-2">
            See sample projects <Arrow />
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
