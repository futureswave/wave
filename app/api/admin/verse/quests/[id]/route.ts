import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { adminGuard, parseQuestInput } from "@/lib/verse/admin";
import { audit } from "@/lib/verse/data";

const STATUSES = ["draft", "published", "paused", "expired"];

// PATCH { status } for publish/pause/expire, or a full quest payload to edit.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const sb = createServiceClient();

  let update: Record<string, unknown>;
  if (Object.keys(body).length === 1 && "status" in body) {
    if (!STATUSES.includes(body.status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    update = { status: body.status, updated_at: new Date().toISOString() };
  } else {
    const parsed = parseQuestInput(body);
    if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
    update = parsed.row;
  }

  const { data, error } = await sb.from("verse_quests").update(update).eq("id", id).select("*").single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Slug already exists." }, { status: 409 });
    console.error("admin quest update:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  await audit(sb, "VERSE_QUEST_UPDATED", { quest_id: id, fields: Object.keys(update) });
  return NextResponse.json({ quest: data });
}

// POST = clone into a new draft.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { id } = await params;
  const sb = createServiceClient();
  const { data: src } = await sb.from("verse_quests").select("*").eq("id", id).single();
  if (!src) return NextResponse.json({ error: "Quest not found." }, { status: 404 });

  const { id: _omit, created_at: _c, updated_at: _u, ...rest } = src;
  const copy = {
    ...rest,
    slug: `${src.slug}-copy-${Date.now().toString(36).slice(-4)}`.slice(0, 48),
    title: `${src.title} (copy)`.slice(0, 80),
    status: "draft",
    featured: false,
  };
  const { data, error } = await sb.from("verse_quests").insert(copy).select("*").single();
  if (error) return NextResponse.json({ error: "Database error." }, { status: 500 });
  await audit(sb, "VERSE_QUEST_CLONED", { from: id, quest_id: data.id });
  return NextResponse.json({ quest: data });
}
