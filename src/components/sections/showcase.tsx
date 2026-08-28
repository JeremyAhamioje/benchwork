"use client";

import { Reveal } from "@/components/ui/reveal";
import { Container, SectionHeader } from "@/components/ui/section";
import { sampleProjects } from "@/lib/content";

/**
 * Sample projects, laid out like documentation sheets rather than portfolio
 * tiles. These are illustrative — nothing here has been built — so every label
 * on this section has to read as a worked example, not a record.
 */
export function Showcase() {
  return (
    <section id="work" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <SectionHeader
          index="05"
          eyebrow="Sample projects"
          title="Sample works."
          lead="A sample of the kind of work the bench is set up for — the discipline, what would be made, and what it would take."
        />

        <ul className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 xl:grid-cols-3">
          {sampleProjects.map((project, index) => (
            <Reveal
              key={project.ref}
              as="li"
              delay={(index % 3) * 0.06}
              className="group relative flex flex-col bg-steel transition-colors duration-300 hover:bg-steel-2"
            >
              <span className="ticked" aria-hidden />

              {/* Drawing header */}
              <div className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
                <span className="tech text-signal">{project.ref}</span>
                <span className="tech">{project.type}</span>
              </div>

              <div className="flex flex-1 flex-col px-5 py-6">
                <h3 className="text-xl font-bold leading-tight tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-3.5 flex-1 text-sm leading-relaxed text-muted">
                  {project.scope}
                </p>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {project.skills.map((skill) => (
                    <li
                      key={skill}
                      className="border border-line-soft bg-ink px-2.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Title block, as on a drawing sheet */}
              <dl className="grid grid-cols-3 border-t border-line-soft">
                {project.spec.map((row, rowIndex) => (
                  <div
                    key={row.label}
                    className={
                      rowIndex < project.spec.length - 1
                        ? "border-r border-line-soft px-4 py-3.5"
                        : "px-4 py-3.5"
                    }
                  >
                    <dt className="tech text-[0.58rem]">{row.label}</dt>
                    <dd className="mt-1.5 text-xs font-medium leading-snug text-bone">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </ul>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-faint">
          These are worked examples of what each project would involve, not
          completed jobs — the studio is new and has no build history yet. Real
          project records will replace them as builds are finished.
        </p>
      </Container>
    </section>
  );
}
