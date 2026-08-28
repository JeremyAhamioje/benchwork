"use client";

import { Arrow, CtaLink } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/section";
import { aboutCapabilities } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

const externalLinks = [
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "Web development portfolio", href: siteConfig.links.devPortfolio },
  { label: "Engineering portfolio", href: siteConfig.links.engPortfolio },
];

export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-graphite/60"
      />
      <div
        aria-hidden
        className="blueprint pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(60%_60%_at_20%_50%,black,transparent)]"
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* ------------------------------- copy -------------------------------- */}
          <div className="lg:col-span-7">
            <Reveal className="flex items-center gap-4">
              <span className="tech text-signal">06</span>
              <span className="h-px w-8 bg-line" aria-hidden />
              <span className="tech">About the engineer</span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="display mt-5 text-[clamp(2rem,5.4vw,3.75rem)]">
                Who you&rsquo;ll be
                <br />
                working with
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-bone md:text-xl">
                I don&rsquo;t just design projects on paper. I build, test,
                troubleshoot and iterate.
              </p>
              <p className="mt-5 max-w-xl leading-relaxed text-muted">
                My work sits on the practical side of engineering — mechanical
                design and analysis carried through to a unit that runs. That
                means CAD and simulation when the geometry has to be right,
                fabrication and welding when it has to be made, and electronics,
                firmware or a model when it has to think for itself.
              </p>
              <p className="mt-5 max-w-xl leading-relaxed text-muted">
                Working with students is a collaboration: you keep ownership of
                your project and your submission, and you get an engineer beside
                you on the design, the fabrication and the testing.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="#book" size="lg">
                Start Your Project
              </CtaLink>
              <CtaLink href="#estimate" variant="outline" size="lg">
                Estimate My Project
              </CtaLink>
            </Reveal>
          </div>

          {/* ----------------------------- spec panel ---------------------------- */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="border border-line bg-steel">
              <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="tech">Capability index</span>
                <span className="tech text-signal">
                  {String(aboutCapabilities.length).padStart(2, "0")}
                </span>
              </div>

              <ul className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
                {aboutCapabilities.map((capability, index) => (
                  <li
                    key={capability}
                    className="flex items-baseline gap-3 bg-steel px-4 py-3.5"
                  >
                    <span className="font-mono text-[0.62rem] text-faint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-snug">{capability}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-line px-5 py-5">
                <p className="tech">Elsewhere</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {externalLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/cta inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-signal"
                      >
                        {link.label} <Arrow />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
