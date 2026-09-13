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
  AnimatePresence,
  motion,
} from "framer-motion";
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

type ServiceFilterKey =
  | "all"
  | "popular"
  | "featured";

const FAVORITES_STORAGE_KEY =
  "bazianhub-favorites";

const GRID_ANIMATION = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },

  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.04,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),

  exit: {
    opacity: 0,
    scale: 0.92,
    transition: {
      duration: 0.2,
    },
  },
} as const;

const CATEGORY_ICONS: Record<
  string,
  LucideIcon
> = {
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

/*
 * Exactly 3 hardcoded filter pills — All / Most Requested /
 * Special. No dynamically generated per-category filters.
 */
const SERVICE_FILTERS: Array<{
  id: ServiceFilterKey;
  translations: {
    ckb: string;
    ar: string;
    en: string;
  };
}> = [
  {
    id: "all",
    translations: {
      ckb: "هەمووی",
      ar: "الكل",
      en: "All",
    },
  },

  {
    id: "popular",
    translations: {
      ckb: "پڕداواکاریترین",
      ar: "الأكثر طلبًا",
      en: "Most Requested",
    },
  },

  {
    id: "featured",
    translations: {
      ckb: "تایبەت",
      ar: "مميز",
      en: "Special",
    },
  },
];

const SERVICE_UI_TEXT: Record<
  string,
  {
    categoryTypes: string;
    servicesList: string;
    featured: string;
    popular: string;
    favoriteAdd: string;
  }
> = {
  ckb: {
    categoryTypes: "جۆر / خزمەتگوزاری",
    servicesList:
      "لیستی خزمەتگوزارییەکان",
    featured: "تایبەت",
    popular: "پڕداواکاری",
    favoriteAdd:
      "زیادکردن بۆ دڵخوازەکان",
  },

  ar: {
    categoryTypes: "نوع / خدمة",
    servicesList: "قائمة الخدمات",
    featured: "مميز",
    popular: "الأكثر طلبًا",
    favoriteAdd:
      "إضافة إلى المفضلة",
  },

  en: {
    categoryTypes: "types / services",
    servicesList: "Services List",
    featured: "Featured",
    popular: "Popular",
    favoriteAdd:
      "Add to favorites",
  },
};

function getLocalizedText(
  language: LanguageCode,
  translations: {
    ckb: string;
    ar: string;
    en: string;
  }
) {
  return translations[language];
}

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
  const localized =
    CATEGORY_TITLES[category.id];

  if (localized) {
    return localized[language];
  }

  return category.translations[language];
}

function readFavorites(): Record<
  string,
  boolean
> {
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

    const parsed: unknown =
      JSON.parse(stored);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
    ) {
      return parsed as Record<
        string,
        boolean
      >;
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
      new CustomEvent(
        "bazianhub-favorites-changed"
      )
    );
  } catch {
    // Ignore localStorage errors.
  }
}

