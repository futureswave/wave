import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, TOKEN_TTL_MS, signAdminToken, verifyPassword } from "@/lib/admin-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** Upper bound on what we feed into scrypt. */
const MAX_PASSWORD_LENGTH = 256;

const invalid = () => NextResponse.json({ error: "Invalid password." }, { status: 401 });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!rateLimit(ip, { namespace: "admin-login", max: 5, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Please wait and try again." }, { status: 429 });
  }

  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return invalid();
  }
  if (typeof password !== "string" || !password || password.length > MAX_PASSWORD_LENGTH) {
    return invalid();
  }

  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!storedHash) {
    console.error("ADMIN_PASSWORD_HASH is not set — admin login is disabled.");
    return invalid();
  }

  if (!(await verifyPassword(password, storedHash))) {
    return invalid();
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, signAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: Math.floor(TOKEN_TTL_MS / 1000),
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
