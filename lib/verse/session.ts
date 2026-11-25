import "server-only";
import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// Wallet session for the Verse (quests / passport). Separate from the admin
// session: different cookie, different key, longer lifetime.
export const VERSE_COOKIE = "vanth_verse";
export const VERSE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

const MIN_SECRET_LENGTH = 32;

function getSecret(): string {
  const own = process.env.VERSE_SESSION_SECRET;
  if (own && own.length >= MIN_SECRET_LENGTH) return own;

  // Fall back to a key derived from ADMIN_SECRET so one strong secret is
  // enough to run the site, while admin and verse tokens stay non-interchangeable.
  const admin = process.env.ADMIN_SECRET;
  if (admin && admin.length >= MIN_SECRET_LENGTH) {
    return createHmac("sha256", admin).update("vanth-verse-session-v1").digest("base64url");
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("VERSE_SESSION_SECRET (or ADMIN_SECRET) must be set to 32+ characters.");
  }
  return "dev-fallback-verse-secret-change-in-prod-000000";
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export interface VerseSession {
  userId: string;
  wallet: string;
}

// `<userId>.<wallet>.<issuedAt>.<nonce>.<hmac>` — uuid and base58 contain no dots.
export function signVerseToken(s: VerseSession): string {
  const payload = `${s.userId}.${s.wallet}.${Date.now()}.${randomBytes(12).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyVerseToken(token: string): VerseSession | null {
  const parts = token.split(".");
  if (parts.length !== 5) return null;
  const [userId, wallet, issued, nonce, sig] = parts;
  const sigBuf = Buffer.from(sig);
  const expected = Buffer.from(sign(`${userId}.${wallet}.${issued}.${nonce}`));
  if (sigBuf.length !== expected.length || !timingSafeEqual(sigBuf, expected)) return null;
  const age = Date.now() - Number(issued);
  if (!Number.isFinite(age) || age < 0 || age > VERSE_TTL_MS) return null;
  return { userId, wallet };
}

export async function getVerseSession(): Promise<VerseSession | null> {
  const token = (await cookies()).get(VERSE_COOKIE)?.value;
  return token ? verifyVerseToken(token) : null;
}

export const verseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: VERSE_TTL_MS / 1000,
};
