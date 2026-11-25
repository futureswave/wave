import type { Metadata } from "next";
import { LeaderboardView } from "@/components/verse/LeaderboardView";

export const metadata: Metadata = {
  title: "Verse Leaderboard — VANTH",
  description: "Season rankings of the VANTH Verse. Complete quests, earn XP and claim your place in the registry.",
};

export default function VersePage() {
  return <LeaderboardView />;
}
