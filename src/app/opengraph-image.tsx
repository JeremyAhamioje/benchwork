import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { siteConfig } from "@/lib/site-config";

/**
 * The link preview. This is the first thing a student sees when the site is
 * shared into a WhatsApp chat or a class group, so it carries the same
 * headline, palette and typography as the hero rather than a generic card.
 *
 * Rendered by Satori, which supports only a subset of CSS: flexbox only (no
 * grid), and every element with more than one child needs an explicit display.
 */
export const alt =
  "Benchwork — final-year projects are a hassle. They don't have to be.";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const archivo = await readFile(
  join(process.cwd(), "assets/archivo-extrabold.ttf"),
);
const plexMono = await readFile(
  join(process.cwd(), "assets/plex-mono-medium.ttf"),
);

const INK = "#08090a";
const BONE = "#ecebe7";
const MUTED = "#8b929c";
const SIGNAL = "#ff0000";
const LINE = "#262a30";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          color: BONE,
          padding: "64px 72px",
          fontFamily: "Archivo",
        }}
      >
        {/* Full-bleed red rule along the top edge. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 10,
            backgroundColor: SIGNAL,
            display: "flex",
          }}
        />

        {/* ------------------------------ wordmark ------------------------------ */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 30,
              height: 30,
              backgroundColor: SIGNAL,
              display: "flex",
              marginRight: 18,
            }}
          />
          <div
            style={{
              fontSize: 34,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        {/* ------------------------------ headline ------------------------------ */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              lineHeight: 1,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>Final-year projects</div>
            <div style={{ display: "flex" }}>are a hassle.</div>
            <div style={{ display: "flex", color: SIGNAL }}>
              They don&rsquo;t have to be.
            </div>
          </div>

          <div
            style={{
              marginTop: 32,
              fontSize: 26,
              lineHeight: 1.4,
              color: MUTED,
              fontFamily: "Archivo",
              display: "flex",
              maxWidth: 860,
            }}
          >
            CAD, simulation, fabrication and full project builds — turning
            difficult engineering projects into working prototypes.
          </div>
        </div>

        {/* ------------------------------- footer ------------------------------- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 26,
            fontFamily: "IBM Plex Mono",
            fontSize: 20,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Research. Design. Build. Test.</div>
          <div style={{ display: "flex", color: SIGNAL }}>
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: archivo, style: "normal", weight: 800 },
        { name: "IBM Plex Mono", data: plexMono, style: "normal", weight: 500 },
      ],
    },
  );
}
