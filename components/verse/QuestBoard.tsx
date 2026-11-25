"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Check, Clock, Hourglass, Lock, RefreshCw, ShieldCheck, Sparkles, X } from "lucide-react";
import type { PublicQuest, QuestCategory } from "@/lib/verse/types";
import { trackEvent } from "@/lib/analytics";
import { useVerse } from "./VerseProvider";
import { ConnectWallet } from "./ConnectWallet";
import { Eyebrow, Panel, useCountdown } from "./bits";

const SECTIONS: { title: string; lead: string; categories: QuestCategory[] }[] = [
  { title: "Daily Missions", lead: "Small signals. Reset every day at 00:00 UTC.", categories: ["daily"] },
  { title: "Lore", lead: "Read the archive. Prove you were paying attention.", categories: ["lore"] },
  { title: "Weekly & Community", lead: "Bigger efforts, reviewed by the team.", categories: ["weekly", "community"] },
  { title: "Onboarding", lead: "One-time steps into the Verse.", categories: ["one_time"] },
  { title: "Holders", lead: "Read-only on-chain checks for VANTH holders.", categories: ["holder"] },
];

const VERIFY_LABEL: Record<PublicQuest["verification"], string> = {
  auto: "Instant",
  quiz: "Quiz",
  proof: "Manual review",
  holder: "On-chain check",
};

const REPEAT_LABEL: Record<PublicQuest["repeat"], string> = {
  once: "One time",
  daily: "Daily",
  weekly: "Weekly",
};

function StateBadge({ q }: { q: PublicQuest }) {
  const resets = useCountdown(q.state === "completed" ? q.resetsAt : null);
  const base = "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest";
  switch (q.state) {
    case "completed":
      return (
        <span className={`${base} text-emerald-400`}>
          <Check className="h-3 w-3" /> Done{resets ? ` · resets ${resets.label}` : ""}
        </span>
      );
    case "submitted":
      return (
        <span className={`${base} text-amber-300`}>
          <Hourglass className="h-3 w-3" /> In review
        </span>
      );
    case "rejected":
      return (
        <span className={`${base} text-red-400`}>
          <X className="h-3 w-3" /> Rejected
        </span>
      );
    case "limit":
      return <span className={`${base} text-white/30`}>Limit reached</span>;
    case "soon":
      return (
        <span className={`${base} text-white/30`}>
          <Lock className="h-3 w-3" /> Opens after mint
        </span>
      );
    default:
      return <span className={`${base} text-white/40`}>Available</span>;
  }
}

