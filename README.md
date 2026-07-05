# VANTH Website

Marketing + community site for **VANTH**, an anime × cyberpunk NFT collection.
Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, framer-motion, and Supabase.

## Features

- Public marketing pages: home, about, story, vision, gallery, roadmap, FAQ, social, stake.
- **Whitelist** form (`/whitelist`) → `POST /api/whitelist/submit`.
- **Access / invite-code** application flow with referral codes, audit trail, and
  race-safe code redemption.
- **Admin committee dashboard** (`/admin`) to review, score, approve/reject applications
  (HMAC-signed, expiring session cookie).

Chain: **Ethereum (EVM)**. Wallet addresses are validated as `0x…` (42 chars).

## Getting Started

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Environment Variables

Create `.env.local` (see the placeholders already in that file):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used by API routes (bypasses RLS) |
| `ADMIN_PASSWORD` | Password for the `/admin` login |
| `ADMIN_SECRET` | HMAC signing secret for the admin session cookie (**required in production**) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used by metadata, robots, sitemap) |
| `TURNSTILE_SECRET_KEY` | *(optional)* Cloudflare Turnstile secret for whitelist captcha |

> In production the app **refuses to sign tokens** if `ADMIN_SECRET` is missing.

## Database (Supabase)

Schema and RLS live in `supabase/migrations/`. Every table has RLS enabled with
**no policies** (deny-all for anon/authenticated); all reads/writes go through the
service-role key in server Route Handlers.

Apply migrations:

```bash
npx supabase db push
```

Tables: `members`, `access_codes`, `applications`, `whitelist_submissions`, `audit_events`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |

## Deployment

Deploys to Vercel. Set all environment variables above in the Vercel project
settings. Rate limiting is currently in-memory (per instance); for production
scale, back `lib/rate-limit.ts` with Upstash Redis / Vercel KV.
