import type { ReactNode } from "react";

/**
 * Shared section header. Keeps the eyebrow / title / lead rhythm identical
 * across every V2 section instead of re-deriving the classes each time.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  action,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  action?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={
        centered
          ? "text-center mb-14"
          : "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14"
      }
    >
      <div className={centered ? "" : "max-w-2xl"}>
        {eyebrow && (
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/40 mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-display uppercase">
          {title}
        </h2>
        {lead && (
          <p
            className={`text-white/55 text-lg leading-relaxed mt-4 ${
              centered ? "max-w-2xl mx-auto" : ""
            }`}
          >
            {lead}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
