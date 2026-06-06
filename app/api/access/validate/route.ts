import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
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

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ valid: false, message: "Too many requests." }, { status: 429 });
  }

  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ valid: false, message: "No code provided." }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("access_codes")
    .select("state")
    .eq("code", code)
    .single();

  if (error || !data) {
    return NextResponse.json({ valid: false, message: "Invalid access code." });
  }

  if (data.state === "AVAILABLE") {
    return NextResponse.json({ valid: true, state: "AVAILABLE", message: "Code accepted. You may apply." });
  }
  if (data.state === "LOCKED") {
    return NextResponse.json({ valid: false, state: "LOCKED", message: "This code is currently locked." });
  }
  return NextResponse.json({ valid: false, state: data.state, message: "Invalid access code." });
}
