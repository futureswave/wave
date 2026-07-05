-- VANTH initial schema
-- Reconstructed from the application code (app/api/**, app/admin, components/admin).
-- All access goes through the service-role key in Route Handlers, which BYPASSES
-- RLS. We still enable RLS on every table with NO policies, so that the public
-- anon/authenticated keys can read/write NOTHING. This is a fail-closed default:
-- if the anon key ever leaks or is used client-side, the tables stay locked.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- members: approved community members (can refer new applicants)
-- ---------------------------------------------------------------------------
create table if not exists public.members (
  id             uuid primary key default gen_random_uuid(),
  role           text not null default 'MEMBER',
  wallet_address text not null unique,
  status         text not null default 'ACTIVE',
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- access_codes: invite codes redeemed by applicants
-- state: AVAILABLE | LOCKED | FINALIZED
-- ---------------------------------------------------------------------------
create table if not exists public.access_codes (
  id                         uuid primary key default gen_random_uuid(),
  code                       text not null unique,
  state                      text not null default 'AVAILABLE',
  referrer_member_id         uuid references public.members(id) on delete set null,
  redeemed_by_application_id uuid,
  created_at                 timestamptz not null default now()
);
create index if not exists access_codes_state_idx on public.access_codes(state);
create index if not exists access_codes_referrer_idx on public.access_codes(referrer_member_id);

-- ---------------------------------------------------------------------------
-- applications: access applications submitted with a code
-- status: SUBMITTED | UNDER_REVIEW | PENDING | APPROVED | REJECTED | FLAGGED
-- ---------------------------------------------------------------------------
create table if not exists public.applications (
  id               uuid primary key default gen_random_uuid(),
  access_code_id   uuid not null references public.access_codes(id) on delete restrict,
  applicant_wallet text not null unique,
  twitter_handle   text not null,
  discord_handle   text not null,
  essay_alignment  text not null,
  essay_reputation text not null,
  essay_value      text not null,
  reference_links  jsonb,
  ip_hash          text,
  user_agent       text,
  status           text not null default 'SUBMITTED',
  committee_score  integer,
  committee_notes  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists applications_status_idx on public.applications(status);
create index if not exists applications_code_idx on public.applications(access_code_id);

-- FK from access_codes back to the redeeming application (added after both exist)
alter table public.access_codes
  drop constraint if exists access_codes_redeemed_by_fk;
alter table public.access_codes
  add constraint access_codes_redeemed_by_fk
  foreign key (redeemed_by_application_id) references public.applications(id) on delete set null;

-- ---------------------------------------------------------------------------
-- whitelist_submissions: public whitelist form entries
-- ---------------------------------------------------------------------------
create table if not exists public.whitelist_submissions (
  id             uuid primary key default gen_random_uuid(),
  wallet_address text not null unique,
  twitter_handle text not null,
  discord_handle text not null,
  ip_hash        text,
  user_agent     text,
  status         text not null default 'submitted',
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- audit_events: append-only audit trail
-- ---------------------------------------------------------------------------
create table if not exists public.audit_events (
  id             uuid primary key default gen_random_uuid(),
  event_type     text not null,
  application_id uuid references public.applications(id) on delete set null,
  access_code_id uuid references public.access_codes(id) on delete set null,
  metadata       jsonb,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere with NO policies => deny-all for anon/authenticated.
-- The service-role key used by the API bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.members              enable row level security;
alter table public.access_codes         enable row level security;
alter table public.applications         enable row level security;
alter table public.whitelist_submissions enable row level security;
alter table public.audit_events         enable row level security;
