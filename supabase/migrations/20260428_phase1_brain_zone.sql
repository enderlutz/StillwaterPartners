-- ============================================================================
-- Phase 1 — Two-zone IA (Brain + Clients), Custom Builds, Pipeline, Practice
-- ============================================================================
-- Adds:
--   - clients.vertical, clients.primary_lens (drives The File spotlight)
--   - builds            — custom software per client
--   - prospects         — light pipeline (Brain zone)
--   - playbooks         — firm reusables (Brain zone)
--   - lessons           — what worked / what didn't (Brain zone, optional client_id)
--   - personal_access_tokens — for MCP server auth (Phase 2)
--   - mcp_audit_log     — every MCP tool call recorded here (Phase 2)
--
-- Visibility flags on most artifacts are no longer needed (clients see the
-- whole Client File). Risks and Commercial keep their visibility column.
-- ============================================================================

-- ─── Verticals + lens enums ────────────────────────────────────────────────
do $$ begin
  create type vertical as enum ('home_services', 'healthcare', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type primary_lens as enum ('revenue', 'procurement', 'hiring', 'ops', 'mixed');
exception when duplicate_object then null; end $$;

alter table clients
  add column if not exists vertical vertical default 'other',
  add column if not exists primary_lens primary_lens default 'mixed';

-- ─── Custom Builds ─────────────────────────────────────────────────────────
do $$ begin
  create type build_status as enum ('planned', 'in_flight', 'shipped', 'deprecated');
exception when duplicate_object then null; end $$;

create table if not exists builds (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  name text not null,
  status build_status not null default 'planned',
  owner text not null default '',
  url text not null default '',
  problem_solved text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  shipped_at timestamptz
);

create index if not exists builds_client_id_idx on builds(client_id);

-- ─── Pipeline / Prospects (Brain zone) ─────────────────────────────────────
do $$ begin
  create type prospect_stage as enum (
    'lead', 'scoping', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  );
exception when duplicate_object then null; end $$;

create table if not exists prospects (
  id text primary key,
  name text not null,
  vertical vertical not null default 'other',
  stage prospect_stage not null default 'lead',
  expected_value numeric not null default 0,
  expected_close date,
  notes text not null default '',
  owner text not null default '',
  created_at timestamptz not null default now()
);

-- ─── Practice — Playbooks + Lessons ────────────────────────────────────────
create table if not exists playbooks (
  id text primary key,
  title text not null,
  vertical text not null default 'all', -- vertical or 'all'
  problem text not null default 'all',  -- primary_lens or 'all'
  content_md text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lessons (
  id text primary key,
  client_id text references clients(id) on delete set null,
  title text not null,
  content text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists lessons_client_id_idx on lessons(client_id);

-- ─── MCP auth (Phase 2 — schema in place now) ──────────────────────────────
create table if not exists personal_access_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  hashed_token text not null unique,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index if not exists pat_user_id_idx on personal_access_tokens(user_id)
  where revoked_at is null;

create table if not exists mcp_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  tool_name text not null,
  args_json jsonb not null default '{}',
  result_status text not null check (result_status in ('ok', 'error')),
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists mcp_audit_user_idx on mcp_audit_log(user_id, created_at desc);
create index if not exists mcp_audit_tool_idx on mcp_audit_log(tool_name, created_at desc);

-- ─── RLS ───────────────────────────────────────────────────────────────────
alter table builds enable row level security;
alter table prospects enable row level security;
alter table playbooks enable row level security;
alter table lessons enable row level security;
alter table personal_access_tokens enable row level security;
alter table mcp_audit_log enable row level security;

-- Team members see all of the above. Clients only see builds for their own
-- client. Pipeline / practice / PATs / audit are admin-only.
create policy if not exists "team sees all builds" on builds
  for select using (
    exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'team_member'
    )
  );

create policy if not exists "client sees own builds" on builds
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'client'
        and profiles.client_id = builds.client_id
    )
  );

create policy if not exists "team only — prospects" on prospects
  for all using (
    exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'team_member'
    )
  );

create policy if not exists "team only — playbooks" on playbooks
  for all using (
    exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'team_member'
    )
  );

create policy if not exists "team only — lessons" on lessons
  for all using (
    exists (
      select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'team_member'
    )
  );

create policy if not exists "owner only — PATs" on personal_access_tokens
  for all using (auth.uid() = user_id);

create policy if not exists "owner only — audit log" on mcp_audit_log
  for select using (auth.uid() = user_id);
