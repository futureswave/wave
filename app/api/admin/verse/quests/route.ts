import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { adminGuard, parseQuestInput } from "@/lib/verse/admin";
import { audit } from "@/lib/verse/data";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const sb = createServiceClient();
  const { data, error } = await sb.from("verse_quests").select("*").order("sort_order").order("created_at");
  if (error) return NextResponse.json({ error: "Database error." }, { status: 500 });
  return NextResponse.json({ quests: data });
}

export async function POST(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const parsed = parseQuestInput(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const sb = createServiceClient();
  const { data, error } = await sb.from("verse_quests").insert(parsed.row).select("*").single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
    console.error("admin quest create:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  await audit(sb, "VERSE_QUEST_CREATED", { quest_id: data.id, slug: data.slug });
  return NextResponse.json({ quest: data });
}
