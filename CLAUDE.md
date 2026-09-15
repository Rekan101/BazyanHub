# BazyanHub (بازیان هەب) — Master Project Guidelines & Rules

> **This file documents what is actually implemented in the codebase**, verified against source
> at time of writing. Where a specification has been agreed but not yet built, it is explicitly
> marked **`[PLANNED — NOT YET IMPLEMENTED]`**. Do not assume a planned item exists just because
> it is described below — check the referenced file first. Keeping this file accurate is more
> valuable than keeping it aspirational: a future session that trusts a false "done" here will
> waste time or break things.

## 1. Project Overview & Tech Stack

- **Product**: Mobile-first Progressive Web App shell for Bazyan town — local services directory, marketplace categories, tourist/historical places, and a community news feed.
- **Framework**: Next.js 16 (App Router, async `params`), React 19, TypeScript 5.
- **Styling**: Tailwind CSS 3.4 (utility classes only — `tailwind.config.ts` defines no custom color tokens beyond the default palette; do not use `bg-primary`, `text-text`, `border-border`, etc. — they resolve to nothing).
- **Icons**: `lucide-react`. Social brand icons are hand-rolled inline SVGs in `components/icons/SocialIcons.tsx`.
- **Animation**: `framer-motion` (`motion` + `AnimatePresence` directly in most files; `LazyMotion`/`m` only in `components/Hero.tsx`).
- **Data layer**: Supabase (Postgres + Auth) via `lib/supabase/`, with the local TypeScript mock data under `lib/data/` retained as a **fallback** whenever the database is unconfigured, unreachable, or empty — see §8.
- **Localization**: Kurdish Sorani (`ckb`) is the default and primary language, RTL. Arabic (`ar`, RTL) and English (`en`, LTR) are also supported. See §7.

## 2. App Shell Architecture

Defined in `app/layout.tsx`. Provider nesting order (outer → inner):

```
ThemeProvider → LanguageProvider → NotificationProvider → (desktop backdrop) → (phone-frame shell)
```

- **Desktop backdrop**: `bg-slate-100 dark:bg-slate-900`, full viewport height.
- **Phone-frame shell**: centered `max-w-md` column — `bg-slate-50 dark:bg-slate-950`, with `md:border-x` + a soft shadow so it reads as a phone frame on wide screens. `AppHeader`, `<main>`, and `BottomNav` all live inside this column and are themselves `max-w-md` + `mx-auto`, so the whole app — including fixed chrome and modals — stays confined to that column even on desktop.
- `<main>` padding: `pt-[73px] pb-24` to clear the fixed header and bottom nav.
- `<html lang="ckb" dir="rtl">` is the default; `LanguageProvider` swaps `document.documentElement.lang`/`dir` (and `document.body.dir`) at runtime when the user changes language.
- `ThemeProvider` is a custom implementation (not `next-themes`) — toggles a `dark` class + `colorScheme` on `document.documentElement`, persisted to `localStorage` under `bazian-theme`. `suppressHydrationWarning` is set on both `<html>` and `<body>` to absorb the expected first-paint flash.

## 3. Global Color System

Established as a 5-color system, replacing an earlier emerald/green theme. **Every color must have an explicit `dark:` counterpart** unless the element is theme-independent by design (see BottomNav below).

| Role | Light | Dark |
|---|---|---|
| Primary (brand blue) | `blue-600` | `blue-500` |
| Secondary (steel blue) | `sky-500` (also `sky-50` pills) | `sky-400` (`sky-900/30` pills) |
| App surface / cards | `slate-50` page / `white` cards | `slate-950` page / `slate-900` cards |
| Borders & dividers | `slate-200` (or `slate-300` for stronger separation) | `slate-800` |
| Muted text & icons | `slate-600` | `slate-400` |

**Semantic exceptions — never remapped to the palette above:**
- **Open/closed status** (provider cards): open = `bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400` with a `bg-green-500` dot; closed = the same shape in `rose-50/rose-600/rose-950/40/rose-400` with a `bg-rose-500` dot. Defined in `components/providers/ProviderCard.tsx`.
- **Star ratings**: `fill-yellow-400 text-yellow-400` (not `amber-*`) — used consistently in `ProviderCard.tsx`, `ProviderModal.tsx`, and the provider detail page.
- **Notification unread dots**: `bg-rose-500` — used in **both** the header bell (`AppHeader.tsx`) and the profile Notifications row (`app/profile/page.tsx`); this pairing was a deliberate, explicit decision so the two visually match.
- **Social brand colors** (profile page + `SocialIcons.tsx`): Facebook `#1877F2`, WhatsApp `#25D366`, Viber `#7360F2`, Instagram gradient `#F9CE34→#EE2A7B→#6228D7`, TikTok near-black `#111827` — real brand hex values, not palette tokens, by design.
- **BottomNav navy** `#003B6D` and **AppHeader dark navy** `#002240` — see §4. These are literal hex values (`bg-[#003B6D]`, `dark:bg-[#002240]`), not palette tokens, also by explicit design decision (the header must read *darker* than the bottom nav in dark mode).

## 4. App Chrome

