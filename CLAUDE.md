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
- **Data layer**: Local TypeScript mock data under `lib/data/`. **No Supabase or any backend/database integration exists in this repo today** — see §8.
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
- **Current sizing** (last confirmed state): container `h-11` (44px, `py-0.5`), icon wrapper `h-5 w-9`, icon glyph `h-4 w-4`, label `text-[9px]`.
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

### `components/layout/MenuSheet.tsx`
- The hamburger-triggered slide-in sheet (page links, language switcher, theme toggle, footer info). Still uses the general slate treatment — **not** updated to navy chrome; if the navy header makes it feel visually disconnected, that is a known, un-actioned observation, not a bug.

## 5. Stories Carousel (`components/Stories.tsx`, used inside `components/Hero.tsx`)

- **Data**: `SLIDES` — a local mock array, exactly **6 slides × 3 stories = 18 stories**. Story shape: `{ id, image, providerName, shortInfo, providerId, categoryId }` — deliberately has **no** expiration/scheduling fields (that's the database's job later; a previous version with client-side expiration logic was removed for exactly this reason).
- Slide titles, in fixed order: `ژیانی ڕۆژانەت ئاسانتر بکە`, `باشترین خزمەتگوزارییەکان لێرەن`, `هەر ئێستا پەیوەندی بکە`, `کات و پارەت بپارێزە`, `وەستای شارەزا بدۆزەرەوە`, `هەموو پێداویستییەکان لە یەک جێگادا`.
- **Layout**: outer glass box `rounded-[2rem] border border-white/20 dark:border-white/10 p-4 shadow-lg`, containing a `grid grid-cols-3 gap-3` of `aspect-square rounded-[1.5rem]` squircle thumbnails, a rotating title pill below (`bg-white dark:bg-slate-900 rounded-full px-6 py-2`), and slide-position dots.
- **Container background — current actual state**: `bg-[linear-gradient(135deg,_#cbd5e1_0%,_#9ca3af_50%,_#cbd5e1_100%)]` (a CSS silver gradient), identical in both themes (no `dark:` background override).
  - `[PLANNED — NOT YET IMPLEMENTED]` Replacing this with a real photographic silver-wave texture image (`public/images/silver-waves.jpg`, referenced as `/images/silver-waves.jpg`) plus a dark overlay stacked into the same `backgroundImage` value was decided but **blocked**: the image file does not exist anywhere in `public/`, and it must be added manually (binary files can't be written by the assistant) before this can be implemented.
- **Auto-loop**: `setInterval` every `SLIDE_INTERVAL_MS = 3000`ms, advances via a functional `setCurrentSlide` updater (keeps the interval stable, never recreated mid-cycle). The effect's cleanup always calls `clearInterval` — both on pause and on unmount, so there is no leak.
- **Pause/resume**: clicking a story sets `isPaused = true` (which tears the interval down completely, not just skips a tick) and opens the fullscreen modal. Closing (X, backdrop click, or `Escape`) sets `isPaused = false`, which builds a **fresh** interval — the current slide always gets a full 3s, never a partial "resume" of elapsed time.
- **Fullscreen story modal**: a **centered popup**, not full-bleed — `fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-10`, with the actual card at `relative w-full max-w-md h-[85vh] rounded-3xl overflow-hidden`. Uses `z-[100]`, not `z-50` — both `AppHeader` and `BottomNav` are `z-50`, and `BottomNav` is a later DOM sibling, so a `z-50` modal would render underneath the bottom nav.
- Modal body-scroll-locks while open (restores previous `overflow` on close) and closes on `Escape`.
- Modal CTA (`بینینی هەژمار`) routes to `/services/[categoryId]/[providerId]` — see §6.

## 6. Routing Map

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero (incl. Stories) + `ServicesSection`. No Working Hours/FAQ/description text — trimmed in an earlier pass. |
| `/about` | `app/about/page.tsx` | `AboutSection` + `PlacesGrid` (tourism/history cards) — moved here from the home page. |
| `/places/[id]` | `app/places/[id]/page.tsx` | Tourism/history detail. Its back button (`گەڕانەوە`) is a **hardcoded** `<Link href="/about">` — not `router.back()` (there is no `useRouter` call anywhere in this codebase). This was fixed after the link had gone stale from pointing at `/`. |
| `/news` | `app/news/page.tsx` | See §9. |
| `/favorites` | `app/favorites/page.tsx` | Category favorites, `localStorage`-backed. |
| `/profile` | `app/profile/page.tsx` | See §10. |
| `/legal` | `app/legal/page.tsx` | Terms & privacy, static content. |
| `/services/[category]` | `app/services/[category]/page.tsx` | Category listing. 2-column grid (`grid-cols-2 gap-3 sm:gap-4`). 3 hardcoded filter pills: هەمووی (All) / پڕداواکاریترین (Most Requested) / تایبەت (Special) — **not** dynamically generated from category filter data. |
| `/services/[category]/[providerId]` | `app/services/[category]/[providerId]/page.tsx` | Server component, Next 16 async `params`. Looks up via `getProviderById` (`lib/data/providers.ts`). If not found, renders a friendly "not available yet" placeholder with a back link — **not** `notFound()`, because most mock `providerId`s in `Stories.tsx` don't resolve to real seeded data yet (only `lib/data/services/restaurants.ts` has a real entry: `restaurant-bazian-cafe`). |

Note: the 2-column grid + 3-pill filter pattern above also applies to the **home page's `ServicesSection`** (`components/services-section.tsx`), which is a separate component from the category listing page and has its own copy of the same 3-pill pattern.

## 7. Internationalization (`lib/i18n.tsx`)

- `LanguageProvider` exposes `{ language, setLanguage, t, direction }`. `t(key)` looks up `TranslationKey` (a union derived from the `ckb` block's keys) in `TRANSLATIONS[language]`.
- **Every translation key must exist in all three language blocks (`ckb`, `ar`, `en`)** or the type-level union breaks the build. When adding a new UI string, add it to all three, even if `en`/`ar` are placeholder-quality.
- Default language `ckb`, persisted to `localStorage` (`bazian-language`), with a browser-language fallback for first-time visitors (`ar`/`en` prefixes only; everything else defaults to `ckb`).
- Mock/demo data strings (FAQ items, story provider names, news post bodies) are **Kurdish-only by established convention** — not run through `t()`. This is intentional, not an oversight.

## 8. Data Layer & Supabase — **NOT YET INTEGRATED**

- `[PLANNED — NOT YET IMPLEMENTED]` There is **no `lib/supabase/` directory, no `client.ts`, no `api.ts`, no `supabase-schema.sql`, no `supabase-seed.sql`, and no `@supabase/*` package dependency** anywhere in this repository as of this writing. Any reference to Supabase in code comments (e.g. in `Stories.tsx`, `ProviderCard.tsx`) is forward-looking documentation of intent, not a working integration.
- Current data lives entirely in `lib/data/`:
  - `categories.ts` — 10 service categories (vehicles, restaurants, shopping, health, mobile, beauty, real-estate, institutes, workers, jobs), each with localized titles and an optional `filters` list.
  - `services/*.ts` — one file per category, typed as `Provider[]` (`lib/types/provider.ts`). **Only `restaurants.ts` has real seeded data** (a single provider, `restaurant-bazian-cafe`); the other nine files are empty arrays.
  - `providers.ts` — the intended integration seam: `getProviderById`, `getProvidersByCategory`, `getAllProviders`, backed by a small in-memory registry keyed by category slug. This is the **one place** to swap in a real database call later.
  - `places.ts`, `faqs.ts` — static mock content for the tourism grid and FAQ accordion.
- **Do not fabricate Supabase file paths or schema in code or docs** until they actually exist. When Supabase integration begins, update this section to describe the real files.

## 9. News Feed (`app/news/page.tsx`)

- **Composer**: real controlled `<textarea>` (not a fake button), an `ImagePlus` attach button, and a `بڵاوکردنەوە` publish button (`disabled` while the draft is empty).
  - `[PLANNED — NOT YET IMPLEMENTED]` The attach button is currently a **styled no-op** — there is no `<input type="file">`, no gallery picker, and no image/video preview thumbnail wired up.
- **Moderation flow**: clicking publish **never appends to the feed array**. It clears the draft and shows a toast: *"پۆستەکەت نێردرا و دوای پەسەندکردنی لەلایەن ئادمینەوە بڵاودەکرێتەوە."* (auto-dismisses after 3.2s). This is the entire "moderation" behavior — there is no admin queue, review UI, or persistence anywhere.
- **Feed**: exactly 2 hardcoded `MOCK_POSTS`, representing already-approved content. Cards: `bg-slate-50 dark:bg-slate-900` with a `border-slate-200/800` + shadow (needed because the page background is the same `slate-50`).
- **Engagement**:
  - **Like (ڕیاکت)** — real per-post local toggle (`Record<string, boolean>` keyed by post id). Fills the heart, turns `text-blue-600 dark:text-blue-500`, count is `post.likes + (liked ? 1 : 0)`. No backend — resets on reload.
  - **Comment (کۆمێنت)** — `[PLANNED — NOT YET IMPLEMENTED]` styled identically to Like but **fully inert** — no inline input, no thread, no state. This was an explicit, confirmed decision, not an oversight.
- There is **no** admin-approval info banner on the page — it was deliberately removed once the toast started carrying that message.

## 10. Profile Page (`app/profile/page.tsx`)

- Layout: floating iOS-style cards, `rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900`, on a `bg-slate-50 dark:bg-slate-950` page.
- Avatar: solid filled circle, `bg-blue-600 dark:bg-blue-500`, white `User` glyph.
- Settings rows (Language, Notifications, Legal) use plain glyphs — no tinted icon tile behind them, per an explicit design correction away from the original tile treatment.
- **Notifications row** is a real `<button onClick={openNotifications}>` wired to the shared `useNotifications()` context (§4.3) — opens the **same** panel as the header bell. Carries a `bg-rose-500` unread dot matching the header's.
- **Contact social icons — strictly 3, not 5**: Instagram and TikTok were removed. Remaining order in source (`facebook`, `whatsapp`, `viber`) renders under RTL as **Viber (left) / WhatsApp (center) / Facebook (right)** — no manual reordering needed, RTL does it. WhatsApp is sized `h-[4.5rem] w-[4.5rem]` (72px) — exactly 1.5× the `h-12 w-12` (48px) Facebook/Viber buttons. All three use real brand hex colors with a glossy top-highlight overlay and brand-tinted glow shadows, no borders.
- Also present, unchanged from earlier work: phone/email contact rows, Working Hours card, Address card, FAQ accordion (reusing `components/ui/accordion.tsx`), and a "coming soon" note for account features.

## 11. Coding & Maintenance Rules

- **Never remove or alter existing business logic without explicit instruction.** When a task is scoped to "only this file" or "only this component," treat that as a hard boundary — verify with `git diff --stat` after the change.
- **Every `setInterval`/`setTimeout` must be cleaned up** in the owning effect's cleanup function, including on early-return branches (see `Stories.tsx`'s auto-loop and `app/news/page.tsx`'s toast timer for the reference pattern).
- **Every color class needs an explicit `dark:` counterpart**, except where an element is deliberately theme-independent (BottomNav, §4) — and that exception must be a conscious, documented choice, not a gap.
- **RTL is the default assumption.** Use logical properties/utilities (`text-start`, `ps-*`, `end-*`, etc.) over physical ones (`text-right`, `pl-*`, `right-*`) so Arabic/Kurdish (RTL) and English (LTR) both render correctly without per-language overrides.
- When adding any user-facing string, add it to **all three** `TRANSLATIONS` blocks in `lib/i18n.tsx` (§7) in the same change — a partial add breaks the `TranslationKey` union at compile time.
- Before claiming a feature is "done" in a commit message, PR, or this file, **verify it against the file**, not against what was requested — requests and final implementations have diverged before (see the `[PLANNED]` markers above).
