"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PlaceCard from "@/components/PlaceCard";
import type { PlaceWithTranslations } from "@/lib/data/places";

interface PlacesGridProps {
  places?: PlaceWithTranslations[];
}

export default function PlacesGrid({
  places = [],
}: PlacesGridProps) {
  const trackRef =
    useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;

    if (!track || places.length === 0) {
      return;
    }

    const cards = Array.from(
      track.children
    ) as HTMLElement[];

    if (cards.length === 0) {
      return;
    }

    const trackRect =
      track.getBoundingClientRect();

    const trackCenter =
      trackRect.left +
      trackRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardRect =
        card.getBoundingClientRect();

      const cardCenter =
        cardRect.left +
        cardRect.width / 2;

      const distance = Math.abs(
        cardCenter - trackCenter
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(
      Math.min(
        Math.max(closestIndex, 0),
        places.length - 1
      )
    );
  }, [places.length]);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    updateActiveIndex();

    track.addEventListener(
      "scroll",
      updateActiveIndex,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      updateActiveIndex
    );

    return () => {
      track.removeEventListener(
        "scroll",
        updateActiveIndex
      );

      window.removeEventListener(
        "resize",
        updateActiveIndex
      );
    };
  }, [updateActiveIndex]);

  const scrollByCard = (
    direction: "prev" | "next"
  ) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard =
      track.firstElementChild as
        | HTMLElement
        | null;

    const cardWidth = firstCard
      ? firstCard.offsetWidth + 20
      : 320;

    const distance =
      direction === "next"
        ? -cardWidth
        : cardWidth;

    track.scrollBy(distance, 0);
  };

  return (
    <section
      dir="rtl"
      className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20"
    >
      {/* Section Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937] dark:text-white sm:text-2xl">
            شوێنە گەشتیاری و مێژووییەکان
          </h2>

          <p className="mt-1.5 text-sm text-[#6B7280] dark:text-gray-400">
            خۆشترین شوێنەکانی بازیان بۆ گەشتیاری، خواردن و پشوودان
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              scrollByCard("prev")
            }
            aria-label="پیشاندانی پێشوو"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] transition-colors hover:border-[#16A34A]/40 hover:text-[#16A34A] dark:border-white/10 dark:text-gray-200"
          >
            <ChevronRight
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              scrollByCard("next")
            }
            aria-label="پیشاندانی دواتر"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#374151] transition-colors hover:border-[#16A34A]/40 hover:text-[#16A34A] dark:border-white/10 dark:text-gray-200"
          >
            <ChevronLeft
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Places */}
      {places.length > 0 ? (
        <>
          <div
            ref={trackRef}
            className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
          >
            {places.map(
              (place, index) => (
                <div
                  key={place.id}
                  className="w-[78vw] shrink-0 snap-start sm:w-auto"
                >
                  <PlaceCard
                    place={place}
                    priority={
                      index === 0
                    }
                  />
                </div>
              )
            )}
          </div>

          {/* Mobile Indicators */}
          <div
            className="mt-5 flex items-center justify-center gap-1.5 sm:hidden"
            aria-label="پۆزیشنی شوێنەکان"
          >
            {places.map(
              (place, index) => (
                <span
                  key={place.id}
                  aria-hidden="true"
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-6 bg-[#16A34A]"
                      : "w-1.5 bg-[#E5E7EB]"
                  }`}
                />
              )
            )}
          </div>
        </>
      ) : (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
          هیچ شوێنێک نەدۆزرایەوە.
        </div>
      )}
    </section>
  );
}