### `components/layout/AppHeader.tsx`
- Light: `bg-[#EBEDF3]/95` (an off-white swatch, deliberately **not** `slate-50` and **not** any blue/sky tint) with `backdrop-blur-md`.
- Dark: `dark:bg-[#002240]` — solid, no translucency.
- Fixed `top-0`, `h-[72px]` (`min-h-[72px]`), contains: brand logo + name (left in RTL... actually start-anchored via flex order, renders right in RTL), then theme toggle, notification bell (with `bg-rose-500` unread dot), and hamburger menu (opens `MenuSheet`).
- The bell's `onClick` calls `toggle()` from `useNotifications()` (see §4.3) — it does **not** own local open/close state itself.

### `components/layout/BottomNav.tsx` — **CRITICAL: intentionally theme-independent**
- Background is **`bg-[#003B6D]` in both light and dark mode** — the file contains **zero** `dark:` classes for its own container or tab colors. This is by explicit design, confirmed across multiple sessions: no color change when the theme toggles.
- Text/icons: `text-white` when active, `text-white/60` (hover → `text-white`) when inactive — same white family in both themes, only opacity differs, so the active tab is still distinguishable.
- Shape: `rounded-t-[1.5rem]` + `overflow-hidden`, `fixed bottom-0`, respects `env(safe-area-inset-bottom)`.
- **Current sizing** (last confirmed state): container `h-12` (48px, `py-1`), icon wrapper `h-5 w-9`, icon glyph `h-4 w-4`, label `text-[9px]`.
- **Tabs, in actual on-screen order (5 total, `grid-cols-5`)**:
  1. Home — `/` — `Home` icon
  2. About Bazyan (دەربارەی بازیان) — `/about` — `Landmark` icon
  3. **News (هەواڵەکان) — `/news` — `Newspaper` icon — center position**
  4. Favorites (دڵخوازەکان) — `/favorites` — `Heart` icon (fills solid when active)
  5. Profile/Account (هەژمارەکەم) — `/profile` — `User` icon
- No background "pill" behind the active icon (removed by design for a flat look).

### `components/layout/NotificationProvider.tsx` + `NotificationPanel.tsx`
- `NotificationProvider` wraps the whole app (in `app/layout.tsx`, inside `LanguageProvider`) and owns the single source of truth: `{ isOpen, open, close, toggle }` via `useNotifications()`.
- It renders **exactly one** `<NotificationPanel>` instance. Both the header bell and the profile Notifications row call `useNotifications()` and trigger the same panel — there is no second panel instance anywhere.
- Closes automatically on route change (`usePathname` effect).
- **Supabase-backed, fetched in the BROWSER** — the one surface that is not fetched on the server. `NotificationProvider` calls `fetchNotificationsFromBrowser()` (`lib/supabase/queries.client.ts`) and passes the list to `NotificationPanel`.
  - **Why client-side, not server-side** (this was deliberately reversed after an earlier pass fetched it in the layout): any `cookies()` call in `app/layout.tsx` opts **every route in the app** into dynamic rendering. Fetching here is what keeps `/`, `/about`, `/news`, `/profile`, `/favorites` and `/legal` prerendered (`○` in the build output). **Do not move this back to the server.** There is deliberately **no** `lib/data/notifications.server.ts`.
  - It also fixes localisation: the user's language lives in `localStorage`, so only the client can pick the right `title_*` / `body_*` column. The fetch re-runs when the language changes.
  - **Lazy**: loads on the first panel *open*, not on mount. The panel is closed by default, so a mount fetch would cost a request per page load for data most visitors never see. Cached for the session afterwards; `loadedLanguageRef` tracks which language is cached.
  - A `cancelled` flag guards against a slow response overwriting a newer one (fast language toggling, or close-then-reopen). A `null` result — unconfigured or errored — **keeps whatever is on screen** rather than blanking it.
  - **Fallback is not data.** When the list is empty — no rows, or Supabase unconfigured — the panel renders its built-in welcome item, whose text comes from the i18n keys `notificationWelcomeTitle` / `notificationWelcomeBody` / `notificationNow`. That is byte-for-byte what it displayed before the database existed. `lib/data/notifications.ts` therefore has **no mock array**, unlike the other data modules.
  - The badge is `countUnread(...)`, falling back to `1` for the welcome item (matching the previously hardcoded `1`).
  - Rows may carry an `icon` key; `NotificationPanel` maps a small allow-list (`sparkles`, `megaphone`, `newspaper`, `store`, `bell`) and falls back to `Sparkles`. Rows with a `linkUrl` wrap in a `<Link>` that closes the panel on click.
  - While loading, a 2px indeterminate bar (`@keyframes notif-loading` in `app/globals.css`) sits in the header border's own space — chosen over a spinner or skeleton rows so the list never shifts.
  - `useNotifications()` now also exposes `{ notifications, unreadCount, isLoading, refresh }` alongside the open/close API, so the header bell could consume the real count later.

### `components/layout/MenuSheet.tsx`
- The hamburger-triggered slide-in sheet (auth CTA, page links, language switcher, theme toggle, footer info). Still uses the general slate treatment — **not** updated to navy chrome; if the navy header makes it feel visually disconnected, that is a known, un-actioned observation, not a bug.
- **First item in the scrollable content is the auth CTA banner** (`<AuthEntryLinks />` under a tinted gradient panel) — see §12. It sits above the page-links nav deliberately: signing in is the most useful action for a signed-out visitor.

