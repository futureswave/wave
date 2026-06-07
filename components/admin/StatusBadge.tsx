const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  SUBMITTED:    { label: "Submitted",    className: "bg-blue-500/15 text-blue-300 border-blue-500/25" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-amber-500/15 text-amber-300 border-amber-500/25" },
  PENDING:      { label: "Pending",      className: "bg-amber-500/10 text-amber-400/70 border-amber-500/15" },
  APPROVED:     { label: "Approved",     className: "bg-green-500/15 text-green-300 border-green-500/25" },
  REJECTED:     { label: "Rejected",     className: "bg-red-500/12 text-red-400 border-red-500/20" },
  FLAGGED:      { label: "Flagged",      className: "bg-orange-500/15 text-orange-300 border-orange-500/25" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-white/5 text-white/35 border-white/10",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${config.className}`}>
      {config.label}
    </span>
  );
}
