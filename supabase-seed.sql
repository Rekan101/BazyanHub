-- ===========================================================================
-- BazyanHub — seed data
-- ===========================================================================
--
-- Run AFTER supabase-schema.sql. Idempotent: re-running updates rather than
-- duplicating (every insert carries an ON CONFLICT clause keyed on slug).
--
-- This mirrors exactly what the app renders from local mock data today, so a
-- fresh Supabase project immediately matches the current site:
--   * the 10 categories from lib/data/categories.ts
--   * the 12 filter chips that actually exist (10 vehicles, 2 beauty)
--   * Bazyan Cafe, the one real seeded provider, with its 7 weekday rows
--   * the 6 story slide headlines from components/Stories.tsx
--
-- Category names are taken from lib/data/categories.ts, which is the
-- canonical source. (app/services/[category]/page.tsx used to carry a second,
-- divergent copy of these names; it no longer does.)
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------

insert into public.categories
  (slug, name_ckb, name_ar, name_en,
   description_ckb, description_ar, description_en,
   icon, image_url, is_popular, is_featured, sort_order)
values
  ('vehicles',
   'سەیارە و گواستنەوە', 'السيارات والنقل', 'Vehicles & Transportation',
   'خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف الخدمات والأعمال التجارية في هذا القسم.',
   'Discover services and businesses in this category.',
   'car', '/images/vehicles.webp', false, true, 1),

  ('restaurants',
   'خواردنگە', 'المطاعم', 'Restaurants',
   'چێشتخانە، کافێ و شوێنەکانی خواردن لە بازیان بدۆزەرەوە.',
   'اكتشف المطاعم والمقاهي وأماكن الطعام في بازیان.',
   'Discover restaurants, cafes and food places in Bazian.',
   'utensils', '/images/restaurants.webp', true, false, 2),

  ('shopping',
   'بازاڕ و فرۆشتن', 'الأسواق والتجزئة', 'Shopping & Retail',
   'خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف الخدمات والأعمال التجارية في هذا القسم.',
   'Discover services and businesses in this category.',
   'shopping-cart', '/images/shopping.webp', false, true, 3),

  ('health',
   'تەندروستی', 'الصحة والرعاية الصحية', 'Healthcare',
   'خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف الخدمات والأعمال التجارية في هذا القسم.',
   'Discover services and businesses in this category.',
   'heart-pulse', '/images/health.webp', true, false, 4),

  ('mobile',
   'فرۆشگای مۆبایل', 'متاجر الهواتف المحمولة', 'Mobile Stores',
   'خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف الخدمات والأعمال التجارية في هذا القسم.',
   'Discover services and businesses in this category.',
   'smartphone', '/images/mobile.webp', true, false, 5),

  ('beauty',
   'جوانکاری', 'التجميل وصالونات', 'Beauty & Salons',
   'خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف الخدمات والأعمال التجارية في هذا القسم.',
   'Discover services and businesses in this category.',
   'scissors', '/images/beauty.webp', false, false, 6),

  ('real-estate',
   'نوسینگەی خانوو و موڵک', 'مكاتب العقارات', 'Real Estate',
   'خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف الخدمات والأعمال التجارية في هذا القسم.',
   'Discover services and businesses in this category.',
   'house', '/images/real-estate.webp', false, true, 7),

  ('institutes',
   'پەیمانگا و کۆرس', 'المعاهد والدورات', 'Institutes & Courses',
   'خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف الخدمات والأعمال التجارية في هذا القسم.',
   'Discover services and businesses in this category.',
   'graduation-cap', '/images/institutes.webp', false, false, 8),

  ('workers',
   'وەستا و کرێکاران', 'الحرفيون والعمال', 'Skilled Workers',
   'خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف الخدمات والأعمال التجارية في هذا القسم.',
   'Discover services and businesses in this category.',
   'wrench', '/images/workers.webp', true, false, 9),

  ('jobs',
   'هەلی کار', 'فرص العمل', 'Job Opportunities',
   'هەلی کار و دامەزراندنەکانی ئەم بەشە بدۆزەرەوە.',
   'اكتشف فرص العمل والتوظيف في هذا القسم.',
   'Discover jobs and employment opportunities.',
   'briefcase', '/images/jobs.webp', false, true, 10)

on conflict (slug) do update set
  name_ckb        = excluded.name_ckb,
  name_ar         = excluded.name_ar,
  name_en         = excluded.name_en,
  description_ckb = excluded.description_ckb,
  description_ar  = excluded.description_ar,
  description_en  = excluded.description_en,
  icon            = excluded.icon,
  image_url       = excluded.image_url,
  is_popular      = excluded.is_popular,
  is_featured     = excluded.is_featured,
  sort_order      = excluded.sort_order;