## 5. Stories Carousel (`components/Stories.tsx`, used inside `components/Hero.tsx`)

- **Data**: **Supabase-backed, prop-driven.** `app/page.tsx` (server) calls `getStorySlides()` from `lib/data/stories.server.ts` and passes the result down through `Hero` → `Stories` as a `slides` prop. The `Story`/`Slide` types and the mock `SLIDES` array (**6 slides × 3 stories = 18 stories**) now live in `lib/data/stories.ts` — client-safe, and shared with the server-side mapper. Story shape: `{ id, image, providerName, shortInfo, providerId, categoryId }` — deliberately **no** expiration/scheduling fields, because `stories.duration` + the `set_story_expiry` trigger handle that in Postgres and the query filters expired rows out before they reach the client.
  - `Stories` and `Hero` both take `slides` as an **optional** prop defaulting to `SLIDES`, so they still render standalone.
  - A slide with zero live stories is dropped in `getStorySlides()` before the fallback check — otherwise an all-expired slide would render as an empty 3-up grid with just a title.
  - The carousel indexes with `slides[currentSlide % slides.length]` and the auto-loop is skipped when `slides.length <= 1`. Do not "simplify" these back to direct indexing: `currentSlide` is state, so a shorter array arriving on a later fetch would otherwise index past the end and crash.
  - The modal CTA renders **only** when both `categoryId` and `providerId` are non-empty. `stories.provider_id` is nullable with `ON DELETE SET NULL`, so a story can outlive its business; without the guard that emits `href="/services//"`.
- Slide titles, in fixed order: `ژیانی ڕۆژانەت ئاسانتر بکە`, `باشترین خزمەتگوزارییەکان لێرەن`, `هەر ئێستا پەیوەندی بکە`, `کات و پارەت بپارێزە`, `وەستای شارەزا بدۆزەرەوە`, `هەموو پێداویستییەکان لە یەک جێگادا`.
- **Layout**: outer glass box `rounded-[2rem] border border-white/20 dark:border-white/10 p-4 shadow-lg`, containing a `grid grid-cols-3 gap-3` of `aspect-square rounded-[1.5rem]` squircle thumbnails, a rotating title pill below (`bg-white dark:bg-slate-900 rounded-full px-6 py-2`), and slide-position dots.
- **Container background**: the real silver-wave photo at `public/images/silver-waves.jpg`, applied via an **inline `style`** (not a Tailwind class), with a flat dark overlay stacked above the image inside the same `backgroundImage` value so the texture reads slightly darker for contrast:
  ```tsx
  style={{
    backgroundImage:
      "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('/images/silver-waves.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
  ```
  A `bg-slate-300` class stays on the element as a base color so the container degrades to silver rather than transparent while the image loads. Identical in both themes — no `dark:` background override. The overlay-in-the-stack approach is deliberate: it needs no extra DOM node and does **not** dim the thumbnails or title pill rendered on top.
  - Note: two `bg-gradient-to-t` classes elsewhere in this file are **not** the container background — one is the bottom scrim on each thumbnail, the other the readability overlay in the fullscreen modal. Both are required for text legibility; do not strip them when asked to "remove gradients" from the container.
- **Auto-loop**: `setInterval` every `SLIDE_INTERVAL_MS = 3000`ms, advances via a functional `setCurrentSlide` updater (keeps the interval stable, never recreated mid-cycle). The effect's cleanup always calls `clearInterval` — both on pause and on unmount, so there is no leak.
- **Pause/resume**: clicking a story sets `isPaused = true` (which tears the interval down completely, not just skips a tick) and opens the fullscreen modal. Closing (X, backdrop click, or `Escape`) sets `isPaused = false`, which builds a **fresh** interval — the current slide always gets a full 3s, never a partial "resume" of elapsed time.
- **Fullscreen story modal**: a **centered popup**, not full-bleed — `fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-10`, with the actual card at `relative w-full max-w-md h-[85vh] rounded-3xl overflow-hidden`. Uses `z-[100]`, not `z-50` — both `AppHeader` and `BottomNav` are `z-50`, and `BottomNav` is a later DOM sibling, so a `z-50` modal would render underneath the bottom nav.
- Modal body-scroll-locks while open (restores previous `overflow` on close) and closes on `Escape`.
- Modal CTA (`بینینی هەژمار`) routes to `/services/[categoryId]/[providerId]` — see §6.

