-- Webrya Ops (Multi-tenant) Database Schema + RLS
-- Run this in your Supabase SQL Editor (Project > SQL Editor).
-- IMPORTANT: This is a production-safe baseline. Review before running on an existing DB.

-- Extensions
create extension if not exists pgcrypto;

-- =========================
-- ENUMS / CHECKS
-- =========================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'member_role') then
    create type public.member_role as enum ('owner','co-host','cleaner');
  end if;
end$$;

-- =========================
-- ORGANIZATIONS / MEMBERS
-- =========================
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'co-host',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

-- =========================
-- PROPERTIES
-- =========================
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  status text not null default 'active',
  address_street text,
  address_city text,
  address_country text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_properties_org on public.properties(org_id);

-- =========================
-- iCAL FEEDS
-- =========================
create table if not exists public.property_ical_feeds (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  provider text not null,
  url text not null,
  is_enabled boolean not null default true,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  unique (org_id, property_id, provider, url)
);

create index if not exists idx_property_ical_feeds_org on public.property_ical_feeds(org_id);
create index if not exists idx_property_ical_feeds_property on public.property_ical_feeds(property_id);

-- =========================
-- BOOKINGS (idempotent by feed uid)
-- =========================
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  source text not null,
  external_uid text not null,
  status text not null default 'scheduled',
  check_in timestamptz not null,
  check_out timestamptz not null,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (org_id, property_id, source, external_uid)
);

create index if not exists idx_bookings_org on public.bookings(org_id);
create index if not exists idx_bookings_property on public.bookings(property_id);
create index if not exists idx_bookings_check_in on public.bookings(check_in);

-- =========================
-- TASKS
-- =========================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  booking_id uuid references public.bookings(id) on delete set null,
  title text not null,
  status text not null default 'open',
  due_at timestamptz,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_tasks_org on public.tasks(org_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_assigned_to on public.tasks(assigned_to);

-- =========================
-- SYNC RUN LOGS
-- =========================
create table if not exists public.ical_sync_runs (
  id bigserial primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  feed_id uuid not null references public.property_ical_feeds(id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null, -- success | error
  inserted_count int not null default 0,
  error text
);

create index if not exists idx_ical_sync_runs_org on public.ical_sync_runs(org_id);
create index if not exists idx_ical_sync_runs_feed on public.ical_sync_runs(feed_id);

-- =========================
-- RLS HELPERS
-- =========================
create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.organization_members m
    where m.org_id = p_org_id
      and m.user_id = auth.uid()
  );
$$;

create or replace function public.org_role(p_org_id uuid)
returns public.member_role
language sql
stable
as $$
  select m.role
  from public.organization_members m
  where m.org_id = p_org_id
    and m.user_id = auth.uid()
  limit 1;
$$;

-- =========================
-- ENABLE RLS
-- =========================
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.properties enable row level security;
alter table public.property_ical_feeds enable row level security;
alter table public.bookings enable row level security;
alter table public.tasks enable row level security;
alter table public.ical_sync_runs enable row level security;

-- =========================
-- POLICIES
-- =========================

-- Organizations: members can read; owners can update
drop policy if exists "org_select_member" on public.organizations;
create policy "org_select_member"
on public.organizations
for select
to authenticated
using (public.is_org_member(id));

drop policy if exists "org_update_owner" on public.organizations;
create policy "org_update_owner"
on public.organizations
for update
to authenticated
using (public.org_role(id) = 'owner')
with check (public.org_role(id) = 'owner');

-- Members: members can read; owners manage
drop policy if exists "members_select_member" on public.organization_members;
create policy "members_select_member"
on public.organization_members
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "members_manage_owner" on public.organization_members;
create policy "members_manage_owner"
on public.organization_members
for all
to authenticated
using (public.org_role(org_id) = 'owner')
with check (public.org_role(org_id) = 'owner');

-- Properties: members read; owner/co-host write
drop policy if exists "properties_select_member" on public.properties;
create policy "properties_select_member"
on public.properties
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "properties_write_ops" on public.properties;
create policy "properties_write_ops"
on public.properties
for insert, update, delete
to authenticated
using (public.org_role(org_id) in ('owner','co-host'))
with check (public.org_role(org_id) in ('owner','co-host'));

-- Feeds: members read; owner/co-host write
drop policy if exists "feeds_select_member" on public.property_ical_feeds;
create policy "feeds_select_member"
on public.property_ical_feeds
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "feeds_write_ops" on public.property_ical_feeds;
create policy "feeds_write_ops"
on public.property_ical_feeds
for insert, update, delete
to authenticated
using (public.org_role(org_id) in ('owner','co-host'))
with check (public.org_role(org_id) in ('owner','co-host'));

-- Bookings: members read; owner/co-host write (sync uses service role)
drop policy if exists "bookings_select_member" on public.bookings;
create policy "bookings_select_member"
on public.bookings
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists "bookings_write_ops" on public.bookings;
create policy "bookings_write_ops"
on public.bookings
for insert, update, delete
to authenticated
using (public.org_role(org_id) in ('owner','co-host'))
with check (public.org_role(org_id) in ('owner','co-host'));

-- Tasks:
-- - members can read tasks in their org, but cleaners only see tasks assigned to them (or unassigned if you want—disabled here)
drop policy if exists "tasks_select_member" on public.tasks;
create policy "tasks_select_member"
on public.tasks
for select
to authenticated
using (
  public.is_org_member(org_id)
  and (
    public.org_role(org_id) in ('owner','co-host')
    or assigned_to = auth.uid()
  )
);

-- - owner/co-host can manage all tasks
drop policy if exists "tasks_manage_ops" on public.tasks;
create policy "tasks_manage_ops"
on public.tasks
for insert, update, delete
to authenticated
using (public.org_role(org_id) in ('owner','co-host'))
with check (public.org_role(org_id) in ('owner','co-host'));

-- - cleaner can update status on assigned tasks
drop policy if exists "tasks_update_cleaner_status" on public.tasks;
create policy "tasks_update_cleaner_status"
on public.tasks
for update
to authenticated
using (
  public.is_org_member(org_id)
  and public.org_role(org_id) = 'cleaner'
  and assigned_to = auth.uid()
)
with check (
  public.is_org_member(org_id)
  and public.org_role(org_id) = 'cleaner'
  and assigned_to = auth.uid()
);

-- Sync run logs: members read; ops write (service role will write anyway)
drop policy if exists "ical_runs_select_member" on public.ical_sync_runs;
create policy "ical_runs_select_member"
on public.ical_sync_runs
for select
to authenticated
using (public.is_org_member(org_id));

-- =========================
-- MINIMUM GRANTS
-- =========================
-- Supabase manages grants for authenticated/anon. RLS policies are the enforcement layer.
