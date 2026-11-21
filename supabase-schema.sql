-- Run once in a NEW Supabase project, SQL Editor.
create table if not exists public.fan_votes (
  voter_hash text primary key check (length(voter_hash)=64),
  choice text not null check (choice in ('fire','keep')),
  updated_at timestamptz not null default now()
);
create index if not exists fan_votes_choice_idx on public.fan_votes(choice);
alter table public.fan_votes enable row level security;
-- No browser access to this table; Netlify server uses service role.
revoke all on public.fan_votes from anon, authenticated;
create or replace function public.fan_vote_totals()
returns table(fire_count bigint, keep_count bigint)
language sql stable security invoker
set search_path = ''
as $$
  select count(*) filter (where choice='fire'), count(*) filter (where choice='keep')
  from public.fan_votes;
$$;
revoke all on function public.fan_vote_totals() from public, anon, authenticated;
grant execute on function public.fan_vote_totals() to service_role;