## 6. Routing Map

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | **Async server component with ISR** (`export const revalidate = 300`). Fetches story slides via `getStorySlides()` and passes them to Hero (incl. Stories) + `ServicesSection`. Stays `○` static because the fetch uses the cookie-free public client. No Working Hours/FAQ/description text — trimmed in an earlier pass. |
| `/login` | `app/login/page.tsx` → `components/auth/AuthPage.tsx` | Static server shell (metadata only) wrapping the client auth form. See §12. |
| `/signup` | `app/signup/page.tsx` → `components/auth/AuthPage.tsx` | Same shell, `mode="signup"`. See §12. |
| `/auth/callback` | `app/auth/callback/route.ts` | Route handler. Exchanges the OAuth `code` for a session and writes the auth cookies. Always `ƒ` dynamic, which is correct. |
| `/about` | `app/about/page.tsx` | `AboutSection` + `PlacesGrid` (tourism/history cards) — moved here from the home page. |
| `/places/[id]` | `app/places/[id]/page.tsx` | Tourism/history detail. Its back button (`گەڕانەوە`) is a **hardcoded** `<Link href="/about">` — not `router.back()` (there is no `useRouter` call anywhere in this codebase). This was fixed after the link had gone stale from pointing at `/`. |
| `/news` | `app/news/page.tsx` | See §9. |
| `/favorites` | `app/favorites/page.tsx` | Category favorites, `localStorage`-backed. |
| `/profile` | `app/profile/page.tsx` | See §10. |
| `/legal` | `app/legal/page.tsx` | Terms & privacy, static content. |
| `/services/[category]` | `app/services/[category]/page.tsx` (server) + `CategoryPageClient.tsx` (client) | Category listing. **Split into a server component that fetches and a client child that owns the modal + filter state.** 2-column grid (`grid-cols-2 gap-3 sm:gap-4`). Filter pills: 3 fixed (هەمووی / پڕداواکاریترین / تایبەت → all / `featured` / `special`) **plus** one per row in the `filters` table for that category. See the correction note below. |
| `/services/[category]/[providerId]` | `app/services/[category]/[providerId]/page.tsx` | Server component, Next 16 async `params`. Looks up via `await getProviderById` (`lib/data/providers.ts` — **now async**). If not found, renders a friendly "not available yet" placeholder with a back link — **not** `notFound()`, because most mock `providerId`s in `Stories.tsx` don't resolve to real seeded data yet (only `lib/data/services/restaurants.ts` has a real entry: `restaurant-bazian-cafe`). |

> **Correction to an earlier version of this file.** This section previously claimed the category
> listing page rendered "3 hardcoded filter pills." **It did not.** `UI_TEXT.filterAll` /
> `filterFeatured` / `filterSpecial` and `type FilterKey` were declared but never used — no pill UI
> was ever rendered. That page also carried its *own duplicate* 10-category array (with different
> Kurdish names than `lib/data/categories.ts`), a hand-rolled `restaurants → Provider` adapter that
> bypassed the `lib/data/providers.ts` seam, and dead code filtering for a nonexistent
> `"bazian-transport-test"` provider. All four are now gone, and the pills genuinely render.
>
> Because the duplicate array's names were divergent, unifying changed some visible header text —
> e.g. restaurants now reads `خواردنگە` (canonical) rather than `چێشتخانە و خواردن`.

Note: the home page's `ServicesSection` (`components/services-section.tsx`) is a **separate**
component with its own independent copy of the 3-pill pattern. It is client-side and still filters
the local `categories` array; it was not part of the Supabase rewiring.

## 7. Internationalization (`lib/i18n.tsx`)

