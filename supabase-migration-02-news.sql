-- ===========================================================================
-- BazyanHub — migration 02: sixth reaction + news media storage
-- ===========================================================================
--
-- Run this AFTER supabase-schema.sql, in the Supabase SQL Editor.
--
-- !! RUN PART A ON ITS OWN, THEN PART B. !!
--
-- Postgres will not let a newly added enum value be USED in the same
-- transaction that adds it ("unsafe use of new value of enum type"). The SQL
-- Editor runs a whole script as one transaction, so if Part A and Part B are
-- executed together the storage policies can fail. Select Part A, run it,
-- then select Part B and run that.
--
-- Both parts are idempotent — running either twice is harmless.
-- ===========================================================================


-- ===========================================================================
-- PART A — add the 'wow' reaction  (run this alone, first)
-- ===========================================================================
--
-- The UI shows six reactions: 👍 like · ❤️ love · 😂 haha · 😮 wow · 😢 sad ·
-- 😡 angry. The enum originally had five.
--
-- `after 'haha'` places it in the same order the picker renders, which keeps
-- `select ... order by reaction_type` output readable. Enum sort order is
-- declaration order, not alphabetical.
--
-- REACTIONS in lib/data/news.ts must match this list exactly. A value here
-- with no entry there renders as a blank bubble; an entry there with no value
-- here is rejected on write.
-- ---------------------------------------------------------------------------

alter type public.news_reaction_type
  add value if not exists 'wow' after 'haha';


-- ===========================================================================
-- PART B — storage bucket for news media  (run this second)
-- ===========================================================================
--
-- Until now the composer's attachment was a local blob preview and nothing
-- was ever uploaded, so news_posts.media_url was always null. This bucket is
-- what makes an attached image real.
--
-- `public = true` means files are readable by URL without a signed token,
-- which is what next/image needs. Only READS are public — uploading still
-- requires the policies below.
-- ---------------------------------------------------------------------------

insert into storage.buckets
  (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news-media',
  'news-media',
  true,
  10485760,                          -- 10 MB, enforced server-side
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
  set
    public             = excluded.public,
    file_size_limit    = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;


-- ---------------------------------------------------------------------------
-- Storage policies.
--
-- Files are stored as `<user-id>/<random>.<ext>`. Pinning the first path
-- segment to auth.uid() is what stops one signed-in user from writing into
-- another user's folder, or overwriting somebody else's image by guessing its
-- name. storage.foldername(name) returns the path segments as a text[].
-- ---------------------------------------------------------------------------

drop policy if exists "news-media: public read" on storage.objects;
create policy "news-media: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'news-media');

drop policy if exists "news-media: upload own folder" on storage.objects;
create policy "news-media: upload own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'news-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Needed because the client uploads with upsert semantics disabled but
-- retries can collide; also lets a user replace their own file.
drop policy if exists "news-media: update own" on storage.objects;
create policy "news-media: update own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'news-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'news-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- An admin may remove anything in the bucket (moderation); a user may remove
-- only their own uploads.
drop policy if exists "news-media: delete own or admin" on storage.objects;
create policy "news-media: delete own or admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'news-media'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );


-- ===========================================================================
-- Verify
-- ===========================================================================
--
--   select unnest(enum_range(null::public.news_reaction_type));
--     -> like, love, haha, wow, sad, angry
--
--   select id, public, file_size_limit from storage.buckets
--    where id = 'news-media';
--
--   select policyname from pg_policies
--    where tablename = 'objects' and policyname like 'news-media%';
--     -> 4 rows
-- ===========================================================================
