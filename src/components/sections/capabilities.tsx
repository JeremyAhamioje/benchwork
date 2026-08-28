"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Arrow, CtaLink } from "@/components/ui/cta";
import { Container, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/cn";
import {
  buildFilters,
  buildImageUrl,
  buildImages,
  buildItems,
  type BuildFilter,
} from "@/lib/content";

export function Capabilities() {
  const [filter, setFilter] = useState<BuildFilter>("All");
  const reduced = useReducedMotion();

  const groups = useMemo(() => {
    const matching =
      filter === "All"
        ? buildItems
        : buildItems.filter((item) => item.tags.includes(filter));

    const byCategory = new Map<string, typeof buildItems>();
    for (const item of matching) {
      const bucket = byCategory.get(item.category) ?? [];
      bucket.push(item);
      byCategory.set(item.category, bucket);
    }
    return [...byCategory.entries()];
  }, [filter]);

  const total = groups.reduce((sum, [, items]) => sum + items.length, 0);

  return (
    <section
      id="build"
      className="relative scroll-mt-24 border-y border-line-soft bg-graphite/40 py-20 md:py-28"
    >
      <Container>
        <SectionHeader
          index="02"
          eyebrow="Capabilities"
          title={
            <>
              What we can
              <br />
              help you build.
            </>
          }
          lead="Filter by what you are working on. If it has to be designed, fabricated, simulated, soldered, welded, assembled or tested, it belongs on this list."
        />

        {/* ------------------------------ controls ----------------------------- */}
        <div className="mt-12 flex flex-col gap-5 border border-line bg-steel p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
            <label
              htmlFor="build-filter"
              className="text-lg font-bold tracking-tight md:text-xl"
            >
              What are you building?
            </label>

            <div className="relative">
              <select
                id="build-filter"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as BuildFilter)
                }
                className="bare-select h-12 w-full min-w-[16rem] cursor-pointer border border-line bg-ink pl-4 pr-11 font-mono text-[0.78rem] uppercase tracking-[0.12em] text-bone transition-colors hover:border-signal focus:border-signal"
              >
                {buildFilters.map((option) => (
                  <option key={option} value={option} className="bg-ink">
                    {option === "All" ? "Select project type" : option}
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

          <p className="tech">
            {total} {total === 1 ? "capability" : "capabilities"}
          </p>
        </div>

        {/* Desktop chip row — same state, faster to scan than the select. */}
        <div className="no-scrollbar mt-4 hidden flex-wrap gap-2 lg:flex">
          {buildFilters.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={cn(
                "border px-3 py-2 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-colors",
                filter === option
                  ? "border-signal bg-signal/10 text-signal"
                  : "border-line text-muted hover:border-bone hover:text-bone",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        {/* ------------------------------- results ----------------------------- */}
        <div className="mt-12 flex flex-col gap-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={filter}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-12"
            >
              {groups.map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-4">
                    <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-bone">
                      {category}
                    </h3>
                    <span className="h-px flex-1 bg-line" aria-hidden />
                    <span className="tech">
                      {String(items.length).padStart(2, "0")}
                    </span>
                  </div>

                  <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                      const photo = buildImages[item.name];

                      return (
                        <li
                          key={item.name}
                          className="group relative flex flex-col bg-ink transition-colors duration-300 hover:bg-steel"
                        >
                          {photo ? (
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-graphite">
                              <Image
                                src={buildImageUrl(photo.id)}
                                alt={photo.alt}
                                fill
                                sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 92vw"
                                className={cn(
                                  "object-cover grayscale transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                  "group-hover:grayscale-0",
                                  reduced ? "" : "group-hover:scale-[1.04]",
                                )}
                              />
                              {/* Keeps the photographs sitting under the page's
                                  own contrast rather than lighting up the grid. */}
                              <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0 bg-ink/45 transition-colors duration-500 group-hover:bg-ink/20"
                              />
                            </div>
                          ) : null}

                          <div className="flex flex-1 flex-col p-5">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-base font-semibold leading-snug tracking-tight">
                                {item.name}
                              </p>
                              <span
                                aria-hidden
                                className="mt-1 h-1.5 w-1.5 shrink-0 bg-line transition-colors duration-300 group-hover:bg-signal"
                              />
                            </div>
                            <p className="mt-2.5 text-sm leading-relaxed text-muted">
                              {item.blurb}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {total === 0 ? (
            <p className="border border-line bg-steel p-8 text-center text-muted">
              Nothing listed under that filter yet — describe the project and we
              will tell you straight whether we can build it.
            </p>
          ) : null}
        </div>

        <div className="mt-12 flex flex-col gap-4 border border-line bg-steel p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base leading-relaxed text-muted">
            <span className="font-semibold text-bone">
              Complex engineering doesn&rsquo;t scare us.
            </span>{" "}
            If your project is not on this list, describe it anyway — we will
            tell you straight whether it is something we can take on.
          </p>
          <CtaLink href="#book" variant="outline" className="shrink-0">
            Tell us about it <Arrow />
          </CtaLink>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-faint">
          Capability photography from{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-signal"
          >
            Unsplash
          </a>
          . Illustrative of the discipline — not photographs of our own work.
        </p>
      </Container>
    </section>
  );
}