- `LanguageProvider` exposes `{ language, setLanguage, t, direction }`. `t(key)` looks up `TranslationKey` (a union derived from the `ckb` block's keys) in `TRANSLATIONS[language]`.
- **Every translation key must exist in all three language blocks (`ckb`, `ar`, `en`)** or the type-level union breaks the build. When adding a new UI string, add it to all three, even if `en`/`ar` are placeholder-quality.
- Default language `ckb`, persisted to `localStorage` (`bazian-language`), with a browser-language fallback for first-time visitors (`ar`/`en` prefixes only; everything else defaults to `ckb`).
- Mock/demo data strings (FAQ items, story provider names, news post bodies) are **Kurdish-only by established convention** — not run through `t()`. This is intentional, not an oversight.

## 8. Data Layer & Supabase — **INTEGRATED (providers & categories only)**

### Files

- `supabase-schema.sql` — full DDL: `profiles`, `categories`, `filters`, `providers`, `provider_hours`, `story_slides`, `stories`, `notifications`, plus RLS policies, an `is_admin()` `SECURITY DEFINER` helper, and a `handle_new_user()` trigger on `auth.users`.
- `supabase-seed.sql` — optional. Inserts the 10 categories, the 12 filter chips, Bazyan Cafe + its 7 hours rows, and the 6 story slide headlines. Run **after** the schema.
- `lib/supabase/types.ts` — hand-written `Database` types. **Keep in sync with the SQL by hand**, or regenerate with `npx supabase gen types typescript`.
- `lib/supabase/client.ts` — `"use client"`. Browser client + all auth helpers (§8.1). Exports `isSupabaseConfigured()`.
- **`lib/supabase/public.ts`** — `server-only`. **Cookie-free** client (plain `createClient`, anon key, `persistSession: false`). Used by every public read. **This is what keeps pages statically renderable**, because it never calls `cookies()`.
- `lib/supabase/server.ts` — `server-only`. Cookie-**based** client via `@supabase/ssr`. **Currently imported by nothing — this is intentional, KEEP IT.** It is the designated client for the next phase's authenticated server work (admin news moderation, a user reading their own `pending` posts), where seeing `auth.uid()` is the whole point. The OAuth callback builds its own inline instead, because this helper deliberately swallows cookie writes. Reach for it only when a read must see the signed-in user — doing so makes the calling route dynamic (see the `cookies()` rule below).
- `lib/supabase/mappers.ts` — DB row → app model. Pure functions and type-only imports, so it is **client-safe**. This is what makes the golden-rule card work (§8.3).
- `lib/supabase/queries.ts` — `server-only`. Public read queries, via the **public** client. Never add a user-specific read here.
- **`lib/supabase/queries.client.ts`** — `"use client"`. Browser-side reads. Currently just notifications.
- `.env.example` — documents both env vars plus every Supabase **dashboard** step the four auth methods need.

### The fallback contract — do not break this

`lib/data/providers.ts` and `lib/data/categories.server.ts` are the only seams. Both are
**Supabase-first, mock-second**:

- A query helper returning `null` means *"no answer"* — unconfigured, or the query errored.
- Returning `[]` means *"the database answered and is genuinely empty."*
- **Both** fall back to the mock data, so a brand-new empty database never renders a blank app.

To make the database strictly authoritative later, drop the `length === 0` half of each condition.
**The app must always build and run with no `.env.local`** — `next build` on a machine with no
credentials is the regression test for this, and it must stay green.

### ⚠️ Static rendering — the `cookies()` rule

`next build` must keep showing `○` for `/`, `/login`, `/signup`, `/about`, `/news`, `/profile`,
`/favorites` and `/legal`. **One `cookies()` call anywhere in a route's tree turns it `ƒ`**, and one
in `app/layout.tsx` turns *the entire app* dynamic.

Therefore:
- Public content (categories, providers, filters, stories) reads through `lib/supabase/public.ts`.
- User-specific content (notifications) is fetched **in the browser**.
- `app/layout.tsx` is **not** `async` and performs **no** data fetching. Keep it that way.
- `/` and `/services/[category]` carry `export const revalidate = 300` (ISR) so database changes
  still surface without giving up prerendering.

Treat the render-mode column of `next build` output as a regression test.

### ⚠️ Server-only module boundary

`lib/data/categories.ts` is imported by **client** components (home grid, favorites). It must stay
pure data + types. The Supabase-backed lookups live in a **separate** file,
`lib/data/categories.server.ts`, marked `import "server-only"`.

A dynamic `await import()` is **not** enough to keep a server module out of the client bundle — the
bundler still traces the edge and the build fails with a `next/headers` error. This was hit and
fixed during the integration; do not "simplify" it back into one file.

### Wired to Supabase (all with mock fallback)

| Surface | Server seam | Client consumer |
|---|---|---|
| Providers | `lib/data/providers.ts` | category + detail pages |
| Categories | `lib/data/categories.server.ts` | `CategoryPageClient` |
| **Stories** | `lib/data/stories.server.ts` | `app/page.tsx` → `Hero` → `Stories` |
| **Notifications** | *(none — browser-fetched)* `lib/supabase/queries.client.ts` | `NotificationProvider` → `NotificationPanel` |

The first three follow the same three-file shape: a **client-safe** `lib/data/<x>.ts` (types + mock),
a **`server-only`** `lib/data/<x>.server.ts` (Supabase + fallback), and a component that receives
data as a prop. Do not collapse the pair back into one file — see the boundary warning above.

Notifications deliberately break that pattern because they are user-specific; see §4.3.

### Still mock-backed

- **News feed** (`app/news/page.tsx`) — **the schema now exists** (`news_posts`, `news_comments`, `news_likes`, plus the `news_feed` view; see §9), but the page is **not wired to it**. It still renders two hardcoded `MOCK_POSTS` with likes/comments in local React state.
- Favorites — still `localStorage` (`bazianhub-favorites`, `Record<string, boolean>` keyed by category id). Needs auth UI first.
- `lib/data/services/*.ts` — **only `restaurants.ts` has real data** (`restaurant-bazian-cafe`); the other nine are empty and serve as the fallback for their categories.
- `places.ts`, `faqs.ts` — static mock content, untouched.

> **The SQL has never been executed.** No Postgres, Docker, or Supabase CLI was available in the
> environment where `supabase-schema.sql` / `supabase-seed.sql` were written. They were verified
> structurally only (balanced parens, quotes and `$$` bodies). **Expect to fix something the first
> time you run them**, and re-run the schema before the seed.

### 8.1 Auth — four methods, helpers only

`lib/supabase/client.ts` exposes typed helpers for all four. **There is no `/login` or `/signup`
route and no `AuthProvider` yet** — this is the data surface a future auth-UI pass consumes.

1. **Email + password** — `signUpWithEmail` / `signInWithEmail`.
2. **Username + password** — Supabase Auth has no native username login. A username maps
   deterministically to a **synthetic address**, `<username>@users.bazyanhub.app`, at both signup
   and signin. No lookup happens, so there is no username→email enumeration endpoint.
   **Trade-off:** those addresses cannot receive mail, so email password reset does not work until
   the user attaches a real address via `linkEmailToAccount()`. `sendPasswordReset()` detects a
   synthetic address and returns a clear error rather than silently doing nothing.
   Requires **"Confirm email" turned OFF** in the dashboard.
3. **Facebook OAuth** — `signInWithFacebook()`. Needs a Facebook App ID/Secret in the dashboard.
4. **Phone + password** — `signUpWithPhone` / `signInWithPhone` / `verifyPhoneOtp`. **Inert until an
   SMS provider (Twilio et al.) is configured in the dashboard.** The code is complete; the
   credentials are not.

### 8.2 Schema notes worth knowing

- **Filters are optional by design (a hard requirement).** `providers.filter_id` is **nullable** and
  `ON DELETE SET NULL`. An admin may attach an existing filter, create one first, or leave it null;
  deleting a filter never cascades into deleting providers.
- **`provider_hours.day_of_week` is `smallint` 0–6, 0 = Sunday**, matching `Date.getDay()`. The app's
  open/closed badge matches on **Kurdish weekday strings**; `mapHoursRows()` converts the integer
  back to the exact string in `KURDISH_WEEKDAYS`. **That array must stay byte-identical between
  `ProviderCard.tsx` and `mappers.ts`** — a mismatch silently reads as "closed".
- **Postgres `time` returns `HH:MM:SS`**, but `parseTimeToMinutes()` in `ProviderCard.tsx` only
  accepts `H:MM`/`HH:MM`. `toHoursMinutes()` in the mapper truncates. Without it *every* provider
  renders as closed.
- **`stories.expires_at`** is set by a `BEFORE INSERT OR UPDATE` trigger, not a generated column — a
  `GENERATED ALWAYS` CASE-over-enum is not provably immutable and Postgres rejects it.
- **News moderation is enforced by RLS, not application code.** The `news_posts` INSERT policy's
  `WITH CHECK` pins `status = 'pending'`, so a user cannot self-publish even by calling the REST API
  directly with a crafted payload. There is deliberately **no owner UPDATE policy**: an UPDATE policy
  cannot restrict *which columns* change, so granting one would let an author flip their own post to
  `'approved'`. Authors may DELETE (withdraw) but not edit; only an admin may UPDATE.
- **`news_post_status` includes `'rejected'`**, one state beyond what was specified. Without it a
  moderator's only options are approve or delete, and deleting destroys the record of what was
  submitted. Drop it from the enum if a strict two-state workflow is wanted.
- **`news_likes` uses a composite primary key `(post_id, user_id)`**, not a surrogate id — that is
  what enforces one like per user. Liking becomes `on conflict do nothing`; unliking is a plain
  delete on the key.
- **`public.news_feed`** is a view over `news_posts` carrying `like_count` / `comment_count`. It is
  declared `security_invoker = true` so it respects the *querying* user's RLS rather than the view
  owner's — without that it would leak unapproved posts. Requires Postgres 15+ (Supabase provides it).
- **`news_comments.text`** is named per spec, which collides with the type name `text`. The CHECK uses
  `btrim(text)` rather than `trim(text)` — both parse, but `trim` has special grammar
  (`trim(BOTH FROM x)`) that makes a type-named identifier inside it needlessly ambiguous to read.
- **`notifications.is_read` is per-row**, so a broadcast (`user_id IS NULL`) cannot track per-user
  read state. A `notification_reads(user_id, notification_id)` join table is the documented fix.
- `filters` uses two **partial** unique indexes, not a plain `UNIQUE (category_id, slug)` — Postgres
  treats NULLs as distinct, so the plain constraint would not constrain global filters at all.

### 8.3 Golden-rule card compliance

`components/providers/ProviderCard.tsx` is the Bazyan Cafe blueprint and is **not modified** by the
Supabase work. Standardization happens at the data layer: `mapProviderRow()` emits the exact
`Provider` shape the card already consumes (`coverImage` falling back to `logo`, rating/reviewCount
defaulted, hours normalized), so a database-backed provider and a mock provider render through
identical markup. **Map to `Provider`; never fork the card.**

## 9. News Feed (`app/news/page.tsx`)

- **Composer**: real controlled `<textarea>` (not a fake button), an `ImagePlus` attach button, and a `بڵاوکردنەوە` publish button (`disabled` while the draft is empty).
- **Media attachment** (local preview only — nothing is uploaded anywhere): the `ImagePlus` button calls `fileInputRef.current?.click()` on a hidden `<input type="file" accept="image/*,video/*" className="hidden">`; `accept` is what makes mobile offer the gallery/camera. `onChange` stores `{ url: URL.createObjectURL(file), type, name }` and renders a 64px preview in the composer (`<video muted playsInline>` for video, a plain `<img>` for images — blob URLs cannot go through `next/image`).
  - Two non-obvious requirements, do not remove: blob URLs are revoked in a `useEffect` keyed on `media` (the cleanup closes over the *previous* value, freeing each URL exactly once), and `clearMedia` resets `fileInputRef.current.value = ""` — without that, re-picking the *same* file never fires `onChange`.
- **Moderation flow**: clicking publish **never appends to the feed array**. It clears the draft and shows a toast: *"پۆستەکەت نێردرا و دوای پەسەندکردنی لەلایەن ئادمینەوە بڵاودەکرێتەوە."* (auto-dismisses after 3.2s). This is the entire "moderation" behavior — there is no admin queue, review UI, or persistence anywhere.
- **Feed**: exactly 2 hardcoded `MOCK_POSTS`, representing already-approved content. Cards: `bg-slate-50 dark:bg-slate-900` with a `border-slate-200/800` + shadow (needed because the page background is the same `slate-50`).
- **Engagement**:
  - **Like (ڕیاکت)** — real per-post local toggle (`Record<string, boolean>` keyed by post id). Fills the heart, turns `text-blue-600 dark:text-blue-500`, count is `post.likes + (liked ? 1 : 0)`. No backend — resets on reload.
  - **Comment (کۆمێنت)** — toggles an inline thread per post. Three `Record<string, …>` maps keyed by post id: `openComments` (open/closed), `commentDrafts` (controlled input value), `comments` (submitted strings). Submit via the send button or the **Enter** key (`onKeyDown` + `preventDefault`); empty/whitespace is rejected and the button is `disabled`. The displayed count is `post.comments + postComments.length`, so it updates live. Local only — resets on reload.
  - The comment input reuses the `newsComposerPlaceholder` key rather than introducing a dedicated one; add a proper key to all three `TRANSLATIONS` blocks if a distinct placeholder is wanted.
- There is **no** admin-approval info banner on the page — it was deliberately removed once the toast started carrying that message.

### 9.1 Database schema — exists, but the page does not use it yet

`supabase-schema.sql` §9 defines `news_posts`, `news_comments`, `news_likes` and the `news_feed`
view, and `supabase-seed.sql` inserts two posts (one `approved`, one `pending`) plus two comments.
**`app/news/page.tsx` is still entirely mock-backed** — every behaviour described above (2 hardcoded
posts, local like/comment state, publish-shows-a-toast) is unchanged. Wiring it is a separate pass
and will need:

- a `lib/data/news.ts` / `lib/data/news.server.ts` pair, following the same split as stories;
- the composer's publish handler to INSERT (the RLS policy forces `status = 'pending'`, so the
  existing toast copy stays accurate);