function QuizForm({ q, onDone }: { q: PublicQuest; onDone: (msg: string) => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => q.quiz!.map(() => null));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (answers.some((a) => a === null)) {
      setError("Answer every question.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/verse/quests/${q.slug}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Something went wrong.");
      return;
    }
    trackEvent("verse_quest_complete", { quest: q.slug });
    onDone(`+${json.xp} XP`);
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-5 border-t border-white/[0.06] pt-5">
      {q.quiz!.map((item, qi) => (
        <fieldset key={qi}>
          <legend className="mb-2 text-sm font-semibold text-white">
            <span className="mr-2 font-mono text-white/30">{String(qi + 1).padStart(2, "0")}</span>
            {item.q}
          </legend>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {item.options.map((opt, oi) => (
              <label
                key={oi}
                className={`flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors ${
                  answers[qi] === oi
                    ? "border-signal/60 bg-signal/10 text-white"
                    : "border-white/[0.07] text-white/55 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name={`q${qi}`}
                  className="sr-only"
                  checked={answers[qi] === oi}
                  onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded-sm bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
      >
        {busy ? "Checking…" : "Submit answers"}
      </button>
    </form>
  );
}

function ProofForm({ q, onDone }: { q: PublicQuest; onDone: (msg: string) => void }) {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/verse/quests/${q.slug}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proofUrl: url, proofText: note }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Something went wrong.");
      return;
    }
    trackEvent("verse_quest_submit", { quest: q.slug });
    onDone("Submitted for review");
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-3 border-t border-white/[0.06] pt-5">
      {q.proofHint && <p className="text-xs text-white/45">{q.proofHint}</p>}
      <input
        type="url"
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://"
        aria-label="Proof link"
        className="h-10 w-full rounded-sm border border-white/10 bg-black/40 px-3 font-mono text-sm text-white placeholder:text-white/25 focus:border-signal/60 focus:outline-none"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={500}
        rows={2}
        placeholder="Optional note for the reviewer"
        aria-label="Note for the reviewer"
        className="w-full rounded-sm border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-signal/60 focus:outline-none"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-[11px] text-white/30">Reviews usually take up to 72 hours. Rejected submissions show a reason and can be resubmitted.</p>
      <button
        type="submit"
        disabled={busy}
        className="rounded-sm bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Submit proof"}
      </button>
    </form>
  );
}

function QuestCard({ q, onChange }: { q: PublicQuest; onChange: () => void }) {
  const { me, refresh } = useVerse();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const actionable = me && (q.state === "available" || q.state === "rejected");

  async function done(msg: string) {
    setFlash(msg);
    setOpen(false);
    await Promise.all([onChange(), refresh()]);
  }

  async function claim() {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/verse/quests/${q.slug}/complete`, { method: "POST" });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Something went wrong.");
      return;
    }
    trackEvent("verse_quest_complete", { quest: q.slug });
    done(`+${json.xp} XP`);
  }

  const cta =
    q.verification === "quiz"
      ? "Start quiz"
      : q.verification === "proof"
        ? q.state === "rejected"
          ? "Resubmit"
          : "Submit proof"
        : q.verification === "holder"
          ? "Verify wallet"
          : "Claim";

  return (
    <Panel className={`flex flex-col p-5 ${q.featured ? "border-signal/30" : ""}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <StateBadge q={q} />
        <span className="shrink-0 font-mono text-lg font-bold text-white">
          +{q.xp} <span className="text-xs text-white/40">XP</span>
        </span>
      </div>
      <h3 className="mb-2 text-lg font-bold text-white">{q.title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-white/55">{q.description}</p>

      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11px] text-white/35">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> ~{q.estMinutes} min
        </span>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" /> {VERIFY_LABEL[q.verification]}
        </span>
        <span>{REPEAT_LABEL[q.repeat]}</span>
        <span className="capitalize">{q.difficulty}</span>
        {q.maxCompletions && <span>Max {q.maxCompletions}×</span>}
        {q.endsAt && <span>Ends {new Date(q.endsAt).toLocaleDateString()}</span>}
      </div>

      {q.loreRef && (
        <Link
          href={q.loreHref ?? "/universe"}
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-signal hover:text-white"
        >
          <BookOpen className="h-3.5 w-3.5" /> {q.loreRef}
        </Link>
      )}

      {q.state === "rejected" && q.rejectReason && (
        <p className="mb-4 rounded-sm border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">
          Reviewer: {q.rejectReason}
        </p>
      )}

      <div className="mt-auto">
        {flash && <p className="mb-3 font-mono text-sm text-emerald-400">{flash}</p>}
        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
        {!me ? (
          q.state !== "soon" && <p className="font-mono text-[11px] text-white/30">Connect a wallet to start.</p>
        ) : actionable ? (
          q.verification === "quiz" || q.verification === "proof" ? (
            !open && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:border-signal/60 hover:bg-signal/[0.06] hover:text-white"
              >
                {cta}
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={claim}
              disabled={busy}
              className="rounded-sm bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50"
            >
              {busy ? "Verifying…" : cta}
            </button>
          )
        ) : null}
      </div>

      {open && q.verification === "quiz" && <QuizForm q={q} onDone={done} />}
      {open && q.verification === "proof" && <ProofForm q={q} onDone={done} />}
    </Panel>
  );
}

export function QuestBoard() {
  const { me, loading: sessionLoading } = useVerse();
  const [quests, setQuests] = useState<PublicQuest[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/verse/quests", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setQuests(json.quests);
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "Could not load quests.");
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading) load();
  }, [load, sessionLoading, me?.wallet]);

  const featured = quests?.find((q) => q.featured && q.state !== "completed");

  return (
    <div>
      <section className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Eyebrow>Quest board</Eyebrow>
          <h1 className="tracking-display mb-4 text-4xl font-bold uppercase leading-[1.05] text-white sm:text-6xl">
            Quests
          </h1>
          <p className="max-w-xl text-white/55">
            Every quest shows its XP, time and how it is verified before you start. No quest will ever ask for a
            transaction, a transfer or your seed phrase.
          </p>
        </div>
        {!me && !sessionLoading && <ConnectWallet />}
      </section>

      {error ? (
        <Panel className="flex flex-col items-center gap-4 p-10 text-center">
          <p className="text-sm text-white/55">{error}</p>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </Panel>
      ) : !quests ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-sm bg-white/[0.03]" />
          ))}
        </div>
      ) : (
        <div className="space-y-14">
          {featured && (
            <section>
              <h2 className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-signal">
                <Sparkles className="h-3.5 w-3.5" /> Featured
              </h2>
              <div className="max-w-2xl">
                <QuestCard q={featured} onChange={load} />
              </div>
            </section>
          )}
          {SECTIONS.map((s) => {
            const list = quests.filter((q) => s.categories.includes(q.category) && q !== featured);
            if (!list.length) return null;
            return (
              <section key={s.title}>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold uppercase text-white">{s.title}</h2>
                  <p className="text-sm text-white/40">{s.lead}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {list.map((q) => (
                    <QuestCard key={q.id} q={q} onChange={load} />
                  ))}
                </div>
              </section>
            );
          })}
          {quests.length === 0 && (
            <Panel className="p-10 text-center text-sm text-white/55">No quests are live right now. Check back soon.</Panel>
          )}
        </div>
      )}
    </div>
  );
}
