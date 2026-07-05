import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { signAdminToken } from "@/lib/admin-auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!rateLimit(ip, { namespace: "admin-login", max: 5, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Please wait and try again." }, { status: 429 });
  }

  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || typeof password !== "string" || !safeEqual(password, adminPassword)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = signAdminToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set("vanth_admin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("vanth_admin");
  return res;
}
