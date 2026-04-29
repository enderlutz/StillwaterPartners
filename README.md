# Client OS

Consulting operating system for managing client strategy, KPIs, campaigns, decisions, and everything in between. Built for agency/operator use, not generic CRM.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom shadcn-style primitives, no CLI required)
- Supabase (optional — mock data is used when env vars are absent)
- `lucide-react` icons

## Getting started

```bash
npm install
cp .env.local.example .env.local   # optional — skip to use mock data
npm run dev
```

Open <http://localhost:3000>. The root redirects to the first client (Stroke Scan Plus).

## Enabling Supabase (optional)

1. Create a Supabase project.
2. In the SQL editor run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Put your project URL + anon key in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

The data layer in `lib/db.ts` automatically switches from mock data to Supabase when both variables are set, and falls back to mocks on any fetch error.

## Modules

1. **Client Dashboard** — status, goals, live KPIs, active campaigns, next actions.
2. **Client Brief** — business overview, audience, offer, pricing, constraints.
3. **Goals & KPI Tracker** — weekly + monthly entries across revenue, leads, bookings, show-ups, CPL, CPB, CPSU, ad spend, profit estimate.
4. **Strategy Roadmap** — initiatives grouped short / mid / long with priority, owner, due date, status, expected impact.
5. **Campaign Tracker** — name, platform, geo, budget, dates, creative angle, results.
6. **Meeting Notes** — summary, key facts, decisions, action items.
7. **Decision Log** — dated decisions with reasoning.
8. **Opportunity Tracker** — revenue leaks and growth plays with estimated impact and difficulty.
9. **Data Room** — shared files and links by category.
10. **Tasks** — lightweight task list scoped per client.

## Project layout

```
app/
  layout.tsx
  page.tsx                       # redirects to first client
  clients/[clientId]/
    page.tsx                     # dashboard
    brief/
    goals/
    roadmap/
    campaigns/
    meetings/
    decisions/
    opportunities/
    data-room/
    tasks/
components/
  sidebar.tsx
  shell.tsx
  ui/                            # card, badge, table, kpi, section primitives
lib/
  types.ts
  mock-data.ts                   # Stroke Scan Plus seed
  db.ts                          # Supabase-or-mock data layer
  utils.ts
supabase/
  schema.sql
  seed.sql
```

## Adding a new client

- In mock mode: append a new entry to `lib/mock-data.ts` (`clients`, optionally `briefs`, and any module arrays).
- In Supabase mode: insert into `clients`, then the per-module tables — all keyed by `client_id`.

Both modes key every record off `client_id`, so the sidebar, dashboard, and all module pages work unchanged.