- media upload to Supabase Storage — right now `URL.createObjectURL` previews are **local only** and
  nothing is uploaded anywhere;
- auth, since `news_posts`/`news_comments`/`news_likes` all require `auth.uid()` to write. Until
  login exists the page cannot do more than read.
- the seeded rows have `user_id IS NULL` (a fresh project has no `auth.users`), which is why that
  column is nullable — keep it that way so imported/seeded content stays possible.

## 10. Profile Page (`app/profile/page.tsx`)

- Layout: floating iOS-style cards, `rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900`, on a `bg-slate-50 dark:bg-slate-950` page.
- Avatar: solid filled circle, `bg-blue-600 dark:bg-blue-500`, white `User` glyph.
- Settings rows (Language, Notifications, Legal) use plain glyphs — no tinted icon tile behind them, per an explicit design correction away from the original tile treatment.
- **Notifications row** is a real `<button onClick={openNotifications}>` wired to the shared `useNotifications()` context (§4.3) — opens the **same** panel as the header bell. Carries a `bg-rose-500` unread dot matching the header's.
- **Contact social icons — strictly 3, not 5**: Instagram and TikTok were removed. Remaining order in source (`facebook`, `whatsapp`, `viber`) renders under RTL as **Viber (left) / WhatsApp (center) / Facebook (right)** — no manual reordering needed, RTL does it. WhatsApp is sized `h-[4.5rem] w-[4.5rem]` (72px) — exactly 1.5× the `h-12 w-12` (48px) Facebook/Viber buttons. All three use real brand hex colors with a glossy top-highlight overlay and brand-tinted glow shadows, no borders.
- **Auth entry card** (last section on the page) — replaced the old dashed "coming soon" note once `/login` and `/signup` shipped. Reuses `cardClass` with `text-center`: a blue-tinted `LogIn` tile, `authEntryTitle`, `authEntrySubtitle`, then `<AuthEntryLinks />`. See §12.
- Also present, unchanged from earlier work: phone/email contact rows, Working Hours card, Address card, and the FAQ accordion (reusing `components/ui/accordion.tsx`).

