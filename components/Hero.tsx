"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Heart,
  ListChecks,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import type { QuickAction } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

/* ==========================================================================
   QUICK ACTION ICONS
   ========================================================================== */

const QUICK_ACTION_ICON = {
  map: Map,
  favorites: Heart,
  list: ListChecks,
  outage: ListChecks,
} as const;

/* ==========================================================================
   STORY TYPES
   ========================================================================== */

type StoryDuration =
  | {
      amount: number;
      unit: "hours";
    }
  | {
      amount: number;
      unit: "days";
    }
  | {
      amount: number;
      unit: "months";
    };

type StoryItem = {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  createdAt: string;
  duration: StoryDuration;

  /**
   * How many seconds this story remains visible.
   * Example: 3 = move to the next story after 3 seconds.
   */
  durationSeconds: number;

  /**
   * External URL opened when the user clicks the story.
   */
  href: string;
};

/* ==========================================================================
   STORY CONFIGURATION

   Image location:
   /public/images/stories/

   Recommended image ratio:
   4:5

   Maximum supported stories:
   10
   ========================================================================== */

const STORY_ITEMS: StoryItem[] = [
  {
    id: "story-1",
    image: "/images/stories/story-1.webp",
    title: "ڕیکلامی تایبەت",
    subtitle: "خزمەتگوزارییە نوێکان لە بازیان",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 24,
      unit: "hours",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-2",
    image: "/images/stories/story-2.webp",
    title: "ئۆفەری تایبەت",
    subtitle: "تەنها بۆ ماوەی کەم",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 7,
      unit: "days",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-3",
    image: "/images/stories/story-3.webp",
    title: "خزمەتگوزاریی نوێ",
    subtitle: "لە بازیان بیدۆزەرەوە",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 30,
      unit: "days",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-4",
    image: "/images/stories/story-4.webp",
    title: "ڕیکلام",
    subtitle: "شوێن و کاروبارەکانی ناوچە",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 24,
      unit: "hours",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-5",
    image: "/images/stories/story-5.webp",
    title: "ناونیشانی ڕیکلام",
    subtitle: "وردەکاری",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 1,
      unit: "months",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-6",
    image: "/images/stories/story-6.webp",
    title: "ناونیشانی ڕیکلام",
    subtitle: "وردەکاری",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 1,
      unit: "months",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-7",
    image: "/images/stories/story-7.webp",
    title: "ناونیشانی ڕیکلام",
    subtitle: "وردەکاری",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 1,
      unit: "months",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-8",
    image: "/images/stories/story-8.webp",
    title: "ناونیشانی ڕیکلام",
    subtitle: "وردەکاری",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 1,
      unit: "months",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-9",
    image: "/images/stories/story-9.webp",
    title: "ناونیشانی ڕیکلام",
    subtitle: "وردەکاری",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 1,
      unit: "months",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },

  {
    id: "story-10",
    image: "/images/stories/story-10.webp",
    title: "ناونیشانی ڕیکلام",
    subtitle: "وردەکاری",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 1,
      unit: "months",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },
];

/* ==========================================================================
   STORY HELPERS
   ========================================================================== */

function getExpirationTime(story: StoryItem): number {
  const createdAt = new Date(story.createdAt).getTime();

  if (Number.isNaN(createdAt)) {
    return 0;
  }

  if (story.duration.unit === "hours") {
    return (
      createdAt +
      story.duration.amount * 60 * 60 * 1000
    );
  }

  if (story.duration.unit === "days") {
    return (
      createdAt +
      story.duration.amount * 24 * 60 * 60 * 1000
    );
  }

  const expiration = new Date(story.createdAt);

  expiration.setMonth(
    expiration.getMonth() + story.duration.amount
  );

  return expiration.getTime();
}

function getRemainingStories(
  stories: StoryItem[],
  now: number
): StoryItem[] {
  return stories
    .slice(0, 10)
    .filter(
      (story) => getExpirationTime(story) > now
    );
}

/* ==========================================================================
   HERO
   ========================================================================== */

