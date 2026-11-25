import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { adminGuard } from "@/lib/verse/admin";
import { audit } from "@/lib/verse/data";

const STATUSES = ["draft", "active", "ended"];

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  const sb = createServiceClient();
  const { data, error } = await sb.from("verse_seasons").select("*").order("starts_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Database error." }, { status: 500 });
  return NextResponse.json({ seasons: data });
}

function parse(body: Record<string, unknown>) {
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim().slice(0, 80) : "";
  if (!/^[a-z0-9-]{3,40}$/.test(slug) || !title) return { error: "Slug (a-z, 0-9, -) and title are required." };
  const starts = Date.parse(String(body.starts_at));
  const ends = Date.parse(String(body.ends_at));
  if (!Number.isFinite(starts) || !Number.isFinite(ends) || ends <= starts) {
    return { error: "Valid start and end dates are required (end after start)." };
  }
  const status = String(body.status ?? "draft");
  if (!STATUSES.includes(status)) return { error: "Invalid status." };
  return {
    row: {
      slug,
      title,
      starts_at: new Date(starts).toISOString(),
      ends_at: new Date(ends).toISOString(),
      status,
      rewards_text: typeof body.rewards_text === "string" ? body.rewards_text.trim().slice(0, 1000) || null : null,
      rules_version: Number.isInteger(Number(body.rules_version)) ? Number(body.rules_version) : 1,
    },
  };
}

// POST creates; POST with { id } updates.
export async function POST(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const parsed = parse(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const sb = createServiceClient();
  const query = typeof body.id === "string"
    ? sb.from("verse_seasons").update(parsed.row).eq("id", body.id)
    : sb.from("verse_seasons").insert(parsed.row);
  const { data, error } = await query.select("*").single();
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Slug already used, or another season is already active (end it first)." },
        { status: 409 },
      );
    }
    console.error("admin season save:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  await audit(sb, typeof body.id === "string" ? "VERSE_SEASON_UPDATED" : "VERSE_SEASON_CREATED", {
    season_id: data.id,
    status: data.status,
  });
  return NextResponse.json({ season: data });
}
