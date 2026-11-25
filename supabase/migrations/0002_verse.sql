-- VANTH Verse: quests, XP ledger, seasons, public leaderboard (PRD: Vanthverse
-- Public Leaderboard & Quest Progression, v1.0).
--
-- Same security model as 0001: every table has RLS enabled with NO policies,
-- and all access goes through Route Handlers using the service-role key.
-- Functions are SECURITY INVOKER and EXECUTE is revoked from anon/authenticated,
-- so the public keys cannot call them either.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- verse_users: one row per wallet that has signed in
-- ---------------------------------------------------------------------------
create table if not exists public.verse_users (
  id            uuid primary key default gen_random_uuid(),
  wallet        text not null unique,
  display_name  text check (display_name is null or char_length(display_name) between 2 and 24),
  is_public     boolean not null default true,
  flagged       boolean not null default false,   -- excluded from rankings (anti-abuse)
  flag_reason   text,
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);
create unique index if not exists verse_users_display_name_uniq
  on public.verse_users (lower(display_name)) where display_name is not null;

-- ---------------------------------------------------------------------------
-- verse_auth_nonces: single-use sign-in challenges (message signing, no tx)
-- ---------------------------------------------------------------------------
create table if not exists public.verse_auth_nonces (
  nonce       text primary key,
  wallet      text not null,
  issued_at   timestamptz not null default now(),
  expires_at  timestamptz not null,
  used_at     timestamptz
);
create index if not exists verse_auth_nonces_expires_idx on public.verse_auth_nonces(expires_at);

-- ---------------------------------------------------------------------------
-- verse_seasons
-- ---------------------------------------------------------------------------
create table if not exists public.verse_seasons (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  starts_at      timestamptz not null,
  ends_at        timestamptz not null,
  status         text not null default 'draft' check (status in ('draft', 'active', 'ended')),
  rewards_text   text,
  rules_version  integer not null default 1,
  created_at     timestamptz not null default now(),
  check (ends_at > starts_at)
);
-- At most one active season at a time.
create unique index if not exists verse_seasons_one_active
  on public.verse_seasons ((true)) where status = 'active';

-- ---------------------------------------------------------------------------
-- verse_quests
-- ---------------------------------------------------------------------------
create table if not exists public.verse_quests (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  title            text not null,
  description      text not null,
  category         text not null check (category in ('daily', 'weekly', 'one_time', 'holder', 'community', 'lore')),
  xp               integer not null check (xp between 1 and 1000),
  est_minutes      integer not null default 1 check (est_minutes > 0),
  difficulty       text not null default 'easy' check (difficulty in ('easy', 'medium', 'hard')),
  verification     text not null check (verification in ('auto', 'quiz', 'proof', 'holder')),
  -- quiz: [{ "q": "...", "options": ["..."], "answer": 0 }] — answers never leave the server
  quiz             jsonb,
  proof_hint       text,
  repeat           text not null default 'once' check (repeat in ('once', 'daily', 'weekly')),
  max_completions  integer check (max_completions is null or max_completions > 0),
  starts_at        timestamptz,
  ends_at          timestamptz,
  status           text not null default 'draft' check (status in ('draft', 'published', 'paused', 'expired')),
  featured         boolean not null default false,
  lore_ref         text,   -- e.g. "Chapter I — The Fracture"
  lore_href        text,   -- site path the quest points to
  sort_order       integer not null default 100,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (verification <> 'quiz' or quiz is not null)
);
create index if not exists verse_quests_status_idx on public.verse_quests(status);

-- ---------------------------------------------------------------------------
-- verse_quest_completions
-- period_key: 'once' | 'YYYY-MM-DD' (daily, UTC) | 'YYYY-Www' (weekly, ISO)
-- The unique key is what guarantees a quest is rewarded at most once per period.
-- ---------------------------------------------------------------------------
create table if not exists public.verse_quest_completions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.verse_users(id) on delete cascade,
  quest_id       uuid not null references public.verse_quests(id) on delete restrict,
  season_id      uuid references public.verse_seasons(id) on delete set null,
  period_key     text not null,
  status         text not null check (status in ('submitted', 'completed', 'rejected')),
  proof_url      text,
  proof_text     text,
  reviewer       text,
  reject_reason  text,
  created_at     timestamptz not null default now(),
  reviewed_at    timestamptz,
  completed_at   timestamptz,
  unique (user_id, quest_id, period_key)
);
create index if not exists verse_completions_user_idx on public.verse_quest_completions(user_id, created_at desc);
create index if not exists verse_completions_status_idx on public.verse_quest_completions(status);

