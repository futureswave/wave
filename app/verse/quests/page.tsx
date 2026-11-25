import type { Metadata } from "next";
import { QuestBoard } from "@/components/verse/QuestBoard";

export const metadata: Metadata = {
  title: "Quests — VANTH Verse",
  description: "Daily missions, lore quizzes and community quests. Earn XP and climb the VANTH Verse leaderboard.",
};

export default function QuestsPage() {
  return <QuestBoard />;
}
