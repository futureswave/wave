import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getVerseSession } from "@/lib/verse/session";
import { fetchLiveQuests, fetchUserCompletions, toPublicQuest } from "@/lib/verse/quests";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getVerseSession();
  const sb = createServiceClient();
  try {
    const [quests, completions] = await Promise.all([
      fetchLiveQuests(sb),
      session ? fetchUserCompletions(sb, session.userId) : Promise.resolve(null),
    ]);
    return NextResponse.json({ quests: quests.map((q) => toPublicQuest(q, completions)) });
  } catch (e) {
    console.error("verse quests:", e);
    return NextResponse.json({ error: "Could not load quests." }, { status: 500 });
  }
}