## 11. Coding & Maintenance Rules

- **Never remove or alter existing business logic without explicit instruction.** When a task is scoped to "only this file" or "only this component," treat that as a hard boundary — verify with `git diff --stat` after the change.
- **Every `setInterval`/`setTimeout` must be cleaned up** in the owning effect's cleanup function, including on early-return branches (see `Stories.tsx`'s auto-loop and `app/news/page.tsx`'s toast timer for the reference pattern).
- **Every color class needs an explicit `dark:` counterpart**, except where an element is deliberately theme-independent (BottomNav, §4) — and that exception must be a conscious, documented choice, not a gap.
- **RTL is the default assumption.** Use logical properties/utilities (`text-start`, `ps-*`, `end-*`, etc.) over physical ones (`text-right`, `pl-*`, `right-*`) so Arabic/Kurdish (RTL) and English (LTR) both render correctly without per-language overrides.
- When adding any user-facing string, add it to **all three** `TRANSLATIONS` blocks in `lib/i18n.tsx` (§7) in the same change — a partial add breaks the `TranslationKey` union at compile time.
- **`lib/data/providers.ts` and `lib/data/categories.server.ts` are async and `server-only`.** Calling them from a client component is a build error, not a runtime one. Client components use the plain `categories` array from `lib/data/categories.ts` instead.
- **Never let a client-reachable module import `lib/supabase/server.ts` or `lib/supabase/queries.ts`** — directly or transitively. See the boundary note in §8.
- Before claiming a feature is "done" in a commit message, PR, or this file, **verify it against the file**, not against what was requested — requests and final implementations have diverged before. This file has carried at least one outright false claim (the category page's filter pills, §6), so treat unverified statements here with suspicion and correct them when found.

## 12. Auth UI (`/login`, `/signup`)

Built on the helpers in §8.1. **`app/profile/page.tsx` was not touched** — its "coming soon" note
still stands, and nothing links to these routes yet (see the gap noted below).

### Files

| File | Role |
|---|---|
| `app/login/page.tsx`, `app/signup/page.tsx` | Static server shells. Metadata only; they render `AuthPage` and nothing else, which is what keeps both routes `○`. |
| `components/auth/AuthPage.tsx` | `"use client"` boundary. Picks the copy for the mode and composes shell + form. |
| `components/auth/AuthShell.tsx` | Navy brand panel + the floating card that overlaps it + the login⇄signup footer link. |
| `components/auth/AuthForm.tsx` | All four methods, validation, OTP step, Facebook button. |
| `components/auth/authText.ts` | Feature-scoped `ckb`/`ar`/`en` copy. |
| `app/auth/callback/route.ts` | PKCE code → session exchange. |

### Design

Deliberately reuses the Profile page's vocabulary so the two read as one app: `rounded-3xl`,
`border-slate-200` / `dark:border-slate-800`, `bg-white` / `dark:bg-slate-900`, soft shadow.
The brand panel is the same navy as the chrome — `#003B6D` light, `#002240` dark (§3) — and the card
is pulled up over it with `-mt-10`, matching the provider detail page's identity-card overlap.
Facebook's button uses its real brand blue `#1877F2`, per the same rule as the profile socials.

These pages render **inside** the root layout, so `AppHeader` and `BottomNav` are present. That is
intentional (it stays a PWA shell); the shell is sized to `min-h-[calc(100vh-73px-6rem)]` to sit
inside the existing `pt-[73px] pb-24` gutters rather than fight them.

### Behaviour worth knowing

- **Copy lives in `authText.ts`, not `lib/i18n.tsx`.** This follows the existing local-`UI_TEXT`
  precedent (`CategoryPageClient`, `services-section`). ~40 strings used by two routes do not belong
  in the union every component depends on. `satisfies Record<LanguageCode, …>` still makes a missing
  `ar`/`en` key a compile error.
- **Password length and confirmation are validated on signup only.** Enforcing them at login would
  leak the policy and could reject a legitimate older password.
- **Phone signup can return no session**, meaning Supabase wants SMS confirmation — the card then
  switches to an OTP step wired to `verifyPhoneOtp()`. Inert until an SMS provider is configured; the
  form shows a standing note saying exactly that.
- **`isSupabaseConfigured()` is surfaced, not swallowed.** With no credentials the form shows an
  amber notice rather than failing silently — which is the repo's current state.
- **The callback sanitises `next`**: only paths starting with a single `/` are honoured, so
  `?next=//evil.com` cannot turn the route into an open redirect. It also builds its Supabase client
  inline instead of using `getSupabaseServerClient()`, because that helper swallows cookie writes —
  correct in a server component, fatal here where persisting the session is the entire job.

### Entry points

Both are wired, via one shared component — `components/auth/AuthEntryLinks.tsx`:

- **`app/profile/page.tsx`** — the dashed "coming soon" note is **gone**, replaced by a centered
  `cardClass` card (blue-tinted `LogIn` tile, title, subtitle, button pair).
- **`components/layout/MenuSheet.tsx`** — a tinted CTA banner at the **top** of the scrollable
  content, above the page links. Uses the same `from-sky-50 to-blue-50/60` gradient family as the
  NotificationPanel header so it reads as a call-to-action, not another nav row. Passes `onClose`
  as `onNavigate`, matching how the sheet's other links already dismiss it.

`AuthEntryLinks` is deliberately **one** component used in both places — two hand-tuned copies would
drift. Primary `/login` is solid `blue-600`; secondary `/signup` is a `border-2 border-blue-600`
outline. Both `h-12 rounded-2xl`, with the same lift-on-hover as the auth form's submit button.

> Its strings (`authLoginButton`, `authSignupButton`, `authEntryTitle`, `authEntrySubtitle`) live in
> **`lib/i18n.tsx`**, not `authText.ts` — these buttons appear on Profile and MenuSheet, which are
> ordinary app surfaces, so they follow the normal §7 rule. `authText.ts` stays scoped to the two
> auth pages themselves. The now-unused `profileComingSoon` key was removed from all three blocks.