export default function Hero() {
  const { language, t } = useLanguage();

  /* ------------------------------------------------------------------------
     Current time
     ------------------------------------------------------------------------ */

  const [now, setNow] = useState<number>(() =>
    Date.now()
  );

  /* ------------------------------------------------------------------------
     Current Story Index
     ------------------------------------------------------------------------ */

  const [activeStoryIndex, setActiveStoryIndex] =
    useState(0);

  /* ------------------------------------------------------------------------
     Update current time every minute
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60 * 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /* ------------------------------------------------------------------------
     Active stories only
     ------------------------------------------------------------------------ */

  const activeStories = useMemo(
    () => getRemainingStories(STORY_ITEMS, now),
    [now]
  );

  /* ------------------------------------------------------------------------
     Keep current index valid
     ------------------------------------------------------------------------ */

  useEffect(() => {
    if (activeStories.length === 0) {
      setActiveStoryIndex(0);
      return;
    }

    if (
      activeStoryIndex >= activeStories.length
    ) {
      setActiveStoryIndex(0);
    }
  }, [
    activeStoryIndex,
    activeStories.length,
  ]);

  /* ------------------------------------------------------------------------
     AUTO STORY LOOP

     1 → 2 → 3 → ... → 10 → 1 → 2 → ...
     ------------------------------------------------------------------------ */

  useEffect(() => {
    if (activeStories.length <= 1) {
      return;
    }

    const currentStory =
      activeStories[activeStoryIndex];

    if (!currentStory) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setActiveStoryIndex(
        (currentIndex) =>
          (currentIndex + 1) %
          activeStories.length
      );
    }, currentStory.durationSeconds * 1000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    activeStoryIndex,
    activeStories,
  ]);

  /* ------------------------------------------------------------------------
     Quick actions
     ------------------------------------------------------------------------ */

  const translatedActions: QuickAction[] = [
    {
      label: t("map"),
      href:
        "https://www.google.com/maps/search/?api=1&query=35.5947,45.13686",
      icon: "map",
    },
    {
      label: t("favorites"),
      href: "/favorites",
      icon: "favorites",
    },
    {
      label: t("servicesList"),
      href: "#services",
      icon: "list",
    },
  ];

  /* ------------------------------------------------------------------------
     RTL
     ------------------------------------------------------------------------ */

  const isRTL = language !== "en";

  /* ------------------------------------------------------------------------
     Current story
     ------------------------------------------------------------------------ */

  const currentStory =
    activeStories[activeStoryIndex] ?? null;

  return (
    <section
      dir={
        language === "en"
          ? "ltr"
          : "rtl"
      }
      className="
        relative
        min-h-[620px]
        overflow-hidden
      "
    >
      {/* ====================================================================
          BACKGROUND
          ==================================================================== */}

      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="
          object-cover
          object-[center_35%]
          sm:object-top
        "
      />

      {/* ====================================================================
          DARK OVERLAY
          ==================================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-black/50
          to-black/20
        "
      />

      {/* ====================================================================
          GREEN LIGHT EFFECT
          ==================================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-gradient-to-l
          from-[#16A34A]/25
          via-transparent
          to-transparent
        "
      />

      {/* ====================================================================
          HERO CONTENT
          ==================================================================== */}

      <div
        className="
          relative
          mx-auto
          flex
          w-full
          max-w-[1440px]
          px-4
          pb-14
          pt-20
          sm:px-6
          sm:pt-24
          lg:px-10
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-3xl
            text-center
          "
        >
          {/* ==================================================================
              STORIES
              ================================================================== */}

          {currentStory && (
            <motion.div
              initial={{
                opacity: 0,
                y: -16,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
              className="
                mx-auto
                mb-6
                w-full
              "
            >
              {/* ================================================================
                  STORY HEADER
                  ================================================================ */}

              <div
                className="
                  mb-2.5
                  flex
                  items-center
                  justify-between
                  px-1
                "
              >
                <div
                  className={`
                    flex
                    items-center
                    gap-2
                    text-white/90
                    ${isRTL ? "flex-row-reverse" : ""}
                  `}
                >
                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-[#34d399]
                      shadow-[0_0_14px_rgba(52,211,153,0.9)]
                    "
                  />

                  <span
                    className="
                      text-xs
                      font-bold
                      sm:text-sm
                    "
                  >
                    ستۆری و ڕیکلام
                  </span>
                </div>

                <span
                  className="
                    rounded-full
                    border
                    border-white/15
                    bg-black/25
                    px-2.5
                    py-1
                    text-[10px]
                    font-semibold
                    text-white/75
                    backdrop-blur-xl
                  "
                >
                  {activeStoryIndex + 1}/
                  {activeStories.length}
                </span>
              </div>

              {/* ================================================================
                  SINGLE COMPACT STORY

                  4:5 ratio:
                  - not too wide
                  - not tall like 9:16
                  - slightly taller than wide
                  ================================================================ */}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStory.id}
                  initial={{
                    opacity: 0,
                    scale: 0.97,
                    y: 6,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.01,
                    y: -6,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  className="
                    mx-auto
                    w-full
                    max-w-[270px]
                    sm:max-w-[285px]
                    md:max-w-[300px]
                  "
                >
                  <a
                    href={currentStory.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`کردنەوەی ${currentStory.title}`}
                    className="
                      group
                      relative
                      block
                      aspect-[4/5]
                      w-full
                      overflow-hidden
                      rounded-[1.5rem]
                      border
                      border-white/25
                      bg-white/10
                      shadow-2xl
                      shadow-black/40
                      outline-none
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-white/45
                      hover:shadow-black/55
                      focus-visible:ring-2
                      focus-visible:ring-[#34d399]
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-transparent
                      sm:rounded-[1.65rem]
                    "
                  >
                    {/* ==========================================================
                        STORY IMAGE
                        ========================================================== */}

                    <Image
                      src={currentStory.image}
                      alt={currentStory.title}
                      fill
                      priority
                      sizes="
                        (max-width: 640px) 270px,
                        (max-width: 768px) 285px,
                        300px
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.035]
                      "
                    />

                    {/* ==========================================================
                        IMAGE OVERLAY
                        ========================================================== */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/85
                        via-black/10
                        to-black/15
                      "
                    />

                    {/* ==========================================================
                        TOP SOFT GRADIENT
                        ========================================================== */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-x-0
                        top-0
                        h-24
                        bg-gradient-to-b
                        from-black/35
                        to-transparent
                      "
                    />

                    {/* ==========================================================
                        EXTERNAL LINK ICON
                        ========================================================== */}

                    <div
                      className="
                        absolute
                        left-3
                        top-3
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/20
                        bg-black/25
                        text-white
                        shadow-lg
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        group-hover:scale-105
                        group-hover:bg-black/40
                      "
                    >
                      <ExternalLink
                        aria-hidden="true"
                        className="h-4 w-4"
                        strokeWidth={2}
                      />
                    </div>

                    {/* ==========================================================
                        STORY CONTENT
                        ========================================================== */}

                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        p-4
                        text-right
                        sm:p-5
                      "
                    >
                      <p
                        className="
                          text-lg
                          font-extrabold
                          leading-tight
                          text-white
                          drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]
                          sm:text-xl
                        "
                      >
                        {currentStory.title}
                      </p>

                      {currentStory.subtitle && (
                        <p
                          className="
                            mt-1
                            line-clamp-2
                            text-xs
                            font-medium
                            leading-relaxed
                            text-white/80
                            drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]
                            sm:text-sm
                          "
                        >
                          {currentStory.subtitle}
                        </p>
                      )}
                    </div>

                    {/* ==========================================================
                        HOVER SHINE
                        ========================================================== */}

                    <div
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        translate-x-[-120%]
                        bg-gradient-to-r
                        from-transparent
                        via-white/10
                        to-transparent
                        transition-transform
                        duration-700
                        group-hover:translate-x-[120%]
                      "
                    />
                  </a>
                </motion.div>
              </AnimatePresence>

              {/* ================================================================
                  PROGRESS BAR
                  ================================================================ */}

              <div
                className="
                  mx-auto
                  mt-2.5
                  flex
                  w-full
                  max-w-[270px]
                  gap-1
                  px-1
                  sm:max-w-[285px]
                  md:max-w-[300px]
                "
                aria-hidden="true"
              >
                {activeStories.map((story, index) => {
                  const isPast =
                    index < activeStoryIndex;

                  const isCurrent =
                    index === activeStoryIndex;

                  return (
                    <div
                      key={story.id}
                      className="
                        relative
                        h-1
                        flex-1
                        overflow-hidden
                        rounded-full
                        bg-white/20
                      "
                    >
                      {isPast && (
                        <div
                          className="
                            absolute
                            inset-0
                            rounded-full
                            bg-white/90
                          "
                        />
                      )}

                      {isCurrent && (
                        <motion.div
                          key={currentStory.id}
                          initial={{
                            width: "0%",
                          }}
                          animate={{
                            width: "100%",
                          }}
                          transition={{
                            duration:
                              currentStory.durationSeconds,
                            ease: "linear",
                          }}
                          className="
                            absolute
                            inset-y-0
                            left-0
                            rounded-full
                            bg-[#34d399]
                            shadow-[0_0_8px_rgba(52,211,153,0.8)]
                          "
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ================================================================
                  STORY LINK HINT
                  ================================================================ */}

              <p
                className="
                  mt-1.5
                  text-[10px]
                  font-medium
                  text-white/50
                "
              >
                بۆ بینینی ڕیکلام کلیک بکە
              </p>
            </motion.div>
          )}

          {/* ==================================================================
              BADGE
              ================================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            <motion.div
              animate={{
                y: [0, -3, 0, 3, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                mx-auto
                mb-3
                inline-flex
                items-center
                rounded-full
                border
                border-white/20
                bg-white/10
                px-3
                py-1.5
                text-[11px]
                font-semibold
                text-white
                shadow-lg
                shadow-black/20
                backdrop-blur-xl
                sm:mb-5
                sm:px-4
                sm:py-2
                sm:text-sm
              "
            >
              <span>
                ✨ پلاتفۆرمی گشتگیری قەزای بازیان
              </span>
            </motion.div>

            {/* ==================================================================
                HEADLINE
                ================================================================== */}

            <motion.h1
              animate={{
                y: [0, -5, 0, 5, 0],
                backgroundPosition: [
                  "0% 50%",
                  "100% 50%",
                  "0% 50%",
                ],
              }}
              transition={{
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                backgroundPosition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              className="
                text-balance
                bg-[linear-gradient(90deg,rgb(4,120,87),rgb(255,255,255),rgb(180,110,8))]
                bg-[length:200%_auto]
                bg-clip-text
                text-2xl
                font-extrabold
                leading-tight
                text-transparent
                drop-shadow-[0_5px_15px_rgba(0,0,0,0.95)]
                sm:text-4xl
                lg:text-5xl
              "
            >
              {t("heroTitle")}
            </motion.h1>

            {/* ==================================================================
                DESCRIPTION
                ================================================================== */}

            <motion.p
              animate={{
                opacity: [0.82, 1, 0.82],
                y: [0, -2, 0],
              }}
              transition={{
                opacity: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="
                mx-auto
                mt-3
                line-clamp-3
                max-w-xl
                text-balance
                text-xs
                leading-relaxed
                text-white
                drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]
                sm:mt-4
                sm:line-clamp-none
                sm:max-w-2xl
                sm:text-base
              "
            >
              {t("heroDescription")}
            </motion.p>
          </motion.div>

          {/* ==================================================================
              QUICK ACTIONS
              ================================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="
              mx-auto
              mt-7
              grid
              w-full
              max-w-2xl
              grid-cols-3
              gap-2
              sm:mt-8
              sm:gap-3
            "
          >
            {translatedActions.map((action) => {
              const Icon =
                QUICK_ACTION_ICON[action.icon];

              const isExternal =
                action.href.startsWith("http");

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  target={
                    isExternal
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    isExternal
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="
                    group
                    flex
                    min-w-0
                    items-center
                    justify-center
                    gap-1.5
                    rounded-full
                    border
                    border-white/25
                    bg-white/10
                    px-2
                    py-2.5
                    text-[10px]
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-black/10
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-white/20
                    hover:shadow-xl
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-white/80
                    sm:gap-2
                    sm:px-4
                    sm:py-3
                    sm:text-sm
                  "
                >
                  <Icon
                    aria-hidden="true"
                    className="
                      h-4
                      w-4
                      shrink-0
                      transition-transform
                      duration-300
                      group-hover:scale-110
                      sm:h-[18px]
                      sm:w-[18px]
                    "
                    strokeWidth={2}
                  />

                  <span className="truncate">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </motion.div>

          {/* ==================================================================
              MOBILE SCROLL INDICATOR
              ================================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.35,
              ease: "easeOut",
            }}
            className="
              mt-6
              flex
              flex-col
              items-center
              sm:hidden
            "
          >
            <Link
              href="#services"
              aria-label="بۆ بینینی خزمەتگوزاریەکان"
              className="
                flex
                flex-col
                items-center
                outline-none
                focus-visible:ring-2
                focus-visible:ring-white/70
                focus-visible:ring-offset-2
                focus-visible:ring-offset-black/20
              "
            >
              <motion.span
                animate={{
                  opacity: [
                    0.8,
                    1,
                    0.8,
                  ],
                  y: [0, -2, 0, 2, 0],
                  color: [
                    "#ffffff",
                    "#34d399",
                    "#fbbf24",
                    "#ffffff",
                  ],
                }}
                transition={{
                  opacity: {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  color: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="
                  text-sm
                  font-bold
                  drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]
                "
              >
                بۆ بینینی خزمەتگوزاریەکان
              </motion.span>

              <motion.span
                animate={{
                  y: [0, 7, 0],
                  scale: [1, 1.08, 1],
                  color: [
                    "#ffffff",
                    "#34d399",
                    "#fbbf24",
                    "#ffffff",
                  ],
                }}
                transition={{
                  y: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  color: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="
                  mt-1.5
                  inline-flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/25
                  bg-black/20
                  shadow-lg
                  shadow-black/30
                  backdrop-blur-md
                "
                aria-hidden="true"
              >
                <ChevronDown
                  className="h-7 w-7"
                  strokeWidth={3}
                />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}