-- Reddit Pain Mining Schema for Validationly
-- This extends the existing validation system with Reddit-based pain point analysis
-- COMPLIANCE: All data collection follows Reddit API terms of service

-- Reddit source content tables
create table if not exists reddit_posts (
  id uuid primary key default gen_random_uuid(),
  reddit_id text unique not null,
  subreddit text not null,
  title text not null,
  selftext text,
  author text,
  url text,
  score int,
  num_comments int,
  created_utc timestamptz not null,
  fetched_at timestamptz not null default now(),
  lang text,
  raw jsonb,
  -- Reddit API compliance fields
  permalink text, -- Reddit compliant permalink
  sanitized_content text, -- PII removed content
  compliance_note text default 'Data collected in compliance with Reddit API terms'
);

create table if not exists reddit_comments (
  id uuid primary key default gen_random_uuid(),
  reddit_id text unique not null,
  post_reddit_id text not null references reddit_posts(reddit_id) on delete cascade,
  body text,
  author text,
  score int,
  created_utc timestamptz not null,
  fetched_at timestamptz not null default now(),
  lang text,
  raw jsonb
);

-- Normalized documents (post + comments combined)
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('reddit')),
  source_id text not null unique, -- reddit_id
  subreddit text,
  title text,
  content text not null,
  created_utc timestamptz not null,
  score int,
  num_comments int,
  lang text,
  hash_lexical text, -- for deduplication
  inserted_at timestamptz not null default now()
);

-- LLM analysis outputs
create table if not exists insights (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  pain_points jsonb,        -- [{pain, severity, who, quote}]
  sentiment text,           -- positive/neutral/negative
  clusters text[],          -- ['grading','lesson-planning']
  summary text,
  ideas jsonb,              -- [{title, value_prop, features, risks, icp}]
  created_at timestamptz not null default now()
);

-- Scoring and trends
create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  freq_score float,
  momentum_score float,
  engagement_score float,
  competition_score float,
  total_score float,
  created_at timestamptz not null default now()
);

-- Validation runs (for integration with existing validation system)
create table if not exists validation_runs (
  id uuid primary key default gen_random_uuid(),
  idea text not null,
  keywords text[],
  target_segments text[],
  locale text default 'en',
  created_at timestamptz default now(),
  status text default 'running' -- running|done|failed
);

-- Signals from different providers
create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references validation_runs(id) on delete cascade,
  provider text not null, -- 'reddit_pain' | 'serp' | 'trends' | ...
  payload jsonb not null, -- provider specific raw/summary data
  strength float,         -- 0..1 (provider internal)
  freshness float,        -- 0..1 (time weight)
  confidence float,       -- 0..1 (provider confidence)
  created_at timestamptz default now()
);

-- Validation scores aggregation
create table if not exists validation_scores (
  id uuid primary key default gen_random_uuid(),
  run_id uuid unique references validation_runs(id) on delete cascade,
  score float not null,
  breakdown jsonb not null, -- provider breakdown and notes
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_posts_created on reddit_posts(created_utc desc);
create index if not exists idx_docs_created on documents(created_utc desc);
create index if not exists idx_docs_hash on documents(hash_lexical);
create index if not exists idx_insights_doc on insights(document_id);
create index if not exists idx_scores_doc_time on scores(document_id, created_at desc);
create index if not exists idx_signals_run on signals(run_id);
create index if not exists idx_validation_runs_status on validation_runs(status);

-- Full-text search indexes
create extension if not exists pg_trgm;
alter table documents add column if not exists tsv_title tsvector;
alter table insights add column if not exists tsv_summary tsvector;
update documents set tsv_title = to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(subreddit,''));
update insights set tsv_summary = to_tsvector('simple', coalesce(summary,''));
create index if not exists idx_docs_tsv on documents using gin(tsv_title);
create index if not exists idx_insights_tsv on insights using gin(tsv_summary);

-- Materialized view for recent Reddit data (last 90 days)
create materialized view if not exists mv_reddit_recent as
select d.id as document_id,
       d.subreddit,
       d.title,
       d.created_utc,
       coalesce(d.score,0) as reddit_score,
       coalesce(d.num_comments,0) as reddit_comments,
       i.summary,
       i.pain_points
from documents d
join insights i on i.document_id = d.id
where d.created_utc > now() - interval '90 days';

create index if not exists idx_mv_recent_time on mv_reddit_recent(created_utc desc);

-- RPC function for Reddit pain data fetching
create or replace function reddit_pain_fetch(p_keywords text[], p_segments text[])
returns table(
  document_id uuid,
  subreddit text,
  title text,
  created_utc timestamptz,
  reddit_score int,
  reddit_comments int,
  summary text,
  pain_points jsonb
) language sql as $$
  select m.document_id, m.subreddit, m.title, m.created_utc, m.reddit_score, m.reddit_comments, m.summary, m.pain_points
  from mv_reddit_recent m
  where (
     p_keywords is null
     or exists (
       select 1 where (
         m.title ilike any (select '%'||k||'%' from unnest(p_keywords) k)
         or m.summary ilike any (select '%'||k||'%' from unnest(p_keywords) k)
       )
     )
  )
  and (
     p_segments is null
     or m.summary ilike any (select '%'||s||'%' from unnest(p_segments) s)
  )
  order by m.created_utc desc
  limit 200;
$$;

-- Public view for ideas (read-only access)
create view ideas_public as
select i.id as insight_id,
       d.id as document_id,
       d.title,
       d.subreddit,
       d.created_utc,
       d.score as reddit_score,
       d.num_comments,
       i.pain_points,
       i.summary,
       i.ideas,
       (
         select s.total_score from scores s
         where s.document_id = d.id
         order by s.created_at desc
         limit 1
       ) as total_score
from insights i
join documents d on d.id = i.document_id;

-- RLS Policies (only service_role can write, public can read ideas_public)
alter table reddit_posts enable row level security;
alter table reddit_comments enable row level security;
alter table documents enable row level security;
alter table insights enable row level security;
alter table scores enable row level security;
alter table validation_runs enable row level security;
alter table signals enable row level security;
alter table validation_scores enable row level security;

-- Service role policies for writing
create policy "posts_write_service" on reddit_posts
  for insert to public using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "posts_update_service" on reddit_posts
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "comments_write_service" on reddit_comments
  for insert to public using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "comments_update_service" on reddit_comments
  for update using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Documents & analysis tables: only service_role can read/write
create policy "documents_all_service" on documents
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "insights_all_service" on insights
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "scores_all_service" on scores
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "validation_runs_all_service" on validation_runs
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "signals_all_service" on signals
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "validation_scores_all_service" on validation_scores
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Public read access for ideas_public view
grant select on ideas_public to anon, authenticated;

-- Revoke all access from base tables for public
revoke all on table reddit_posts from anon, authenticated;
revoke all on table reddit_comments from anon, authenticated;
revoke all on table documents from anon, authenticated;
revoke all on table insights from anon, authenticated;
revoke all on table scores from anon, authenticated;
revoke all on table validation_runs from anon, authenticated;
revoke all on table signals from anon, authenticated;
revoke all on table validation_scores from anon, authenticated;
