import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { validateWhitelistForm, normalizeXHandle } from "@/lib/validation";

// In-memory rate limit store (resets on server restart)
// For production, replace with Upstash Redis or Vercel KV
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ipHash: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ipHash);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ipHash, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip + process.env.SUPABASE_SERVICE_ROLE_KEY).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const ipHash = hashIp(ip);

    if (!checkRateLimit(ipHash)) {
      return NextResponse.json({ error: "Too many requests. Please wait and try again." }, { status: 429 });
    }

    const body = await req.json();
    const { wallet_address, twitter_handle, discord_handle, ack_magiceden_only, captcha_token } = body;

    // Server-side validation (mirrors client)
    const validationErrors = validateWhitelistForm({
      wallet_address: wallet_address ?? "",
      twitter_handle: twitter_handle ?? "",
      discord_handle: discord_handle ?? "",
      ack_magiceden_only: ack_magiceden_only ?? false,
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
