interface TBABadgeProps {
  label?: string;
  className?: string;
}

export function TBABadge({ label = "TBA", className = "" }: TBABadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold font-mono bg-white/5 text-white/40 border border-white/10 ${className}`}
    >
      {label}
    </span>
  );
}

export function ComingSoonBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold font-mono bg-white/5 text-white/40 border border-white/10 ${className}`}
    >
      Soon
    </span>
  );
}
