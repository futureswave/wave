"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, Hourglass, ShieldCheck, X } from "lucide-react";
import { levelFor, shortWallet } from "@/lib/verse/levels";
import { useVerse } from "./VerseProvider";
import { ConnectWallet } from "./ConnectWallet";
import { Eyebrow, Glyph, Panel, RankDelta, formatXp, timeAgo } from "./bits";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function ProfileSettings() {
  const { me, refresh } = useVerse();
  const [name, setName] = useState(me?.displayName ?? "");
  const [isPublic, setIsPublic] = useState(me?.isPublic ?? true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setName(me?.displayName ?? "");
    setIsPublic(me?.isPublic ?? true);
  }, [me?.displayName, me?.isPublic]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/verse/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName: name, isPublic }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMsg({ ok: false, text: json.error ?? "Could not save." });
      return;
    }
    setMsg({ ok: true, text: "Saved." });
    refresh();
  }

  return (
    <Panel className="p-5">
      <Eyebrow>Identity</Eyebrow>
      <form onSubmit={save} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs text-white/45">Alias (optional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder={me ? shortWallet(me.wallet) : ""}
            className="h-10 w-full rounded-sm border border-white/10 bg-black/40 px-3 font-mono text-sm text-white placeholder:text-white/25 focus:border-signal/60 focus:outline-none"
          />
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mt-0.5 accent-[#7c3aed]"
          />
          <span className="text-sm text-white/60">
            Public profile
            <span className="block text-xs text-white/35">
              Off: the board shows only your shortened wallet — no alias, no profile page.
            </span>
          </span>
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:border-signal/60 hover:text-white disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
          {msg && <span className={`text-xs ${msg.ok ? "text-emerald-400" : "text-red-400"}`}>{msg.text}</span>}
        </div>
      </form>
    </Panel>
  );
}

export function PassportView() {
  const { me, season, loading } = useVerse();

  if (loading) return <div className="h-96 animate-pulse rounded-sm bg-white/[0.03]" />;

  if (!me) {
    return (
      <Panel className="mx-auto max-w-xl p-10 text-center">
        <Eyebrow>Vanth Passport</Eyebrow>
        <h1 className="mb-4 text-3xl font-bold uppercase text-white">Open your Passport</h1>
        <p className="mb-8 text-white/55">
          Your Passport tracks XP, level, rank and every quest you complete. Connect a Solana wallet and sign a message
          to open it — no transaction, no fee.
        </p>
        <div className="flex justify-center">
          <ConnectWallet />
        </div>
      </Panel>
    );
  }

  const level = levelFor(me.lifetimeXp);
  const profileUrl = typeof window !== "undefined" ? `${window.location.origin}/verse/u/${me.wallet}` : "";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        {/* Passport card */}
        <Panel className="relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-signal/10 blur-3xl" aria-hidden />
          <Eyebrow>Vanth Passport</Eyebrow>
          <div className="mb-8 flex items-center gap-4">
            <Glyph seed={shortWallet(me.wallet)} size={56} />
            <div className="min-w-0">
              <h1 className="truncate text-3xl font-bold text-white">{me.displayName ?? shortWallet(me.wallet)}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-white/35">{shortWallet(me.wallet)}</span>
                <CopyButton value={me.wallet} label="Copy wallet" />
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: season ? "Season XP" : "XP", value: formatXp(me.seasonXp) },
              { label: "Lifetime XP", value: formatXp(me.lifetimeXp) },
              { label: "Rank", value: me.rank ? `#${me.rank}` : "—" },
              { label: "Level", value: `${level.level}` },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{s.label}</p>
                <p className="mt-1 flex items-center gap-2 font-mono text-2xl font-bold text-white">
                  {s.value}
                  {s.label === "Rank" && me.rank && <RankDelta delta={me.delta} />}
                </p>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-2 flex justify-between font-mono text-[11px] text-white/40">
              <span className="uppercase tracking-widest">{level.title}</span>
              <span>{level.next ? `${level.toNext} XP to ${level.next.title}` : "Max level"}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full bg-signal" style={{ width: `${Math.round(level.progress * 100)}%` }} />
            </div>
          </div>
        </Panel>

        {/* Activity */}
        <Panel>
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">Activity</p>
            <Link href="/verse/quests" className="text-xs text-white/40 hover:text-white">
              Find quests →
            </Link>
          </div>
          {me.activity.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-white/45">No activity yet.</p>
          ) : (
            <ul>
              {me.activity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-4 border-b border-white/[0.04] px-5 py-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{a.questTitle}</p>
                    <p className="font-mono text-[11px] text-white/30">{timeAgo(a.at)}</p>
                    {a.status === "rejected" && a.rejectReason && (
                      <p className="mt-1 text-xs text-red-300/80">{a.rejectReason}</p>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-xs">
                    {a.status === "completed" && <span className="text-emerald-400">+{a.xp} XP</span>}
                    {a.status === "submitted" && (
                      <span className="inline-flex items-center gap-1 text-amber-300">
                        <Hourglass className="h-3 w-3" /> review
                      </span>
                    )}
                    {a.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 text-red-400">
                        <X className="h-3 w-3" /> rejected
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <aside className="space-y-6">
        <ProfileSettings />
        <Panel className="p-5">
          <Eyebrow>Holder status</Eyebrow>
          {me.holder.verified ? (
            <p className="inline-flex items-center gap-2 text-sm text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Verified · {me.holder.count} VANTH
            </p>
          ) : (
            <p className="text-sm text-white/45">Not verified. Holder verification opens after mint.</p>
          )}
          {me.holder.checkedAt && (
            <p className="mt-2 font-mono text-[11px] text-white/30">Checked {timeAgo(me.holder.checkedAt)}</p>
          )}
        </Panel>
        {me.isPublic && (
          <Panel className="p-5">
            <Eyebrow>Share</Eyebrow>
            <div className="flex flex-wrap items-center gap-4">
              <CopyButton value={profileUrl} label="Copy profile link" />
              <Link
                href={`/verse/u/${me.wallet}`}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/40 hover:text-white"
              >
                <ExternalLink className="h-3 w-3" /> View
              </Link>
            </div>
          </Panel>
        )}
      </aside>
    </div>
  );
}
