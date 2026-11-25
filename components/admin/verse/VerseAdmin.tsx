"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Download, Pause, Pencil, Play, Plus, Square } from "lucide-react";

type Tab = "reviews" | "quests" | "users" | "seasons";
type Row = Record<string, unknown> & { id: string };

const input =
  "h-9 w-full rounded border border-white/10 bg-black/40 px-3 text-sm text-white placeholder:text-white/25 focus:border-violet-500/60 focus:outline-none";
const btn =
  "inline-flex items-center gap-1.5 rounded border border-white/10 px-3 py-1.5 text-xs font-mono text-white/60 hover:border-white/25 hover:text-white disabled:opacity-40";
const primary = "rounded bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-50";

async function api<T = Record<string, unknown>>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (res.status === 401) window.location.href = "/admin/login?next=/admin/verse";
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
  return json as T;
}

const short = (w: unknown) => (typeof w === "string" && w.length > 10 ? `${w.slice(0, 4)}…${w.slice(-4)}` : String(w ?? ""));
const when = (d: unknown) => (d ? new Date(String(d)).toLocaleString() : "—");

// --------------------------------------------------------------------------- reviews

function Reviews() {
  const [status, setStatus] = useState("submitted");
  const [items, setItems] = useState<Row[] | null>(null);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const { submissions } = await api<{ submissions: Row[] }>(`/api/admin/verse/reviews?status=${status}`);
      setItems(submissions);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [status]);
  useEffect(() => {
    load();
  }, [load]);

  async function review(id: string, approve: boolean) {
    try {
      await api("/api/admin/verse/reviews", {
        method: "POST",
        body: JSON.stringify({ id, approve, reason: reasons[id] ?? "" }),
      });
      setItems((prev) => prev?.filter((i) => i.id !== id) ?? null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["submitted", "completed", "rejected"].map((s) => (
          <button key={s} type="button" onClick={() => setStatus(s)} className={`${btn} ${status === s ? "border-violet-500/60 text-white" : ""}`}>
            {s === "submitted" ? "Pending" : s}
          </button>
        ))}
        <a href="/api/admin/verse/export?type=submissions" className={`${btn} ml-auto`}>
          <Download className="h-3.5 w-3.5" /> CSV
        </a>
      </div>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {!items ? (
        <p className="text-sm text-white/30">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded border border-white/5 p-8 text-center text-sm text-white/30">Queue is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map((s) => {
            const u = s.verse_users as { wallet: string; display_name: string | null; flagged: boolean };
            const q = s.verse_quests as { title: string; xp: number };
            return (
              <div key={s.id} className="rounded border border-white/5 bg-[#111] p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {q.title} <span className="font-mono text-xs text-white/40">+{q.xp} XP</span>
                  </p>
                  <p className="font-mono text-xs text-white/40">
                    {u.display_name ? `${u.display_name} · ` : ""}
                    {u.wallet} {u.flagged && <span className="text-red-400">FLAGGED</span>} · {when(s.created_at)}
                  </p>
                </div>
                {typeof s.proof_url === "string" && (
                  <a href={s.proof_url} target="_blank" rel="noopener noreferrer nofollow" className="block break-all font-mono text-xs text-violet-300 hover:underline">
                    {s.proof_url}
                  </a>
                )}
                {typeof s.proof_text === "string" && <p className="mt-2 whitespace-pre-wrap text-sm text-white/60">{s.proof_text}</p>}
                {status === "submitted" ? (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      className={input}
                      placeholder="Rejection reason (shown to the user)"
                      value={reasons[s.id] ?? ""}
                      onChange={(e) => setReasons((r) => ({ ...r, [s.id]: e.target.value }))}
                    />
                    <div className="flex shrink-0 gap-2">
                      <button type="button" className={`${btn} border-emerald-500/30 text-emerald-300`} onClick={() => review(s.id, true)}>
                        Approve
                      </button>
                      <button type="button" className={`${btn} border-red-500/30 text-red-300`} onClick={() => review(s.id, false)}>
                        Reject
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 font-mono text-[11px] text-white/30">
                    {String(s.reviewer ?? "")} · {when(s.reviewed_at)} {s.reject_reason ? `· ${String(s.reject_reason)}` : ""}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------- quests

const EMPTY_QUEST = {
  slug: "",
  title: "",
  description: "",
  category: "daily",
  xp: 10,
  est_minutes: 1,
  difficulty: "easy",
  verification: "auto",
  repeat: "once",
  max_completions: "",
  starts_at: "",
  ends_at: "",
  status: "draft",
  featured: false,
  lore_ref: "",
  lore_href: "",
  proof_hint: "",
  sort_order: 100,
  quiz: "",
};
type QuestForm = typeof EMPTY_QUEST;

function toLocalInput(v: unknown) {
  if (!v) return "";
  const d = new Date(String(v));
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function QuestEditor({ initial, onSaved, onCancel }: { initial: Row | null; onSaved: () => void; onCancel: () => void }) {
  const [f, setF] = useState<QuestForm>(() =>
    initial
      ? {
          ...EMPTY_QUEST,
          ...Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, v ?? ""])),
          starts_at: toLocalInput(initial.starts_at),
          ends_at: toLocalInput(initial.ends_at),
          quiz: initial.quiz ? JSON.stringify(initial.quiz, null, 2) : "",
          featured: Boolean(initial.featured),
        } as QuestForm
      : EMPTY_QUEST,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof QuestForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    let quiz: unknown = null;
    if (f.verification === "quiz") {
      try {
        quiz = JSON.parse(f.quiz);
      } catch {
        setError("Quiz JSON is invalid.");
        return;
      }
    }
    setBusy(true);
    try {
      const payload = {
        ...f,
        xp: Number(f.xp),
        est_minutes: Number(f.est_minutes),
        sort_order: Number(f.sort_order),
        starts_at: f.starts_at ? new Date(f.starts_at).toISOString() : null,
        ends_at: f.ends_at ? new Date(f.ends_at).toISOString() : null,
        quiz,
      };
      await api(initial ? `/api/admin/verse/quests/${initial.id}` : "/api/admin/verse/quests", {
        method: initial ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const label = "mb-1 block font-mono text-[10px] uppercase tracking-widest text-white/35";
  const sel = (k: keyof QuestForm, opts: string[]) => (
    <select className={input} value={String(f[k])} onChange={set(k)}>
      {opts.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  return (
    <form onSubmit={save} className="mb-6 space-y-4 rounded border border-violet-500/20 bg-[#111] p-5">
      <p className="text-sm font-semibold text-white">{initial ? `Edit · ${initial.slug}` : "New quest"}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label><span className={label}>Slug</span><input className={input} value={f.slug} onChange={set("slug")} required /></label>
        <label className="sm:col-span-2"><span className={label}>Title</span><input className={input} value={f.title} onChange={set("title")} required /></label>
      </div>
      <label className="block"><span className={label}>Description</span>
        <textarea className={`${input} h-20 py-2`} value={f.description} onChange={set("description")} required />
      </label>
      <div className="grid gap-3 sm:grid-cols-4">
        <label><span className={label}>Category</span>{sel("category", ["daily", "weekly", "one_time", "holder", "community", "lore"])}</label>
        <label><span className={label}>Verification</span>{sel("verification", ["auto", "quiz", "proof", "holder"])}</label>
        <label><span className={label}>Repeat</span>{sel("repeat", ["once", "daily", "weekly"])}</label>
        <label><span className={label}>Difficulty</span>{sel("difficulty", ["easy", "medium", "hard"])}</label>
        <label><span className={label}>XP</span><input type="number" className={input} value={f.xp} onChange={set("xp")} /></label>
        <label><span className={label}>Minutes</span><input type="number" className={input} value={f.est_minutes} onChange={set("est_minutes")} /></label>
        <label><span className={label}>Max completions</span><input type="number" className={input} value={f.max_completions} onChange={set("max_completions")} placeholder="∞" /></label>
        <label><span className={label}>Sort</span><input type="number" className={input} value={f.sort_order} onChange={set("sort_order")} /></label>
        <label><span className={label}>Starts (local)</span><input type="datetime-local" className={input} value={f.starts_at} onChange={set("starts_at")} /></label>
        <label><span className={label}>Ends (local)</span><input type="datetime-local" className={input} value={f.ends_at} onChange={set("ends_at")} /></label>
        <label><span className={label}>Status</span>{sel("status", ["draft", "published", "paused", "expired"])}</label>
        <label className="flex items-end gap-2 pb-2 text-sm text-white/60"><input type="checkbox" checked={f.featured} onChange={set("featured")} /> Featured</label>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label><span className={label}>Lore reference</span><input className={input} value={f.lore_ref} onChange={set("lore_ref")} placeholder="Chapter I — The Fracture" /></label>
        <label><span className={label}>Lore link</span><input className={input} value={f.lore_href} onChange={set("lore_href")} placeholder="/universe" /></label>
        <label><span className={label}>Proof hint</span><input className={input} value={f.proof_hint} onChange={set("proof_hint")} /></label>
      </div>
      {f.verification === "quiz" && (
        <label className="block">
          <span className={label}>Quiz JSON — [{`{"q":"…","options":["a","b"],"answer":0}`}]</span>
          <textarea className={`${input} h-40 py-2 font-mono text-xs`} value={f.quiz} onChange={set("quiz")} />
        </label>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className={primary}>{busy ? "Saving…" : "Save"}</button>
        <button type="button" onClick={onCancel} className={btn}>Cancel</button>
      </div>
    </form>
  );
}

function Quests() {
  const [quests, setQuests] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { quests } = await api<{ quests: Row[] }>("/api/admin/verse/quests");
      setQuests(quests);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, init: RequestInit) {
    setError(null);
    try {
      await api(`/api/admin/verse/quests/${id}`, init);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const setStatus = (id: string, status: string) => act(id, { method: "PATCH", body: JSON.stringify({ status }) });

  const statusColor: Record<string, string> = {
    published: "text-emerald-400",
    paused: "text-amber-300",
    expired: "text-white/30",
    draft: "text-blue-300",
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setEditing("new")} className={btn}>
          <Plus className="h-3.5 w-3.5" /> New quest
        </button>
      </div>
      {editing && (
        <QuestEditor
          key={editing === "new" ? "new" : editing.id}
          initial={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {!quests ? (
        <p className="text-sm text-white/30">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded border border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-widest text-white/30">
              <tr className="border-b border-white/5">
                <th className="px-3 py-2 font-normal">Quest</th>
                <th className="px-3 py-2 font-normal">Type</th>
                <th className="px-3 py-2 font-normal">XP</th>
                <th className="px-3 py-2 font-normal">Status</th>
                <th className="px-3 py-2 font-normal" />
              </tr>
            </thead>
            <tbody>
              {quests.map((q) => (
                <tr key={q.id} className="border-b border-white/[0.03]">
                  <td className="px-3 py-2">
                    <p className="text-white">{String(q.title)} {q.featured ? <span className="text-violet-300">★</span> : null}</p>
                    <p className="font-mono text-[11px] text-white/30">{String(q.slug)}</p>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-white/50">
                    {String(q.category)} · {String(q.verification)} · {String(q.repeat)}
                  </td>
                  <td className="px-3 py-2 font-mono text-white/70">{String(q.xp)}</td>
                  <td className={`px-3 py-2 font-mono text-xs ${statusColor[String(q.status)]}`}>{String(q.status)}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      {q.status !== "published" && (
                        <button type="button" title="Publish" className={btn} onClick={() => setStatus(q.id, "published")}><Play className="h-3 w-3" /></button>
                      )}
                      {q.status === "published" && (
                        <button type="button" title="Pause" className={btn} onClick={() => setStatus(q.id, "paused")}><Pause className="h-3 w-3" /></button>
                      )}
                      {q.status !== "expired" && (
                        <button type="button" title="Expire" className={btn} onClick={() => setStatus(q.id, "expired")}><Square className="h-3 w-3" /></button>
                      )}
                      <button type="button" title="Edit" className={btn} onClick={() => setEditing(q)}><Pencil className="h-3 w-3" /></button>
                      <button type="button" title="Clone" className={btn} onClick={() => act(q.id, { method: "POST" })}><Copy className="h-3 w-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------- users

function UserDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const [d, setD] = useState<{ user: Row; lifetimeXp: number; events: Row[]; completions: Row[] } | null>(null);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setD(await api(`/api/admin/verse/users?id=${id}`));
    } catch (e) {
      setError((e as Error).message);
    }
  }, [id]);
  useEffect(() => {
    load();
  }, [load]);

  async function adjust(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/api/admin/verse/users", { method: "POST", body: JSON.stringify({ userId: id, amount: Number(amount), reason }) });
      setAmount("");
      setReason("");
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function patch(body: Record<string, unknown>) {
    setError(null);
    try {
      await api("/api/admin/verse/users", { method: "PATCH", body: JSON.stringify({ userId: id, ...body }) });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  if (!d) return <p className="text-sm text-white/30">{error ?? "Loading…"}</p>;
  const u = d.user;
  return (
    <div className="rounded border border-violet-500/20 bg-[#111] p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{String(u.display_name ?? short(u.wallet))}</p>
          <p className="break-all font-mono text-xs text-white/40">{String(u.wallet)}</p>
          <p className="mt-1 font-mono text-xs text-white/50">
            Lifetime {d.lifetimeXp} XP · {u.is_public ? "public" : "private"}
            {u.flagged ? <span className="text-red-400"> · FLAGGED ({String(u.flag_reason ?? "")})</span> : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {u.flagged ? (
            <button type="button" className={btn} onClick={() => patch({ flagged: false })}>Unflag</button>
          ) : (
            <button
              type="button"
              className={`${btn} border-red-500/30 text-red-300`}
              onClick={() => {
                const r = window.prompt("Flag reason (removes from rankings):");
                if (r) patch({ flagged: true, flagReason: r });
              }}
            >
              Flag
            </button>
          )}
          {u.display_name ? <button type="button" className={btn} onClick={() => patch({ clearAlias: true })}>Clear alias</button> : null}
          <button type="button" className={btn} onClick={onClose}>Close</button>
        </div>
      </div>

      <form onSubmit={adjust} className="mb-5 flex flex-col gap-2 sm:flex-row">
        <input className={`${input} sm:w-28`} type="number" placeholder="±XP" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input className={input} placeholder="Reason (logged, required)" value={reason} onChange={(e) => setReason(e.target.value)} required />
        <button type="submit" className={primary}>Adjust</button>
      </form>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/35">XP ledger</p>
          <ul className="max-h-72 space-y-1 overflow-y-auto font-mono text-xs">
            {d.events.map((e) => (
              <li key={e.id} className="flex justify-between gap-2 text-white/55">
                <span className="truncate">{String(e.source)}{e.reason ? ` · ${String(e.reason)}` : ""}</span>
                <span className={Number(e.amount) < 0 ? "text-red-400" : "text-emerald-400"}>
                  {Number(e.amount) > 0 ? "+" : ""}{String(e.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-white/35">Quests</p>
          <ul className="max-h-72 space-y-1 overflow-y-auto font-mono text-xs">
            {d.completions.map((c) => (
              <li key={c.id} className="flex justify-between gap-2 text-white/55">
                <span className="truncate">{(c.verse_quests as { title: string } | null)?.title} · {String(c.period_key)}</span>
                <span>{String(c.status)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Users() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<Row[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const search = useCallback(async (term: string) => {
    const { users } = await api<{ users: Row[] }>(`/api/admin/verse/users?q=${encodeURIComponent(term)}`);
    setUsers(users);
  }, []);
  useEffect(() => {
    search("");
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <form
          className="flex flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            search(q);
          }}
        >
          <input className={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search wallet or alias" />
          <button type="submit" className={btn}>Search</button>
        </form>
        <a href="/api/admin/verse/export?type=leaderboard&season=all" className={btn}>
          <Download className="h-3.5 w-3.5" /> All-time CSV
        </a>
      </div>
      {selected && <UserDetail key={selected} id={selected} onClose={() => setSelected(null)} />}
      {!users ? (
        <p className="text-sm text-white/30">Loading…</p>
      ) : (
        <ul className="divide-y divide-white/[0.04] rounded border border-white/5">
          {users.map((u) => (
            <li key={u.id}>
              <button type="button" onClick={() => setSelected(u.id)} className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-white/[0.02]">
                <span className="min-w-0">
                  <span className="block truncate text-sm text-white">{String(u.display_name ?? short(u.wallet))}</span>
                  <span className="block truncate font-mono text-[11px] text-white/30">{String(u.wallet)}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] text-white/30">
                  {u.flagged ? <span className="text-red-400">flagged · </span> : null}seen {when(u.last_seen_at)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------- seasons

function Seasons() {
  const [seasons, setSeasons] = useState<Row[] | null>(null);
  const [form, setForm] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { seasons } = await api<{ seasons: Row[] }>("/api/admin/verse/seasons");
    setSeasons(seasons);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  async function save(body: Record<string, unknown>) {
    setError(null);
    try {
      await api("/api/admin/verse/seasons", { method: "POST", body: JSON.stringify(body) });
      setForm(null);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  const edit = (s?: Row) =>
    setForm({
      id: s ? s.id : "",
      slug: String(s?.slug ?? ""),
      title: String(s?.title ?? ""),
      starts_at: toLocalInput(s?.starts_at),
      ends_at: toLocalInput(s?.ends_at),
      status: String(s?.status ?? "draft"),
      rewards_text: String(s?.rewards_text ?? ""),
      rules_version: String(s?.rules_version ?? 1),
    });

  const payload = (f: Record<string, string>) => ({
    ...f,
    id: f.id || undefined,
    starts_at: f.starts_at ? new Date(f.starts_at).toISOString() : "",
    ends_at: f.ends_at ? new Date(f.ends_at).toISOString() : "",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className={btn} onClick={() => edit()}>
          <Plus className="h-3.5 w-3.5" /> New season
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {form && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(payload(form));
          }}
          className="grid gap-3 rounded border border-violet-500/20 bg-[#111] p-5 sm:grid-cols-2"
        >
          {(["slug", "title"] as const).map((k) => (
            <input key={k} className={input} placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required />
          ))}
          <input type="datetime-local" className={input} value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} required />
          <input type="datetime-local" className={input} value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} required />
          <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {["draft", "active", "ended"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <input className={input} type="number" placeholder="rules version" value={form.rules_version} onChange={(e) => setForm({ ...form, rules_version: e.target.value })} />
          <textarea className={`${input} h-20 py-2 sm:col-span-2`} placeholder="Rewards text (public)" value={form.rewards_text} onChange={(e) => setForm({ ...form, rewards_text: e.target.value })} />
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className={primary}>Save</button>
            <button type="button" className={btn} onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}
      {!seasons ? (
        <p className="text-sm text-white/30">Loading…</p>
      ) : (
        <ul className="divide-y divide-white/[0.04] rounded border border-white/5">
          {seasons.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm text-white">{String(s.title)} <span className="font-mono text-xs text-white/40">· {String(s.status)}</span></p>
                <p className="font-mono text-[11px] text-white/30">{when(s.starts_at)} → {when(s.ends_at)}</p>
              </div>
              <div className="flex gap-1">
                {s.status === "draft" && (
                  <button type="button" className={`${btn} text-emerald-300`} onClick={() => save({ ...s, status: "active" })}>Activate</button>
                )}
                {s.status === "active" && (
                  <button type="button" className={btn} onClick={() => window.confirm("End this season? Rankings freeze.") && save({ ...s, status: "ended" })}>End</button>
                )}
                <button type="button" className={btn} onClick={() => edit(s)}><Pencil className="h-3 w-3" /></button>
                <a href={`/api/admin/verse/export?type=leaderboard&season=${s.id}`} className={btn}><Download className="h-3 w-3" /> CSV</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------- shell

export function VerseAdmin() {
  const [tab, setTab] = useState<Tab>("reviews");
  const tabs: { id: Tab; label: string }[] = [
    { id: "reviews", label: "Reviews" },
    { id: "quests", label: "Quests" },
    { id: "users", label: "Users & XP" },
    { id: "seasons", label: "Seasons" },
  ];
  return (
    <div>
      <div className="mb-6 flex gap-1 border-b border-white/5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 pb-3 font-mono text-xs uppercase tracking-widest ${
              tab === t.id ? "border-violet-500 text-white" : "border-transparent text-white/35 hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "reviews" && <Reviews />}
      {tab === "quests" && <Quests />}
      {tab === "users" && <Users />}
      {tab === "seasons" && <Seasons />}
    </div>
  );
}
