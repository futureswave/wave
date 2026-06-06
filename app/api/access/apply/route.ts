import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { validateSolanaWallet, validateXHandle, validateDiscordHandle, normalizeXHandle, validateEssay } from "@/lib/validation";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const ipHash = hashIp(ip);

    if (!checkRateLimit(ipHash)) {
      return NextResponse.json({ error: "Too many requests. Please wait and try again." }, { status: 429 });
    }

    const body = await req.json();
    const {
      code,
      wallet_address,
      twitter_handle,
      discord_handle,
      essay_alignment,
      essay_reputation,
      essay_value,
      reference_links,
      ack_magiceden_only,
    } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ error: "Access code is required." }, { status: 400 });
    }

    const walletErr = validateSolanaWallet(wallet_address ?? "");
    if (walletErr) return NextResponse.json({ error: walletErr }, { status: 400 });

    const xErr = validateXHandle(twitter_handle ?? "");
    if (xErr) return NextResponse.json({ error: xErr }, { status: 400 });

    const discordErr = validateDiscordHandle(discord_handle ?? "");
    if (discordErr) return NextResponse.json({ error: discordErr }, { status: 400 });

    const essay1Err = validateEssay(essay_alignment ?? "");
    if (essay1Err) return NextResponse.json({ error: `Essay 1: ${essay1Err}` }, { status: 400 });

    const essay2Err = validateEssay(essay_reputation ?? "");
    if (essay2Err) return NextResponse.json({ error: `Essay 2: ${essay2Err}` }, { status: 400 });

    const essay3Err = validateEssay(essay_value ?? "");
    if (essay3Err) return NextResponse.json({ error: `Essay 3: ${essay3Err}` }, { status: 400 });

    if (!ack_magiceden_only) {
      return NextResponse.json({ error: "You must acknowledge that minting happens on Magic Eden only." }, { status: 400 });
    }

    if (reference_links !== undefined && reference_links !== null) {
      if (!Array.isArray(reference_links) || reference_links.length > 5) {
        return NextResponse.json({ error: "Reference links must be an array of max 5 items." }, { status: 400 });
      }
    }

    const supabase = createServiceClient();
    const normalizedCode = code.trim().toUpperCase();

    // Re-check code availability (race condition guard)
    const { data: codeData, error: codeErr } = await supabase
      .from("access_codes")
      .select("id, state")
      .eq("code", normalizedCode)
      .single();

    if (codeErr || !codeData) {
      return NextResponse.json({ error: "Invalid access code." }, { status: 400 });
    }
    if (codeData.state !== "AVAILABLE") {
      return NextResponse.json({ error: "This access code is no longer available." }, { status: 409 });
    }

    // Insert application
    const { data: appData, error: appErr } = await supabase
      .from("applications")
      .insert({
        access_code_id: codeData.id,
        applicant_wallet: wallet_address.trim(),
        twitter_handle: normalizeXHandle(twitter_handle),
        discord_handle: discord_handle.trim(),
        essay_alignment: essay_alignment.trim(),
        essay_reputation: essay_reputation.trim(),
        essay_value: essay_value.trim(),
        reference_links: reference_links ?? null,
        ip_hash: ipHash,
        user_agent: req.headers.get("user-agent")?.slice(0, 200) ?? null,
        status: "SUBMITTED",
      })
      .select("id")
      .single();

    if (appErr) {
      if (appErr.code === "23505") {
        return NextResponse.json({ error: "This wallet has already submitted an application." }, { status: 409 });
      }
      throw appErr;
    }

    // Lock the code
    await supabase
      .from("access_codes")
      .update({ state: "LOCKED", redeemed_by_application_id: appData.id })
      .eq("id", codeData.id);

    // Audit log
    await supabase.from("audit_events").insert({
      event_type: "APPLICATION_SUBMITTED",
      application_id: appData.id,
      access_code_id: codeData.id,
      metadata: { ip_hash: ipHash },
    });

    return NextResponse.json({ success: true, application_id: appData.id });
  } catch (err) {
    console.error("Apply error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
