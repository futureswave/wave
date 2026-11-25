import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { periodKey, periodResetsAt, type Repeat } from "./periods";
import { holderCheckEnabled } from "./holder";
import type { PublicQuest, QuestState } from "./types";

export type QuestRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: PublicQuest["category"];
  xp: number;
  est_minutes: number;
  difficulty: PublicQuest["difficulty"];
  verification: PublicQuest["verification"];
  quiz: { q: string; options: string[]; answer: number }[] | null;
  proof_hint: string | null;
  repeat: Repeat;
  max_completions: number | null;
  starts_at: string | null;
  ends_at: string | null;
  status: string;
  featured: boolean;
  lore_ref: string | null;
  lore_href: string | null;
  sort_order: number;
};

type CompletionRow = {
  quest_id: string;
  period_key: string;
  status: "submitted" | "completed" | "rejected";
  reject_reason: string | null;
};

/** Published quests that are inside their schedule window right now. */
export async function fetchLiveQuests(sb: SupabaseClient): Promise<QuestRow[]> {
  const { data, error } = await sb
    .from("verse_quests")
    .select("*")
    .eq("status", "published")
    .order("sort_order");
  if (error) throw error;
  const now = Date.now();
  return ((data as QuestRow[]) ?? []).filter(
    (q) =>
      (!q.starts_at || Date.parse(q.starts_at) <= now) && (!q.ends_at || Date.parse(q.ends_at) >= now),
  );
}

export function toPublicQuest(q: QuestRow, completions: CompletionRow[] | null): PublicQuest {
  const mine = completions?.filter((c) => c.quest_id === q.id) ?? [];
  const current = mine.find((c) => c.period_key === periodKey(q.repeat));
  const timesCompleted = mine.filter((c) => c.status === "completed").length;
  const used = mine.filter((c) => c.status !== "rejected").length;

  let state: QuestState;
  if (completions === null) state = "signed_out";
  else if (current?.status === "completed") state = "completed";
  else if (current?.status === "submitted") state = "submitted";
  else if (q.max_completions !== null && used >= q.max_completions) state = "limit";
  else if (current?.status === "rejected") state = "rejected";
  else state = "available";
  if (q.verification === "holder" && !holderCheckEnabled() && state !== "completed") state = "soon";

  const resets = periodResetsAt(q.repeat);
  return {
    id: q.id,
    slug: q.slug,
    title: q.title,
    description: q.description,
    category: q.category,
    xp: q.xp,
    estMinutes: q.est_minutes,
    difficulty: q.difficulty,
    verification: q.verification,
    repeat: q.repeat,
    maxCompletions: q.max_completions,
    endsAt: q.ends_at,
    featured: q.featured,
    loreRef: q.lore_ref,
    loreHref: q.lore_href,
    proofHint: q.proof_hint,
    quiz: q.quiz?.map(({ q: text, options }) => ({ q: text, options })) ?? null,
    state,
    resetsAt: resets ? resets.toISOString() : null,
    rejectReason: current?.status === "rejected" ? current.reject_reason : null,
    timesCompleted,
  };
}

export async function fetchUserCompletions(sb: SupabaseClient, userId: string): Promise<CompletionRow[]> {
  const { data } = await sb
    .from("verse_quest_completions")
    .select("quest_id, period_key, status, reject_reason")
    .eq("user_id", userId);
  return (data as CompletionRow[]) ?? [];
}

/** Maps errors raised by verse_record_completion to user-facing responses. */
export function completionError(message: string | undefined): { error: string; status: number } {
  if (message?.includes("ALREADY_DONE")) return { error: "Already completed for this period.", status: 409 };
  if (message?.includes("LIMIT_REACHED")) return { error: "Completion limit reached for this quest.", status: 409 };
  if (message?.includes("QUEST_UNAVAILABLE")) return { error: "This quest is not available.", status: 404 };
  return { error: "Could not record the quest.", status: 500 };
}
