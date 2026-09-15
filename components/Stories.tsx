"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { ArrowLeft, X } from "lucide-react";

import {
  SLIDES,
  type Slide,
  type Story,
} from "@/lib/data/stories";

/* ==========================================================================
   TYPES

   Story/Slide now live in lib/data/stories.ts alongside the mock SLIDES, so
   that both this client component and the server-side Supabase mapper share
   one definition. Re-exported here because that is where they used to live.
   ========================================================================== */

export type { Slide, Story };

/* ==========================================================================
   SLIDES

   Data arrives as a prop from app/page.tsx, which fetches it on the server
   via lib/data/stories.server.ts (Supabase first, SLIDES as fallback). The
   default parameter keeps this component usable on its own.

   Expiration/scheduling is the database's job — the query filters expired
   rows out before they reach here, so no createdAt/duration fields exist on
   the client type.
   ========================================================================== */

const SLIDE_INTERVAL_MS = 3000;

/* ==========================================================================
   STORIES
   ========================================================================== */

type StoriesProps = {
  slides?: Slide[];
};

export default function Stories({
  slides = SLIDES,
}: StoriesProps) {
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
    if (isPaused || slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(
      () => {
        setCurrentSlide(
          (previous) =>
            (previous + 1) % slides.length
        );
      },
      SLIDE_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused, slides.length]);

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

  /*
   * Clamp rather than index directly. `currentSlide` is state, so a shorter
   * `slides` array arriving on a re-render (fewer live slides than the last
   * fetch) would otherwise leave the index past the end and crash on
   * `slide.stories`.
   */
  const slide =
    slides[currentSlide % slides.length];

  if (!slide) {
    return null;
  }

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
          bg-slate-300
          p-4
          shadow-lg shadow-black/10

          dark:border-white/10
        "
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('/images/silver-waves.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
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
          {slides.map((item, index) => (
            <span
              key={item.id}
              className={`
                h-1.5 rounded-full
                transition-all duration-300
                ${
                  index ===
                  currentSlide % slides.length
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

              {/*
                Only linkable when the story actually resolves to a provider.
                stories.provider_id is nullable and ON DELETE SET NULL, so a
                story can outlive its business — without this guard that case
                renders an href of "/services//".
              */}
              {selectedStory.categoryId &&
              selectedStory.providerId ? (
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
              ) : null}
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
