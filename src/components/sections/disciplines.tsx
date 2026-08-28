"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Container, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import { disciplines } from "@/lib/content";

export function Disciplines() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges]);

  const nudge = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.8, 520),
      behavior: "smooth",
    });
  };

  return (
    <section id="disciplines" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            index="01"
            eyebrow="Departments"
            title={
              <>
                Department-agnostic.
                <br />
                Mechanically obsessed.
              </>
            }
            lead="We work across engineering departments, but the deepest bench is in mechanical and practical, hands-on builds."
          />

          <div className="flex shrink-0 gap-2">
            <ScrollButton
              direction="left"
              disabled={atStart}
              onClick={() => nudge(-1)}
            />
            <ScrollButton
              direction="right"
              disabled={atEnd}
              onClick={() => nudge(1)}
            />
          </div>
        </div>
      </Container>

      <div
        ref={trackRef}
        onScroll={syncEdges}
        className="no-scrollbar edge-fade mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 md:px-8"
      >
        {disciplines.map((discipline) => (
          <article
            key={discipline.id}
            className={cn(
              "group relative flex shrink-0 snap-start flex-col justify-between border p-6 transition-colors duration-300",
              "w-[85vw] sm:w-[22rem] md:w-[24rem]",
              discipline.primary
                ? "border-signal/45 bg-gradient-to-b from-signal/[0.09] to-transparent md:w-[27rem]"
                : "border-line bg-steel hover:border-line hover:bg-steel-2",
            )}
          >
            <span className="ticked" aria-hidden />

            <div>
              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "tech",
                    discipline.primary && "text-signal",
                  )}
                >
                  {discipline.index}
                </span>
                {discipline.primary ? (
                  <span className="border border-signal/40 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-signal">
                    Primary specialty
                  </span>
                ) : null}
              </div>

              <h3
                className={cn(
                  "mt-6 text-2xl font-bold leading-[1.05] tracking-tight",
                  discipline.primary && "text-[1.7rem]",
                )}
              >
                {discipline.name}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {discipline.blurb}
              </p>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-2 gap-y-2">
              {discipline.skills.map((skill) => (
                <li
                  key={skill}
                  className="border border-line-soft bg-ink/60 px-2.5 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </article>
        ))}

        {/* Trailing spacer so the last card can rest clear of the edge. */}
        <div className="w-1 shrink-0" aria-hidden />
      </div>
    </section>
  );
}

function ScrollButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Scroll ${direction}`}
      className="flex h-11 w-11 items-center justify-center border border-line text-bone transition-all hover:border-bone disabled:opacity-30 disabled:hover:border-line"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d={direction === "left" ? "M15 5 8 12l7 7" : "M9 5l7 7-7 7"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="square"
        />
      </svg>
    </button>
  );
}
