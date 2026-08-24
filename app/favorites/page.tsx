"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Sparkles,
  Flame,
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

  return category.title;
}

function readFavorites(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);

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

export default function FavoritesPage() {
  const { language } = useLanguage();

  const currentLanguage = language as LanguageCode;

  const isRTL = currentLanguage !== "en";

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [favorites, setFavorites] =
    useState<Record<string, boolean>>({});

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFavorites(readFavorites());
    setIsLoaded(true);

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

  const favoriteCategories = useMemo(() => {
    if (!isLoaded) {
      return [];
    }

    return categories.filter(
      (category) => favorites[category.id] === true
    );
  }, [favorites, isLoaded]);

  const removeFavorite = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites((prev) => {
      const updated = {
        ...prev,
        [id]: false,
      };

      saveFavorites(updated);

      return updated;
    });
  };

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center">
          <span
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-sm"
            aria-hidden="true"
          >
            <Heart className="h-7 w-7 fill-current" />
          </span>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            {currentLanguage === "ckb"
              ? "دڵخوازەکان"
              : currentLanguage === "ar"
                ? "المفضلة"
                : "Favorites"}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {currentLanguage === "ckb"
              ? "ئەو خزمەتگوزاری و بەشانەی کە هەڵتبژاردوون لێرە پیشان دەدرێن."
              : currentLanguage === "ar"
                ? "ستظهر هنا الخدمات والأقسام التي أضفتها إلى المفضلة."
                : "The services and categories you added to your favorites will appear here."}
          </p>
        </div>

        {/* Favorites */}
        {isLoaded && favoriteCategories.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {favoriteCategories.map((category) => {
              const Icon =
                CATEGORY_ICONS[category.icon];

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
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-500",
                    "hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
                    "dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-primary/50 dark:hover:shadow-primary/20"
                  )}
                >
                  {/* Top */}
                  <div className="flex flex-col p-3 pb-3 sm:p-5 sm:pb-4">
                    <div className="flex items-start justify-between gap-1.5">

                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl",
                          "bg-primary/10 text-primary transition-all duration-300",
                          "group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/30"
                        )}
                      >
                        {Icon ? (
                          <Icon
                            className="h-5 w-5 sm:h-6 sm:w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            className="text-xs"
                            aria-hidden="true"
                          >
                            •
                          </span>
                        )}
                      </span>

                      <div className="flex items-center gap-1.5">

                        {category.featured && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[9px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 sm:text-[11px]">
                            <Sparkles className="h-3 w-3" />
                            {currentLanguage === "ckb"
                              ? "تایبەت"
                              : currentLanguage === "ar"
                                ? "مميز"
                                : "Featured"}
                          </span>
                        )}

                        {category.popular && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[9px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 sm:text-[11px]">
                            <Flame className="h-3 w-3" />
                            {currentLanguage === "ckb"
                              ? "پڕداواکاری"
                              : currentLanguage === "ar"
                                ? "الأكثر طلبًا"
                                : "Popular"}
                          </span>
                        )}

                        <button
                          type="button"
                          aria-label={
                            currentLanguage === "ckb"
                              ? "لابردن لە دڵخوازەکان"
                              : currentLanguage === "ar"
                                ? "إزالة من المفضلة"
                                : "Remove from favorites"
                          }
                          onClick={(e) =>
                            removeFavorite(
                              e,
                              category.id
                            )
                          }
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 transition-all duration-300 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 sm:h-9 sm:w-9"
                        >
                          <Heart className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 min-w-0 sm:mt-4">
                      <h2 className="line-clamp-2 break-words text-[15px] font-bold leading-6 text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100 sm:text-lg sm:leading-7">
                        {categoryTitle}
                      </h2>

                      <p className="mt-0.5 text-[10px] font-medium leading-5 text-slate-500 dark:text-slate-400 sm:text-xs">
                        {category.filters.length > 0
                          ? `${category.filters.length} ${
                              currentLanguage === "ckb"
                                ? "جۆر / خزمەتگوزاری"
                                : currentLanguage === "ar"
                                  ? "نوع / خدمة"
                                  : "types / services"
                            }`
                          : currentLanguage === "ckb"
                            ? "لیستی خزمەتگوزارییەکان"
                            : currentLanguage === "ar"
                              ? "قائمة الخدمات"
                              : "Services List"}
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative mt-auto h-32 w-full overflow-hidden border-t border-slate-100 dark:border-slate-800/80 sm:h-40">
                    <Image
                      src={category.imageSrc}
                      alt={categoryTitle}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent transition-opacity duration-300 group-hover:opacity-75" />

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 text-white sm:bottom-3 sm:left-4 sm:right-4">
                      <span className="min-w-0 truncate text-[10px] font-semibold drop-shadow-sm sm:text-xs">
                        {currentLanguage === "ckb"
                          ? "بینینی زانیارییەکان"
                          : currentLanguage === "ar"
                            ? "عرض التفاصيل"
                            : "View details"}
                      </span>

                      <ArrowIcon
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 text-white transition-transform duration-300 sm:h-4 sm:w-4",
                          isRTL
                            ? "group-hover:-translate-x-1.5"
                            : "group-hover:translate-x-1.5"
                        )}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : isLoaded ? (
          /* Empty State */
          <div className="mx-auto mt-12 flex max-w-xl flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <Heart className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">
              {currentLanguage === "ckb"
                ? "هیچ دڵخوازێکت نییە"
                : currentLanguage === "ar"
                  ? "لا توجد مفضلة"
                  : "No favorites yet"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {currentLanguage === "ckb"
                ? "لە بەشی خزمەتگوزارییەکان ❤️ لەسەر ئەو بەشە بکە کە دەتەوێت بیخەیتە دڵخوازەکان."
                : currentLanguage === "ar"
                  ? "اذهب إلى الخدمات واضغط على ❤️ لإضافة ما تريد إلى المفضلة."
                  : "Go to services and press ❤️ on any category you want to add to favorites."}
            </p>

            <Link
              href="/#services"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
            >
              {currentLanguage === "ckb"
                ? "بینینی خزمەتگوزارییەکان"
                : currentLanguage === "ar"
                  ? "عرض الخدمات"
                  : "View Services"}

              <ArrowIcon
                className="h-4 w-4"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}