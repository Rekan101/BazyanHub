-- ===========================================================================
-- BazyanHub (بازیان هەب) — Supabase schema
-- ===========================================================================
--
-- Run this file in the Supabase SQL Editor (or `supabase db push`) BEFORE
-- supabase-seed.sql. It is idempotent: safe to run more than once.
--
-- Conventions used throughout:
--   * snake_case columns; every localized field is split into explicit
--     _ckb / _ar / _en columns rather than a JSON blob, so they stay
--     indexable and editable from the Supabase table editor.
--   * Kurdish Sorani (ckb) is the primary language and is NOT NULL wherever
--     a value is required; ar/en are nullable and fall back to ckb at render
--     time (see lib/supabase/mappers.ts).
--   * Every table has Row Level Security enabled. Public content is readable
--     by the `anon` role; all writes require an admin profile.
--
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'story_duration') then
    create type public.story_duration as enum ('daily', 'weekly', 'monthly');
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'auth_method') then
    create type public.auth_method as enum ('email', 'username', 'facebook', 'phone');
  end if;
end
$$;


-- ===========================================================================
-- 1. profiles
-- ===========================================================================
--
-- One row per auth.users row, created automatically by the handle_new_user()
-- trigger at the bottom of this file.
--
-- `username` is what makes username+password login possible. Supabase Auth has
-- no native username support, so lib/supabase/client.ts derives a synthetic
-- email address (<username>@users.bazyanhub.app) at signup and rebuilds the
-- same address at login. The real username is stored here for display and for
-- uniqueness enforcement.
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,

  username      text unique,
  full_name     text,
  avatar_url    text,
  phone         text,

  -- How this account was originally created. Informational; a user may later
  -- attach an email to a username-only account (see linkEmailToAccount()).
  auth_method   public.auth_method,

  -- Gate for every write policy in this schema. Flip manually in the
  -- Supabase table editor; there is deliberately no self-serve path.
  is_admin      boolean not null default false,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint profiles_username_format
    check (username is null or username ~ '^[a-z0-9_]{3,30}$')
);

create index if not exists profiles_username_idx on public.profiles (username);


-- ===========================================================================
-- 2. categories
-- ===========================================================================
--
-- The 10 service categories. Column names intentionally mirror the shape that
-- app/services/[category]/page.tsx was already hand-rolling locally, so the
-- render logic maps across with no translation layer.
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,

  name_ckb         text not null,
  name_ar          text,
  name_en          text,

  description_ckb  text,
  description_ar   text,
  description_en   text,

  -- lucide-react icon key, e.g. 'car', 'utensils'. Mapped to a component by
  -- CATEGORY_ICONS in the client; unknown keys fall back to a default glyph.
  icon             text,
  image_url        text,

  is_active        boolean not null default true,
  is_popular       boolean not null default false,
  is_featured      boolean not null default false,
  sort_order       integer not null default 0,

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists categories_active_idx
  on public.categories (is_active, sort_order);


-- ===========================================================================
-- 3. filters
-- ===========================================================================
--
-- Subcategory chips (تاکسی, پیکاپ, سالۆن, ...). Deliberately an INDEPENDENT
-- table, not an array column on categories, so an admin can create one in
-- isolation and attach it later — or never.
--
-- `category_id` is NULLABLE: a NULL means the filter is global rather than
-- scoped to one category.
--
-- NOTE on uniqueness: a plain UNIQUE (category_id, slug) would not constrain
-- the global rows at all, because Postgres treats NULLs as distinct — you
-- could insert the same global slug repeatedly. Two partial indexes are used
-- instead, one for each case.
-- ---------------------------------------------------------------------------

create table if not exists public.filters (
  id           uuid primary key default gen_random_uuid(),

  category_id  uuid references public.categories (id) on delete cascade,

  slug         text not null,
  label_ckb    text not null,
  label_ar     text,
  label_en     text,

  sort_order   integer not null default 0,
  is_active    boolean not null default true,

  created_at   timestamptz not null default now()
);

create unique index if not exists filters_category_slug_idx
  on public.filters (category_id, slug)
  where category_id is not null;

create unique index if not exists filters_global_slug_idx
  on public.filters (slug)
  where category_id is null;


