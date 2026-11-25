// Period keys for repeatable quests. All boundaries are UTC.

export type Repeat = "once" | "daily" | "weekly";

function isoWeek(d: Date): { year: number; week: number } {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day); // Thursday of this ISO week
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: t.getUTCFullYear(), week };
}

export function periodKey(repeat: Repeat, now = new Date()): string {
  if (repeat === "daily") return now.toISOString().slice(0, 10);
  if (repeat === "weekly") {
    const { year, week } = isoWeek(now);
    return `${year}-W${String(week).padStart(2, "0")}`;
  }
  return "once";
}

/** When the current period ends (null for one-time quests). */
export function periodResetsAt(repeat: Repeat, now = new Date()): Date | null {
  if (repeat === "daily") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  }
  if (repeat === "weekly") {
    const day = now.getUTCDay() || 7;
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + (8 - day)));
  }
  return null;
}
