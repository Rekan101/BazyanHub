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
  Flame,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  type ServiceCategory,
  type LanguageCode,
} from "@/lib/data/categories";
import { useLanguage } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

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

type ServiceCategoryFromDatabase = ServiceCategory & {
  is_featured: boolean;
  is_popular: boolean;
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

  const [categories, setCategories] =
    useState<ServiceCategoryFromDatabase[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [favorites, setFavorites] =
    useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Failed to load categories:",
          error
        );

        setError(
          "Failed to load service categories."
        );

        setIsLoading(false);

        return;
      }

      const mappedCategories: ServiceCategoryFromDatabase[] =
        ((data ?? []) as Array<{
          id: string;
          slug: string;
          name_ckb: string;
          name_ar: string;
          name_en: string;
          icon: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          is_featured: boolean;
          is_popular: boolean;
        }>).map((category) => ({
          id: category.slug,
          title: category.name_ckb,
          translations: {
            ckb: category.name_ckb,
            ar: category.name_ar,
            en: category.name_en,
          },
          icon: category.icon ?? "",
          filters: [],
          imageSrc:
            category.image_url ??
            "/images/placeholder.webp",
          is_featured:
            category.is_featured ?? false,
          is_popular:
            category.is_popular ?? false,
        }));

      setCategories(mappedCategories);
      setIsLoading(false);
    }

    loadCategories();
  }, []);

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

  if (isLoading) {
    return (
      <main className="min-h-screen w-full bg-slate-50 py-6 dark:bg-slate-950 sm:py-10">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {Array.from({ length: 10 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 sm:h-64"
                />
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm dark:border-red-900/50 dark:bg-slate-900">
          <p className="font-semibold text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </main>
    );
  }

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
            (
              category: ServiceCategoryFromDatabase
            ) => {
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
                        {/* Popular Badge */}
                       {category.is_popular && (
                                  <span
                                    className="
                                      inline-flex
                                      h-7
                                      items-center
                                      gap-1
                                      rounded-full
                                      bg-rose-50
                                      px-2
                                      text-[9px]
                                      font-bold
                                      text-rose-600
                                      ring-1
                                      ring-rose-200
                                      sm:h-9
                                      sm:px-2.5
                                      sm:text-[11px]
                                      dark:bg-rose-950/40
                                      dark:text-rose-400
                                      dark:ring-rose-900/50
                                    "
                                  >
                            <Flame
                              className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                              aria-hidden="true"
                            />

                            <span className="hidden sm:inline">
                              {currentLanguage === "ckb"
                                ? "پڕداواکارترین"
                                : currentLanguage === "ar"
                                  ? "الأكثر طلبًا"
                                  : "Most Popular"}
                            </span>
                          </span>
                        )}

                        {/* Featured Badge */}
                        {category.is_featured && (
                          <span
                            className="
                              inline-flex
                              h-7
                              items-center
                              gap-1
                              rounded-full
                              bg-amber-50
                              px-2
                              text-[9px]
                              font-bold
                              text-amber-600
                              ring-1
                              ring-amber-200
                              sm:h-9
                              sm:px-2.5
                              sm:text-[11px]
                              dark:bg-amber-950/40
                              dark:text-amber-400
                              dark:ring-amber-900/50
                            "
                          >
                            <Sparkles
                              className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                              aria-hidden="true"
                            />

                            <span className="hidden sm:inline">
                              {currentLanguage === "ckb"
                                ? "تایبەت"
                                : currentLanguage === "ar"
                                  ? "مميز"
                                  : "Featured"}
                            </span>
                          </span>
                        )}

                        {/* Favorite */}
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