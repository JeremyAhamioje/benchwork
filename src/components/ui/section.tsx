import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";

/** Page-wide horizontal rhythm. Every section uses this container. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[86rem] px-5 md:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * Section header in the shape of a drawing title block: an index, a rule,
 * a large title and a supporting line.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <span className="tech text-signal">{index}</span>
        <span className="h-px w-8 bg-line" aria-hidden />
        <span className="tech">{eyebrow}</span>
      </div>

      <h2 className="display max-w-3xl text-[clamp(2rem,5.4vw,3.75rem)]">
        {title}
      </h2>

      {lead ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted md:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

/** Thin full-bleed divider used between major sections. */
export function Rule() {
  return <div className="h-px w-full bg-line-soft" aria-hidden />;
}
