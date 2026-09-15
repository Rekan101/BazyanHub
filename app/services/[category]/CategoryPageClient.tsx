"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Car,
  GraduationCap,
  HeartPulse,
  House,
  Scissors,
  ShoppingCart,
  Smartphone,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import {
  DEFAULT_CATEGORY_DESCRIPTION,
  type ServiceCategory,
  type ServiceFilter,
} from "@/lib/data/categories";

import ProviderCard from "@/components/providers/ProviderCard";
import ProviderModal from "@/components/providers/ProviderModal";

import type { Provider } from "@/lib/types/provider";

type LanguageCode = "ckb" | "ar" | "en";

/*
|--------------------------------------------------------------------------
| Category Icons
|--------------------------------------------------------------------------
*/

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
  briefcase: BriefcaseBusiness,
};

/*
|--------------------------------------------------------------------------
| UI Text
|--------------------------------------------------------------------------
*/

const UI_TEXT = {
  ckb: {
    back: "گەڕانەوە بۆ خزمەتگوزارییەکان",
    providersTitle: "خزمەتگوزاری و شوێنەکان",
    noProvidersTitle:
      "هیچ خزمەتگوزارییەک هێشتا زیاد نەکراوە",
    noProvidersDescription:
      "خزمەتگوزاری و کاروبارە نوێکان بە زوویی لێرە زیاد دەکرێن.",
    filterAll: "هەمووی",
    filterFeatured: "پڕداواکاریترین",
    filterSpecial: "تایبەت",
    filtersLabel: "پۆلێنکردن",
    noFilterResultsTitle:
      "هیچ ئەنجامێک نەدۆزرایەوە",
    noFilterResultsDescription:
      "لەم پۆلە بۆ ئێستا هیچ خزمەتگوزارییەک نییە، تکایە پۆلێکی تر تاقی بکەرەوە.",
  },

  ar: {
    back: "العودة إلى الخدمات",
    providersTitle: "الخدمات والأماكن",
    noProvidersTitle:
      "لم تتم إضافة خدمات بعد",
    noProvidersDescription:
      "ستتم إضافة الخدمات والأعمال الجديدة هنا قريبًا.",
    filterAll: "الكل",
    filterFeatured: "الأكثر طلبًا",
    filterSpecial: "مميز",
    filtersLabel: "التصنيفات",
    noFilterResultsTitle:
      "لا توجد نتائج",
    noFilterResultsDescription:
      "لا توجد خدمات ضمن هذا التصنيف حاليًا، جرّب تصنيفًا آخر.",
  },

  en: {
    back: "Back to services",
    providersTitle: "Services & Places",
    noProvidersTitle:
      "No services have been added yet",
    noProvidersDescription:
      "New services and businesses will be added here soon.",
    filterAll: "All",
    filterFeatured: "Most Requested",
    filterSpecial: "Special",
    filtersLabel: "Filters",
    noFilterResultsTitle:
      "No results found",
    noFilterResultsDescription:
      "No services match this filter yet, try another tab.",
  },
} satisfies Record<
  LanguageCode,
  Record<string, string>
>;

/*
|--------------------------------------------------------------------------
| Filters
|--------------------------------------------------------------------------
|
| Three fixed pills (all / featured / special) are always rendered. Any
| filter rows configured for this category in the database are appended after
| them, keyed by their slug.
|
*/

type FilterKey = string;

const FILTER_ALL: FilterKey = "all";
const FILTER_FEATURED: FilterKey = "featured";
const FILTER_SPECIAL: FilterKey = "special";

/*
|--------------------------------------------------------------------------
| Language Helpers
|--------------------------------------------------------------------------
*/

function isLanguageCode(
  value: string
): value is LanguageCode {
  return (
    value === "ckb" ||
    value === "ar" ||
    value === "en"
  );
}

function getCategoryTitle(
  category: ServiceCategory,
  language: LanguageCode
): string {
  return (
    category.translations[language] ??
    category.title
  );
}

function getCategoryDescription(
  category: ServiceCategory,
  language: LanguageCode
): string {
  return (
    category.descriptions?.[language] ??
    DEFAULT_CATEGORY_DESCRIPTION[language]
  );
}

