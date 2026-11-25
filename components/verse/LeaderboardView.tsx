"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Crown, RefreshCw, Search, X } from "lucide-react";
import type { LeaderRow, SeasonInfo } from "@/lib/verse/types";
import { levelFor } from "@/lib/verse/levels";
import { trackEvent } from "@/lib/analytics";
import { useVerse } from "./VerseProvider";
import { ConnectWallet } from "./ConnectWallet";
import { Eyebrow, Glyph, Panel, RankDelta, formatXp, useCountdown } from "./bits";

type Scope = "season" | "all";
interface BoardResponse {
  season: SeasonInfo | null;
  scope: Scope;
  rows: LeaderRow[];
  total: number;
  hasMore?: boolean;
  updatedAt: string;
  error?: string;
}

function rowName(r: LeaderRow) {
  return r.name ?? r.short;
}

function NameCell({ r }: { r: LeaderRow }) {
  const label = (
    <span className="flex min-w-0 items-center gap-3">
      <Glyph seed={r.short} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-white">{rowName(r)}</span>
        {r.name && <span className="block font-mono text-[11px] text-white/30">{r.short}</span>}
      </span>
    </span>
  );
  return r.wallet ? (
    <Link href={`/verse/u/${r.wallet}`} className="min-w-0 hover:opacity-80">
      {label}
    </Link>
  ) : (
    label
  );
}

