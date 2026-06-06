const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  SUBMITTED: { label: "Submitted", className: "bg-white/8 text-white/60 border-white/15" },
  UNDER_REVIEW: { label: "Under Review", className: "bg-white/6 text-white/50 border-white/12" },
  PENDING: { label: "Pending", className: "bg-white/6 text-white/50 border-white/10" },
  APPROVED: { label: "Approved", className: "bg-white/10 text-white/80 border-white/20" },
  REJECTED: { label: "Rejected", className: "bg-white/4 text-white/30 border-white/8" },
  FLAGGED: { label: "Flagged", className: "bg-white/6 text-white/45 border-white/12" },
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
