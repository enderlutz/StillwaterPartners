-- Company Operations: a per-client whiteboard split into 9 fixed sections,
-- each holding an ordered list of markdown blocks. Visible to team members
-- and to the client themselves (RLS scopes them to their own client_id).

create table if not exists company_operations_blocks (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references clients(id) on delete cascade,
  section_key text not null,
  position integer not null default 0,
  content_md text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists company_ops_client_section_idx
  on company_operations_blocks(client_id, section_key, position);

alter table company_operations_blocks enable row level security;

drop policy if exists "team or own client — operations" on company_operations_blocks;
create policy "team or own client — operations" on company_operations_blocks
  for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and (
          profiles.role = 'team_member'
          or (
            profiles.role = 'client'
            and profiles.client_id = company_operations_blocks.client_id
          )
        )
    )
  );
