import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// In-memory rate limit (resets on cold start — good enough for Edge Functions)
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

function validateWallet(address: string): boolean {
  const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]+$/;
  const trimmed = address.trim();
  return BASE58_REGEX.test(trimmed) && trimmed.length >= 32 && trimmed.length <= 44;
}

function validateXHandle(handle: string): boolean {
  const trimmed = handle.trim().replace(/^@/, "");
  return /^[A-Za-z0-9_]{1,50}$/.test(trimmed);
}

function validateDiscord(handle: string): boolean {
  const trimmed = handle.trim();
  return /^[a-z0-9_.]{2,32}$/.test(trimmed) || /^.{2,32}#\d{4}$/.test(trimmed);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { wallet_address, twitter_handle, discord_handle, ack_magiceden_only } = await req.json();

    // Validations
    if (!wallet_address || !validateWallet(wallet_address)) {
      return new Response(
        JSON.stringify({ error: "Invalid Solana wallet address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!twitter_handle || !validateXHandle(twitter_handle)) {
      return new Response(
        JSON.stringify({ error: "Invalid X username." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!discord_handle || !validateDiscord(discord_handle)) {
      return new Response(
        JSON.stringify({ error: "Invalid Discord username." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!ack_magiceden_only) {
      return new Response(
        JSON.stringify({ error: "You must acknowledge Magic Eden only minting." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { error } = await supabase.from("whitelist_submissions").insert({
      wallet_address: wallet_address.trim(),
      twitter_handle: twitter_handle.trim().replace(/^@/, ""),
      discord_handle: discord_handle.trim(),
      ip_hash: ip,
      user_agent: req.headers.get("user-agent")?.slice(0, 200) ?? null,
      status: "submitted",
    });

    if (error) {
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: "This wallet is already on the whitelist." }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
