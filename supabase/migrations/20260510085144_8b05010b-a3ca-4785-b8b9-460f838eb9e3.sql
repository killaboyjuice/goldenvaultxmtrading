
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  balance numeric not null default 0,
  total_profit numeric not null default 0,
  account_type text not null default 'standard',
  verification_status text not null default 'unverified',
  win_rate numeric not null default 0,
  active_positions int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles selectable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles insertable by owner" on public.profiles for insert with check (auth.uid() = id);
create policy "Profiles updatable by owner" on public.profiles for update using (auth.uid() = id);

-- Auto create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, balance, total_profit, account_type, verification_status, win_rate, active_positions)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    125430.50,
    12543.20,
    'premium',
    'verified',
    68.5,
    12
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trades
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  asset_type text not null,
  side text not null,
  amount numeric not null,
  entry_price numeric not null,
  current_price numeric not null,
  profit_loss numeric not null default 0,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trades enable row level security;

create policy "Trades selectable by owner" on public.trades for select using (auth.uid() = user_id);
create policy "Trades insertable by owner" on public.trades for insert with check (auth.uid() = user_id);
create policy "Trades updatable by owner" on public.trades for update using (auth.uid() = user_id);
create policy "Trades deletable by owner" on public.trades for delete using (auth.uid() = user_id);

-- Sentiment votes
create table public.sentiment_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vote text not null check (vote in ('bullish', 'bearish')),
  created_at timestamptz not null default now()
);

alter table public.sentiment_votes enable row level security;

create policy "Anyone can view sentiment" on public.sentiment_votes for select using (true);
create policy "Users can insert own votes" on public.sentiment_votes for insert with check (auth.uid() = user_id);

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.trades;
alter publication supabase_realtime add table public.sentiment_votes;