-- ---------------------------------------------------------------------------
-- verse_xp_events: APPEND-ONLY ledger. Corrections are new rows, never edits.
-- ---------------------------------------------------------------------------
create table if not exists public.verse_xp_events (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.verse_users(id) on delete cascade,
  season_id      uuid references public.verse_seasons(id) on delete set null,
  amount         integer not null check (amount <> 0),
  source         text not null check (source in ('quest', 'adjustment', 'reversal')),
  completion_id  uuid references public.verse_quest_completions(id) on delete set null,
  reason         text,
  actor          text not null default 'system',
  created_at     timestamptz not null default now(),
  check (source = 'quest' or reason is not null)
);
create index if not exists verse_xp_user_idx on public.verse_xp_events(user_id, created_at);
create index if not exists verse_xp_season_idx on public.verse_xp_events(season_id, user_id);
-- One quest reward per completion.
create unique index if not exists verse_xp_one_per_completion
  on public.verse_xp_events(completion_id) where source = 'quest';

create or replace function public.verse_xp_events_immutable()
returns trigger language plpgsql as $$
begin
  raise exception 'verse_xp_events is append-only; insert a reversal/adjustment instead';
end;
$$;
drop trigger if exists verse_xp_events_no_update on public.verse_xp_events;
create trigger verse_xp_events_no_update
  before update or delete on public.verse_xp_events
  for each row execute function public.verse_xp_events_immutable();

-- ---------------------------------------------------------------------------
-- verse_wallet_verifications: on-chain holder checks (enabled once the
-- collection address is configured)
-- ---------------------------------------------------------------------------
create table if not exists public.verse_wallet_verifications (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.verse_users(id) on delete cascade,
  wallet       text not null,
  collection   text not null,
  held_count   integer not null default 0,
  status       text not null check (status in ('verified', 'not_holder', 'error')),
  verified_at  timestamptz not null default now()
);
create index if not exists verse_verifications_user_idx on public.verse_wallet_verifications(user_id, verified_at desc);

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------

-- The currently running season (status active AND inside its window).
create or replace function public.verse_active_season_id()
returns uuid language sql stable as $$
  select id from public.verse_seasons
  where status = 'active' and now() between starts_at and ends_at
  limit 1
$$;

-- Ranked leaderboard computed straight from the ledger, so it can always be
-- regenerated. p_season null = all-time. p_as_of lets us compute the ranking
-- at an earlier moment to show rank movement.
-- Tie-breakers: higher XP, then whoever reached that score first, then more
-- completed quests, then older account.
create or replace function public.verse_leaderboard(
  p_season uuid default null,
  p_as_of  timestamptz default now()
)
returns table (
  user_id          uuid,
  wallet           text,
  display_name     text,
  is_public        boolean,
  xp               bigint,
  quests_completed bigint,
  reached_at       timestamptz,
  rank             bigint
)
language sql stable as $$
  with totals as (
    select e.user_id, sum(e.amount)::bigint as xp, max(e.created_at) as reached_at
    from public.verse_xp_events e
    where (p_season is null or e.season_id = p_season)
      and e.created_at <= p_as_of
    group by e.user_id
  ),
  qc as (
    select c.user_id, count(*)::bigint as n
    from public.verse_quest_completions c
    where c.status = 'completed'
      and (p_season is null or c.season_id = p_season)
      and c.completed_at <= p_as_of
    group by c.user_id
  )
  select
    t.user_id,
    u.wallet,
    case when u.is_public then u.display_name end,
    u.is_public,
    t.xp,
    coalesce(qc.n, 0),
    t.reached_at,
    row_number() over (
      order by t.xp desc, t.reached_at asc, coalesce(qc.n, 0) desc, u.created_at asc
    )
  from totals t
  join public.verse_users u on u.id = t.user_id
  left join qc on qc.user_id = t.user_id
  where t.xp > 0 and not u.flagged