function getFilterLabel(
  filter: ServiceFilter,
  language: LanguageCode
): string {
  return (
    filter.translations[language] ??
    filter.label
  );
}

/*
|--------------------------------------------------------------------------
| Category Page (client)
|--------------------------------------------------------------------------
|
| Receives already-fetched data from the server component in page.tsx and
| owns the interactive bits: the selected filter pill and the provider modal.
|
*/

type CategoryPageClientProps = {
  category: ServiceCategory;
  providers: Provider[];
  filters: ServiceFilter[];
};

export default function CategoryPageClient({
  category,
  providers,
  filters,
}: CategoryPageClientProps) {
  const { language } = useLanguage();

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  const [activeFilter, setActiveFilter] =
    useState<FilterKey>(FILTER_ALL);

  const currentLanguage: LanguageCode =
    isLanguageCode(language)
      ? language
      : "ckb";

  const t = UI_TEXT[currentLanguage];

  const isRTL = currentLanguage !== "en";

  const ArrowIcon = isRTL
    ? ArrowLeft
    : ArrowRight;

  /*
  |--------------------------------------------------------------------------
  | Filter Pills
  |--------------------------------------------------------------------------
  */

  const filterPills = useMemo(() => {
    const base = [
      { key: FILTER_ALL, label: t.filterAll },
      {
        key: FILTER_FEATURED,
        label: t.filterFeatured,
      },
      {
        key: FILTER_SPECIAL,
        label: t.filterSpecial,
      },
    ];

    const dynamic = filters.map((filter) => ({
      key: filter.id,
      label: getFilterLabel(
        filter,
        currentLanguage
      ),
    }));

    return [...base, ...dynamic];
  }, [filters, currentLanguage, t]);

  /*
  |--------------------------------------------------------------------------
  | Visible Providers
  |--------------------------------------------------------------------------
  */

  const visibleProviders = useMemo(() => {
    if (activeFilter === FILTER_ALL) {
      return providers;
    }

    if (activeFilter === FILTER_FEATURED) {
      return providers.filter(
        (provider) => provider.featured
      );
    }

    if (activeFilter === FILTER_SPECIAL) {
      return providers.filter(
        (provider) => provider.special
      );
    }

    /*
     * A database filter slug. Providers carry their assigned filter as
     * `subcategory` after mapping, so match on that; a provider with no
     * filter assigned simply never matches, which is the point of filters
     * being optional.
     */
    const matching = filters.find(
      (filter) => filter.id === activeFilter
    );

    if (!matching) {
      return providers;
    }

    return providers.filter(
      (provider) =>
        provider.subcategory ===
          matching.label ||
        provider.subcategory === matching.id ||
        (provider.tags ?? []).includes(
          matching.label
        )
    );
  }, [activeFilter, providers, filters]);

  /*
  |--------------------------------------------------------------------------
  | Category Header Data
  |--------------------------------------------------------------------------
  */

  const categoryTitle = getCategoryTitle(
    category,
    currentLanguage
  );

  const categoryDescription =
    getCategoryDescription(
      category,
      currentLanguage
    );

  const CategoryIcon =
    CATEGORY_ICONS[category.icon ?? ""];

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <main
      dir={
        isRTL
          ? "rtl"
          : "ltr"
      }
      className="
        min-h-screen
        bg-slate-50
        px-3
        py-6
        dark:bg-slate-950
        sm:px-6
        sm:py-10
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >
        {/* =========================================================
            Header
        ========================================================== */}

        <header className="mb-8">
          <Link
            href="/#services"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-blue-600 dark:text-blue-500
              transition-opacity
              hover:opacity-80
            "
          >
            <ArrowIcon
              className="h-4 w-4"
              aria-hidden="true"
            />

            {t.back}
          </Link>

          <div
            className="
              mt-6
              flex
              items-start
              gap-4
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-blue-600/10 dark:bg-blue-500/10
                text-blue-600 dark:text-blue-500
                sm:h-16
                sm:w-16
              "
            >
              {CategoryIcon ? (
                <CategoryIcon
                  className="
                    h-7
                    w-7
                    sm:h-8
                    sm:w-8
                  "
                  aria-hidden="true"
                />
              ) : (
                <BriefcaseBusiness
                  className="
                    h-7
                    w-7
                    sm:h-8
                    sm:w-8
                  "
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-sm
                  font-semibold
                  text-blue-600 dark:text-blue-500
                "
              >
                BazianHub
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  sm:text-3xl
                "
              >
                {categoryTitle}
              </h1>

              <p
                className="
                  mt-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {categoryDescription}
              </p>
            </div>
          </div>
        </header>

        {/* =========================================================
            Filter Pills
        ========================================================== */}

        <div
          role="tablist"
          aria-label={t.filtersLabel}
          className="
            mb-6
            flex
            snap-x
            gap-2
            overflow-x-auto
            pb-2
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            sm:flex-wrap
            sm:overflow-visible
          "
        >
          {filterPills.map((pill) => {
            const isActive =
              activeFilter === pill.key;

            return (
              <button
                key={pill.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() =>
                  setActiveFilter(pill.key)
                }
                className={`
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

                  focus-visible:ring-2
                  focus-visible:ring-blue-600/60 dark:focus-visible:ring-blue-500/60
                  focus-visible:ring-offset-2

                  ${
                    isActive
                      ? `
                          border-blue-600 dark:border-blue-500
                          bg-blue-600 dark:bg-blue-500
                          text-white
                          shadow-md
                          shadow-blue-600/25 dark:shadow-blue-500/25
                        `
                      : `
                          border-slate-200
                          bg-white/80
                          text-slate-700
                          hover:border-blue-600/40 dark:hover:border-blue-500/40
                          hover:text-blue-600 dark:hover:text-blue-500
                          dark:border-slate-800
                          dark:bg-slate-900/80
                          dark:text-slate-300
                        `
                  }
                `}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* =========================================================
            Provider Heading
        ========================================================== */}

        <div
          className="
            mb-5
            flex
            items-center
            justify-between
            gap-4
          "
        >
          <h2
            className="
              text-lg
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {t.providersTitle}
          </h2>

          <span
            className="
              rounded-full
              bg-slate-100
              px-3
              py-1
              text-xs
              font-semibold
              text-slate-600
              dark:bg-slate-800
              dark:text-slate-300
            "
          >
            {visibleProviders.length}
          </span>
        </div>

        {/* =========================================================
            Empty States
        ========================================================== */}

        {providers.length === 0 ? (
          <section
            className="
              rounded-3xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-10
              text-center
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-blue-600 dark:text-blue-500
                dark:bg-slate-800
              "
            >
              {CategoryIcon ? (
                <CategoryIcon
                  className="h-7 w-7"
                  aria-hidden="true"
                />
              ) : (
                <BriefcaseBusiness
                  className="h-7 w-7"
                  aria-hidden="true"
                />
              )}
            </div>

            <h2
              className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              {t.noProvidersTitle}
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-600
                dark:text-slate-400
              "
            >
              {t.noProvidersDescription}
            </p>
          </section>
        ) : visibleProviders.length === 0 ? (
          /* Providers exist, but none match the active filter. */
          <section
            className="
              rounded-3xl
              border
              border-dashed
              border-slate-300
              bg-white
              p-10
              text-center
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-blue-600 dark:text-blue-500
                dark:bg-slate-800
              "
            >
              {CategoryIcon ? (
                <CategoryIcon
                  className="h-7 w-7"
                  aria-hidden="true"
                />
              ) : (
                <BriefcaseBusiness
                  className="h-7 w-7"
                  aria-hidden="true"
                />
              )}
            </div>

            <h2
              className="
                text-lg
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              {t.noFilterResultsTitle}
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-600
                dark:text-slate-400
              "
            >
              {t.noFilterResultsDescription}
            </p>
          </section>
        ) : (
          /* =========================================================
             Provider Grid
          ========================================================== */

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:gap-4
            "
          >
            {visibleProviders.map(
              (provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onClick={
                    setSelectedProvider
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      {/* =========================================================
          Provider Modal
      ========================================================== */}

      <ProviderModal
        provider={selectedProvider}
        isOpen={
          selectedProvider !== null
        }
        onClose={() =>
          setSelectedProvider(null)
        }
      />
    </main>
  );
}
