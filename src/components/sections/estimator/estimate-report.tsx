"use client";

import { motion, useReducedMotion } from "motion/react";

import { Arrow, CtaButton, CtaLink } from "@/components/ui/cta";
import { cn } from "@/lib/cn";
import type { EstimateResponse, ProjectEstimate } from "@/lib/types";

export function EstimateReport({
  result,
  onDiscuss,
  onReset,
}: {
  result: EstimateResponse;
  onDiscuss: (estimate: ProjectEstimate) => void;
  onReset: () => void;
}) {
  const reduced = useReducedMotion();
  const { estimate } = result;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border border-line bg-steel"
    >
      {/* -------------------------------- header ------------------------------- */}
      <header className="border-b border-line px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="tech text-signal">Report · BW-EST</p>
            <h3 className="display mt-3 text-[clamp(1.6rem,4vw,2.4rem)]">
              Your Project Breakdown
            </h3>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-faint underline-offset-4 transition-colors hover:text-bone hover:underline"
          >
            Start over
          </button>
        </div>

        <p className="mt-5 border border-line-soft bg-ink px-4 py-3 font-mono text-[0.64rem] uppercase leading-relaxed tracking-[0.1em] text-muted">
          AI-generated preliminary estimate — final pricing may change after
          project review.
        </p>

        {result.notice ? (
          <p className="mt-3 border border-signal/35 bg-signal/[0.07] px-4 py-3 text-sm leading-relaxed text-bone">
            {result.notice}
          </p>
        ) : null}
      </header>

      {/* --------------------------------- meta -------------------------------- */}
      <dl className="grid gap-px border-b border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        <Meta label="Project" value={estimate.project_title} />
        <Meta label="Discipline" value={estimate.discipline} />
        <Meta label="Difficulty" value={estimate.difficulty} accent />
        <Meta label="Estimated timeline" value={estimate.estimated_timeline} />
      </dl>

      <div className="px-5 py-7 sm:px-7">
        <p className="max-w-3xl leading-relaxed text-muted">
          {estimate.project_summary}
        </p>
      </div>

      {/* --------------------------------- cost -------------------------------- */}
      <section className="border-t border-line px-5 py-7 sm:px-7">
        <SubHeading>Estimated cost</SubHeading>

        <div className="mt-5 grid gap-px border border-line bg-line lg:grid-cols-3">
          <CostLine label="Materials" value={estimate.estimated_material_cost} />
          <CostLine
            label="Engineering / design"
            value={estimate.estimated_engineering_cost}
          />
          <CostLine
            label="Workmanship / fabrication"
            value={estimate.estimated_workmanship}
          />
        </div>

        <div className="mt-px flex flex-col gap-2 border border-line border-t-0 bg-signal/[0.07] px-5 py-5 sm:flex-row sm:items-baseline sm:justify-between">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-bone">
            Estimated total
          </span>
          <span className="text-2xl font-bold tracking-tight text-signal md:text-3xl">
            {estimate.estimated_total_cost}
          </span>
        </div>
      </section>

      {/* ------------------------------ components ----------------------------- */}
      {estimate.parts.length ? (
        <section className="border-t border-line px-5 py-7 sm:px-7">
          <SubHeading>Required components</SubHeading>

          {/* Desktop: a real table. Mobile: stacked rows, no sideways scroll. */}
          <div className="mt-5 hidden overflow-hidden border border-line md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-ink">
                  <th className="px-4 py-3 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-faint">
                    Component
                  </th>
                  <th className="w-28 px-4 py-3 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-faint">
                    Qty
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-faint">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {estimate.parts.map((part, index) => (
                  <tr
                    key={`${part.name}-${index}`}
                    className="border-b border-line-soft last:border-b-0 hover:bg-ink/60"
                  >
                    <td className="px-4 py-3.5 font-medium">{part.name}</td>
                    <td className="px-4 py-3.5 font-mono text-muted">
                      {part.quantity || "—"}
                    </td>
                    <td className="px-4 py-3.5 text-muted">
                      {part.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-5 flex flex-col gap-px border border-line bg-line md:hidden">
            {estimate.parts.map((part, index) => (
              <li key={`${part.name}-m-${index}`} className="bg-steel p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{part.name}</p>
                  <span className="shrink-0 border border-line-soft px-2 py-1 font-mono text-[0.64rem] text-muted">
                    {part.quantity || "—"}
                  </span>
                </div>
                {part.notes ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {part.notes}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ------------------------- engineering work ---------------------------- */}
      <section className="grid border-t border-line lg:grid-cols-2">
        <div className="border-b border-line px-5 py-7 sm:px-7 lg:border-b-0 lg:border-r">
          <SubHeading>Engineering work</SubHeading>
          <ol className="mt-5 flex flex-col gap-2.5">
            {estimate.engineering_tasks.map((task, index) => (
              <li key={task} className="flex gap-3 text-sm leading-relaxed">
                <span className="shrink-0 font-mono text-[0.7rem] text-signal">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{task}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="px-5 py-7 sm:px-7">
          <SubHeading>Materials &amp; tooling</SubHeading>

          {estimate.materials.length ? (
            <ul className="mt-5 flex flex-col gap-2">
              {estimate.materials.map((material) => (
                <li
                  key={material}
                  className="flex gap-3 text-sm leading-relaxed text-muted"
                >
                  <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-signal/60" />
                  {material}
                </li>
              ))}
            </ul>
          ) : null}

          {estimate.tools_required.length ? (
            <ul className="mt-6 flex flex-wrap gap-2">
              {estimate.tools_required.map((tool) => (
                <li
                  key={tool}
                  className="border border-line-soft bg-ink px-2.5 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* -------------------------- assumptions & risks ------------------------ */}
      <section className="grid border-t border-line lg:grid-cols-2">
        <div className="border-b border-line px-5 py-7 sm:px-7 lg:border-b-0 lg:border-r">
          <SubHeading>Assumptions</SubHeading>
          <p className="tech mt-2 normal-case tracking-[0.06em]">
            What the brief did not say
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {estimate.assumptions.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-muted">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-5 py-7 sm:px-7">
          <SubHeading>Risks</SubHeading>
          <p className="tech mt-2 normal-case tracking-[0.06em]">
            What could move cost or time
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {estimate.risks.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 border border-signal/70"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------- CTA --------------------------------- */}
      <footer className="flex flex-col gap-4 border-t border-line bg-ink px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="max-w-md text-sm leading-relaxed text-muted">
          Want this reviewed properly? We will go through the brief, confirm the
          scope and give you a firm price.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <CtaButton onClick={() => onDiscuss(estimate)}>
            Discuss This Project
          </CtaButton>
          <CtaLink href="#book" variant="ghost" className="px-2">
            Onboarding form <Arrow />
          </CtaLink>
        </div>
      </footer>
    </motion.div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-bone">
      {children}
    </h4>
  );
}

function Meta({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-steel px-5 py-5 sm:px-7">
      <dt className="tech">{label}</dt>
      <dd
        className={cn(
          "mt-2.5 text-base font-semibold leading-snug tracking-tight",
          accent && "text-signal",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function CostLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-steel px-5 py-5">
      <p className="tech">{label}</p>
      <p className="mt-2.5 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}