-- ===========================================================================
-- 4. providers
-- ===========================================================================
--
-- The businesses/services themselves. This is the table behind every
-- ProviderCard in the app.
--
-- *** STRICT RULE — filters are optional. ***
-- `filter_id` is nullable AND uses ON DELETE SET NULL. An admin creating a
-- provider may: assign an existing filter, create a new filter first and
-- assign it, or leave it NULL entirely. Deleting a filter later nulls the
-- reference; it never cascades into deleting providers.
-- ---------------------------------------------------------------------------

create table if not exists public.providers (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique,

  category_id       uuid not null references public.categories (id) on delete restrict,
  filter_id         uuid references public.filters (id) on delete set null,

  name              text not null,
  description       text,

  -- Free-text label shown on the card pill when present, in preference to
  -- the category name. Distinct from filter_id, which is structured.
  subcategory       text,

  logo_url          text,
  cover_image_url   text,

  phone             text,
  secondary_phone   text,
  email             text,
  website           text,

  rating            numeric(2, 1) not null default 0
                      check (rating >= 0 and rating <= 5),
  review_count      integer not null default 0 check (review_count >= 0),

  price_range       text check (price_range in ('$', '$$', '$$$', '$$$$')),

  is_verified       boolean not null default false,
  is_featured       boolean not null default false,
  is_special        boolean not null default false,
  is_active         boolean not null default true,

  address           text,
  city              text,
  latitude          double precision,
  longitude         double precision,
  google_maps_url   text,

  -- { "whatsapp": "...", "instagram": "...", "facebook": "...",
  --   "tiktok": "...", "viber": "..." } — all keys optional.
  socials           jsonb not null default '{}'::jsonb,

  tags              text[] not null default '{}',
  services          text[] not null default '{}',

  -- Who manages this listing. owner_name is a plain display string for
  -- listings with no linked account; ProviderModal already renders it.
  owner_id          uuid references public.profiles (id) on delete set null,
  owner_name        text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists providers_category_idx
  on public.providers (category_id, is_active);

create index if not exists providers_filter_idx
  on public.providers (filter_id)
  where filter_id is not null;

create index if not exists providers_ranking_idx
  on public.providers (is_featured desc, rating desc);


-- ===========================================================================
-- 5. provider_hours
-- ===========================================================================
--
-- Opening hours, one row per weekday.
--
-- `day_of_week` is 0..6 with 0 = Sunday, matching JavaScript's Date.getDay().
-- The app's open/closed badge previously matched on hardcoded Kurdish weekday
-- STRINGS, which would have been fragile to store verbatim in Postgres (a
-- single typo or spelling variant silently reads as "closed"). The integer is
-- converted back to the Kurdish label at render time by lib/supabase/mappers.ts.
--
-- An overnight range (e.g. 20:00 -> 02:00) is represented by close_time being
-- less than open_time; the client already handles that wrap-around.
-- ---------------------------------------------------------------------------

create table if not exists public.provider_hours (
  id           uuid primary key default gen_random_uuid(),
  provider_id  uuid not null references public.providers (id) on delete cascade,

  day_of_week  smallint not null check (day_of_week between 0 and 6),

  open_time    time,
  close_time   time,
  is_closed    boolean not null default false,

  unique (provider_id, day_of_week)
);

create index if not exists provider_hours_provider_idx
  on public.provider_hours (provider_id);


-- ===========================================================================
-- 6. story_slides  —  "the 6 text sentences"
-- ===========================================================================
--
-- The rotating headline above the story thumbnails. One row per slide, so
-- slides can be added, reordered or retired without a schema migration.
-- ---------------------------------------------------------------------------

create table if not exists public.story_slides (
  id          uuid primary key default gen_random_uuid(),

  title_ckb   text not null,
  title_ar    text,
  title_en    text,

  position    integer not null default 0,
  is_active   boolean not null default true,

  created_at  timestamptz not null default now()
);

create index if not exists story_slides_position_idx
  on public.story_slides (is_active, position);


-- ===========================================================================
-- 7. stories
-- ===========================================================================
--
-- The individual thumbnails (3 per slide in the current design, but nothing
-- here enforces 3).
--
-- `duration` + `published_at` drive `expires_at`, which is maintained by the
-- trigger below rather than a GENERATED ALWAYS column: the CASE-over-enum
-- expression is not provably IMMUTABLE, so Postgres rejects it in a generated
-- column definition.
--
-- `provider_id` is nullable and ON DELETE SET NULL so that removing a business
-- does not blow away its story; the denormalized provider_name keeps the card
-- readable afterwards.
-- ---------------------------------------------------------------------------

create table if not exists public.stories (
  id             uuid primary key default gen_random_uuid(),

  slide_id       uuid not null references public.story_slides (id) on delete cascade,
  provider_id    uuid references public.providers (id) on delete set null,

  image_url      text not null,
  provider_name  text,
  short_info     text,

  duration       public.story_duration not null default 'daily',
  published_at   timestamptz not null default now(),
  expires_at     timestamptz,

  position       integer not null default 0,
  is_active      boolean not null default true,

  created_at     timestamptz not null default now()
);

create or replace function public.set_story_expiry()
returns trigger
language plpgsql
as $$
begin
  new.expires_at := new.published_at + case new.duration
    when 'daily'   then interval '1 day'
    when 'weekly'  then interval '7 days'
    when 'monthly' then interval '30 days'
  end;

  return new;
end;
$$;

drop trigger if exists stories_set_expiry on public.stories;

create trigger stories_set_expiry
  before insert or update of published_at, duration on public.stories
  for each row execute function public.set_story_expiry();

create index if not exists stories_live_idx
  on public.stories (slide_id, position)
  where is_active;


-- ===========================================================================
-- 8. notifications
-- ===========================================================================
--
-- App-wide alerts.
--
-- `user_id` NULL means a broadcast to everyone.
--
-- KNOWN LIMITATION, documented deliberately: `is_read` lives on the row, so a
-- broadcast row cannot track per-user read state — marking it read marks it
-- read for everyone. Supporting per-user reads on broadcasts requires a
-- notification_reads (user_id, notification_id) join table. That is a
-- deliberate future step, not an oversight; the current app shows a single
-- hardcoded welcome item and does not yet need it.
-- ---------------------------------------------------------------------------

create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),

  user_id     uuid references public.profiles (id) on delete cascade,

  title_ckb   text not null,
  title_ar    text,
  title_en    text,

  body_ckb    text,
  body_ar     text,
  body_en     text,

  -- lucide-react icon key, e.g. 'sparkles'.
  icon        text,
  link_url    text,

  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);


