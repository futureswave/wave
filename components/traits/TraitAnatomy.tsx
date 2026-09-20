"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BaseFigure } from "./BaseFigure";
import { GenderTypeControls } from "./GenderTypeControls";
import { TraitList } from "./TraitList";
import { splitByExclusivity } from "@/lib/content/traits";
import { findThumb } from "@/lib/content/trait-layers";
import type {
  Gender,
  TraitCategory,
  TraitCategoryId,
  VanthType,
} from "@/lib/content/traits";

type Props = { categories: TraitCategory[] };

/**
 * Box the base figure occupies inside the stage, in percent of each axis.
 * The renders are square, and the stage is 16/11, so the height percentage is
 * the width percentage scaled by that ratio: 38 * 16 / 11 = 55.3.
 */
const FIGURE_LEFT = 31;
const FIGURE_WIDTH = 38;
const FIGURE_HEIGHT = 55.3;
const FIGURE_TOP = (100 - FIGURE_HEIGHT) / 2;

/** Where leader lines bend and where they stop, per side. */
const RAIL = {
  left: { bend: 30, elbow: 28, end: 26.5 },
  right: { bend: 70, elbow: 72, end: 73.5 },
};

type Placed = TraitCategory & {
  /** Anchor in stage coordinates. */
  sx: number;
  sy: number;
  /** Vertical slot the label sits in, in stage percent. */
  labelY: number;
};

/**
 * Lays each side's callouts out on an evenly spaced vertical rail, ordered by
 * how high its anchor sits on the body. Keeps labels from colliding without
 * hand-tuning every one of them.
 */
function place(categories: TraitCategory[]): Placed[] {
  const out: Placed[] = [];

  for (const side of ["left", "right"] as const) {
    const group = categories
      .filter((c) => c.anchor.side === side)
      .sort((a, b) => a.anchor.y - b.anchor.y);

    const top = 8;
    const bottom = 92;
    const step = group.length > 1 ? (bottom - top) / (group.length - 1) : 0;

    group.forEach((category, i) => {
      out.push({
        ...category,
        sx: FIGURE_LEFT + (category.anchor.x / 100) * FIGURE_WIDTH,
        sy: FIGURE_TOP + (category.anchor.y / 100) * FIGURE_HEIGHT,
        labelY: group.length > 1 ? top + step * i : 50,
      });
    });
  }

  return out;
}

function leaderPath(item: Placed): string {
  const rail = RAIL[item.anchor.side];
  return [
    `M ${item.sx} ${item.sy}`,
    `L ${rail.bend} ${item.sy}`,
    `L ${rail.elbow} ${item.labelY}`,
    `L ${rail.end} ${item.labelY}`,
  ].join(" ");
}

