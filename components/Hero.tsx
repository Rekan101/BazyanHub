"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Heart,
  ListChecks,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Pause,
  Play,
} from "lucide-react";
import type { QuickAction } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

const QUICK_ACTION_ICON = {
  map: Map,
  favorites: Heart,
  list: ListChecks,
  outage: ListChecks,
} as const;

/*
|--------------------------------------------------------------------------
| Story Types
|--------------------------------------------------------------------------
*/

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
  durationSeconds: number;
};

/*
|--------------------------------------------------------------------------
| Story Configuration
|
| To add a new story:
| 1. Add one object here.
| 2. Put your portrait image in /public/images/stories/
| 3. Use 9:16 images for best results.
|
| Maximum supported stories: 10
|--------------------------------------------------------------------------
*/

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
  },

  {
    id: "story-4",
    image: "/images/stories/story-4.webp",
    title: "ریکلام",
    subtitle: "شوێن و کاروبارەکانی ناوچە",
    createdAt: "2026-09-02T12:00:00",
    duration: {
      amount: 24,
      unit: "hours",
    },
    durationSeconds: 3,
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
},

  // You can add up to 6 more stories here.
  // Maximum total = 10 stories.
];

/*
|--------------------------------------------------------------------------
| Story Helpers
|--------------------------------------------------------------------------
*/

