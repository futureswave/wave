import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createServiceClient } from "@/lib/supabase";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { validateSolanaWallet } from "@/lib/validation";
import { buildSignInMessage, requestOrigin } from "@/lib/verse/solana";

const NONCE_TTL_MS = 5 * 60 * 1000;

// Step 1 of wallet sign-in: issue a single-use challenge for the wallet to sign.
export async function POST(req: NextRequest) {
  if (!rateLimit(getClientIp(req.headers), { namespace: "verse-nonce", max: 20, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const wallet = typeof body?.wallet === "string" ? body.wallet.trim() : "";
  if (validateSolanaWallet(wallet)) {
    return NextResponse.json({ error: "Invalid wallet address." }, { status: 400 });
  }
  const origin = requestOrigin(req.headers);
  if (!origin) return NextResponse.json({ error: "Invalid request origin." }, { status: 400 });

  const nonce = randomBytes(16).toString("hex");
  const issuedAt = new Date();
  const sb = createServiceClient();

  // Opportunistic cleanup of stale challenges.
  await sb.from("verse_auth_nonces").delete().lt("expires_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

  const { error } = await sb.from("verse_auth_nonces").insert({
    nonce,
    wallet,
    issued_at: issuedAt.toISOString(),
    expires_at: new Date(issuedAt.getTime() + NONCE_TTL_MS).toISOString(),
  });
  if (error) {
    console.error("verse nonce insert:", error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }

  return NextResponse.json({ nonce, message: buildSignInMessage(wallet, nonce, issuedAt.toISOString(), origin) });
}
