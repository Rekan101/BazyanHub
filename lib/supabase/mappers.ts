// lib/supabase/mappers.ts

import type {
  Provider,
  ProviderHours,
  ProviderSocials,
} from "@/lib/types/provider";
import type {
  ServiceCategory,
  ServiceFilter,
} from "@/lib/data/categories";
import type { Slide } from "@/lib/data/stories";
import type { AppNotification } from "@/lib/data/notifications";
import {
  getAuthorInitials,
  type FeedPost,
} from "@/lib/data/news";
import type {
  CategoryRow,
  FilterRow,
  NewsFeedRow,
  NotificationRow,
  ProviderHoursRow,
  ProviderRowWithRelations,
  StorySlideRowWithStories,
} from "@/lib/supabase/types";

/*
|--------------------------------------------------------------------------
| Row -> app model mappers
|--------------------------------------------------------------------------
|
| This is where the database shape becomes the shape the existing components
| already render. Nothing downstream of these functions knows Supabase
| exists - ProviderCard, ProviderModal and the detail page keep receiving the
| exact same Provider objects they get from the mock data today.
|
| That is what makes the "golden rule" hold: dynamically fetched providers
| render through the identical card component, because they are the identical
| type.
|
*/

/*
 * Index 0 = Sunday, matching JS Date.getDay() and the day_of_week CHECK in
 * supabase-schema.sql. Must stay byte-identical to KURDISH_WEEKDAYS in
 * components/providers/ProviderCard.tsx - the open/closed badge matches these
 * strings exactly, and a mismatch silently reads as "closed".
 */
const KURDISH_WEEKDAYS = [
  "یەکشەممە",
  "دووشەممە",
  "سێشەممە",
  "چوارشەممە",
  "پێنجشەممە",
  "هەینی",
  "شەممە",
] as const;

/*
 * Postgres `time` columns come back as "HH:MM:SS" (sometimes with a
 * fractional part), but ProviderCard's parseTimeToMinutes() only accepts
 * "H:MM"/"HH:MM". Without this truncation every provider would silently
 * render as closed.
 */
function toHoursMinutes(
  value: string | null
): string | undefined {
  if (!value) {
    return undefined;
  }

  const match = value.match(
    /^(\d{1,2}):(\d{2})/
  );

  if (!match) {
    return undefined;
  }

  return `${match[1]}:${match[2]}`;
}

export function mapHoursRows(
  rows: ProviderHoursRow[] | null | undefined
): ProviderHours[] | undefined {
  if (!rows || rows.length === 0) {
    return undefined;
  }

  return [...rows]
    .sort(
      (a, b) =>
        a.day_of_week - b.day_of_week
    )
    .map((row) => ({
      day:
        KURDISH_WEEKDAYS[row.day_of_week] ??
        String(row.day_of_week),
      open: toHoursMinutes(row.open_time),
      close: toHoursMinutes(row.close_time),
      closed: row.is_closed,
    }));
}

const SOCIAL_PLATFORMS = [
  "whatsapp",
  "instagram",
  "facebook",
  "tiktok",
  "viber",
] as const;

export function mapSocials(
  socials: Record<string, unknown> | null | undefined
): ProviderSocials | undefined {
  if (!socials || typeof socials !== "object") {
    return undefined;
  }

  const result: ProviderSocials = {};

  for (const platform of SOCIAL_PLATFORMS) {
    const value = socials[platform];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      result[platform] = value.trim();
    }
  }

  return Object.keys(result).length > 0
    ? result
    : undefined;
}

function orUndefined(
  value: string | null | undefined
): string | undefined {
  return value ?? undefined;
}