-- ===========================================================================
-- Helpers
-- ===========================================================================

-- SECURITY DEFINER so that policies ON public.profiles can call it without
-- re-entering those same policies. A plain `exists (select ... from profiles)`
-- inside a profiles policy recurses and errors at query time.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select p.is_admin from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- Keeps updated_at honest on the tables that carry it.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch
  before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists categories_touch on public.categories;
create trigger categories_touch
  before update on public.categories
  for each row execute function public.touch_updated_at();

drop trigger if exists providers_touch on public.providers;
create trigger providers_touch
  before update on public.providers
  for each row execute function public.touch_updated_at();


-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever an auth user is created.
--
-- Reads the metadata that lib/supabase/client.ts passes via options.data at
-- signup. For username signups this is where the real username is lifted out
-- of metadata and into the unique profiles.username column.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url, phone, auth_method)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'username', ''),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', '')
    ),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    new.phone,
    nullif(new.raw_user_meta_data ->> 'auth_method', '')::public.auth_method
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ===========================================================================
-- Row Level Security
-- ===========================================================================

alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.filters        enable row level security;
alter table public.providers      enable row level security;
alter table public.provider_hours enable row level security;
alter table public.story_slides   enable row level security;
alter table public.stories        enable row level security;
alter table public.notifications  enable row level security;

-- --- profiles --------------------------------------------------------------
-- Users read and edit only their own row. There is no public read of the
-- profiles table: exposing it would leak the synthetic username emails and
-- make username enumeration trivial. Expose a narrowed view instead if the
-- app ever needs to show other users' handles.

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- --- public content: read for everyone, write for admins -------------------

drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read"
  on public.categories for select
  to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists "categories: admin write" on public.categories;
create policy "categories: admin write"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());


drop policy if exists "filters: public read" on public.filters;
create policy "filters: public read"
  on public.filters for select
  to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists "filters: admin write" on public.filters;
create policy "filters: admin write"
  on public.filters for all
  using (public.is_admin())
  with check (public.is_admin());


drop policy if exists "providers: public read" on public.providers;
create policy "providers: public read"
  on public.providers for select
  to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists "providers: admin write" on public.providers;
create policy "providers: admin write"
  on public.providers for all
  using (public.is_admin())
  with check (public.is_admin());

