"use client";

export type TraitListItem = {
  name: string;
  /** 128px preview, when the artwork for this variant is known. */
  thumb?: string | null;
  /** True when only one gender has this variant — flagged in the anatomy panel. */
  exclusive?: boolean;
};

type Props = {
  items: TraitListItem[];
  /** Line above the grid, e.g. "42 variants · Man". */
  caption?: React.ReactNode;
  /** Present when the grid is a picker rather than a read-only list. */
  selected?: string;
  onSelect?: (name: string) => void;
};

/**
 * Grid of trait variants. Read-only in the anatomy panel, selectable in the
 * character builder — the difference is just whether `onSelect` is passed.
 */
export function TraitList({ items, caption, selected, onSelect }: Props) {
  const picker = typeof onSelect === "function";

  return (
    <div>
      {caption && <div className="mb-4">{caption}</div>}

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const none = item.name === "NONE";
          const isSelected = picker && item.name === selected;

          const border = isSelected
            ? "border-[#7c3aed] bg-[#7c3aed]/15"
            : item.exclusive
              ? "border-[#7c3aed]/35 bg-[#7c3aed]/[0.06] hover:border-[#7c3aed]/60"
              : "border-white/[0.07] bg-white/[0.02] hover:border-white/20";

          const body = (
            <>
              <span
                aria-hidden
                className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-white/[0.07] bg-[#0d0d0d] font-mono text-[11px] text-white/45"
              >
                {none || !item.thumb ? (
                  none ? "—" : item.name.charAt(0).toUpperCase()
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumb}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full scale-[2.1] object-cover object-[50%_28%]"
                  />
                )}
              </span>
              <span
                className={`truncate text-sm ${
                  none ? "italic text-white/35" : "text-white/70"
                } group-hover:text-white`}
                title={item.name}
              >
                {none ? "None" : item.name}
              </span>
            </>
          );

          const className = `group flex w-full items-center gap-3 rounded-sm border px-3 py-2.5 text-left transition-colors ${border}`;

          return (
            <li key={item.name}>
              {picker ? (
                <button
                  type="button"
                  onClick={() => onSelect?.(item.name)}
                  aria-pressed={isSelected}
                  className={className}
                >
                  {body}
                </button>
              ) : (
                <div className={className}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
