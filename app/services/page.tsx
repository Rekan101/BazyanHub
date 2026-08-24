"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Utensils,
  ShoppingCart,
  HeartPulse,
  Smartphone,
  Scissors,
  House,
  GraduationCap,
  Wrench,
  Briefcase,
  Heart,
  Sparkles,
  Flame,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  categories,
  type ServiceCategory,
  type LanguageCode,
} from "@/lib/data/categories";
import { useLanguage } from "@/lib/i18n";

const FAVORITES_STORAGE_KEY = "bazianhub-favorites";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  car: Car,
  utensils: Utensils,
  "shopping-cart": ShoppingCart,
  "heart-pulse": HeartPulse,
  smartphone: Smartphone,
  scissors: Scissors,
  house: House,
  "graduation-cap": GraduationCap,
  wrench: Wrench,
  briefcase: Briefcase,
};

const CATEGORY_TITLES: Record<
  string,
  {
    ckb: string;
    ar: string;
    en: string;
  }
> = {
  jobs: {
    ckb: "هەلی کار",
    ar: "فرص العمل",
    en: "Job Opportunities",
  },
};

function getCategoryTitle(
  category: ServiceCategory,
  language: LanguageCode
) {
  const localized = CATEGORY_TITLES[category.id];

  if (localized) {
    return localized[language];
  }

  return category.translations[language];
}

function readFavorites(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(
      FAVORITES_STORAGE_KEY
    );

    if (!stored) {
      return {};
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<string, boolean>;
    }

    return {};
  } catch {
    return {};
  }
}

function saveFavorites(
  favorites: Record<string, boolean>
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );

    window.dispatchEvent(
      new CustomEvent("bazianhub-favorites-changed")
    );
  } catch {
    // Ignore localStorage errors.
  }
}

export default function ServicesPage() {
  const { language } = useLanguage();

  const currentLanguage =
    language as LanguageCode;

  const isRTL = currentLanguage !== "en";

  const ArrowIcon = isRTL
    ? ArrowLeft
    : ArrowRight;

  const [favorites, setFavorites] =
    useState<Record<string, boolean>>({});

  useEffect(() => {
    setFavorites(readFavorites());

    const handleFavoritesChanged = () => {
      setFavorites(readFavorites());
    };

    window.addEventListener(
      "bazianhub-favorites-changed",
      handleFavoritesChanged
    );

    window.addEventListener(
      "storage",
      handleFavoritesChanged
    );

    return () => {
      window.removeEventListener(
        "bazianhub-favorites-changed",
        handleFavoritesChanged
      );

      window.removeEventListener(
        "storage",
        handleFavoritesChanged
      );
    };
  }, []);

  const toggleFavorite = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites((prev) => {
      const updated = {
        ...prev,
        [id]: !prev[id],
      };

      saveFavorites(updated);

      return updated;
    });
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 py-6 dark:bg-slate-950 sm:py-10">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">

        <div
          className="
            grid
            grid-cols-3
            gap-2
            sm:grid-cols-2
            sm:gap-4
            lg:grid-cols-3
            lg:gap-5
          "
        >
          {categories.map(
            (category: ServiceCategory) => {
              const Icon =
                CATEGORY_ICONS[category.icon];

              const isFavorite =
                !!favorites[category.id];

              const categoryTitle =
                getCategoryTitle(
                  category,
                  currentLanguage
                );

              return (
                <Link
                  key={category.id}
                  href={`/services/${category.id}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300",
                    "hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
                    "dark:border-slate-800/80 dark:bg-slate-900",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  )}
                >
                  {/* Top Area */}
                  <div className="p-2.5 sm:p-5">

                    <div className="flex items-start justify-between gap-1.5">

                      {/* Icon */}
                      <span
                        className="
                          flex h-9 w-9 shrink-0
                          items-center justify-center
                          rounded-xl
                          bg-primary/10
                          text-primary
                          transition-all
                          duration-300
                          group-hover:bg-primary
                          group-hover:text-white
                          sm:h-12 sm:w-12
                          sm:rounded-2xl
                        "
                      >
                        {Icon ? (
                          <Icon
                            className="h-4.5 w-4.5 sm:h-6 sm:w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <span>•</span>
                        )}
                      </span>

                      {/* Badges + Favorite */}
                      <div className="flex items-center gap-1">

                        {category.featured && (
                          <span
                            className="
                              hidden
                              items-center
                              gap-1
                              rounded-full
                              border
                              border-amber-500/30
                              bg-amber-500/10
                              px-2
                              py-1
                              text-[10px]
                              font-semibold
                              text-amber-700
                              sm:inline-flex
                            "
                          >
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </span>
                        )}

                        {category.popular && (
                          <span
                            className="
                              hidden
                              items-center
                              gap-1
                              rounded-full
                              border
                              border-rose-500/30
                              bg-rose-500/10
                              px-2
                              py-1
                              text-[10px]
                              font-semibold
                              text-rose-700
                              sm:inline-flex
                            "
                          >
                            <Flame className="h-3 w-3" />
                            Popular
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) =>
                            toggleFavorite(
                              e,
                              category.id
                            )
                          }
                          aria-label={
                            isFavorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                          aria-pressed={isFavorite}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full transition-all sm:h-9 sm:w-9",
                            "bg-slate-100 dark:bg-slate-800",
                            isFavorite
                              ? "text-rose-500"
                              : "text-slate-400 hover:text-rose-500"
                          )}
                        >
                          <Heart
                            className={cn(
                              "h-3.5 w-3.5 sm:h-4 sm:w-4",
                              isFavorite &&
                                "fill-current"
                            )}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="mt-2.5 sm:mt-4">
                      <h2
                        className="
                          line-clamp-2
                          text-[12px]
                          font-bold
                          leading-5
                          text-slate-900
                          group-hover:text-primary
                          dark:text-slate-100
                          sm:text-lg
                          sm:leading-7
                        "
                      >
                        {categoryTitle}
                      </h2>

                      <p
                        className="
                          mt-0.5
                          text-[9px]
                          font-medium
                          leading-4
                          text-slate-500
                          dark:text-slate-400
                          sm:text-xs
                        "
                      >
                        {category.filters.length}{" "}
                        {currentLanguage === "ckb"
                          ? "جۆر / خزمەتگوزاری"
                          : currentLanguage === "ar"
                            ? "نوع / خدمة"
                            : "types / services"}
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative mt-auto h-24 w-full overflow-hidden border-t border-slate-100 dark:border-slate-800 sm:h-40">

                    <Image
                      src={category.imageSrc}
                      alt={categoryTitle}
                      fill
                      sizes="
                        (max-width: 640px) 33vw,
                        (max-width: 1024px) 50vw,
                        33vw
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-700
                        group-hover:scale-110
                      "
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1 text-white sm:bottom-3 sm:left-4 sm:right-4">

                      <span className="truncate text-[8px] font-semibold sm:text-xs">
                        {currentLanguage === "ckb"
                          ? "بینینی زانیارییەکان"
                          : currentLanguage === "ar"
                            ? "عرض التفاصيل"
                            : "View details"}
                      </span>

                      <ArrowIcon
                        className="h-3 w-3 shrink-0 sm:h-4 sm:w-4"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}