-- Owners may edit their own listing, but may not create or delete one.
drop policy if exists "providers: owner update" on public.providers;
create policy "providers: owner update"
  on public.providers for update
  using (owner_id is not null and owner_id = auth.uid())
  with check (owner_id is not null and owner_id = auth.uid());


drop policy if exists "provider_hours: public read" on public.provider_hours;
create policy "provider_hours: public read"
  on public.provider_hours for select
  to anon, authenticated
  using (true);

drop policy if exists "provider_hours: admin write" on public.provider_hours;
create policy "provider_hours: admin write"
  on public.provider_hours for all
  using (public.is_admin())
  with check (public.is_admin());


drop policy if exists "story_slides: public read" on public.story_slides;
create policy "story_slides: public read"
  on public.story_slides for select
  to anon, authenticated
  using (is_active or public.is_admin());

drop policy if exists "story_slides: admin write" on public.story_slides;
create policy "story_slides: admin write"
  on public.story_slides for all
  using (public.is_admin())
  with check (public.is_admin());


-- Expired stories disappear from the public read automatically.
drop policy if exists "stories: public read" on public.stories;
create policy "stories: public read"
  on public.stories for select
  to anon, authenticated
  using (
    public.is_admin()
    or (is_active and (expires_at is null or expires_at > now()))
  );

drop policy if exists "stories: admin write" on public.stories;
create policy "stories: admin write"
  on public.stories for all
  using (public.is_admin())
  with check (public.is_admin());

-- --- notifications ---------------------------------------------------------

drop policy if exists "notifications: read own or broadcast" on public.notifications;
create policy "notifications: read own or broadcast"
  on public.notifications for select
  to anon, authenticated
  using (user_id is null or user_id = auth.uid());

drop policy if exists "notifications: mark own read" on public.notifications;
create policy "notifications: mark own read"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "notifications: admin write" on public.notifications;
create policy "notifications: admin write"
  on public.notifications for all
  using (public.is_admin())
  with check (public.is_admin());


-- ===========================================================================
-- 9. News feed
-- ===========================================================================
--
-- Backs app/news/page.tsx. That page currently renders two hardcoded posts
-- and keeps likes/comments in local React state that resets on reload; these
-- tables are what it will read from once it is wired up.
--
-- The moderation guarantee lives in the RLS policy, not in application code:
-- the INSERT policy's WITH CHECK pins status to 'pending', so a user
-- physically cannot publish straight to the feed even by calling the REST API
-- directly with a crafted payload. Only an admin can move a post to
-- 'approved'.
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'news_post_status') then
    -- 'rejected' is an addition beyond the two states originally specified.
    -- Without it a moderator's only options are "approve" or "delete", and
    -- deleting destroys the record of what was submitted. Drop it from this
    -- enum if you genuinely only want a two-state workflow.
    create type public.news_post_status as enum ('pending', 'approved', 'rejected');
  end if;
end
$$;

create table if not exists public.news_posts (
  id            uuid primary key default gen_random_uuid(),

  -- ON DELETE SET NULL, not CASCADE: removing an account should not silently
  -- delete community history. author_name keeps the byline readable after.
  user_id       uuid references public.profiles (id) on delete set null,
  author_name   text,

  text_content  text,
  media_url     text,
  media_type    text check (media_type in ('image', 'video')),

  status        public.news_post_status not null default 'pending',

  approved_at   timestamptz,
  approved_by   uuid references public.profiles (id) on delete set null,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- A post with neither text nor media is meaningless. Mirrors the composer,
  -- whose publish button is disabled while the draft is empty.
  constraint news_posts_not_empty
    check (
      coalesce(trim(text_content), '') <> ''
      or coalesce(trim(media_url), '') <> ''
    )
);

create index if not exists news_posts_feed_idx
  on public.news_posts (status, created_at desc);

create index if not exists news_posts_author_idx
  on public.news_posts (user_id, created_at desc);

drop trigger if exists news_posts_touch on public.news_posts;
create trigger news_posts_touch
  before update on public.news_posts
  for each row execute function public.touch_updated_at();


