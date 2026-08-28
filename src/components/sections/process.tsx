"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Reveal } from "@/components/ui/reveal";
import { Container, SectionHeader } from "@/components/ui/section";
import { processSteps } from "@/lib/content";

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // A single scroll subscription drives the spine that links the five steps.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 60%"],
  });
  const spine = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <SectionHeader
          index="03"
          eyebrow="How we work"
          title={
            <>
              Five steps from
              <br />
              brief to working unit.
            </>
          }
          lead="No mystery, no drip-feeding. You know what happens at each stage and what you get at the end of it."
        />

        <div ref={containerRef} className="relative mt-14 md:mt-20">
          {/* Spine — horizontal on desktop, vertical on mobile. */}
          <div
            aria-hidden
            className="absolute left-[1.4rem] top-2 bottom-2 w-px bg-line md:left-0 md:right-0 md:top-0 md:bottom-auto md:h-px md:w-full"
          >
            <motion.span
              className="block bg-signal md:h-px"
              style={
                reduced
                  ? { width: "100%", height: "100%" }
                  : { height: spine, width: "100%" }
              }
            />
          </div>

          <ol className="grid gap-10 md:grid-cols-5 md:gap-0">
            {processSteps.map((step, index) => (
              <Reveal
                key={step.number}
                as="li"
                delay={index * 0.07}
                className="relative pl-14 md:border-l md:border-line md:px-5 md:pl-5 md:pt-8 md:first:pl-5"
              >
                {/* Node marker */}
                <span
                  aria-hidden
                  className="absolute left-[1.4rem] top-2 h-2.5 w-2.5 -translate-x-1/2 bg-signal md:left-0 md:top-0 md:-translate-y-1/2 md:translate-x-0"
                />

                <p className="font-mono text-3xl font-semibold leading-none tracking-tight text-line md:text-4xl">
                  {step.number}
                </p>

                <h3 className="mt-4 text-lg font-bold leading-tight tracking-tight md:text-xl">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>

                <ul className="mt-5 flex flex-col gap-1.5">
                  {step.detail.map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-faint"
                    >
                      <span
                        aria-hidden
                        className="h-px w-3 shrink-0 bg-signal/60"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
