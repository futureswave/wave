import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { getVerseSession } from "@/lib/verse/session";
import { periodKey } from "@/lib/verse/periods";
import { completionError, type QuestRow } from "@/lib/verse/quests";
import { collectionAddress, countVanthHeld, holderCheckEnabled } from "@/lib/verse/holder";

const MAX_PROOF_URL = 300;
const MAX_PROOF_TEXT = 500;

// All quest verification happens here, server-side. The client only says
// "I did quest X" and supplies answers / proof; XP is decided by the database.
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getVerseSession();
  if (!session) return NextResponse.json({ error: "Connect your wallet first." }, { status: 401 });

  const { slug } = await params;
  if (!rateLimit(`${session.userId}:${slug}`, { namespace: "verse-complete", max: 6, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  }

  const sb = createServiceClient();
  const { data } = await sb.from("verse_quests").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  const quest = data as QuestRow | null;
  if (!quest) return NextResponse.json({ error: "Quest not found." }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  let status: "completed" | "submitted" = "completed";
  let proofUrl: string | null = null;
  let proofText: string | null = null;

  switch (quest.verification) {
    case "auto":
      break;

    case "quiz": {
      const answers: unknown = body?.answers;
      const key = quest.quiz ?? [];
      if (!Array.isArray(answers) || answers.length !== key.length) {
        return NextResponse.json({ error: "Answer every question." }, { status: 400 });
      }
      const correct = key.filter((item, i) => answers[i] === item.answer).length;
      if (correct !== key.length) {
        return NextResponse.json(
          { error: `${correct}/${key.length} correct. Revisit the archive and try again.`, correct },
          { status: 422 },
        );
      }
      break;
    }

    case "proof": {
      const url = typeof body?.proofUrl === "string" ? body.proofUrl.trim() : "";
      const text = typeof body?.proofText === "string" ? body.proofText.trim() : "";
      if (url) {
        let parsed: URL;
        try {
          parsed = new URL(url);
        } catch {
          return NextResponse.json({ error: "Proof link is not a valid URL." }, { status: 400 });
        }
        if (parsed.protocol !== "https:" || url.length > MAX_PROOF_URL) {
          return NextResponse.json({ error: "Proof link must be an https URL." }, { status: 400 });
        }
        proofUrl = parsed.toString();
      }
      if (text.length > MAX_PROOF_TEXT) {
        return NextResponse.json({ error: `Note is limited to ${MAX_PROOF_TEXT} characters.` }, { status: 400 });
      }
      if (!proofUrl) return NextResponse.json({ error: "A proof link is required." }, { status: 400 });
      proofText = text || null;
      status = "submitted";
      break;
    }

    case "holder": {
      if (!holderCheckEnabled()) {
        return NextResponse.json({ error: "Holder verification opens after mint." }, { status: 409 });
      }
      let held = 0;
      try {
        held = await countVanthHeld(session.wallet);
      } catch (e) {
        console.error("holder check:", e);
        await sb.from("verse_wallet_verifications").insert({
          user_id: session.userId,
          wallet: session.wallet,
          collection: collectionAddress(),
          status: "error",
        });
        return NextResponse.json({ error: "On-chain check failed. Try again later." }, { status: 502 });
      }
      await sb.from("verse_wallet_verifications").insert({
        user_id: session.userId,
        wallet: session.wallet,
        collection: collectionAddress(),
        held_count: held,
        status: held > 0 ? "verified" : "not_holder",
      });
      if (held === 0) {
        return NextResponse.json({ error: "No VANTH found in this wallet." }, { status: 422 });
      }
      break;
    }
  }

  const { data: completion, error } = await sb.rpc("verse_record_completion", {
    p_user: session.userId,
    p_quest: quest.id,
    p_period: periodKey(quest.repeat),
    p_status: status,
    p_proof_url: proofUrl,
    p_proof_text: proofText,
  });
  if (error) {
    const mapped = completionError(error.message);
    if (mapped.status === 500) console.error("verse complete:", error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }

  return NextResponse.json({
    ok: true,
    status: (completion as { status: string }).status,
    xp: status === "completed" ? quest.xp : 0,
  });
}
