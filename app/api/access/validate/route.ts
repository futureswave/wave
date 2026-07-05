import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!rateLimit(ip, { namespace: "access-validate", max: 10, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ valid: false, message: "Too many requests." }, { status: 429 });
  }

  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ valid: false, message: "No code provided." }, { status: 400 });
  }

  // Dev bypass: accept test code without database
  if (process.env.NODE_ENV === "development" && code === "VANTH-TEST-0000") {
    return NextResponse.json({ valid: true, state: "AVAILABLE", message: "Code accepted. You may apply." });
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