function getExpirationTime(story: StoryItem): number {
  const createdAt = new Date(story.createdAt).getTime();

  if (Number.isNaN(createdAt)) {
    return 0;
  }

  if (story.duration.unit === "hours") {
    return createdAt + story.duration.amount * 60 * 60 * 1000;
  }

  if (story.duration.unit === "days") {
    return createdAt + story.duration.amount * 24 * 60 * 60 * 1000;
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
    .filter((story) => getExpirationTime(story) > now);
}

function formatStoryDuration(
  duration: StoryDuration
): string {
  if (
    duration.unit === "hours" &&
    duration.amount === 24
  ) {
    return "24 کاتژمێر";
  }

  if (
    duration.unit === "days" &&
    duration.amount === 7
  ) {
    return "7 ڕۆژ";
  }

  if (
    duration.unit === "days" &&
    duration.amount === 30
  ) {
    return "30 ڕۆژ";
  }

  if (duration.unit === "hours") {
    return `${duration.amount} کاتژمێر`;
  }

  if (duration.unit === "days") {
    return `${duration.amount} ڕۆژ`;
  }

  if (duration.unit === "months") {
    return `${duration.amount} مانگ`;
  }

  return "";
}

/*
|--------------------------------------------------------------------------
| Hero
|--------------------------------------------------------------------------
*/

export default function Hero() {
  const { language, t } = useLanguage();

  const [now, setNow] = useState<number>(
    () => Date.now()
  );

  const [activeStoryIndex, setActiveStoryIndex] =
    useState(0);

  const [isStoryViewerOpen, setIsStoryViewerOpen] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Keep expiration UI up to date
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60 * 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Active Stories
  |--------------------------------------------------------------------------
  */

  const activeStories = useMemo(
    () => getRemainingStories(STORY_ITEMS, now),
    [now]
  );

  /*
  |--------------------------------------------------------------------------
  | Keep active index valid when stories expire
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (activeStories.length === 0) {
      setActiveStoryIndex(0);
      setIsStoryViewerOpen(false);
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

  /*
  |--------------------------------------------------------------------------
  | Story Auto Progress
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !isStoryViewerOpen ||
      isPaused ||
      activeStories.length <= 1
    ) {
      return;
    }

    const currentStory =
      activeStories[activeStoryIndex];

    const timeout = window.setTimeout(
      () => {
        setActiveStoryIndex(
          (currentIndex) =>
            (currentIndex + 1) %
            activeStories.length
        );
      },
      currentStory.durationSeconds * 1000
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    activeStoryIndex,
    activeStories,
    isPaused,
    isStoryViewerOpen,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Lock body scrolling while viewer is open
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isStoryViewerOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isStoryViewerOpen]);

  /*
  |--------------------------------------------------------------------------
  | Keyboard Controls
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isStoryViewerOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsStoryViewerOpen(false);
      }

      if (event.key === "ArrowRight") {
        setActiveStoryIndex(
          (currentIndex) =>
            (currentIndex + 1) %
            activeStories.length
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveStoryIndex(
          (currentIndex) =>
            currentIndex === 0
              ? activeStories.length - 1
              : currentIndex - 1
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    activeStories.length,
    isStoryViewerOpen,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Open Story
  |--------------------------------------------------------------------------
  */

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setIsPaused(false);
    setIsStoryViewerOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Story Navigation
  |--------------------------------------------------------------------------
  */

  const goToPreviousStory = () => {
    if (activeStories.length === 0) {
      return;
    }

    setActiveStoryIndex(
      (currentIndex) =>
        currentIndex === 0
          ? activeStories.length - 1
          : currentIndex - 1
    );
  };

  const goToNextStory = () => {
    if (activeStories.length === 0) {
      return;
    }

    setActiveStoryIndex(
      (currentIndex) =>
        (currentIndex + 1) %
        activeStories.length
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Quick Actions
  |--------------------------------------------------------------------------
  */

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

  const isRTL =
    language !== "en";

  const currentStory =
    activeStories[activeStoryIndex] ?? null;

  return (
    <>
      <section
        dir={
          language === "en"
            ? "ltr"
            : "rtl"
        }
        className="relative min-h-[620px] overflow-hidden"
      >
        {/* =========================================================
            BACKGROUND
        ========================================================== */}

        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] sm:object-top"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-l from-[#16A34A]/25 via-transparent to-transparent"
        />

        {/* =========================================================
            HERO CONTENT
        ========================================================== */}

        <div className="relative mx-auto flex w-full max-w-[1440px] px-4 pb-14 pt-24 sm:px-6 sm:pt-24 lg:px-10">
          <div className="mx-auto w-full max-w-3xl text-center">

            {/* =====================================================
                STORIES
            ====================================================== */}

            {activeStories.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="mx-auto mb-7 w-full"
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <div
                    className={`
                      flex
                      items-center
                      gap-2
                      text-white/90
                      ${
                        isRTL
                          ? "flex-row-reverse"
                          : ""
                      }
                    `}
                  >
                    <span className="h-2 w-2 rounded-full bg-[#34d399] shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                    <span className="text-xs font-bold sm:text-sm">
                      ستۆری و ڕیکلام
                    </span>
                  </div>

                  <span className="rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[10px] font-semibold text-white/70 backdrop-blur-md">
                    {activeStories.length}/10
                  </span>
                </div>

                <div
                  className="
                    flex
                    w-full
                    items-end
                    justify-center
                    gap-2.5
                    overflow-hidden
                    px-1
                    sm:gap-3
                  "
                >
                  {activeStories.map(
                    (story, index) => (
                      <button
                        key={story.id}
                        type="button"
                        onClick={() =>
                          openStory(index)
                        }
                        aria-label={`کردنەوەی ستۆری ${index + 1}`}
                        className="
                          group
                          relative
                          h-[118px]
                          w-[72px]
                          shrink-0
                          overflow-hidden
                          rounded-[1.15rem]
                          border
                          border-white/25
                          bg-white/10
                          shadow-xl
                          shadow-black/25
                          outline-none
                          backdrop-blur-md
                          transition-all
                          duration-300
                          hover:-translate-y-1
                          hover:scale-[1.03]
                          hover:border-white/50
                          focus-visible:ring-2
                          focus-visible:ring-white/80
                          sm:h-[138px]
                          sm:w-[86px]
                        "
                      >
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          sizes="86px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute inset-x-0 bottom-0 p-2 text-right">
                          <p className="line-clamp-2 text-[9px] font-bold leading-tight text-white sm:text-[10px]">
                            {story.title}
                          </p>
                        </div>

                        {index ===
                          activeStoryIndex && (
                          <div className="absolute inset-0 rounded-[1.15rem] ring-2 ring-[#34d399]/90 ring-offset-1 ring-offset-transparent" />
                        )}
                      </button>
                    )
                  )}
                </div>

                <p className="mt-2 text-[10px] font-medium text-white/55">
                  بۆ بینینی ڕیکلام کلیک بکە
                </p>
              </motion.div>
            )}

            {/* =====================================================
                BADGE + HEADLINE
            ====================================================== */}

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

            {/* =====================================================
                QUICK ACTIONS
            ====================================================== */}

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
              {translatedActions.map(
                (action) => {
                  const Icon =
                    QUICK_ACTION_ICON[
                      action.icon
                    ];

                  const isExternal =
                    action.href.startsWith(
                      "http"
                    );

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
                          ? "noreferrer"
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
                }
              )}
            </motion.div>

            {/* =====================================================
                MOBILE SCROLL INDICATOR
            ====================================================== */}

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

      {/* ===========================================================
          STORY VIEWER
      ============================================================ */}

      <AnimatePresence>
        {isStoryViewerOpen &&
          currentStory && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="
                fixed
                inset-0
                z-[999]
                flex
                items-center
                justify-center
                bg-black/85
                p-3
                backdrop-blur-xl
                sm:p-5
              "
              onClick={() =>
                setIsStoryViewerOpen(false)
              }
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: 16,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="
                  relative
                  h-[min(88vh,760px)]
                  w-[min(92vw,430px)]
                  overflow-hidden
                  rounded-[2rem]
                  border
                  border-white/15
                  bg-black
                  shadow-2xl
                  shadow-black/60
                "
                onClick={(
                  event: MouseEvent
                ) =>
                  event.stopPropagation()
                }
              >
                {/* =================================================
                    STORY IMAGE
                ================================================== */}

                <AnimatePresence
                  mode="wait"
                >
                  <motion.div
                    key={currentStory.id}
                    initial={{
                      opacity: 0,
                      scale: 1.03,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.99,
                    }}
                    transition={{
                      duration: 0.22,
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={
                        currentStory.image
                      }
                      alt={
                        currentStory.title
                      }
                      fill
                      priority
                      sizes="430px"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75" />
                  </motion.div>
                </AnimatePresence>

                {/* =================================================
                    PROGRESS BARS
                ================================================== */}

                <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
                  {activeStories.map(
                    (story, index) => {
                      const isPast =
                        index <
                        activeStoryIndex;

                      const isCurrent =
                        index ===
                        activeStoryIndex;

                      return (
                        <div
                          key={story.id}
                          className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                        >
                          <motion.div
                            initial={{
                              width: isPast
                                ? "100%"
                                : "0%",
                            }}
                            animate={{
                              width:
                                isPast
                                  ? "100%"
                                  : isCurrent
                                  ? "100%"
                                  : "0%",
                            }}
                            transition={{
                              duration:
                                isCurrent
                                  ? story.durationSeconds
                                  : 0,
                              ease: "linear",
                            }}
                            className="h-full rounded-full bg-white"
                          />
                        </div>
                      );
                    }
                  )}
                </div>

                {/* =================================================
                    HEADER
                ================================================== */}

                <div className="absolute inset-x-4 top-7 z-20 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-white/60">
                      ستۆری {activeStoryIndex + 1} لە{" "}
                      {activeStories.length}
                    </p>

                    <h3 className="mt-1 truncate text-sm font-bold text-white sm:text-base">
                      {currentStory.title}
                    </h3>

                    {currentStory.subtitle && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-white/75">
                        {currentStory.subtitle}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-label="داخستن"
                    onClick={() =>
                      setIsStoryViewerOpen(
                        false
                      )
                    }
                    className="
                      inline-flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/15
                      bg-black/20
                      text-white
                      backdrop-blur-md
                      transition
                      hover:bg-white/15
                    "
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* =================================================
                    SIDE NAVIGATION
                ================================================== */}

                {activeStories.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="ستۆری پێشوو"
                      onClick={
                        goToPreviousStory
                      }
                      className="
                        absolute
                        left-3
                        top-1/2
                        z-20
                        -translate-y-1/2
                        inline-flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/15
                        bg-black/20
                        text-white
                        backdrop-blur-md
                        transition
                        hover:bg-white/15
                      "
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      aria-label="ستۆری دواتر"
                      onClick={
                        goToNextStory
                      }
                      className="
                        absolute
                        right-3
                        top-1/2
                        z-20
                        -translate-y-1/2
                        inline-flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/15
                        bg-black/20
                        text-white
                        backdrop-blur-md
                        transition
                        hover:bg-white/15
                      "
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* =================================================
                    BOTTOM INFO
                ================================================== */}

                <div className="absolute inset-x-4 bottom-4 z-20">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-md">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-semibold text-white/55">
                          ماوەی ستۆری
                        </p>

                        <p className="mt-0.5 text-xs font-bold text-white">
                          {formatStoryDuration(
                            currentStory.duration
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={
                          isPaused
                            ? "دەستپێکردن"
                            : "ڕاگرتن"
                        }
                        onClick={() =>
                          setIsPaused(
                            (value) =>
                              !value
                          )
                        }
                        className="
                          inline-flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/15
                          bg-white/10
                          text-white
                          transition
                          hover:bg-white/20
                        "
                      >
                        {isPaused ? (
                          <Play className="h-4 w-4 fill-current" />
                        ) : (
                          <Pause className="h-4 w-4 fill-current" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}