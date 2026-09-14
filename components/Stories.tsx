"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { ArrowLeft, X } from "lucide-react";

/* ==========================================================================
   TYPES — mirrors the eventual Supabase row shape
   ========================================================================== */

export type Story = {
  id: string;
  image: string;
  providerName: string;
  shortInfo: string;
  providerId: string;
  categoryId: string;
};

export type Slide = {
  id: string;
  title: string;
  stories: Story[];
};

/* ==========================================================================
   SLIDES — 6 slides x 3 stories

   Mock data only. Expiration/scheduling is the database's job, so no
   createdAt/duration fields live here. Replacing this constant with a
   Supabase query is the only change needed to go live.
   ========================================================================== */

const SLIDE_INTERVAL_MS = 3000;

const SLIDES: Slide[] = [
  {
    id: "slide-1",
    title: "ژیانی ڕۆژانەت ئاسانتر بکە",
    stories: [
      {
        id: "story-1-1",
        image: "/images/stories/story-1.webp",
        providerName: "Bazian Cafe",
        shortInfo: "کافێیەکی مۆدێرن لە ناوەندی بازیان",
        providerId: "restaurant-bazian-cafe",
        categoryId: "restaurants",
      },
      {
        id: "story-1-2",
        image: "/images/stories/story-2.webp",
        providerName: "تاکسی بازیان",
        shortInfo: "گواستنەوەی خێرا بۆ هەموو ناوچەکان",
        providerId: "vehicle-bazian-taxi",
        categoryId: "vehicles",
      },
      {
        id: "story-1-3",
        image: "/images/stories/story-3.webp",
        providerName: "مارکێتی گەورە",
        shortInfo: "هەموو پێداویستییەکانی ماڵەوە",
        providerId: "shopping-bazian-market",
        categoryId: "shopping",
      },
    ],
  },

  {
    id: "slide-2",
    title: "باشترین خزمەتگوزارییەکان لێرەن",
    stories: [
      {
        id: "story-2-1",
        image: "/images/stories/story-4.webp",
        providerName: "دەرمانخانەی بازیان",
        shortInfo: "دەرمان و ڕاوێژی تەندروستی",
        providerId: "health-bazian-pharmacy",
        categoryId: "health",
      },
      {
        id: "story-2-2",
        image: "/images/stories/story-5.webp",
        providerName: "فرۆشگای مۆبایل",
        shortInfo: "مۆبایل و ئامێری تەکنەلۆجیا",
        providerId: "mobile-bazian-store",
        categoryId: "mobile",
      },
      {
        id: "story-2-3",
        image: "/images/stories/story-6.webp",
        providerName: "سالۆنی جوانکاری",
        shortInfo: "خزمەتگوزاری جوانکاری پیشەیی",
        providerId: "beauty-bazian-salon",
        categoryId: "beauty",
      },
    ],
  },

  {
    id: "slide-3",
    title: "هەر ئێستا پەیوەندی بکە",
    stories: [
      {
        id: "story-3-1",
        image: "/images/stories/story-1.webp",
        providerName: "وەستای کارەبا",
        shortInfo: "چاککردنەوەی کارەبا بە خێرایی",
        providerId: "worker-bazian-electrician",
        categoryId: "workers",
      },
      {
        id: "story-3-2",
        image: "/images/stories/story-2.webp",
        providerName: "نوسینگەی خانووبەرە",
        shortInfo: "کڕین و فرۆشتنی موڵک",
        providerId: "estate-bazian-office",
        categoryId: "real-estate",
      },
      {
        id: "story-3-3",
        image: "/images/stories/story-3.webp",
        providerName: "پەیمانگای فێرکاری",
        shortInfo: "کۆرسی زمان و کۆمپیوتەر",
        providerId: "institute-bazian-center",
        categoryId: "institutes",
      },
    ],
  },

  {
    id: "slide-4",
    title: "کات و پارەت بپارێزە",
    stories: [
      {
        id: "story-4-1",
        image: "/images/stories/story-4.webp",
        providerName: "گەیاندنی خێرا",
        shortInfo: "گەیاندن بۆ هەموو بازیان",
        providerId: "vehicle-bazian-delivery",
        categoryId: "vehicles",
      },
      {
        id: "story-4-2",
        image: "/images/stories/story-5.webp",
        providerName: "Bazian Cafe",
        shortInfo: "ئۆفەری تایبەت بۆ ماوەیەکی کەم",
        providerId: "restaurant-bazian-cafe",
        categoryId: "restaurants",
      },
      {
        id: "story-4-3",
        image: "/images/stories/story-6.webp",
        providerName: "فرۆشگای کەلوپەل",
        shortInfo: "نرخی گونجاو و جۆری باش",
        providerId: "shopping-bazian-goods",
        categoryId: "shopping",
      },
    ],
  },

  {
    id: "slide-5",
    title: "وەستای شارەزا بدۆزەرەوە",
    stories: [
      {
        id: "story-5-1",
        image: "/images/stories/story-1.webp",
        providerName: "وەستای بۆیە",
        shortInfo: "بۆیەکردنی ماڵ و نوسینگە",
        providerId: "worker-bazian-painter",
        categoryId: "workers",
      },
      {
        id: "story-5-2",
        image: "/images/stories/story-2.webp",
        providerName: "کارەباچی سەیارە",
        shortInfo: "چاککردنەوەی کارەبای ئۆتۆمبێل",
        providerId: "vehicle-bazian-auto-electric",
        categoryId: "vehicles",
      },
      {
        id: "story-5-3",
        image: "/images/stories/story-3.webp",
        providerName: "وەستای ئاودانان",
        shortInfo: "چاککردنەوەی بۆری و ئاو",
        providerId: "worker-bazian-plumber",
        categoryId: "workers",
      },
    ],
  },

  {
    id: "slide-6",
    title: "هەموو پێداویستییەکان لە یەک جێگادا",
    stories: [
      {
        id: "story-6-1",
        image: "/images/stories/story-4.webp",
        providerName: "هەلی کاری نوێ",
        shortInfo: "دامەزراندن لە بازیان",
        providerId: "job-bazian-openings",
        categoryId: "jobs",
      },
      {
        id: "story-6-2",
        image: "/images/stories/story-5.webp",
        providerName: "سەرتاشخانە",
        shortInfo: "سەرتاشی پیاوان بە شێوازی نوێ",
        providerId: "beauty-bazian-barber",
        categoryId: "beauty",
      },
      {
        id: "story-6-3",
        image: "/images/stories/story-6.webp",
        providerName: "چێشتخانەی خێزانی",
        shortInfo: "خواردنی ڕۆژانەی خۆجێیی",
        providerId: "restaurant-bazian-family",
        categoryId: "restaurants",
      },
    ],
  },
];

