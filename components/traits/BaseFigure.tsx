"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Gender, VanthType } from "@/lib/content/traits";

type Props = {
  gender: Gender;
  type: VanthType;
  /** Anchor of the hovered/selected category, used to glow the right region. */
  focus?: { x: number; y: number } | null;
};

/**
 * The bare base render the callouts point at.
 *
 * Artwork lives in public/images/traits/base as `{m|w}-{Type}.png` — square,
 * transparent bust crops. If one is ever missing the component falls back to a
 * drawn silhouette rather than showing a broken frame.
 * See public/images/traits/README.md.
 */
export function BaseFigure({ gender, type, focus }: Props) {
  const src = `/images/traits/base/${gender === "man" ? "m" : "w"}-${type}.png`;
  const [failed, setFailed] = useState(false);

  // A new gender/type pair gets a fresh shot at its own artwork.
  useEffect(() => setFailed(false), [src]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-sm border border-white/[0.07] bg-[#0d0d0d]">
      {/* Blueprint grid — reads as a technical plate behind the figure. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-[#7c3aed]/12 to-transparent motion-reduce:hidden"
      />

      {/* Soft halo under the figure, over the region the active callout points to. */}
      {focus && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
          style={{
            left: `${focus.x}%`,
            top: `${focus.y}%`,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.45) 0%, rgba(124,58,237,0.12) 45%, transparent 70%)",
          }}
        />
      )}

      {failed ? (
        <PlaceholderSilhouette type={type} />
      ) : (
        <Image
          src={src}
          alt={`${type} ${gender === "man" ? "male" : "female"} base render`}
          fill
          sizes="(max-width: 1024px) 80vw, 420px"
          className="z-20 object-contain"
          onError={() => setFailed(true)}
          priority
        />
      )}

      {/* Corner ticks. */}
      {[
        "left-2 top-2 border-l border-t",
        "right-2 top-2 border-r border-t",
        "left-2 bottom-2 border-l border-b",
        "right-2 bottom-2 border-r border-b",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute z-30 h-3 w-3 border-white/20 ${pos}`}
        />
      ))}
    </div>
  );
}

/** Drawn stand-in, only reached if a base render fails to load. */
function PlaceholderSilhouette({ type }: { type: VanthType }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 z-20 h-full w-full"
      role="img"
      aria-label={`${type} base render placeholder`}
    >
      <defs>
        <linearGradient id="vanth-figure" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <g
        fill="url(#vanth-figure)"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.4"
      >
        {/* Matches the real crop: head y10-58, shoulders from y65 down. */}
        <ellipse cx="53" cy="33" rx="20" ry="24" />
        <path d="M44 55 h14 v12 h-14 z" />
        <path d="M51 66 C30 66 14 78 8 100 h86 C88 78 72 66 51 66 z" />
      </g>
      <text
        x="50"
        y="96"
        textAnchor="middle"
        className="fill-white/25"
        style={{ fontSize: 3, letterSpacing: "0.3em", fontFamily: "monospace" }}
      >
        BASE RENDER UNAVAILABLE
      </text>
    </svg>
  );
}
