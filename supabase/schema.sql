-- Client OS — Supabase schema
-- Run in the Supabase SQL editor, then seed.sql.
-- Assumes Supabase Auth is enabled (built-in auth.users table exists).

create extension if not exists "pgcrypto";

-- ─── Profiles (extends auth.users with role + client binding) ───────────────
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null check (role in ('team_member', 'client')),
  client_id  text,
  full_name  text,
  created_at timestamptz default now()
);
create index if not exists profiles_client_id_idx on profiles(client_id);

-- ─── 1. Clients ─────────────────────────────────────────────────────────────
create table if not exists clients (
  id               text primary key,
  name             text not null,
  industry         text,
  main_offer       text,
  current_status   text,
  goal_90_day      text,
  long_term_goal   text,
  next_actions     text[] default '{}',
  engagement_stage text check (engagement_stage in ('diagnose','design','deliver','sustain')),
  health           text check (health in ('on_track','at_risk','critical')),
  created_at       timestamptz default now()
);

-- ─── 2. Client Brief ────────────────────────────────────────────────────────
create table if not exists briefs (
  client_id                text primary key references clients(id) on delete cascade,
  business_overview        text,
  target_audience          text,
  core_offer               text,
  pricing                  text,
  upsells                  text,
  competitors              text,
  marketing_channels       text,
  operational_constraints  text,
  notes                    text,
  updated_at               timestamptz default now()
);

-- ─── 3. KPI entries ─────────────────────────────────────────────────────────
create table if not exists kpi_entries (
  id                   uuid primary key default gen_random_uuid(),
  client_id            text not null references clients(id) on delete cascade,
  period_type          text not null check (period_type in ('weekly','monthly')),
  period_label         text not null,
  revenue_goal         numeric default 0,
  revenue              numeric default 0,
  patient_volume_goal  integer default 0,
  leads_goal           integer default 0,
  leads                integer default 0,
  bookings_goal        integer default 0,
  bookings             integer default 0,
  show_ups             integer default 0,
  show_up_rate         numeric default 0,
  cost_per_lead        numeric default 0,
  cost_per_booking     numeric default 0,
  cost_per_show_up     numeric default 0,
  ad_spend             numeric default 0,
  profit_estimate      numeric default 0,
  created_at           timestamptz default now()
);
create index if not exists kpi_entries_client_idx on kpi_entries(client_id);

-- ─── 4. Strategy initiatives ────────────────────────────────────────────────
create table if not exists initiatives (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references clients(id) on delete cascade,
  horizon         text not null check (horizon in ('short','mid','long')),
  title           text not null,
  description     text,
  priority        text check (priority in ('low','medium','high','critical')),
  owner           text,
  due_date        date,
  status          text check (status in ('not_started','in_progress','blocked','done','paused')),
  expected_impact text,
  visibility      text default 'shared' check (visibility in ('internal','shared')),
  created_at      timestamptz default now()
);
create index if not exists initiatives_client_idx on initiatives(client_id);

-- ─── 5. Campaigns ───────────────────────────────────────────────────────────
create table if not exists campaigns (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references clients(id) on delete cascade,
  name            text not null,
  platform        text,
  target_location text,
  budget          numeric default 0,
  start_date      date,
  end_date        date,
  creative_angle  text,
  results         text,
  notes           text,
  status          text check (status in ('draft','live','paused','ended')),
  visibility      text default 'shared' check (visibility in ('internal','shared')),
  created_at      timestamptz default now()
);
create index if not exists campaigns_client_idx on campaigns(client_id);

-- ─── 6. Meeting notes ───────────────────────────────────────────────────────
create table if not exists meeting_notes (
  id           uuid primary key default gen_random_uuid(),
  client_id    text not null references clients(id) on delete cascade,
  date         date not null,
  attendees    text[] default '{}',
  summary      text,
  key_facts    text[] default '{}',
  decisions    text[] default '{}',
  action_items jsonb default '[]',
  visibility   text default 'shared' check (visibility in ('internal','shared')),
  created_at   timestamptz default now()
);
create index if not exists meeting_notes_client_idx on meeting_notes(client_id);

-- ─── 7. Decisions ───────────────────────────────────────────────────────────
create table if not exists decisions (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references clients(id) on delete cascade,
  date       date not null,
  decision   text not null,
  reason     text,
  owner      text,
  related    text,
  visibility text default 'shared' check (visibility in ('internal','shared')),
  created_at timestamptz default now()
);
create index if not exists decisions_client_idx on decisions(client_id);

-- ─── 8. Opportunities ───────────────────────────────────────────────────────
create table if not exists opportunities (
  id                uuid primary key default gen_random_uuid(),
  client_id         text not null references clients(id) on delete cascade,
  name              text not null,
  description       text,
  estimated_impact  text,
  difficulty        text check (difficulty in ('easy','medium','hard')),
  priority          text check (priority in ('low','medium','high','critical')),
  status            text check (status in ('not_started','in_progress','blocked','done','paused')),
  next_step         text,
  visibility        text default 'internal' check (visibility in ('internal','shared')),
  created_at        timestamptz default now()
);
create index if not exists opportunities_client_idx on opportunities(client_id);

-- ─── 9. Data room ───────────────────────────────────────────────────────────
create table if not exists data_room (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null references clients(id) on delete cascade,
  file_name   text not null,
  category    text,
  description text,
  url         text,
  date_added  date default current_date,
  visibility  text default 'shared' check (visibility in ('internal','shared')),
  created_at  timestamptz default now()
);
create index if not exists data_room_client_idx on data_room(client_id);