/* ==========================================================================
   STORIES
   ========================================================================== */

export default function Stories() {
  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [selectedStory, setSelectedStory] =
    useState<Story | null>(null);

  const [isPaused, setIsPaused] =
    useState(false);

  /* ------------------------------------------------------------------
     AUTO LOOP

     While paused no interval exists at all — the cleanup tears it
     down. Unpausing builds a fresh one, so the visible slide always
     gets a full SLIDE_INTERVAL_MS before advancing. The functional
     updater keeps `currentSlide` out of the dependency array, so the
     interval is never recreated mid-cycle.
     ------------------------------------------------------------------ */

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const intervalId = window.setInterval(
      () => {
        setCurrentSlide(
          (previous) =>
            (previous + 1) % SLIDES.length
        );
      },
      SLIDE_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused]);

  /* ------------------------------------------------------------------
     MODAL — escape key + body scroll lock
     ------------------------------------------------------------------ */

  useEffect(() => {
    if (!selectedStory) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeStory();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStory]);

  /* ------------------------------------------------------------------
     OPEN / CLOSE
     ------------------------------------------------------------------ */

  const openStory = (story: Story) => {
    setIsPaused(true);
    setSelectedStory(story);
  };

  const closeStory = () => {
    setSelectedStory(null);
    setIsPaused(false);
  };

  const slide = SLIDES[currentSlide];

  return (
    <>
      {/* =====================================================
          CAROUSEL BOX
      ====================================================== */}

      <div
        className="
          w-full
          rounded-[2rem]
          border border-white/20
          bg-[linear-gradient(135deg,_#cbd5e1_0%,_#9ca3af_50%,_#cbd5e1_100%)]
          p-4
          shadow-lg shadow-black/10

          dark:border-white/10
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
            }}
          >
            {/* THREE STORIES */}

            <div className="grid grid-cols-3 gap-3">
              {slide.stories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() =>
                    openStory(story)
                  }
                  aria-label={`کردنەوەی ${story.providerName}`}
                  className="
                    group relative
                    aspect-square w-full
                    overflow-hidden
                    rounded-[1.5rem]
                    border border-white/30
                    bg-slate-300
                    shadow-md shadow-black/20
                    outline-none
                    transition-all duration-300

                    hover:-translate-y-1
                    hover:shadow-xl

                    focus-visible:ring-2
                    focus-visible:ring-blue-600
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-transparent

                    active:scale-95

                    dark:border-white/15
                    dark:bg-slate-700
                    dark:focus-visible:ring-blue-500
                  "
                >
                  <Image
                    src={story.image}
                    alt={story.providerName}
                    fill
                    sizes="(max-width: 640px) 33vw, 150px"
                    className="
                      object-cover
                      transition-transform duration-500
                      group-hover:scale-110
                    "
                  />

                  {/* Bottom scrim so the name stays readable */}
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute inset-x-0 bottom-0
                      h-1/2
                      bg-gradient-to-t
                      from-black/80
                      to-transparent
                    "
                  />

                  <span
                    className="
                      absolute inset-x-0 bottom-0
                      truncate
                      px-2 pb-2
                      text-[10px] font-bold
                      text-white
                      drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]
                    "
                  >
                    {story.providerName}
                  </span>
                </button>
              ))}
            </div>

            {/* ACTIVE SLIDE TITLE */}

            <p
              className="
                mx-auto mt-4
                w-fit max-w-full
                rounded-full
                bg-white
                px-6 py-2
                text-center
                text-[13px] font-bold
                text-slate-900
                shadow-md shadow-black/10

                dark:bg-slate-900
                dark:text-white
                sm:text-[15px]
              "
            >
              {slide.title}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* SLIDE INDICATORS */}

        <div
          className="mt-3 flex items-center justify-center gap-1.5"
          aria-hidden="true"
        >
          {SLIDES.map((item, index) => (
            <span
              key={item.id}
              className={`
                h-1.5 rounded-full
                transition-all duration-300
                ${
                  index === currentSlide
                    ? "w-5 bg-blue-600 dark:bg-blue-500"
                    : "w-1.5 bg-white/50 dark:bg-white/25"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          FULLSCREEN STORY MODAL

          z-[100] matches ProviderModal — the app header and the
          bottom nav both sit at z-50, so a lower value would let
          the nav paint on top of the modal.
      ====================================================== */}

      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              fixed inset-0 z-[100]
              flex items-center justify-center
              bg-black/80
              p-4
              md:p-10
            "
            role="dialog"
            aria-modal="true"
            aria-label={
              selectedStory.providerName
            }
          >
            {/* BACKDROP — click to close */}

            <button
              type="button"
              aria-label="داخستن"
              onClick={closeStory}
              className="absolute inset-0 cursor-default"
            />

            {/* CARD */}

            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.97 }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="
                relative
                h-[85vh] w-full max-w-md
                overflow-hidden
                rounded-3xl
                bg-slate-900
                shadow-2xl shadow-black/60
              "
            >
              {/* STORY IMAGE */}

              <Image
                src={selectedStory.image}
                alt={
                  selectedStory.providerName
                }
                fill
                priority
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover"
              />

              {/* READABILITY GRADIENTS */}

              <div
                aria-hidden="true"
                className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/90
                  via-black/20
                  to-black/40
                "
              />

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeStory}
              aria-label="داخستن"
              className="
                absolute end-4 top-4 z-10
                flex h-10 w-10
                items-center justify-center
                rounded-full
                bg-black/40
                text-white
                backdrop-blur-md
                outline-none
                transition-all duration-200

                hover:scale-105
                hover:bg-black/60

                focus-visible:ring-2
                focus-visible:ring-white/70

                touch-manipulation
              "
            >
              <X
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>

            {/* BOTTOM BAR — info at start (right in RTL), CTA at end */}

            <div
              className="
                absolute inset-x-0 bottom-0 z-10
                flex items-end justify-between gap-3
                p-5
              "
            >
              <div className="min-w-0 flex-1 text-start">
                <p
                  className="
                    truncate
                    text-lg font-extrabold
                    text-white
                    drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                  "
                >
                  {
                    selectedStory.providerName
                  }
                </p>

                <p
                  className="
                    mt-1
                    line-clamp-2
                    text-[12px] font-medium
                    leading-relaxed
                    text-white/85
                    drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]
                  "
                >
                  {selectedStory.shortInfo}
                </p>
              </div>

              <Link
                href={`/services/${selectedStory.categoryId}/${selectedStory.providerId}`}
                onClick={closeStory}
                className="
                  inline-flex shrink-0
                  items-center gap-1.5
                  rounded-full
                  bg-blue-600
                  px-4 py-2.5
                  text-[13px] font-bold
                  text-white
                  shadow-lg shadow-blue-600/40
                  outline-none
                  transition-all duration-200

                  hover:-translate-y-0.5
                  hover:bg-blue-700

                  focus-visible:ring-2
                  focus-visible:ring-white/80

                  active:translate-y-0

                  dark:bg-blue-500
                  dark:hover:bg-blue-600
                "
              >
                بینینی هەژمار
                <ArrowLeft
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
              </Link>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