function Podium({ rows }: { rows: LeaderRow[] }) {
  // Visual order 2 · 1 · 3
  const order = [rows[1], rows[0], rows[2]].filter(Boolean);
  const heights: Record<number, string> = { 1: "sm:h-44", 2: "sm:h-36", 3: "sm:h-32" };
  return (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-end">
      {order.map((r) => (
        <Panel
          key={r.rank}
          className={`relative flex flex-col justify-end p-5 ${heights[r.rank]} ${
            r.rank === 1 ? "border-signal/40 shadow-[0_0_40px_rgba(124,58,237,0.15)] sm:order-none" : ""
          } ${r.rank === 1 ? "order-first" : ""}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-3xl font-bold text-white/90">
              {String(r.rank).padStart(2, "0")}
            </span>
            {r.rank === 1 && <Crown className="h-5 w-5 text-signal" />}
          </div>
          <NameCell r={r} />
          <p className="mt-3 font-mono text-sm text-white/60">
            {formatXp(r.xp)} <span className="text-white/30">XP</span>
          </p>
        </Panel>
      ))}
    </div>
  );
}

function YourRank() {
  const { me, loading } = useVerse();

  if (loading) return <Panel className="h-56 animate-pulse p-5" />;

  if (!me) {
    return (
      <Panel className="p-5">
        <Eyebrow>Your rank</Eyebrow>
        <p className="mb-5 text-sm leading-relaxed text-white/55">
          Connect a Solana wallet to open your Passport, earn XP and appear on the board.
        </p>
        <ConnectWallet />
      </Panel>
    );
  }

  const level = levelFor(me.lifetimeXp);
  return (
    <Panel className="p-5">
      <Eyebrow>Your rank</Eyebrow>
      {me.rank ? (
        <>
          <div className="mb-1 flex items-baseline gap-3">
            <span className="font-mono text-4xl font-bold text-white">#{me.rank}</span>
            <RankDelta delta={me.delta} />
          </div>
          <p className="mb-5 font-mono text-xs text-white/40">
            {formatXp(me.seasonXp)} XP · of {formatXp(me.totalRanked)} ranked
          </p>
          <ul className="mb-5 space-y-1">
            {me.neighbors.map((n) => (
              <li
                key={n.rank}
                className={`flex items-center justify-between rounded-sm px-2 py-1.5 font-mono text-xs ${
                  n.isYou ? "bg-signal/15 text-white" : "text-white/45"
                }`}
              >
                <span className="truncate">
                  {n.rank}. {n.isYou ? "You" : rowName(n)}
                </span>
                <span>{formatXp(n.xp)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mb-5 text-sm text-white/55">
          Unranked. Complete your first quest to enter the board.
        </p>
      )}
      <div className="mb-5">
        <div className="mb-1.5 flex justify-between font-mono text-[11px] text-white/40">
          <span>
            LVL {level.level} · {level.title}
          </span>
          {level.next && <span>{level.toNext} XP to {level.next.title}</span>}
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/5">
          <div className="h-full bg-signal" style={{ width: `${Math.round(level.progress * 100)}%` }} />
        </div>
      </div>
      <Link
        href="/verse/quests"
        className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-signal"
      >
        Earn XP <ArrowRight className="h-4 w-4" />
      </Link>
    </Panel>
  );
}

export function LeaderboardView() {
  const { me } = useVerse();
  const [scope, setScope] = useState<Scope>("season");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<BoardResponse | null>(null);
  const [extra, setExtra] = useState<LeaderRow[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (p: number, s: Scope, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ scope: s, page: String(p) });
      if (q) params.set("q", q);
      const res = await fetch(`/api/verse/leaderboard?${params}`, { cache: "no-store" });
      const json: BoardResponse = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not load the leaderboard.");
      if (p === 0) {
        setData(json);
        setExtra([]);
      } else {
        setData((prev) => (prev ? { ...json, rows: prev.rows } : json));
        setExtra((prev) => [...prev, ...json.rows]);
      }
      setPage(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the leaderboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload when scope/search change, and when the signed-in wallet changes
  // (so the "you" highlight is right).
  useEffect(() => {
    load(0, scope, search);
  }, [load, scope, search, me?.wallet]);

  const season = data?.season ?? null;
  const countdown = useCountdown(season?.endsAt ?? null);
  const rows = [...(data?.rows ?? []), ...extra];
  const showPodium = !search && rows.length >= 3;
  const tableRows = showPodium ? rows.slice(3) : rows;

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Eyebrow>{season ? "Season live" : "Pre-season"}</Eyebrow>
          <h1 className="tracking-display mb-4 text-4xl font-bold uppercase leading-[1.05] text-white sm:text-6xl">
            {season?.title ?? "The Registry"}
          </h1>
          <p className="max-w-xl text-white/55">
            Complete quests, earn XP and claim your place in the Verse. Rankings measure participation, not the value
            of any asset.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {countdown && (
            <div className="font-mono">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Season ends in</p>
              <p className="text-2xl font-bold text-white">{countdown.label}</p>
            </div>
          )}
          <Link
            href="/verse/quests"
            className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-black transition-[background-color,box-shadow] hover:bg-white/90 hover:shadow-[0_0_24px_rgba(124,58,237,0.35)]"
          >
            Start earning XP <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {/* Controls */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex rounded-sm border border-white/10 p-0.5 font-mono text-xs uppercase tracking-widest">
              {(["season", "all"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScope(s)}
                  disabled={s === "season" && !season && data !== null}
                  className={`rounded-sm px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                    (data?.scope ?? scope) === s ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {s === "season" ? "Season" : "All-time"}
                </button>
              ))}
            </div>
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                setSearch(query.trim());
                if (query.trim()) trackEvent("verse_leaderboard_search");
              }}
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search wallet or alias"
                aria-label="Search wallet or alias"
                className="h-9 w-full rounded-sm border border-white/10 bg-black/40 pl-9 pr-9 font-mono text-xs text-white placeholder:text-white/25 focus:border-signal/60 focus:outline-none sm:w-72"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearch("");
                  }}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>
          </div>

          {error ? (
            <Panel className="flex flex-col items-center gap-4 p-10 text-center">
              <p className="text-sm text-white/55">{error}</p>
              <button
                type="button"
                onClick={() => load(0, scope, search)}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </Panel>
          ) : !data && loading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-sm bg-white/[0.03]" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <Panel className="p-10 text-center">
              <p className="text-sm text-white/55">
                {search ? "No ranked wallet or alias matches that search." : "The board is empty. Be the first signal."}
              </p>
            </Panel>
          ) : (
            <>
              {showPodium && <Podium rows={rows.slice(0, 3)} />}
              <Panel>
                <div className="grid grid-cols-[3rem_1fr_auto] gap-3 border-b border-white/[0.06] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 sm:grid-cols-[3.5rem_1fr_5rem_6rem_3.5rem]">
                  <span>Rank</span>
                  <span>Member</span>
                  <span className="hidden text-right sm:block">Quests</span>
                  <span className="text-right">XP</span>
                  <span className="hidden text-right sm:block">24h</span>
                </div>
                <ol>
                  {tableRows.map((r) => (
                    <li
                      key={r.rank}
                      className={`grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-b border-white/[0.04] px-4 py-3 last:border-0 sm:grid-cols-[3.5rem_1fr_5rem_6rem_3.5rem] ${
                        r.isYou ? "bg-signal/10" : ""
                      }`}
                    >
                      <span className="font-mono text-sm text-white/50">{r.rank}</span>
                      <NameCell r={r} />
                      <span className="hidden text-right font-mono text-xs text-white/40 sm:block">{r.quests}</span>
                      <span className="text-right font-mono text-sm text-white">{formatXp(r.xp)}</span>
                      <span className="hidden justify-end sm:flex">
                        <RankDelta delta={r.delta} />
                      </span>
                    </li>
                  ))}
                </ol>
              </Panel>
              {data?.hasMore && !search && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => load(page + 1, scope, search)}
                    disabled={loading}
                    className="rounded-sm border border-white/10 px-5 py-2 font-mono text-xs uppercase tracking-widest text-white/50 hover:border-white/25 hover:text-white disabled:opacity-40"
                  >
                    {loading ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}

          <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-white/30">
            {data && <span>Updated {new Date(data.updatedAt).toLocaleTimeString()}</span>}
            <Link href="/verse/rules" className="underline-offset-4 hover:text-white/60 hover:underline">
              How scoring works
            </Link>
          </p>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <YourRank />
        </aside>
      </div>
    </div>
  );
}
