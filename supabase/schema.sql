-- Anti-Ragging Portal Schema
create extension if not exists "pgcrypto";

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  public_report_id text unique not null,
  secret_code_hash text not null,
  category text not null,
  description text not null,
  location text,
  incident_date date,
  status text not null default 'submitted' check (status in ('submitted','under_review','action_taken','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists report_updates (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  status text not null check (status in ('submitted','under_review','action_taken','closed')),
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists report_evidence (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete cascade,
  file_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_reports_public_id on reports(public_report_id);
create index if not exists idx_updates_report_id on report_updates(report_id);
create index if not exists idx_evidence_report_id on report_evidence(report_id);

-- RLS: lock everything down. All access goes through server-side API routes using the service role key.
alter table reports enable row level security;
alter table report_updates enable row level security;
alter table report_evidence enable row level security;

-- No public policies created on purpose -> anon/public key gets zero access.
-- Service role key (used only in server API routes) bypasses RLS by design.