$$;

-- Records a quest completion and, when it is immediately completed, its XP
-- event — atomically. A previously rejected submission for the same period may
-- be resubmitted; anything else raises ALREADY_DONE.
create or replace function public.verse_record_completion(
  p_user        uuid,
  p_quest       uuid,
  p_period      text,
  p_status      text,
  p_proof_url   text default null,
  p_proof_text  text default null
)
returns public.verse_quest_completions
language plpgsql as $$
declare
  v_quest   public.verse_quests;
  v_season  uuid := public.verse_active_season_id();
  v_row     public.verse_quest_completions;
  v_done    integer;
begin
  if p_status not in ('submitted', 'completed') then
    raise exception 'INVALID_STATUS';
  end if;

  select * into v_quest from public.verse_quests where id = p_quest for share;
  if not found or v_quest.status <> 'published'
     or (v_quest.starts_at is not null and now() < v_quest.starts_at)
     or (v_quest.ends_at is not null and now() > v_quest.ends_at) then
    raise exception 'QUEST_UNAVAILABLE';
  end if;

  if v_quest.max_completions is not null then
    select count(*) into v_done from public.verse_quest_completions
    where user_id = p_user and quest_id = p_quest and status in ('completed', 'submitted');
    if v_done >= v_quest.max_completions then
      raise exception 'LIMIT_REACHED';
    end if;
  end if;

  insert into public.verse_quest_completions as c
    (user_id, quest_id, season_id, period_key, status, proof_url, proof_text, completed_at)
  values
    (p_user, p_quest, v_season, p_period, p_status, p_proof_url, p_proof_text,
     case when p_status = 'completed' then now() end)
  on conflict (user_id, quest_id, period_key) do update
    set status        = excluded.status,
        season_id     = excluded.season_id,
        proof_url     = excluded.proof_url,
        proof_text    = excluded.proof_text,
        reject_reason = null,
        reviewer      = null,
        reviewed_at   = null,
        created_at    = now(),
        completed_at  = excluded.completed_at
    where c.status = 'rejected'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'ALREADY_DONE';
  end if;

  if p_status = 'completed' then
    insert into public.verse_xp_events (user_id, season_id, amount, source, completion_id)
    values (p_user, v_season, v_quest.xp, 'quest', v_row.id);
  end if;

  return v_row;
end;
$$;

-- Admin review of a submitted proof. Approval writes the XP event in the same
-- transaction; rejection stores the reason shown to the user.
create or replace function public.verse_review_completion(
  p_completion uuid,
  p_approve    boolean,
  p_reviewer   text,
  p_reason     text default null
)
returns public.verse_quest_completions
language plpgsql as $$
declare
  v_row  public.verse_quest_completions;
  v_xp   integer;
begin
  update public.verse_quest_completions
     set status        = case when p_approve then 'completed' else 'rejected' end,
         reviewer      = p_reviewer,
         reviewed_at   = now(),
         completed_at  = case when p_approve then now() end,
         reject_reason = case when p_approve then null else p_reason end
   where id = p_completion and status = 'submitted'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'NOT_PENDING';
  end if;

  if p_approve then
    select xp into v_xp from public.verse_quests where id = v_row.quest_id;
    insert into public.verse_xp_events (user_id, season_id, amount, source, completion_id, actor)
    values (v_row.user_id, v_row.season_id, v_xp, 'quest', v_row.id, p_reviewer);
  end if;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- Lock everything down
-- ---------------------------------------------------------------------------
alter table public.verse_users                enable row level security;
alter table public.verse_auth_nonces          enable row level security;
alter table public.verse_seasons              enable row level security;
alter table public.verse_quests               enable row level security;
alter table public.verse_quest_completions    enable row level security;
alter table public.verse_xp_events            enable row level security;
alter table public.verse_wallet_verifications enable row level security;

