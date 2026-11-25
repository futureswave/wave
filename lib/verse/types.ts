// Shapes shared by the Verse API routes and client components.

export type QuestCategory = "daily" | "weekly" | "one_time" | "holder" | "community" | "lore";
export type Verification = "auto" | "quiz" | "proof" | "holder";
export type QuestRepeat = "once" | "daily" | "weekly";

/** Per-user status of a quest for the current period. */
export type QuestState =
  | "available"
  | "submitted"
  | "completed"
  | "rejected"
  | "limit"     // max completions reached
  | "soon"      // holder check not live yet
  | "signed_out";

export interface PublicQuest {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: QuestCategory;
  xp: number;
  estMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  verification: Verification;
  repeat: QuestRepeat;
  maxCompletions: number | null;
  endsAt: string | null;
  featured: boolean;
  loreRef: string | null;
  loreHref: string | null;
  proofHint: string | null;
  /** Questions and options only — answers stay on the server. */
  quiz: { q: string; options: string[] }[] | null;
  state: QuestState;
  resetsAt: string | null;
  rejectReason: string | null;
  timesCompleted: number;
}

export interface SeasonInfo {
  id: string;
  slug: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: "draft" | "active" | "ended";
  rewardsText: string | null;
}

export interface LeaderRow {
  rank: number;
  /** Full wallet only for public profiles (used for the profile link). */
  wallet: string | null;
  short: string;
  name: string | null;
  xp: number;
  quests: number;
  /** Positions gained in the last 24h; null = new to the board. */
  delta: number | null;
  isYou?: boolean;
}

export interface ActivityItem {
  id: string;
  questTitle: string;
  xp: number;
  status: "submitted" | "completed" | "rejected";
  at: string;
  rejectReason: string | null;
}

export interface MeResponse {
  wallet: string;
  displayName: string | null;
  isPublic: boolean;
  seasonXp: number;
  lifetimeXp: number;
  rank: number | null;
  delta: number | null;
  totalRanked: number;
  neighbors: LeaderRow[];
  activity: ActivityItem[];
  holder: { verified: boolean; count: number; checkedAt: string | null };
}
