import { NextResponse } from "next/server";
import { VERSE_COOKIE } from "@/lib/verse/session";

// Disconnect: drop the Verse session cookie.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(VERSE_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
