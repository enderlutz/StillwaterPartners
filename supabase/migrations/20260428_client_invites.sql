-- Client invites: per-client signup gate codes.
-- The admin generates an invite for a specific client; the resulting code
-- (sent to the client out-of-band) unlocks the public /signup form and
-- binds any new accounts created against it to that client_id with
-- role='client'.

create table if not exists client_invites (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references clients(id) on delete cascade,
  label text not null default '',
  token_hash text not null unique,
  token_prefix text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  max_uses integer,
  use_count integer not null default 0,
  last_used_at timestamptz
);

create index if not exists client_invites_client_idx on client_invites(client_id);
create index if not exists client_invites_active_idx
  on client_invites(token_hash) where revoked_at is null;

alter table client_invites enable row level security;

drop policy if exists "team only — invites" on client_invites;
create policy "team only — invites" on client_invites
  for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.role = 'team_member'
    )
  );
