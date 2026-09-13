"use client";

import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LazyMotion,
  domAnimation,
  m,
} from "framer-motion";
import {
  ChevronDown,
  ExternalLink,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";

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
  durationSeconds: number;
  href: string;
};

/* ==========================================================================
   STORY CONFIGURATION
   ========================================================================== */

/*
 * Mock stories don't have a real backend `createdAt` yet, so
 * we stamp them as "just created" at module load instead of a
 * hardcoded past date. A fixed past date silently drifts out
 * of its expiration window as real time passes — which is
 * exactly what was hiding 3 of the 6 stories. Once real story
 * data exists, this constant goes away.
 */
const STORIES_CREATED_AT =
  new Date().toISOString();

const STORY_ITEMS: StoryItem[] = [
  {
    id: "story-1",
    image: "/images/stories/story-1.webp",
    title: "ڕیکلامی تایبەت",
    subtitle: "خزمەتگوزارییە نوێکان لە بازیان",
    createdAt: STORIES_CREATED_AT,
    duration: {
      amount: 240,
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
    createdAt: STORIES_CREATED_AT,
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
    createdAt: STORIES_CREATED_AT,
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
    createdAt: STORIES_CREATED_AT,
    duration: {
      amount: 240,
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
    createdAt: STORIES_CREATED_AT,
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
    createdAt: STORIES_CREATED_AT,
    duration: {
      amount: 1,
      unit: "months",
    },
    durationSeconds: 3,
    href: "https://example.com",
  },
];

/* ==========================================================================
   STORY EXPIRATION
   ========================================================================== */

function getExpirationTime(
  story: StoryItem
): number {
  const createdAt = new Date(
    story.createdAt
  ).getTime();

  if (Number.isNaN(createdAt)) {
    return 0;
  }

  if (
    story.duration.unit === "hours"
  ) {
    return (
      createdAt +
      story.duration.amount *
        60 *
        60 *
        1000
    );
  }

  if (
    story.duration.unit === "days"
  ) {
    return (
      createdAt +
      story.duration.amount *
        24 *
        60 *
        60 *
        1000
    );
  }

  const expiration = new Date(
    story.createdAt
  );

  expiration.setMonth(
    expiration.getMonth() +
      story.duration.amount
  );

  return expiration.getTime();
}

/* ==========================================================================
   ACTIVE STORIES
   ========================================================================== */

function getRemainingStories(
  stories: StoryItem[],
  now: number
): StoryItem[] {
  return stories
    .slice(0, 10)
    .filter(
      (story) =>
        getExpirationTime(story) >
        now
    );
}

/* ==========================================================================
   HERO
   ========================================================================== */

export default function Hero() {
  const { language, t } =
    useLanguage();

  /* ------------------------------------------------------------------------
     Current time
     ------------------------------------------------------------------------ */

  const [now, setNow] =
    useState<number>(
      () => Date.now()
    );

  /* ------------------------------------------------------------------------
     Current story
     ------------------------------------------------------------------------ */

  const [
    activeStoryIndex,
    setActiveStoryIndex,
  ] = useState(0);

  /* ------------------------------------------------------------------------
     Update time every minute
     ------------------------------------------------------------------------ */

  useEffect(() => {
    const interval =
      window.setInterval(() => {
        setNow(Date.now());
      }, 60 * 1000);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, []);

  /* ------------------------------------------------------------------------
     Get non-expired stories
     ------------------------------------------------------------------------ */

  const activeStories = useMemo(
    () =>
      getRemainingStories(
        STORY_ITEMS,
        now
      ),
    [now]
  );

  /* ------------------------------------------------------------------------
     Keep story index valid
     ------------------------------------------------------------------------ */

  useEffect(() => {
    if (activeStories.length === 0) {
      setActiveStoryIndex(0);
      return;
    }

    if (
      activeStoryIndex >=
      activeStories.length
    ) {
      setActiveStoryIndex(0);
    }
  }, [
    activeStoryIndex,
    activeStories.length,
  ]);

  /* ------------------------------------------------------------------------
     AUTO STORY LOOP
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

    const timeout =
      window.setTimeout(() => {
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
     SCROLL TO SERVICES
     ------------------------------------------------------------------------ */

  const handleServicesScroll = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    const servicesSection =
      document.getElementById(
        "services"
      );

    if (!servicesSection) {
      return;
    }

    servicesSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(
      null,
      "",
      "#services"
    );
  };

  /* ------------------------------------------------------------------------
     RTL
     ------------------------------------------------------------------------ */

  const isRTL =
    language !== "en";

  /* ------------------------------------------------------------------------
     Current story
     ------------------------------------------------------------------------ */

  const currentStory =
    activeStories[
      activeStoryIndex
    ] ?? null;

  return (
    <LazyMotion features={domAnimation}>
      <section
        dir={
          language === "en"
            ? "ltr"
            : "rtl"
        }
        className="
          relative
          min-h-[calc(100svh-155px)]
          overflow-hidden
          sm:min-h-[620px]
        "
      >
        {/* ====================================================================
            BACKGROUND — LCP
            ==================================================================== */}

        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={60}
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
            min-h-[calc(100svh-155px)]
            w-full
            max-w-[1440px]
            items-start
            px-4
            pb-8
            pt-3
            sm:min-h-0
            sm:px-6
            sm:pb-14
            sm:pt-14
            lg:px-10
            lg:pt-16
          "
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-3xl
              flex-col
              items-center
              text-center
            "
          >
            {/* ==================================================================
                BADGE
                ================================================================== */}

            <m.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: "easeOut",
              }}
              className="
                order-1
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
                backdrop-blur-md
                sm:mb-5
                sm:px-4
                sm:py-2
                sm:text-sm
              "
            >
              <span>
                ✨ پلاتفۆرمی گشتگیری قەزای بازیان
              </span>
            </m.div>

            {/* ==================================================================
                SINGLE STORY
                ================================================================== */}

            {currentStory && (
              <m.div
                initial={{
                  opacity: 0,
                  y: 12,
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
                  order-2
                  mb-3
                  w-full
                  sm:mb-5
                "
              >
                <div
                  className="
                    mx-auto
                    w-full
                    max-w-[220px]
                    sm:max-w-[250px]
                    md:max-w-[285px]
                    lg:max-w-[300px]
                  "
                >
                  <Link
                    href={
                      currentStory.href
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`کردنەوەی ${currentStory.title}`}
                    className="
                      group
                      relative
                      block
                      aspect-[5/6]
                      w-full
                      overflow-hidden
                      rounded-[1.45rem]
                      border
                      border-white/25
                      bg-white/10
                      shadow-2xl
                      shadow-black/35
                      outline-none
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-white/40
                      hover:shadow-black/50
                      focus-visible:ring-2
                      focus-visible:ring-[#34d399]
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-transparent
                      sm:rounded-[1.6rem]
                    "
                  >
                    {/* STORY IMAGE */}

                    <Image
                      src={
                        currentStory.image
                      }
                      alt={
                        currentStory.title
                      }
                      fill
                      loading="lazy"
                      fetchPriority="low"
                      quality={80}
                      sizes="(max-width: 640px) 220px, (max-width: 768px) 250px, (max-width: 1024px) 285px, 300px"
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.035]
                      "
                    />

                    {/* IMAGE OVERLAY */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/85
                        via-black/10
                        to-black/10
                      "
                    />

                    {/* TOP SOFT GRADIENT */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        inset-x-0
                        top-0
                        h-20
                        bg-gradient-to-b
                        from-black/30
                        to-transparent
                      "
                    />

                    {/* EXTERNAL LINK ICON */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        left-3
                        top-3
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/20
                        bg-black/25
                        text-white
                        shadow-lg
                        backdrop-blur-md
                        transition-all
                        duration-300
                        group-hover:scale-105
                        group-hover:bg-black/40
                        sm:h-9
                        sm:w-9
                      "
                    >
                      <ExternalLink
                        className="
                          h-4
                          w-4
                        "
                        strokeWidth={2}
                      />
                    </div>

                    {/* STORY TEXT */}

                    <div
                      className="
                        absolute
                        inset-x-0
                        bottom-0
                        p-3.5
                        text-right
                        sm:p-4
                      "
                    >
                      <p
                        className="
                          text-base
                          font-extrabold
                          leading-tight
                          text-white
                          drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]
                          sm:text-lg
                        "
                      >
                        {
                          currentStory.title
                        }
                      </p>

                      {currentStory.subtitle && (
                        <p
                          className="
                            mt-1
                            line-clamp-2
                            text-[11px]
                            font-medium
                            leading-relaxed
                            text-white/80
                            drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]
                            sm:text-xs
                          "
                        >
                          {
                            currentStory.subtitle
                          }
                        </p>
                      )}
                    </div>

                    {/* HOVER SHINE */}

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
                  </Link>

                  {/* STORY PROGRESS */}

                  <div
                    className="
                      mx-auto
                      mt-2
                      flex
                      w-full
                      gap-1
                      px-1
                    "
                    aria-hidden="true"
                  >
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
                            className="
                              relative
                              h-[3px]
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
                              <m.div
                                key={
                                  currentStory.id
                                }
                                initial={{
                                  scaleX: 0,
                                }}
                                animate={{
                                  scaleX: 1,
                                }}
                                transition={{
                                  duration:
                                    currentStory.durationSeconds,
                                  ease: "linear",
                                }}
                                style={{
                                  transformOrigin:
                                    isRTL
                                      ? "right center"
                                      : "left center",
                                }}
                                className="
                                  absolute
                                  inset-y-0
                                  left-0
                                  right-0
                                  rounded-full
                                  bg-[#34d399]
                                  shadow-[0_0_7px_rgba(52,211,153,0.85)]
                                "
                              />
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </m.div>
            )}

            {/* ==================================================================
                GLASS PANEL — HEADLINE + DESCRIPTION + QUICK ACTIONS
                ================================================================== */}

            <div
              className="
                order-3
                mt-4
                w-full
                rounded-3xl
                border border-white/20
                bg-white/40
                px-6
                py-7
                text-center
                shadow-lg
                backdrop-blur-md
                sm:mt-6
                sm:px-10
                sm:py-10

                dark:border-white/10
                dark:bg-black/40
              "
            >
              {/* HEADLINE + DESCRIPTION */}

              <m.div
                initial={{
                  opacity: 0,
                  y: 14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.05,
                  ease: "easeOut",
                }}
                className="w-full"
              >
                {/* HEADLINE */}

                <m.h1
                  className="
                    text-balance
                    bg-[linear-gradient(90deg,rgb(4,120,87),rgb(255,255,255),rgb(180,110,8))]
                    bg-[length:200%_auto]
                    bg-clip-text
                    text-[1.7rem]
                    font-extrabold
                    leading-[1.12]
                    text-transparent
                    drop-shadow-[0_5px_15px_rgba(0,0,0,0.95)]
                    sm:text-4xl
                    sm:leading-tight
                    lg:text-5xl
                  "
                >
                  {t("heroTitle")}
                </m.h1>

                {/* DESCRIPTION */}

                <m.p
                  className="
                    mx-auto
                    mt-3
                    line-clamp-3
                    max-w-[340px]
                    text-balance
                    text-[11px]
                    leading-[1.7]
                    text-white
                    drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]
                    sm:mt-4
                    sm:line-clamp-none
                    sm:max-w-2xl
                    sm:text-base
                    sm:leading-relaxed
                  "
                >
                  {t("heroDescription")}
                </m.p>
              </m.div>
            </div>

            {/* ==================================================================
                MOBILE SCROLL INDICATOR
                ================================================================== */}

            <m.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: "easeOut",
              }}
              className="
                order-5
                mt-3
                flex
                flex-col
                items-center
                sm:mt-6
                sm:hidden
              "
            >
              <Link
                href="#services"
                onClick={
                  handleServicesScroll
                }
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
                {/* TEXT */}

                <m.span
                  className="
                    text-[11px]
                    font-bold
                    text-white
                    drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]
                  "
                >
                  بۆ بینینی خزمەتگوزاریەکان
                </m.span>

                {/* ARROW */}

                <m.span
                  className="
                    mt-1
                    inline-flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/25
                    bg-black/20
                    text-white
                    shadow-lg
                    shadow-black/30
                    backdrop-blur-md
                  "
                  aria-hidden="true"
                >
                  <ChevronDown
                    className="
                      h-5
                      w-5
                    "
                    strokeWidth={3}
                  />
                </m.span>
              </Link>
            </m.div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}