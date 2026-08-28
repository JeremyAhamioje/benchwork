"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

import { BlueprintFigure } from "@/components/ui/blueprint-figure";
import { Arrow, CtaLink } from "@/components/ui/cta";
import { Container } from "@/components/ui/section";
import { servedUniversity } from "@/lib/content";

const pillars = [
  { label: "Research", note: "Scope it properly" },
  { label: "Design", note: "CAD & analysis" },
  { label: "Build", note: "Fabricate & assemble" },
  { label: "Test", note: "Prove it works" },
];

export function Hero() {
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.8,
            delay,
            ease: [0.16, 1, 0.3, 1] as const,
          },
        };

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 md:pt-36">
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ------------------------------ copy ------------------------------ */}
          <div className="lg:col-span-7">
            <motion.h1
              {...rise(0.08)}
              className="display text-[clamp(2.6rem,8.2vw,5.4rem)]"
            >
              Final-year projects
              <br />
              are a hassle.
              <br />
              <span className="text-signal">They don&rsquo;t have to be.</span>
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="mt-7 max-w-xl text-base leading-relaxed text-muted md:text-lg"
            >
              From sourcing materials to CAD, simulation, fabrication and full
              project builds, we help turn difficult engineering projects into
              working prototypes.
            </motion.p>

            {/* Research. Design. Build. Test. */}
            <motion.ul
              {...rise(0.24)}
              className="mt-9 grid grid-cols-2 border-t border-l border-line sm:grid-cols-4"
            >
              {pillars.map((pillar) => (
                <li
                  key={pillar.label}
                  className="border-r border-b border-line px-4 py-4"
                >
                  <p className="text-lg font-bold tracking-tight">
                    {pillar.label}
                    <span className="text-signal">.</span>
                  </p>
                  <p className="tech mt-1.5 normal-case tracking-[0.08em]">
                    {pillar.note}
                  </p>
                </li>
              ))}
            </motion.ul>

            <motion.p
              {...rise(0.3)}
              className="mt-8 max-w-lg text-lg font-semibold tracking-tight text-bone md:text-xl"
            >
              We get our hands dirty while you sit back and relax.
            </motion.p>

            <motion.div
              {...rise(0.36)}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <CtaLink href="#book" size="lg">
                Book a Project
              </CtaLink>
              <CtaLink href="#estimate" variant="outline" size="lg">
                Estimate My Project
              </CtaLink>
            </motion.div>

            <motion.div {...rise(0.42)} className="mt-6">
              <CtaLink href="#about" variant="ghost">
                About the Engineer <Arrow />
              </CtaLink>
            </motion.div>

            {/* Who the service is for. The crest belongs to the university, not
                to us, so the independence note travels with it. */}
            <motion.div
              {...rise(0.48)}
              className="mt-10 flex max-w-md items-center gap-4 bg-white py-4 pl-4 pr-5"
            >
              <Image
                src={servedUniversity.crest}
                alt={`Coat of arms of ${servedUniversity.name}`}
                width={servedUniversity.crestWidth}
                height={servedUniversity.crestHeight}
                className="h-16 w-auto shrink-0"
              />
              <div className="min-w-0">
                {/* Not `.tech`: that class is unlayered, so its faint colour
                    would beat any utility override on this light plate. */}
                <p className="font-mono text-[0.6875rem] uppercase leading-none tracking-[0.18em] text-ink">
                  Working with students at
                </p>
                <p className="mt-2 text-sm font-semibold tracking-tight text-ink">
                  {servedUniversity.name}
                </p>
                <p className="mt-1.5 text-[0.7rem] leading-relaxed text-ink/70">
                  {servedUniversity.independenceNote}
                </p>
              </div>
            </motion.div>
          </div>

          {/* ---------------------------- drawing ----------------------------- */}
          <motion.div
            {...(reduced
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.97 },
                  animate: { opacity: 1, scale: 1 },
                  transition: {
                    duration: 1,
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1] as const,
                  },
                })}
            className="relative lg:col-span-5"
          >
            <div className="relative border border-line bg-graphite/50 p-4 backdrop-blur-sm sm:p-6">
              <div className="flex items-center justify-between border-b border-line-soft pb-3">
                <span className="tech">Drawing · Sample sheet</span>
                <span className="tech text-signal">Sheet 1/1</span>
              </div>
              <div className="blueprint-fine mt-4 aspect-[420/380] w-full opacity-95">
                <BlueprintFigure />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-3">
                <span className="tech">Tolerance ±0.5</span>
                <span className="tech">Third angle</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ------------------------- academic integrity ------------------------ */}
        <motion.aside
          {...rise(0.5)}
          className="relative mt-16 border border-line bg-graphite/40 md:mt-20"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] bg-signal"
          />
          <div className="grid gap-4 px-5 py-6 sm:px-7 md:grid-cols-[auto_1fr] md:gap-8 md:py-7">
            <p className="font-mono text-[0.72rem] font-semibold uppercase leading-relaxed tracking-[0.16em] text-bone md:max-w-[15rem]">
              We don&rsquo;t submit your academic work for you.
            </p>
            <p className="max-w-3xl text-sm leading-relaxed text-muted">
              We provide the engineering expertise behind your project: design,
              fabrication, prototyping, simulation, technical assistance,
              research support and collaboration. You remain responsible for
              your academic submission — we help you turn your engineering ideas
              into properly designed, functional, real-world projects.
            </p>
          </div>
        </motion.aside>
      </Container>
    </section>
  );
}