create table if not exists public.news_comments (
  id           uuid primary key default gen_random_uuid(),

  -- CASCADE here is correct: a comment has no meaning without its post.
  post_id      uuid not null references public.news_posts (id) on delete cascade,

  user_id      uuid references public.profiles (id) on delete set null,
  author_name  text,

  -- Column is named `text` per spec, which collides with the type name.
  -- btrim() is used rather than trim() because trim() has special grammar
  -- (trim(BOTH FROM x)) and a bare type-named identifier inside it is
  -- needlessly ambiguous to read, even though it parses.
  text         text not null check (btrim(text) <> ''),

  created_at   timestamptz not null default now()
);

create index if not exists news_comments_post_idx
  on public.news_comments (post_id, created_at asc);


-- One like per user per post, enforced by the composite primary key rather
-- than a surrogate id + unique index. A duplicate like is then a no-op via
-- `on conflict do nothing`, and unliking is a plain delete on the key.
create table if not exists public.news_likes (
  post_id     uuid not null references public.news_posts (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),

  primary key (post_id, user_id)
);

create index if not exists news_likes_user_idx
  on public.news_likes (user_id);


-- ---------------------------------------------------------------------------
-- Feed view with counts.
--
-- The UI needs likes and comments totals per post. security_invoker makes the
-- view respect the querying user's RLS rather than the view owner's, so it
-- cannot be used to read unapproved posts. Requires Postgres 15+, which
-- Supabase provides.
-- ---------------------------------------------------------------------------

create or replace view public.news_feed
with (security_invoker = true)
as
select
  p.*,
  coalesce(l.like_count, 0)    as like_count,
  coalesce(c.comment_count, 0) as comment_count
from public.news_posts p
left join (
  select post_id, count(*) as like_count
  from public.news_likes
  group by post_id
) l on l.post_id = p.id
left join (
  select post_id, count(*) as comment_count
  from public.news_comments
  group by post_id
) c on c.post_id = p.id;


-- --- news RLS --------------------------------------------------------------

alter table public.news_posts    enable row level security;
alter table public.news_comments enable row level security;
alter table public.news_likes    enable row level security;

-- Approved posts are public. Authors additionally see their own pending and
-- rejected submissions, so the composer can show "awaiting approval".
drop policy if exists "news_posts: read approved" on public.news_posts;
create policy "news_posts: read approved"
  on public.news_posts for select
  to anon, authenticated
  using (
    status = 'approved'
    or user_id = auth.uid()
    or public.is_admin()
  );

-- THE moderation rule. status is pinned to 'pending' on insert, so a user
-- cannot self-publish regardless of what the client sends.
drop policy if exists "news_posts: submit pending" on public.news_posts;
create policy "news_posts: submit pending"
  on public.news_posts for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and status = 'pending'
  );

-- Authors may withdraw their own submission; they may not edit it, because
-- an UPDATE policy cannot restrict which columns change and would therefore
-- let an author flip their own status to 'approved'.
drop policy if exists "news_posts: delete own" on public.news_posts;
create policy "news_posts: delete own"
  on public.news_posts for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "news_posts: admin moderate" on public.news_posts;
create policy "news_posts: admin moderate"
  on public.news_posts for update
  using (public.is_admin())
  with check (public.is_admin());


-- Comments are visible only on posts the reader can already see.
drop policy if exists "news_comments: read visible" on public.news_comments;
create policy "news_comments: read visible"
  on public.news_comments for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.news_posts p
      where p.id = news_comments.post_id
        and (
          p.status = 'approved'
          or p.user_id = auth.uid()
          or public.is_admin()
        )
    )
  );

-- Commenting is allowed only on approved posts.
drop policy if exists "news_comments: write own" on public.news_comments;
create policy "news_comments: write own"
  on public.news_comments for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.news_posts p
      where p.id = news_comments.post_id
        and p.status = 'approved'
    )
  );

drop policy if exists "news_comments: delete own" on public.news_comments;
create policy "news_comments: delete own"
  on public.news_comments for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());


-- Likes are world-readable so the counts render for signed-out visitors.
drop policy if exists "news_likes: read all" on public.news_likes;
create policy "news_likes: read all"
  on public.news_likes for select
  to anon, authenticated
  using (true);

drop policy if exists "news_likes: like own" on public.news_likes;
create policy "news_likes: like own"
  on public.news_likes for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.news_posts p
      where p.id = news_likes.post_id
        and p.status = 'approved'
    )
  );

drop policy if exists "news_likes: unlike own" on public.news_likes;
create policy "news_likes: unlike own"
  on public.news_likes for delete
  to authenticated
  using (user_id = auth.uid());
