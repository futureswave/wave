import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { validateSolanaWallet, validateXHandle, validateDiscordHandle, normalizeXHandle } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const ipHash = hashIp(ip);

    if (!rateLimit(ipHash, { namespace: "access-apply", max: 3, windowMs: 10 * 60 * 1000 })) {
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
      ack_opensea_only,
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

    // Essays are optional in the current flow (the form no longer collects them).
    // Coerce to safe strings so downstream .trim()/insert can't crash on undefined.
    const essayAlignment = typeof essay_alignment === "string" ? essay_alignment : "";
    const essayReputation = typeof essay_reputation === "string" ? essay_reputation : "";
    const essayValue = typeof essay_value === "string" ? essay_value : "";

    if (!ack_opensea_only) {
      return NextResponse.json({ error: "You must acknowledge the minting safety notice." }, { status: 400 });
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

    // Atomically claim the code before inserting: the conditional update on
    // state='AVAILABLE' ensures only one concurrent request can win. If no row
    // is returned, another request already claimed it.
    const { data: lockedCode, error: lockErr } = await supabase
      .from("access_codes")
      .update({ state: "LOCKED" })
      .eq("id", codeData.id)
      .eq("state", "AVAILABLE")
      .select("id")
      .maybeSingle();

    if (lockErr) throw lockErr;
    if (!lockedCode) {
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
        essay_alignment: essayAlignment.trim(),
        essay_reputation: essayReputation.trim(),
        essay_value: essayValue.trim(),
        reference_links: reference_links ?? null,
        ip_hash: ipHash,
        user_agent: req.headers.get("user-agent")?.slice(0, 200) ?? null,
        status: "SUBMITTED",
      })
      .select("id")
      .single();

    if (appErr) {
      // Release the code we just claimed so a valid retry can reuse it.
      await supabase
        .from("access_codes")
        .update({ state: "AVAILABLE" })
        .eq("id", codeData.id);
      if (appErr.code === "23505") {
        return NextResponse.json({ error: "This wallet has already submitted an application." }, { status: 409 });
      }
      throw appErr;
    }

    // Record which application redeemed the (already LOCKED) code
    await supabase
      .from("access_codes")
      .update({ redeemed_by_application_id: appData.id })
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