-- ---------------------------------------------------------------------------
-- Filters — the 12 chips that exist today.
--
-- Note these are OPTIONAL by design: the other eight categories have none,
-- and providers are free to leave filter_id NULL.
-- ---------------------------------------------------------------------------

insert into public.filters (category_id, slug, label_ckb, label_ar, label_en, sort_order)
select c.id, v.slug, v.label_ckb, v.label_ar, v.label_en, v.sort_order
from public.categories c
join (values
  ('vehicles', 'taxi',              'تاکسی',                'تاكسي',              'Taxi',              1),
  ('vehicles', 'pickup',            'پیکاپ',                'بيك أب',             'Pickup',            2),
  ('vehicles', 'excavator',         'حەفارە',               'حفارة',              'Excavator',         3),
  ('vehicles', 'shovel',            'شۆڤڵ',                 'شيول',               'Shovel',            4),
  ('vehicles', 'filter',            'فیتەر',                'فلتر',               'Filter',            5),
  ('vehicles', 'painter',           'ڕونگۆر',               'دهان سيارات',        'Car Painter',       6),
  ('vehicles', 'puncture',          'پەنچەرچی',             'بنشرجي',             'Tire Repair',       7),
  ('vehicles', 'car-wash',          'غەسل',                 'غسيل سيارات',        'Car Wash',          8),
  ('vehicles', 'auto-electrician',  'کارەباچی سەیارە',      'كهربائي سيارات',     'Auto Electrician',  9),
  ('vehicles', 'spare-parts',       'پارچەی یەدەگی سەیارە', 'قطع غيار السيارات',  'Spare Parts',      10),
  ('beauty',   'barber',            'سەرتاش',               'حلاق',               'Barber',            1),
  ('beauty',   'salon',             'سالۆن',                'صالون',              'Salon',             2)
) as v (category_slug, slug, label_ckb, label_ar, label_en, sort_order)
  on v.category_slug = c.slug
on conflict do nothing;


-- ---------------------------------------------------------------------------
-- Bazyan Cafe — the one real provider.
--
-- filter_id is deliberately left NULL: the restaurants category has no filter
-- chips, and a provider must be creatable without one.
-- ---------------------------------------------------------------------------

insert into public.providers
  (slug, category_id, name, description, subcategory,
   logo_url, cover_image_url, phone,
   rating, review_count,
   is_verified, is_featured, is_active,
   address, city, google_maps_url,
   socials, services, tags)
select
  'restaurant-bazian-cafe',
  c.id,
  'Bazian Cafe',
  'کافێیەکی مۆدێرن لە بازیان بە ژوورێکی ئارام و خزمەتگوزاریی خێرا.',
  'کافێ',
  '/images/providers/restaurants/bazian-cafe.jpg',
  '/images/providers/restaurants/bazian-cafe.jpg',
  '+9647500000000',
  4.8,
  124,
  true,
  true,
  true,
  'ناوەندی بازیان',
  'بازیان',
  'https://www.google.com/maps',
  '{
     "whatsapp":  "+9647500000000",
     "instagram": "https://instagram.com/",
     "facebook":  "https://facebook.com/",
     "tiktok":    "https://tiktok.com/",
     "viber":     "+9647500000000"
   }'::jsonb,
  array['قاوە', 'چای', 'خواردنەوە', 'Fast Food'],
  array['کافێ', 'قاوە', 'بازیان', 'خێرا']
from public.categories c
where c.slug = 'restaurants'
on conflict (slug) do update set
  name            = excluded.name,
  description     = excluded.description,
  subcategory     = excluded.subcategory,
  logo_url        = excluded.logo_url,
  cover_image_url = excluded.cover_image_url,
  phone           = excluded.phone,
  rating          = excluded.rating,
  review_count    = excluded.review_count,
  socials         = excluded.socials,
  services        = excluded.services,
  tags            = excluded.tags;


-- Hours. 0 = Sunday .. 6 = Saturday, matching JS Date.getDay().
-- Friday (5) opens later, as in the mock data.
insert into public.provider_hours (provider_id, day_of_week, open_time, close_time, is_closed)
select p.id, v.day_of_week, v.open_time::time, v.close_time::time, false
from public.providers p
join (values
  (0, '08:00', '23:00'),
  (1, '08:00', '23:00'),
  (2, '08:00', '23:00'),
  (3, '08:00', '23:00'),
  (4, '08:00', '23:00'),
  (5, '14:00', '23:30'),
  (6, '08:00', '23:00')
) as v (day_of_week, open_time, close_time) on true
where p.slug = 'restaurant-bazian-cafe'
on conflict (provider_id, day_of_week) do update set
  open_time  = excluded.open_time,
  close_time = excluded.close_time,
  is_closed  = excluded.is_closed;


