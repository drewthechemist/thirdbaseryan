-- Run ONCE in the Supabase SQL Editor for ThirdBaseRyan.
-- This is an additive migration. It does NOT alter fan_votes or the Hot Seat poll.
create table if not exists public.loss_pain_ratings (
  loss_id text not null,
  voter_hash text not null check (length(voter_hash)=64),
  rating smallint not null check (rating between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (loss_id, voter_hash)
);
create index if not exists loss_pain_ratings_loss_idx on public.loss_pain_ratings(loss_id);
alter table public.loss_pain_ratings enable row level security;
revoke all on public.loss_pain_ratings from anon, authenticated;
-- Only Netlify's service-role backend can read/write individual ballots.
create or replace function public.loss_pain_leaderboard()
returns table(loss_id text, average_rating numeric, vote_count bigint)
language sql stable security invoker
set search_path = ''
as $$
  select r.loss_id,
         round(avg(r.rating::numeric), 2) as average_rating,
         count(*) as vote_count
  from public.loss_pain_ratings r
  group by r.loss_id
  order by average_rating desc, vote_count desc, loss_id asc;
$$;
revoke all on function public.loss_pain_leaderboard() from public, anon, authenticated;
grant execute on function public.loss_pain_leaderboard() to service_role;
