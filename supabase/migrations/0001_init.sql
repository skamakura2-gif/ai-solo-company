-- Chirp: X-style minimal social app
-- Run this in the Supabase SQL editor (or `supabase db push`).

-- =============================================================
-- profiles: 1:1 with auth.users; stores public handle.
-- =============================================================
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    handle text not null unique,
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by anyone" on public.profiles;
create policy "Profiles are readable by anyone"
    on public.profiles for select
    using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id)
    with check (auth.uid() = id);

-- =============================================================
-- posts: a single tweet/chirp
-- =============================================================
create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    content text not null check (char_length(content) between 1 and 280),
    created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx
    on public.posts (created_at desc);

alter table public.posts enable row level security;

drop policy if exists "Posts are readable by anyone" on public.posts;
create policy "Posts are readable by anyone"
    on public.posts for select
    using (true);

drop policy if exists "Users can insert their own posts" on public.posts;
create policy "Users can insert their own posts"
    on public.posts for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own posts" on public.posts;
create policy "Users can delete their own posts"
    on public.posts for delete
    using (auth.uid() = user_id);

-- =============================================================
-- View: posts joined with author handle (read by the timeline).
-- =============================================================
create or replace view public.posts_with_author
with (security_invoker = true) as
select
    p.id,
    p.user_id,
    p.content,
    p.created_at,
    pr.handle
from public.posts p
left join public.profiles pr on pr.id = p.user_id;

-- =============================================================
-- Trigger: auto-create profile row on signup, using
-- raw_user_meta_data.handle if present, otherwise the email local-part.
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    desired_handle text;
    final_handle text;
    suffix int := 0;
begin
    desired_handle := coalesce(
        nullif(new.raw_user_meta_data ->> 'handle', ''),
        split_part(new.email, '@', 1)
    );
    -- Strip anything that isn't a-z, 0-9, or _
    desired_handle := lower(regexp_replace(desired_handle, '[^a-zA-Z0-9_]', '', 'g'));
    if desired_handle = '' then
        desired_handle := 'user';
    end if;

    final_handle := desired_handle;
    while exists (select 1 from public.profiles where handle = final_handle) loop
        suffix := suffix + 1;
        final_handle := desired_handle || suffix::text;
    end loop;

    insert into public.profiles (id, handle) values (new.id, final_handle);
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