-- ---------------------------------------------------------------------------
-- Story slides — the 6 rotating headline sentences.
-- ---------------------------------------------------------------------------

insert into public.story_slides (title_ckb, title_ar, title_en, position)
values
  ('ژیانی ڕۆژانەت ئاسانتر بکە',            'اجعل حياتك اليومية أسهل',        'Make your daily life easier',        1),
  ('باشترین خزمەتگوزارییەکان لێرەن',       'أفضل الخدمات هنا',               'The best services are here',         2),
  ('هەر ئێستا پەیوەندی بکە',               'تواصل الآن',                     'Get in touch right now',             3),
  ('کات و پارەت بپارێزە',                  'وفّر وقتك ومالك',                'Save your time and money',           4),
  ('وەستای شارەزا بدۆزەرەوە',              'اعثر على حرفي ماهر',             'Find a skilled professional',        5),
  ('هەموو پێداویستییەکان لە یەک جێگادا',   'كل ما تحتاجه في مكان واحد',      'Everything you need in one place',   6)
on conflict do nothing;


-- ---------------------------------------------------------------------------
-- News feed
--
-- user_id is NULL on every row here: a fresh project has no auth.users, and
-- news_posts.user_id is nullable precisely so seeded/imported content can
-- exist without an account. author_name carries the byline instead.
--
-- Two posts, matching the states the moderation flow produces:
--   * post 1 — 'approved', the kind of row the feed renders today
--   * post 2 — 'pending',  invisible to the public feed until an admin
--                          approves it. Use it to verify the RLS actually
--                          hides unapproved content.
--
-- Guarded by NOT EXISTS rather than ON CONFLICT: these rows have no natural
-- unique key, so re-running would otherwise insert duplicates.
-- ---------------------------------------------------------------------------

insert into public.news_posts
  (author_name, text_content, media_url, media_type, status, approved_at)
select
  v.author_name, v.text_content, v.media_url, v.media_type,
  v.status::public.news_post_status,
  case when v.status = 'approved' then now() else null end
from (values
  (
    'ئیدارەی بازیان هەب',
    'ڕێگای بازیان پاش چاککردنەوە کرایەوە بۆ هاتوچۆ. تکایە ئاگاداری هێمای ڕێگا و خێرایی بن لە کاتی تێپەڕبوون. 🚗',
    '/images/bazian-pass.webp',
    'image',
    'approved'
  ),
  (
    'هەلی کاری بازیان',
    'چەند هەلێکی کاری نوێ لە بازیان زیادکران: فرۆشیار، وەستای کارەبا و شۆفێری پیکاپ. بۆ زانیاری زیاتر پەیوەندی بە ژمارەی ناو پۆستەکە بکە. 💼',
    '/images/jobs.webp',
    'image',
    'pending'
  )
) as v (author_name, text_content, media_url, media_type, status)
where not exists (
  select 1 from public.news_posts existing
  where existing.text_content = v.text_content
);


-- ---------------------------------------------------------------------------
-- Reactions.
--
-- IMPORTANT — this block usually inserts NOTHING, by design.
--
-- news_reactions.user_id is NOT NULL (it is half of the composite primary key
-- that enforces one reaction per person), and it references profiles, which
-- references auth.users. A freshly created project has no users, so there is
-- no one to attribute a reaction to. Unlike posts, reactions genuinely cannot
-- be seeded anonymously.
--
-- Rather than fail, the insert is driven by whatever profiles happen to exist:
-- on an empty project the driving select returns no rows and this is a no-op;
-- once you have signed a few accounts up, re-running the seed gives the
-- approved post some demo reactions.
--
-- Until then the feed's reaction counts come from the mock fallback in
-- lib/data/news.ts, which is what the UI renders while the database is empty.
-- ---------------------------------------------------------------------------

insert into public.news_reactions (post_id, user_id, reaction_type)
select
  p.id,
  u.id,
  -- Spread the first few accounts across different reactions so the
  -- overlapping-icon cluster in the UI has something to show.
  --
  -- The ::int on the subscript is deliberate: row_number() returns bigint,
  -- and Postgres array subscripts require integer — bigint is only an
  -- assignment cast, so without this it errors with
  -- "array subscript must have type integer".
  (array['like', 'love', 'haha', 'sad', 'angry'])[
    (((u.rn - 1) % 5) + 1)::int
  ]::public.news_reaction_type
from public.news_posts p
cross join (
  select
    id,
    row_number() over (order by created_at) as rn
  from public.profiles
  limit 5
) u
where p.status = 'approved'
  and p.author_name = 'ئیدارەی بازیان هەب'
on conflict (post_id, user_id) do update set
  reaction_type = excluded.reaction_type,
  updated_at    = now();
