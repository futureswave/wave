import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { validateSolanaWallet } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet")?.trim();
  if (!wallet) {
    return NextResponse.json({ found: false, error: "Wallet address is required." }, { status: 400 });
  }

  const walletErr = validateSolanaWallet(wallet);
  if (walletErr) {
    return NextResponse.json({ found: false, error: walletErr }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("applications")
    .select("status, updated_at, created_at")
    .eq("applicant_wallet", wallet)
    .single();

  if (error || !data) {
    return NextResponse.json({ found: false });
  }

  return NextResponse.json({
    found: true,
    status: data.status,
    updated_at: data.updated_at,
    created_at: data.created_at,
  });
}