export function ServicesSection() {
  const { t, language } =
    useLanguage();

  const currentLanguage =
    language as LanguageCode;

  const ui =
    SERVICE_UI_TEXT[
      currentLanguage
    ] ?? SERVICE_UI_TEXT.ckb;

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<ServiceFilterKey>(
    "all"
  );

  const [favorites, setFavorites] =
    useState<
      Record<string, boolean>
    >({});

  const isRTL =
    currentLanguage !== "en";

  const ArrowIcon = isRTL
    ? ArrowLeft
    : ArrowRight;

  useEffect(() => {
    setFavorites(
      readFavorites()
    );

    const handleFavoritesChanged =
      () => {
        setFavorites(
          readFavorites()
        );
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

  const visibleCategories =
    useMemo(() => {
      if (
        activeFilter === "popular"
      ) {
        return categories.filter(
          (category) =>
            category.popular
        );
      }

      if (
        activeFilter === "featured"
      ) {
        return categories.filter(
          (category) =>
            category.featured
        );
      }

      // "all"
      return categories;
    }, [activeFilter]);

  const toggleFavorite = (
    e: MouseEvent,
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
    <section
      id="services"
      className="w-full py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span
            className="
              mb-3
              inline-flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-primary/20
              bg-primary/10
              text-xl
              text-primary
              shadow-sm
            "
            aria-hidden="true"
          >
            🏪
          </span>

          <h2
            className="
              text-2xl
              font-extrabold
              tracking-tight
              text-slate-900
              dark:text-slate-100
              sm:text-4xl
            "
          >
            {t("servicesTitle")}
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-2xl
              text-sm
              leading-relaxed
              text-slate-600
              dark:text-slate-400
              sm:text-base
            "
          >
            {t("servicesDescription")}
          </p>
        </div>

        {/* Filters */}
        <div
          role="tablist"
          aria-label={t("servicesFilter")}
          className="
            mt-10
            flex
            snap-x
            gap-2
            overflow-x-auto
            pb-2
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            sm:flex-wrap
            sm:justify-center
            sm:overflow-visible
          "
        >
          {SERVICE_FILTERS.map((filter) => {
            const isActive =
              activeFilter ===
              filter.id;

            const label =
              getLocalizedText(
                currentLanguage,
                filter.translations
              );

            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={
                  isActive
                }
                onClick={() =>
                  setActiveFilter(
                    filter.id
                  )
                }
                className={cn(
                  `
                    relative
                    shrink-0
                    snap-start
                    rounded-full
                    border
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    outline-none
                    transition-all
                    duration-300
                  `,
                  `
                    focus-visible:ring-2
                    focus-visible:ring-primary/60
                    focus-visible:ring-offset-2
                  `,
                  isActive
                    ? `
                        border-primary
                        bg-primary
                        text-white
                        shadow-md
                        shadow-primary/25
                      `
                    : `
                        border-slate-200
                        bg-white/80
                        text-slate-700
                        hover:border-primary/40
                        hover:text-primary
                        dark:border-slate-800
                        dark:bg-slate-900/80
                        dark:text-slate-300
                      `
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div
          className="
            mt-10
            grid
            grid-cols-2
            gap-3
            sm:gap-4
          "
        >
          <AnimatePresence mode="popLayout">
            {visibleCategories.map(
              (
                category: ServiceCategory,
                index: number
              ) => {
                const Icon =
                  CATEGORY_ICONS[
                    category.icon
                  ];

                const isFavorite =
                  !!favorites[
                    category.id
                  ];

                const categoryTitle =
                  getCategoryTitle(
                    category,
                    currentLanguage
                  );

                return (
                  <motion.div
                    key={category.id}
                    custom={index}
                    variants={
                      GRID_ANIMATION
                    }
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="min-w-0"
                  >
                    <Link
                      href={`/services/${category.id}`}
                      className={cn(
                        `
                          group
                          relative
                          flex
                          h-full
                          min-w-0
                          flex-col
                          overflow-hidden
                          rounded-2xl
                          border
                          border-slate-200/80
                          bg-white
                          shadow-sm
                          transition-all
                          duration-500
                        `,
                        `
                          hover:-translate-y-1
                          hover:border-primary/50
                          hover:shadow-xl
                          hover:shadow-primary/10
                        `,
                        `
                          dark:border-slate-800/80
                          dark:bg-slate-900
                          dark:hover:border-primary/50
                          dark:hover:shadow-primary/20
                        `,
                        `
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-primary/60
                          focus-visible:ring-offset-2
                        `
                      )}
                    >
                      {/* Top Info Area */}
                      <div
                        className="
                          flex
                          min-w-0
                          flex-col
                          p-3
                          pb-2.5
                          sm:p-5
                          sm:pb-4
                        "
                      >
                        {/* Icon / Badges / Favorite */}
                        <div
                          className="
                            flex
                            min-w-0
                            items-start
                            justify-between
                            gap-1.5
                          "
                        >
                          <span
                            className="
                              flex
                              h-9
                              w-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-primary/10
                              text-primary
                              transition-all
                              duration-300
                              group-hover:bg-primary
                              group-hover:text-white
                              group-hover:shadow-md
                              group-hover:shadow-primary/30
                              sm:h-12
                              sm:w-12
                              sm:rounded-2xl
                            "
                          >
                            {Icon ? (
                              <Icon
                                className="
                                  h-4
                                  w-4
                                  sm:h-6
                                  sm:w-6
                                "
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                className="
                                  text-xs
                                  sm:text-xs
                                "
                                aria-hidden="true"
                              >
                                •
                              </span>
                            )}
                          </span>

                          <div
                            className="
                              flex
                              min-w-0
                              items-center
                              gap-1
                              sm:gap-1.5
                            "
                          >
                            {category.featured && (
                              <span
                                className="
                                  inline-flex
                                  shrink-0
                                  items-center
                                  gap-0.5
                                  rounded-full
                                  border
                                  border-amber-500/30
                                  bg-amber-500/10
                                  p-1.5
                                  text-[0px]
                                  font-semibold
                                  text-amber-700
                                  dark:bg-amber-500/20
                                  dark:text-amber-300
                                  sm:gap-1
                                  sm:px-2.5
                                  sm:py-1
                                  sm:text-[11px]
                                "
                                title={
                                  ui.featured
                                }
                              >
                                <Sparkles
                                  className="
                                    h-3
                                    w-3
                                    sm:h-3
                                    sm:w-3
                                  "
                                  aria-hidden="true"
                                />

                                <span className="hidden sm:inline">
                                  {
                                    ui.featured
                                  }
                                </span>
                              </span>
                            )}

                            {category.popular && (
                              <span
                                className="
                                  inline-flex
                                  shrink-0
                                  items-center
                                  gap-0.5
                                  rounded-full
                                  border
                                  border-rose-500/30
                                  bg-rose-500/10
                                  p-1.5
                                  text-[0px]
                                  font-semibold
                                  text-rose-700
                                  dark:bg-rose-500/20
                                  dark:text-rose-300
                                  sm:gap-1
                                  sm:px-2.5
                                  sm:py-1
                                  sm:text-[11px]
                                "
                                title={
                                  ui.popular
                                }
                              >
                                <Flame
                                  className="
                                    h-3
                                    w-3
                                    sm:h-3
                                    sm:w-3
                                  "
                                  aria-hidden="true"
                                />

                                <span className="hidden sm:inline">
                                  {
                                    ui.popular
                                  }
                                </span>
                              </span>
                            )}

                            {/* Favorite Button */}
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
                                  : ui.favoriteAdd
                              }
                              aria-pressed={
                                isFavorite
                              }
                              className={cn(
                                `
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  transition-all
                                  duration-300
                                `,
                                `
                                  bg-slate-100/80
                                  dark:bg-slate-800/80
                                `,
                                `
                                  hover:bg-rose-50
                                  dark:hover:bg-rose-950/40
                                `,
                                `
                                  sm:h-9
                                  sm:w-9
                                `,
                                isFavorite
                                  ? "text-rose-500"
                                  : "text-slate-400 hover:text-rose-500"
                              )}
                            >
                              <Heart
                                className={cn(
                                  `
                                    h-3.5
                                    w-3.5
                                    transition-transform
                                    duration-300
                                    sm:h-4
                                    sm:w-4
                                  `,
                                  isFavorite &&
                                    "scale-110 fill-current"
                                )}
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        {/* Category Information */}
                        <div
                          className="
                            mt-2
                            min-w-0
                            sm:mt-4
                          "
                        >
                          <h3
                            className="
                              line-clamp-2
                              break-words
                              text-sm
                              font-bold
                              leading-5
                              text-slate-900
                              transition-colors
                              group-hover:text-primary
                              dark:text-slate-100
                              sm:text-lg
                              sm:leading-7
                            "
                          >
                            {categoryTitle}
                          </h3>

                          <p
                            className="
                              mt-1
                              line-clamp-2
                              text-[11px]
                              font-medium
                              leading-4
                              text-slate-500
                              dark:text-slate-400
                              sm:text-xs
                              sm:leading-5
                            "
                          >
                            {category.filters.length > 0
                              ? `${category.filters.length} ${ui.categoryTypes}`
                              : ui.servicesList}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Cover Image */}
                      <div
                        className="
                          relative
                          mt-auto
                          h-28
                          w-full
                          overflow-hidden
                          border-t
                          border-slate-100
                          dark:border-slate-800/80
                          sm:h-40
                        "
                      >
                        <Image
                          src={category.imageSrc}
                          alt={categoryTitle}
                          fill
                          loading="lazy"
                          fetchPriority="low"
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 50vw, 33vw"
                          className="
                            object-cover
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-110
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-slate-950/80
                            via-slate-950/20
                            to-transparent
                            transition-opacity
                            duration-300
                            group-hover:opacity-75
                          "
                        />

                        <div
                          className="
                            absolute
                            bottom-2
                            left-2.5
                            right-2.5
                            flex
                            items-center
                            justify-between
                            gap-1
                            text-white
                            sm:bottom-3
                            sm:left-4
                            sm:right-4
                            sm:gap-2
                          "
                        >
                          <span
                            className="
                              min-w-0
                              truncate
                              text-[10px]
                              font-semibold
                              drop-shadow-sm
                              sm:text-xs
                            "
                          >
                            {currentLanguage ===
                            "ckb"
                              ? "بینینی زانیارییەکان"
                              : currentLanguage ===
                                  "ar"
                                ? "عرض التفاصيل"
                                : "View details"}
                          </span>

                          <ArrowIcon
                            className={cn(
                              `
                                h-3
                                w-3
                                shrink-0
                                text-white
                                transition-transform
                                duration-300
                                sm:h-4
                                sm:w-4
                              `,
                              isRTL
                                ? "group-hover:-translate-x-1.5"
                                : "group-hover:translate-x-1.5"
                            )}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              }
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}