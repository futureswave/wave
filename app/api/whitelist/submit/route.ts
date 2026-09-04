import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { validateWhitelistForm, normalizeXHandle } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "")).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(req.headers);
    const ipHash = hashIp(ip);

    if (!rateLimit(ipHash, { namespace: "whitelist-submit", max: 3, windowMs: 10 * 60 * 1000 })) {
      return NextResponse.json({ error: "Too many requests. Please wait and try again." }, { status: 429 });
    }

    const body = await req.json();
    const { wallet_address, twitter_handle, discord_handle, ack_opensea_only, captcha_token } = body;

    // Server-side validation (mirrors client)
    const validationErrors = validateWhitelistForm({
      wallet_address: wallet_address ?? "",
      twitter_handle: twitter_handle ?? "",
      discord_handle: discord_handle ?? "",
      ack_opensea_only: ack_opensea_only ?? false,
    });

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ error: "Validation failed", fields: validationErrors }, { status: 400 });
    }

    // Cloudflare Turnstile verification (optional but recommended)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && captcha_token) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: turnstileSecret, response: captcha_token }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json({ error: "Captcha verification failed." }, { status: 400 });
      }
    }

    // Supabase insert
    const supabase = createServiceClient();
    const { error } = await supabase.from("whitelist_submissions").insert({
      wallet_address: wallet_address.trim(),
      twitter_handle: normalizeXHandle(twitter_handle),
      discord_handle: discord_handle.trim(),
      ip_hash: ipHash,
      user_agent: req.headers.get("user-agent")?.slice(0, 200) ?? null,
      status: "submitted",
    });

    if (error) {
      // Duplicate wallet
      if (error.code === "23505") {
        return NextResponse.json({ error: "This wallet is already on the whitelist." }, { status: 409 });
      }
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Database error. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Whitelist submit error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
