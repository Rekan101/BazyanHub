"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, MapPin, Heart, ArrowLeft } from "lucide-react";
import type { PlaceWithTranslations } from "@/lib/data/places";
import { useLanguage } from "@/lib/i18n";

interface PlaceCardProps {
  place: PlaceWithTranslations;
  priority?: boolean;
}

export default function PlaceCard({
  place,
  priority = false,
}: PlaceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { language } = useLanguage();

  const currentLanguage =
    language === "ar"
      ? "ar"
      : language === "en"
        ? "en"
        : "ckb";

  const placeTitle =
    place.translations[currentLanguage];

  // Normalize image path
  const imageName = place.image.split("/").pop() || "";
  const imageSrc = `/images/${imageName}`;

  return (
    <article
      dir="rtl"
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm shadow-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.08] dark:border-white/10 dark:bg-[#1F2937]"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={imageSrc}
          alt={placeTitle}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(event) => {
            console.error("IMAGE FAILED:", imageSrc);

            event.currentTarget.style.display = "none";
          }}
        />

        {/* Category */}
        <span className="absolute right-3 top-3 z-20 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#16A34A] shadow-sm backdrop-blur-sm">
          {place.category}
        </span>

        {/* Favorite */}
        <button
          type="button"
          onClick={() =>
            setIsFavorite((value) => !value)
          }
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? "لابردن لە دڵخوازەکان"
              : "زیادکردن بۆ دڵخوازەکان"
          }
          className="absolute left-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#374151] shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:text-[#EF4444] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30"
        >
          <Heart
            className="h-[18px] w-[18px]"
            fill={
              isFavorite
                ? "#EF4444"
                : "none"
            }
            stroke={
              isFavorite
                ? "#EF4444"
                : "currentColor"
            }
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title + Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 text-base font-bold leading-snug text-[#1F2937] dark:text-white">
            {placeTitle}
          </h3>

          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-[#FACC15]/15 px-2 py-1 text-xs font-bold text-[#B45309]">
            <Star className="h-3.5 w-3.5 fill-[#FACC15] text-[#FACC15]" />
            {place.rating.toFixed(1)}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" />

          <span className="truncate">
            {place.location}
          </span>
        </div>

        {/* Description */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[#4B5563] dark:text-gray-300">
          {place.description}
        </p>

        {/* Dynamic Details */}
        <Link
          href={`/places/${place.id}`}
          className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#16A34A] px-4 py-2.5 text-sm font-semibold text-[#16A34A] transition-all duration-200 hover:bg-[#16A34A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
        >
          بینینی وردەکاری

          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        </Link>
      </div>
    </article>
  );
}