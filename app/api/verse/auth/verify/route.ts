import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { validateSolanaWallet } from "@/lib/validation";
import { buildSignInMessage, requestOrigin, verifySolanaSignature } from "@/lib/verse/solana";
import { signVerseToken, VERSE_COOKIE, verseCookieOptions } from "@/lib/verse/session";
import { periodKey } from "@/lib/verse/periods";

const ONBOARDING_QUEST = "connect-passport";

// Step 2 of wallet sign-in: check the signature over the stored challenge,
// then open (or create) the wallet's Verse profile.
export async function POST(req: NextRequest) {
  if (!rateLimit(getClientIp(req.headers), { namespace: "verse-verify", max: 20, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const wallet = typeof body?.wallet === "string" ? body.wallet.trim() : "";
  const nonce = typeof body?.nonce === "string" ? body.nonce : "";
  const signatureB64 = typeof body?.signature === "string" ? body.signature : "";
  if (validateSolanaWallet(wallet) || !/^[0-9a-f]{32}$/.test(nonce) || !signatureB64) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const sb = createServiceClient();

  // Consume the nonce atomically: only an unused, unexpired challenge for this
  // exact wallet can be redeemed, and only once.
  const { data: challenge } = await sb
    .from("verse_auth_nonces")
    .update({ used_at: new Date().toISOString() })
    .eq("nonce", nonce)
    .eq("wallet", wallet)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("issued_at")
    .maybeSingle();
  if (!challenge) {
    return NextResponse.json({ error: "Sign-in request expired. Please try again." }, { status: 401 });
  }

  const origin = requestOrigin(req.headers);
  if (!origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 400 });
  // Same host as the nonce request (same page), so the rebuilt text matches what was signed.
  const message = buildSignInMessage(wallet, nonce, new Date(challenge.issued_at).toISOString(), origin);
  const signature = Buffer.from(signatureB64, "base64");
  if (!verifySolanaSignature(wallet, message, signature)) {
    return NextResponse.json({ error: "Signature could not be verified." }, { status: 401 });
  }

  const { data: user, error } = await sb
    .from("verse_users")
    .upsert({ wallet, last_seen_at: new Date().toISOString() }, { onConflict: "wallet" })
    .select("id, wallet")
    .single();
  if (error || !user) {
    console.error("verse user upsert:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }

  // One-time onboarding quest is granted by the sign-in itself. Ignore
  // ALREADY_DONE / unpublished — it is a bonus, not part of sign-in.
  const { data: onboarding } = await sb
    .from("verse_quests")
    .select("id")
    .eq("slug", ONBOARDING_QUEST)
    .eq("status", "published")
    .maybeSingle();
  if (onboarding) {
    await sb.rpc("verse_record_completion", {
      p_user: user.id,
      p_quest: onboarding.id,
      p_period: periodKey("once"),
      p_status: "completed",
    });
  }

  const res = NextResponse.json({ ok: true, wallet: user.wallet });
  res.cookies.set(VERSE_COOKIE, signVerseToken({ userId: user.id, wallet: user.wallet }), verseCookieOptions);
  return res;
}