-- ─── 10. Tasks (team-owned) ─────────────────────────────────────────────────
create table if not exists tasks (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references clients(id) on delete cascade,
  name       text not null,
  owner      text,
  due_date   date,
  status     text check (status in ('not_started','in_progress','blocked','done','paused')),
  priority   text check (priority in ('low','medium','high','critical')),
  notes      text,
  created_at timestamptz default now()
);
create index if not exists tasks_client_idx on tasks(client_id);

-- ─── MBB modules ────────────────────────────────────────────────────────────

-- 11. Synthesis / narrative (one per client)
create table if not exists synthesis (
  client_id       text primary key references clients(id) on delete cascade,
  headline        text,
  situation       text,
  complication    text,
  resolution      text,
  key_findings    text[] default '{}',
  recommendations text[] default '{}',
  visibility      text default 'shared' check (visibility in ('internal','shared')),
  updated_at      timestamptz default now()
);

-- 12. Hypotheses (issue tree)
create table if not exists hypotheses (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references clients(id) on delete cascade,
  statement  text not null,
  status     text check (status in ('untested','in_progress','confirmed','rejected')),
  owner      text,
  evidence   text,
  so_what    text,
  parent_id  uuid references hypotheses(id) on delete set null,
  created_at timestamptz default now()
);
create index if not exists hypotheses_client_idx on hypotheses(client_id);

-- 13. Deliverables (decks, models, memos, reports)
create table if not exists deliverables (
  id              uuid primary key default gen_random_uuid(),
  client_id       text not null references clients(id) on delete cascade,
  name            text not null,
  type            text check (type in ('deck','model','memo','report','other')),
  owner           text,
  status          text check (status in ('drafting','review','ready','delivered')),
  due_date        date,
  delivered_date  date,
  url             text,
  notes           text,
  visibility      text default 'shared' check (visibility in ('internal','shared')),
  created_at      timestamptz default now()
);
create index if not exists deliverables_client_idx on deliverables(client_id);

-- 14. Stakeholders (who's who at the client)
create table if not exists stakeholders (
  id           uuid primary key default gen_random_uuid(),
  client_id    text not null references clients(id) on delete cascade,
  name         text not null,
  role         text,
  email        text,
  influence    text check (influence in ('low','medium','high')),
  posture      text check (posture in ('champion','supportive','neutral','skeptical','blocker')),
  last_contact date,
  notes        text,
  created_at   timestamptz default now()
);
create index if not exists stakeholders_client_idx on stakeholders(client_id);

-- 15. Risks & issues (internal)
create table if not exists risks (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null references clients(id) on delete cascade,
  title       text not null,
  description text,
  likelihood  text check (likelihood in ('low','medium','high')),
  impact      text check (impact in ('low','medium','high')),
  mitigation  text,
  owner       text,
  status      text check (status in ('open','mitigating','closed')),
  created_at  timestamptz default now()
);
create index if not exists risks_client_idx on risks(client_id);

-- 16. Client actions (what the client owes us)
create table if not exists client_actions (
  id         uuid primary key default gen_random_uuid(),
  client_id  text not null references clients(id) on delete cascade,
  item       text not null,
  owner      text,
  due_date   date,
  status     text check (status in ('not_started','in_progress','blocked','done','paused')),
  notes      text,
  created_at timestamptz default now()
);
create index if not exists client_actions_client_idx on client_actions(client_id);

-- 17. Impact (value delivered)
create table if not exists impacts (
  id               uuid primary key default gen_random_uuid(),
  client_id        text not null references clients(id) on delete cascade,
  name             text not null,
  category         text check (category in ('revenue','cost_savings','efficiency','risk_reduction','other')),
  value_label      text,
  value_numeric    numeric default 0,
  realized_date    date,
  initiative_link  text,
  notes            text,
  created_at       timestamptz default now()
);
create index if not exists impacts_client_idx on impacts(client_id);

-- 18. Commercial (one per client, internal only)
create table if not exists commercial (
  client_id        text primary key references clients(id) on delete cascade,
  engagement_name  text,
  budget_hours     numeric default 0,
  budget_fee       numeric default 0,
  hours_burned     numeric default 0,
  fee_invoiced     numeric default 0,
  start_date       date,
  end_date         date,
  margin_pct       numeric default 0,
  notes            text,
  updated_at       timestamptz default now()
);

-- ─── RLS (Row Level Security) ───────────────────────────────────────────────
-- For MVP: team_member role sees everything, client role sees only their
-- own client_id + only rows flagged visibility='shared'. Policies below
-- enforce read-side filtering. Write access is team-only.
-- Enable RLS and add policies after seeding. Commented out for initial dev.
--
-- alter table clients enable row level security;
-- alter table briefs enable row level security;
-- ... (all tables)
--
-- Example: clients table
-- create policy "team reads all clients" on clients for select to authenticated
--   using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'team_member'));
-- create policy "client reads own client" on clients for select to authenticated
--   using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.client_id = clients.id));
--
-- Example: meeting_notes with visibility filter
-- create policy "team reads all meetings" on meeting_notes for select to authenticated
--   using (exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'team_member'));
-- create policy "client reads shared meetings" on meeting_notes for select to authenticated
--   using (visibility = 'shared' and exists (
--     select 1 from profiles where profiles.id = auth.uid()
--       and profiles.client_id = meeting_notes.client_id));