export function mapProviderRow(
  row: ProviderRowWithRelations
): Provider {
  const categoryLabel =
    row.categories?.name_ckb ??
    row.categories?.slug ??
    "";

  return {
    /*
     * The public id is the slug when one exists. Routes like
     * /services/restaurants/restaurant-bazian-cafe are already built on the
     * slug, and keeping that stable means existing links survive the move to
     * Supabase. Falls back to the uuid for rows with no slug.
     */
    id: row.slug ?? row.id,

    name: row.name,
    slug: orUndefined(row.slug),
    description: orUndefined(row.description),

    category: categoryLabel,
    subcategory: orUndefined(row.subcategory),

    logo: orUndefined(row.logo_url),

    // ProviderCard falls back to initials when there is no cover; prefer the
    // logo over nothing so a card with only a logo still shows an image.
    coverImage:
      row.cover_image_url ??
      row.logo_url ??
      undefined,

    phone: orUndefined(row.phone),
    secondaryPhone: orUndefined(row.secondary_phone),
    email: orUndefined(row.email),
    website: orUndefined(row.website),

    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),

    verified: Boolean(row.is_verified),
    featured: Boolean(row.is_featured),
    special: Boolean(row.is_special),
    active: Boolean(row.is_active),

    priceRange: row.price_range ?? undefined,

    location: {
      address: orUndefined(row.address),
      city: orUndefined(row.city),
      latitude: row.latitude ?? undefined,
      longitude: row.longitude ?? undefined,
      googleMapsUrl: orUndefined(row.google_maps_url),
    },

    hours: mapHoursRows(row.provider_hours),
    socials: mapSocials(row.socials),

    tags: row.tags ?? [],
    services: row.services ?? [],

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapFilterRow(
  row: FilterRow
): ServiceFilter {
  return {
    id: row.slug,
    label: row.label_ckb,
    translations: {
      ckb: row.label_ckb,
      ar: row.label_ar ?? row.label_ckb,
      en: row.label_en ?? row.label_ckb,
    },
  };
}

export type CategoryRowWithFilters =
  CategoryRow & {
    filters?: FilterRow[] | null;
  };

export function mapCategoryRow(
  row: CategoryRowWithFilters
): ServiceCategory {
  return {
    id: row.slug,
    title: row.name_ckb,

    translations: {
      ckb: row.name_ckb,
      ar: row.name_ar ?? row.name_ckb,
      en: row.name_en ?? row.name_ckb,
    },

    descriptions: row.description_ckb
      ? {
          ckb: row.description_ckb,
          ar:
            row.description_ar ??
            row.description_ckb,
          en:
            row.description_en ??
            row.description_ckb,
        }
      : undefined,

    icon: row.icon ?? "",
    imageSrc: row.image_url ?? "",

    filters: (row.filters ?? [])
      .filter((filter) => filter.is_active)
      .sort(
        (a, b) =>
          a.sort_order - b.sort_order
      )
      .map(mapFilterRow),

    popular: row.is_popular,
    featured: row.is_featured,
  };
}

/*
|--------------------------------------------------------------------------
| Stories
|--------------------------------------------------------------------------
|
| Produces the exact Slide/Story types that components/Stories.tsx already
| renders (defined in lib/data/stories.ts), so a database-backed slide and a
| mock slide are indistinguishable to the carousel.
|
*/

export function mapStorySlideRow(
  row: StorySlideRowWithStories,
  categorySlugById: Map<string, string>
): Slide {
  const stories = (row.stories ?? [])
    .filter(
      (story) =>
        story.is_active &&
        (!story.expires_at ||
          new Date(story.expires_at) > new Date())
    )
    .sort(
      (a, b) => a.position - b.position
    )
    .map((story) => ({
      id: story.id,
      image: story.image_url,

      providerName:
        story.provider_name ??
        story.providers?.name ??
        "",

      shortInfo: story.short_info ?? "",

      /*
       * Both may be "" when a story has no linked provider - stories.provider_id
       * is nullable, and ON DELETE SET NULL leaves the story standing after its
       * business is removed. Stories.tsx checks for that and hides the CTA
       * rather than emitting a broken /services// link.
       */
      providerId:
        story.providers?.slug ??
        story.provider_id ??
        "",

      categoryId:
        (story.providers?.category_id &&
          categorySlugById.get(
            story.providers.category_id
          )) ??
        "",
    }));

  return {
    id: row.id,
    title: row.title_ckb,
    stories,
  };
}

/*
|--------------------------------------------------------------------------
| News feed
|--------------------------------------------------------------------------
*/

/*
 * Relative time, formatted in the reader's language. The mock posts carry a
 * pre-written Kurdish string instead; real rows get this.
 */
function formatRelativeTime(
  iso: string,
  language: "ckb" | "ar" | "en"
): string {
  const then = new Date(iso).getTime();

  if (Number.isNaN(then)) {
    return "";
  }

  const diffSeconds = Math.round(
    (then - Date.now()) / 1000
  );

  const units: Array<
    [Intl.RelativeTimeFormatUnit, number]
  > = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  /*
   * Intl has no "ckb" relative-time data in most runtimes; "ar" is the
   * closest script/plural match and degrades gracefully.
   */
  const locale =
    language === "en"
      ? "en"
      : language === "ar"
        ? "ar"
        : "ckb";

  const formatter =
    new Intl.RelativeTimeFormat(
      [locale, "ar", "en"],
      { numeric: "auto" }
    );

  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) {
      return formatter.format(
        Math.round(diffSeconds / seconds),
        unit
      );
    }
  }

  return formatter.format(
    diffSeconds,
    "second"
  );
}

export function mapNewsFeedRow(
  row: NewsFeedRow,
  language: "ckb" | "ar" | "en" = "ckb"
): FeedPost {
  const author =
    row.author_name?.trim() || "—";

  return {
    id: row.id,
    author,
    authorInitials: getAuthorInitials(author),

    /*
     * No verified flag on news_posts. Admin-authored posts are the only
     * thing that would earn the badge, and that is not modelled yet, so it
     * is deliberately always false rather than faked.
     */
    verified: false,

    time: formatRelativeTime(
      row.created_at,
      language
    ),
    createdAt: row.created_at,

    body: row.text_content ?? "",
    image: row.media_url,
    mediaType: row.media_type,

    totalReactions: Number(
      row.total_reactions ?? 0
    ),

    topReactionTypes:
      row.top_reaction_types ?? [],
  };
}

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

export function mapNotificationRow(
  row: NotificationRow,
  language: "ckb" | "ar" | "en"
): AppNotification {
  const title =
    language === "ar"
      ? (row.title_ar ?? row.title_ckb)
      : language === "en"
        ? (row.title_en ?? row.title_ckb)
        : row.title_ckb;

  const body =
    language === "ar"
      ? (row.body_ar ?? row.body_ckb)
      : language === "en"
        ? (row.body_en ?? row.body_ckb)
        : row.body_ckb;

  return {
    id: row.id,
    title,
    body: body ?? "",
    icon: row.icon,
    linkUrl: row.link_url,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}
