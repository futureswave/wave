import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { validateEthereumWallet } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get("wallet")?.trim();
  if (!wallet) {
    return NextResponse.json({ found: false, error: "Wallet address is required." }, { status: 400 });
  }

  const walletErr = validateEthereumWallet(wallet);
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

  let invite_codes: { code: string; state: string }[] = [];

  if (data.status === "APPROVED") {
    const { data: member } = await supabase
      .from("members")
      .select("id")
      .eq("wallet_address", wallet)
      .single();

    if (member) {
      const { data: codes } = await supabase
        .from("access_codes")
        .select("code, state")
        .eq("referrer_member_id", member.id);
      invite_codes = codes ?? [];
    }
  }

  return NextResponse.json({
    found: true,
    status: data.status,
    updated_at: data.updated_at,
    created_at: data.created_at,
    invite_codes,
  });
}
