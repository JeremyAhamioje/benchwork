"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * A CAD-style part drawing, drawn in SVG so it stays crisp, weighs nothing and
 * needs no stock photography. Lines draw themselves in on mount.
 */
export function BlueprintFigure() {
  const reduced = useReducedMotion();

  const draw = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: {
              duration: 1.4,
              delay,
              ease: [0.16, 1, 0.3, 1] as const,
            },
            opacity: { duration: 0.3, delay },
          },
        };

  return (
    <svg
      viewBox="0 0 420 380"
      className="h-full w-full"
      role="img"
      aria-label="Technical drawing of a bracket with dimension lines"
    >
      {/* Dimension lines */}
      <g stroke="var(--color-blueprint)" strokeWidth="1" opacity="0.85">
        <motion.path d="M60 44 H360" {...draw(0.5)} fill="none" />
        <motion.path d="M60 38 V50" {...draw(0.5)} fill="none" />
        <motion.path d="M360 38 V50" {...draw(0.5)} fill="none" />
        <motion.path d="M32 78 V320" {...draw(0.65)} fill="none" />
        <motion.path d="M26 78 H38" {...draw(0.65)} fill="none" />
        <motion.path d="M26 320 H38" {...draw(0.65)} fill="none" />
      </g>

      <text
        x="210"
        y="32"
        textAnchor="middle"
        className="fill-faint font-mono"
        style={{ fontSize: 11, letterSpacing: "0.12em" }}
      >
        300.00
      </text>
      <text
        x="20"
        y="205"
        textAnchor="middle"
        transform="rotate(-90 20 205)"
        className="fill-faint font-mono"
        style={{ fontSize: 11, letterSpacing: "0.12em" }}
      >
        242.00
      </text>

      {/* Main body */}
      <g fill="none" stroke="currentColor" className="text-bone/70">
        <motion.path
          d="M60 78 H360 V196 H196 V320 H60 Z"
          strokeWidth="1.6"
          {...draw(0)}
        />
        <motion.path d="M60 196 H196" strokeWidth="1" {...draw(0.35)} />
        <motion.path d="M196 78 V196" strokeWidth="1" {...draw(0.4)} />
      </g>

      {/* Fixing holes */}
      <g stroke="var(--color-signal)" fill="none" strokeWidth="1.4">
        {[
          [96, 114],
          [324, 114],
          [96, 284],
          [160, 160],
        ].map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="14"
            initial={reduced ? undefined : { scale: 0, opacity: 0 }}
            animate={reduced ? undefined : { scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.9 + index * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        ))}
      </g>

      {/* Centre marks */}
      <g stroke="var(--color-signal)" strokeWidth="0.9" opacity="0.55">
        {[
          [96, 114],
          [324, 114],
          [96, 284],
          [160, 160],
        ].map(([cx, cy]) => (
          <g key={`c-${cx}-${cy}`}>
            <line x1={cx - 20} y1={cy} x2={cx + 20} y2={cy} />
            <line x1={cx} y1={cy - 20} x2={cx} y2={cy + 20} />
          </g>
        ))}
      </g>

      {/* Leader + callout */}
      <g stroke="var(--color-blueprint)" strokeWidth="1" fill="none">
        <motion.path d="M324 114 L392 66" {...draw(1.2)} />
      </g>
      <text
        x="392"
        y="58"
        textAnchor="end"
        className="fill-signal font-mono"
        style={{ fontSize: 10, letterSpacing: "0.14em" }}
      >
        4 × ⌀14
      </text>

      {/* Title block */}
      <g>
        <rect
          x="196"
          y="284"
          width="188"
          height="60"
          fill="none"
          stroke="var(--color-line)"
        />
        <line
          x1="196"
          y1="306"
          x2="384"
          y2="306"
          stroke="var(--color-line)"
        />
        <line
          x1="300"
          y1="306"
          x2="300"
          y2="344"
          stroke="var(--color-line)"
        />
        <text
          x="206"
          y="300"
          className="fill-muted font-mono"
          style={{ fontSize: 9, letterSpacing: "0.16em" }}
        >
          BRACKET — MS 6MM
        </text>
        <text
          x="206"
          y="329"
          className="fill-faint font-mono"
          style={{ fontSize: 9, letterSpacing: "0.16em" }}
        >
          SCALE 1:2
        </text>
        <text
          x="310"
          y="329"
          className="fill-faint font-mono"
          style={{ fontSize: 9, letterSpacing: "0.16em" }}
        >
          REV 03
        </text>
      </g>
    </svg>
  );
}
