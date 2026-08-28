import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "group/cta relative inline-flex items-center justify-center gap-2.5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] " +
  "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-40";

const sizes: Record<Size, string> = {
  md: "h-11 px-5",
  lg: "h-14 px-7 text-[0.78rem]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-signal text-white hover:bg-signal-deep shadow-[0_0_0_0_rgba(255,0,0,0.5)] hover:shadow-[0_0_28px_-4px_rgba(255,0,0,0.55)]",
  outline:
    "border border-line bg-transparent text-bone hover:border-bone hover:bg-white/[0.03]",
  ghost: "px-0 text-muted hover:text-signal",
};

type CtaProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

export function CtaLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CtaProps & ComponentProps<"a">) {
  return (
    <a
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </a>
  );
}

export function CtaButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CtaProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

/** The small chevron used on ghost / tertiary links. */
export function Arrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-1",
        className,
      )}
    >
      →
    </span>
  );
}