export function TraitAnatomy({ categories }: Props) {
  const [gender, setGender] = useState<Gender>("man");
  const [type, setType] = useState<VanthType>("Aegis");
  const [selected, setSelected] = useState<TraitCategoryId | null>("hair");
  const [hovered, setHovered] = useState<TraitCategoryId | null>(null);
  const reduceMotion = useReducedMotion();

  const placed = useMemo(() => place(categories), [categories]);
  const ordered = useMemo(
    () => [...placed].sort((a, b) => a.labelY - b.labelY),
    [placed],
  );
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const active = hovered ?? selected;
  const activeItem = placed.find((c) => c.id === active) ?? null;
  const selectedCategory =
    categories.find((c) => c.id === selected) ?? categories[0];

  // Up/down walks the callouts in visual order, matching what the eye expects.
  function handleKeyDown(event: React.KeyboardEvent, id: TraitCategoryId) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    const index = ordered.findIndex((c) => c.id === id);
    const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
    const next =
      ordered[(index + (forward ? 1 : -1) + ordered.length) % ordered.length];

    setSelected(next.id);
    buttonRefs.current[next.id]?.focus();
  }

  return (
    <div>
      <div className="sticky top-0 z-30 -mx-4 mb-10 bg-[#0a0a0a]/80 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <GenderTypeControls
          gender={gender}
          onGenderChange={setGender}
          type={type}
          onTypeChange={setType}
        />
      </div>

      {/* ---------- Desktop: anatomical callout diagram ---------- */}
      <div
        className="relative mx-auto hidden aspect-[16/11] w-full max-w-5xl lg:block"
        onMouseLeave={() => setHovered(null)}
      >
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {placed.map((item, i) => {
            const isActive = item.id === active;
            return (
              <g key={item.id}>
                <motion.path
                  d={leaderPath(item)}
                  fill="none"
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={isActive ? 1.5 : 1}
                  stroke={isActive ? "#7c3aed" : "rgba(255,255,255,0.18)"}
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.07 }}
                />
                <circle
                  cx={item.sx}
                  cy={item.sy}
                  r={isActive ? 1.1 : 0.7}
                  vectorEffect="non-scaling-stroke"
                  fill={isActive ? "#7c3aed" : "rgba(255,255,255,0.45)"}
                />
              </g>
            );
          })}
        </svg>

        {/* Base render, centred in the figure band. */}
        <div
          className="absolute"
          style={{
            left: `${FIGURE_LEFT}%`,
            width: `${FIGURE_WIDTH}%`,
            top: `${FIGURE_TOP}%`,
            height: `${FIGURE_HEIGHT}%`,
          }}
        >
          <BaseFigure
            gender={gender}
            type={type}
            focus={
              activeItem
                ? { x: activeItem.anchor.x, y: activeItem.anchor.y }
                : null
            }
          />
        </div>

        {/* Callout labels. */}
        {placed.map((item) => {
          const isActive = item.id === active;
          const isSelected = item.id === selected;
          const left = item.anchor.side === "left";

          return (
            <motion.button
              key={item.id}
              ref={(el) => {
                buttonRefs.current[item.id] = el;
              }}
              onMouseEnter={() => setHovered(item.id)}
              onFocus={() => setHovered(item.id)}
              onBlur={() => setHovered(null)}
              onClick={() => setSelected(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              aria-pressed={isSelected}
              aria-controls="trait-detail-panel"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`absolute w-[24%] -translate-y-1/2 px-1 outline-none focus-visible:ring-1 focus-visible:ring-[#7c3aed]/60 ${
                left ? "text-right" : "text-left"
              }`}
              style={{
                top: `${item.labelY}%`,
                ...(left ? { right: "75%" } : { left: "75%" }),
              }}
            >
              <span
                className={`block font-mono text-[10px] uppercase tracking-[0.3em] transition-colors ${
                  isActive ? "text-[#a78bfa]" : "text-white/40"
                }`}
              >
                {item.label}
              </span>
              <span
                className={`block text-4xl font-black leading-none tracking-tight transition-colors ${
                  isActive ? "text-white" : "text-white/70"
                }`}
              >
                {item.traits[gender].length}
              </span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                variants
              </span>
              <span
                className={`mt-2 block h-px transition-all duration-300 ${
                  left ? "ml-auto" : ""
                } ${isSelected ? "w-10 bg-[#7c3aed]" : "w-0 bg-transparent"}`}
              />
            </motion.button>
          );
        })}
      </div>

      {/* ---------- Desktop detail panel ---------- */}
      <div className="hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.section
            key={`${selectedCategory.id}-${gender}`}
            id="trait-detail-panel"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-12 rounded-sm border border-white/[0.07] bg-[#111]/60 p-8 backdrop-blur-sm"
          >
            <h2 className="text-3xl font-black uppercase tracking-tight text-white">
              {selectedCategory.label}
            </h2>
            <p className="mb-6 mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
              {selectedCategory.blurb}
            </p>
            <CategoryVariants category={selectedCategory} gender={gender} />
          </motion.section>
        </AnimatePresence>
      </div>

      {/* ---------- Mobile: figure + accordion ---------- */}
      <div className="lg:hidden">
        <div className="mx-auto mb-8 aspect-square w-full max-w-sm">
          <BaseFigure
            gender={gender}
            type={type}
            focus={
              activeItem
                ? { x: activeItem.anchor.x, y: activeItem.anchor.y }
                : null
            }
          />
        </div>

        <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {categories.map((category) => {
            const open = category.id === selected;
            return (
              <li key={category.id}>
                <button
                  onClick={() => setSelected(open ? null : category.id)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.28em] ${
                        open ? "text-[#a78bfa]" : "text-white/45"
                      }`}
                    >
                      {category.label}
                    </span>
                    <span className="text-2xl font-black leading-none text-white">
                      {category.traits[gender].length}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-white/35 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6">
                        <p className="mb-5 text-sm leading-relaxed text-white/45">
                          {category.blurb}
                        </p>
                        <CategoryVariants category={category} gender={gender} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/**
 * Read-only variant grid for one category, with the real trait thumbnails and
 * a count that calls out anything only this gender has.
 */
function CategoryVariants({
  category,
  gender,
}: {
  category: TraitCategory;
  gender: Gender;
}) {
  const variants = splitByExclusivity(category, gender);
  const exclusiveCount = variants.filter((v) => v.exclusive).length;
  const genderLabel = gender === "man" ? "Man" : "Women";

  const items = variants.map(({ name, exclusive }) => ({
    name,
    exclusive,
    thumb: findThumb(gender, category.id, name),
  }));

  return (
    <TraitList
      items={items}
      caption={
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
            {variants.length} variants · {genderLabel}
          </span>
          {exclusiveCount > 0 && (
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#a78bfa]/70">
              {exclusiveCount} {genderLabel}-only
            </span>
          )}
        </div>
      }
    />
  );
}
