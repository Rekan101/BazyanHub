// lib/data/news.ts

import type { NewsReactionType } from "@/lib/supabase/types";
import type { TranslationKey } from "@/lib/i18n";

/*
|--------------------------------------------------------------------------
| News feed types, reaction config, mock fallback
|--------------------------------------------------------------------------
|
| KEEP THIS MODULE CLIENT-SAFE. It is imported by the news client component.
| Nothing here may reach lib/supabase/server.ts, lib/supabase/public.ts or
| lib/supabase/queries.ts — all three are `server-only`.
|
| The Supabase-backed lookup lives in lib/data/news.server.ts.
|
| *** Comments do not exist. *** They were removed from the product; there is
| no comment type, no comment count, and no news_comments table. Do not add
| one back on this side without the schema agreeing.
|
*/

export type { NewsReactionType };

export type FeedPost = {
  id: string;
  author: string;
  authorInitials: string;
  verified: boolean;

  /* Pre-formatted for display. Real rows carry an ISO createdAt too. */
  time: string;
  createdAt: string | null;

  body: string;
  image: string | null;
  mediaType: "image" | "video" | null;

  /* Aggregates from the news_feed view. */
  totalReactions: number;

  /*
   * Distinct reaction types this post received, most-used first. Drives the
   * overlapping icon cluster; the UI shows the first few.
   */
  topReactionTypes: NewsReactionType[];
};

/*
|--------------------------------------------------------------------------
| Reactions
|--------------------------------------------------------------------------
|
| Strictly six, matching the news_reaction_type enum — five from
| supabase-schema.sql plus 'wow' from supabase-migration-02-news.sql, in the
| same order the picker renders them.
|
| Adding one here without adding it there (or vice versa) breaks the round
| trip — the DB would reject the write, or the UI would receive a type it
| cannot render.
|
*/

export type ReactionConfig = {
  type: NewsReactionType;
  emoji: string;
  labelKey: TranslationKey;

  /* Tint applied to the action button once this reaction is chosen. */
  activeClass: string;
};

export const REACTIONS: ReactionConfig[] = [
  {
    type: "like",
    emoji: "👍",
    labelKey: "reactionLike",
    activeClass:
      "text-blue-600 dark:text-blue-500",
  },
  {
    type: "love",
    emoji: "❤️",
    labelKey: "reactionLove",
    activeClass:
      "text-rose-600 dark:text-rose-400",
  },
  {
    type: "haha",
    emoji: "😂",
    labelKey: "reactionHaha",
    activeClass:
      "text-amber-600 dark:text-amber-400",
  },
  {
    type: "wow",
    emoji: "😮",
    labelKey: "reactionWow",
    activeClass:
      "text-amber-600 dark:text-amber-400",
  },
  {
    type: "sad",
    emoji: "😢",
    labelKey: "reactionSad",
    activeClass:
      "text-amber-600 dark:text-amber-400",
  },
  {
    type: "angry",
    emoji: "😡",
    labelKey: "reactionAngry",
    activeClass:
      "text-orange-600 dark:text-orange-400",
  },
];

const REACTION_BY_TYPE = new Map(
  REACTIONS.map((item) => [item.type, item])
);

export function getReaction(
  type: NewsReactionType | null | undefined
): ReactionConfig | null {
  if (!type) {
    return null;
  }

  return REACTION_BY_TYPE.get(type) ?? null;
}

/* The reaction a bare tap on the action button applies. */
export const DEFAULT_REACTION: NewsReactionType =
  "like";

/*
|--------------------------------------------------------------------------
| Mock fallback
|--------------------------------------------------------------------------
|
| Served whenever the database is unconfigured, unreachable, or has no
| approved posts — the same contract as stories/providers/categories. These
| represent already-approved content; a new submission never lands here,
| it goes to the moderation queue as `pending`.
|
*/

export const MOCK_POSTS: FeedPost[] = [
  {
    id: "post-1",
    author: "ئیدارەی بازیان هەب",
    authorInitials: "بھ",
    verified: true,
    time: "٢ کاتژمێر لەمەوپێش",
    createdAt: null,
    body: "ڕێگای بازیان پاش چاککردنەوە کرایەوە بۆ هاتوچۆ. تکایە ئاگاداری هێمای ڕێگا و خێرایی بن لە کاتی تێپەڕبوون. 🚗",
    image: "/images/bazian-pass.webp",
    mediaType: "image",
    totalReactions: 128,
    topReactionTypes: ["like", "love", "haha"],
  },

  {
    id: "post-2",
    author: "هەلی کاری بازیان",
    authorInitials: "هک",
    verified: false,
    time: "دوێنێ",
    createdAt: null,
    body: "چەند هەلێکی کاری نوێ لە بازیان زیادکران: فرۆشیار، وەستای کارەبا و شۆفێری پیکاپ. بۆ زانیاری زیاتر پەیوەندی بە ژمارەی ناو پۆستەکە بکە. 💼",
    image: "/images/jobs.webp",
    mediaType: "image",
    totalReactions: 76,
    topReactionTypes: ["love", "like"],
  },
];

/*
 * Initials for the avatar bubble, from a display name. Two "words" max,
 * which suits both Kurdish names and a single-word org name.
 */
export function getAuthorInitials(
  name: string
): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .slice(0, 2);

  return (
    parts
      .map((part) => part.charAt(0))
      .join("") || "؟"
  );
}