revoke execute on function public.verse_active_season_id() from public, anon, authenticated;
revoke execute on function public.verse_leaderboard(uuid, timestamptz) from public, anon, authenticated;
revoke execute on function public.verse_record_completion(uuid, uuid, text, text, text, text) from public, anon, authenticated;
revoke execute on function public.verse_review_completion(uuid, boolean, text, text) from public, anon, authenticated;
grant execute on function public.verse_active_season_id() to service_role;
grant execute on function public.verse_leaderboard(uuid, timestamptz) to service_role;
grant execute on function public.verse_record_completion(uuid, uuid, text, text, text, text) to service_role;
grant execute on function public.verse_review_completion(uuid, boolean, text, text) to service_role;

-- ---------------------------------------------------------------------------
-- Seed: pilot season (4 weeks) + pilot quests (PRD §15: 5–10 pilot quests)
-- ---------------------------------------------------------------------------
insert into public.verse_seasons (slug, title, starts_at, ends_at, status, rewards_text)
values (
  'season-0',
  'Season 0 — The Signal',
  date_trunc('day', now()),
  date_trunc('day', now()) + interval '28 days',
  'draft',
  'Pilot season. Rankings are for status and recognition only — no financial rewards are promised. Any reward will be announced with its rules before it applies.'
)
on conflict (slug) do nothing;

insert into public.verse_quests
  (slug, title, description, category, xp, est_minutes, difficulty, verification, quiz, proof_hint, repeat, max_completions, status, featured, lore_ref, lore_href, sort_order)
values
  ('connect-passport', 'Open your Passport',
   'Connect a Solana wallet and sign the registry message. No transaction, no fee.',
   'one_time', 25, 1, 'easy', 'auto', null, null, 'once', null, 'published', false, null, null, 10),

  ('daily-signal', 'Daily Signal',
   'Check in with the Verse once a day. Resets at 00:00 UTC.',
   'daily', 10, 1, 'easy', 'auto', null, null, 'daily', null, 'published', false, null, null, 20),

  ('read-the-fracture', 'Read: The Fracture',
   'Read Chapter I of the origin and answer three questions about it.',
   'lore', 50, 5, 'easy', 'quiz',
   '[{"q":"In which year did the Fracture happen?","options":["2049","2077","2089","2101"],"answer":2},
     {"q":"How did the VANTH come into existence?","options":["They were born","They were programmed","They emerged from the static","They were minted"],"answer":2},
     {"q":"What directive is woven into their base code?","options":["Obey, build, repeat","Exist, resist, persist","Collect, trade, hold","Watch, wait, wake"],"answer":1}]'::jsonb,
   null, 'once', null, 'published', true, 'Chapter I — The Fracture', '/universe', 30),

  ('map-the-districts', 'Map the Districts',
   'Study the district map of the Verse and identify where each story lives.',
   'lore', 40, 4, 'medium', 'quiz',
   '[{"q":"Which district is ground zero of the Fracture?","options":["Neo Arcadia","Sector Zero","The Underground","Outer Grid"],"answer":1},
     {"q":"Where are the unlicensed frequencies?","options":["The Underground","Neo Arcadia","Sector Zero","Outer Grid"],"answer":0}]'::jsonb,
   null, 'once', null, 'published', false, 'The Districts', '/universe', 40),

  ('signal-boost', 'Signal Boost',
   'Post about VANTH on X and submit the link to your post. Reviewed by the team.',
   'weekly', 75, 5, 'easy', 'proof', null,
   'Paste the URL of your public post on X.', 'weekly', null, 'published', false, null, null, 50),

  ('fan-artifact', 'Leave an Artifact',
   'Create original art, writing or a remix inspired by a VANTH and submit it. Reviewed against originality and effort.',
   'community', 200, 60, 'hard', 'proof', null,
   'Link to your work (X, Discord, Drive…) plus a short note.', 'once', null, 'published', false, null, null, 60),

  ('holder-verify', 'Verify a VANTH',
   'Verify on-chain that your connected wallet holds a VANTH. Read-only check, one time.',
   'holder', 100, 1, 'easy', 'holder', null, null, 'once', null, 'published', false, null, null, 70)
on conflict (slug) do nothing;
