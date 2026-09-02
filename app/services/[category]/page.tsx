"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { restaurants } from "@/lib/data/services/restaurants";

import ProviderCard from "@/components/providers/ProviderCard";
import ProviderModal from "@/components/providers/ProviderModal";

import type {
  Provider,
  ProviderSocials as ProviderSocialLinks,
} from "@/lib/types/provider";

type LanguageCode = "ckb" | "ar" | "en";

type Category = {
  id: string;
  slug: string;

  name_ckb: string;
  name_ar: string;
  name_en: string;

  description_ckb: string | null;
  description_ar: string | null;
  description_en: string | null;

  icon: string | null;
  image_url: string | null;
  is_active: boolean;
};

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
| Categories
|--------------------------------------------------------------------------
*/

const CATEGORIES: Category[] = [
  {
    id: "vehicles",
    slug: "vehicles",
    name_ckb: "سەیارە و گواستنەوە",
    name_ar: "السيارات والنقل",
    name_en: "Vehicles & Transportation",

    description_ckb:
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
    description_en:
      "Discover services and businesses in this category.",

    icon: "car",
    image_url: "/images/vehicles.webp",
    is_active: true,
  },

  {
    id: "restaurants",
    slug: "restaurants",
    name_ckb: "چێشتخانە و خواردن",
    name_ar: "المطاعم والطعام",
    name_en: "Restaurants & Food",

    description_ckb:
      "چێشتخانە، کافێ و شوێنەکانی خواردن لە بازیان بدۆزەرەوە.",
    description_ar:
      "اكتشف المطاعم والمقاهي وأماكن الطعام في بازیان.",
    description_en:
      "Discover restaurants, cafes and food places in Bazian.",

    icon: "utensils",
    image_url: "/images/restaurants.webp",
    is_active: true,
  },

  {
    id: "shopping",
    slug: "shopping",
    name_ckb: "بازاڕ و کڕین",
    name_ar: "الأسواق والتسوق",
    name_en: "Shopping & Markets",

    description_ckb:
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
    description_en:
      "Discover services and businesses in this category.",

    icon: "shopping-cart",
    image_url: "/images/shopping.webp",
    is_active: true,
  },

  {
    id: "health",
    slug: "health",
    name_ckb: "تەندروستی",
    name_ar: "الصحة",
    name_en: "Health",

    description_ckb:
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
    description_en:
      "Discover services and businesses in this category.",

    icon: "heart-pulse",
    image_url: "/images/health.webp",
    is_active: true,
  },

  {
    id: "mobile",
    slug: "mobile",
    name_ckb: "مۆبایل و تەکنەلۆجیا",
    name_ar: "الهواتف والتكنولوجيا",
    name_en: "Mobile & Technology",

    description_ckb:
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
    description_en:
      "Discover services and businesses in this category.",

    icon: "smartphone",
    image_url: "/images/mobile.webp",
    is_active: true,
  },

  {
    id: "beauty",
    slug: "beauty",
    name_ckb: "جوانکاری",
    name_ar: "التجميل",
    name_en: "Beauty",

    description_ckb:
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
    description_en:
      "Discover services and businesses in this category.",

    icon: "scissors",
    image_url: "/images/beauty.webp",
    is_active: true,
  },

  {
    id: "real-estate",
    slug: "real-estate",
    name_ckb: "خانووبەرە",
    name_ar: "العقارات",
    name_en: "Real Estate",

    description_ckb:
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
    description_en:
      "Discover services and businesses in this category.",

    icon: "house",
    image_url: "/images/real-estate.webp",
    is_active: true,
  },

  {
    id: "institutes",
    slug: "institutes",
    name_ckb: "پەروەردە و فێرکاری",
    name_ar: "التعليم والتدريب",
    name_en: "Education & Training",

    description_ckb:
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
    description_en:
      "Discover services and businesses in this category.",

    icon: "graduation-cap",
    image_url: "/images/institutes.webp",
    is_active: true,
  },

  {
    id: "workers",
    slug: "workers",
    name_ckb: "کرێکار و پیشەکار",
    name_ar: "العمال والحرفيون",
    name_en: "Workers & Handymen",

    description_ckb:
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
    description_en:
      "Discover services and businesses in this category.",

    icon: "wrench",
    image_url: "/images/workers.webp",
    is_active: true,
  },

  {
    id: "jobs",
    slug: "jobs",
    name_ckb: "هەلی کار",
    name_ar: "فرص العمل",
    name_en: "Job Opportunities",

    description_ckb:
      "هەلی کار و دامەزراندنەکانی ئەم بەشە بدۆزەرەوە.",
    description_ar:
      "اكتشف فرص العمل والتوظيف في هذا القسم.",
    description_en:
      "Discover jobs and employment opportunities.",

    icon: "briefcase",
    image_url: "/images/jobs.webp",
    is_active: true,
  },
];

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
  },

  ar: {
    back: "العودة إلى الخدمات",
    providersTitle: "الخدمات والأماكن",
    noProvidersTitle:
      "لم تتم إضافة خدمات بعد",
    noProvidersDescription:
      "ستتم إضافة الخدمات والأعمال الجديدة هنا قريبًا.",
  },

  en: {
    back: "Back to services",
    providersTitle: "Services & Places",
    noProvidersTitle:
      "No services have been added yet",
    noProvidersDescription:
      "New services and businesses will be added here soon.",
  },
} satisfies Record<
  LanguageCode,
  Record<string, string>
>;

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
  category: Category,
  language: LanguageCode
): string {
  if (language === "ckb") {
    return category.name_ckb;
  }

  if (language === "ar") {
    return category.name_ar;
  }

  return category.name_en;
}

function getCategoryDescription(
  category: Category,
  language: LanguageCode
): string {
  if (language === "ckb") {
    return (
      category.description_ckb ??
      "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە."
    );
  }

  if (language === "ar") {
    return (
      category.description_ar ??
      "اكتشف الخدمات والأعمال التجارية في هذا القسم."
    );
  }

  return (
    category.description_en ??
    "Discover services and businesses in this category."
  );
}

/*
|--------------------------------------------------------------------------
| Social Normalizer
|--------------------------------------------------------------------------
*/

function normalizeSocials(
  socials: unknown
): ProviderSocialLinks | undefined {
  if (!socials || typeof socials !== "object") {
    return undefined;
  }

  const source =
    socials as Record<
      string,
      unknown
    >;

  const result: ProviderSocialLinks = {};

  const platforms = [
    "whatsapp",
    "instagram",
    "facebook",
    "tiktok",
    "viber",
  ] as const;

  for (const platform of platforms) {
    const value = source[platform];

    if (typeof value === "string" && value.trim()) {
      result[platform] = value.trim();
    }
  }

  return Object.keys(result).length > 0
    ? result
    : undefined;
}

/*
|--------------------------------------------------------------------------
| Restaurant -> Provider Adapter
|--------------------------------------------------------------------------
*/

const RESTAURANT_PROVIDERS: Provider[] =
  restaurants.map((restaurant) => {
    const hours = (
      restaurant.hours ?? []
    ).map((hour) => ({
      day: hour.day,
      open: hour.open ?? "",
      close: hour.close ?? "",
      closed:
        Boolean(
          (hour as { closed?: boolean }).closed
        ) ||
        (!hour.open && !hour.close),
    }));

    const socialLinks =
      normalizeSocials(
        restaurant.socials
      );

    /*
     * This adapter intentionally keeps the existing
     * restaurant data model intact and only transforms
     * it into the Provider component model.
     */
    return {
      id: restaurant.id,

      name: restaurant.name,

      category: "چێشتخانە",

      subcategory:
        typeof restaurant.subcategory ===
        "string"
          ? restaurant.subcategory
          : undefined,

      description:
        restaurant.description ??
        undefined,

      phone:
        restaurant.phone ??
        undefined,

      email:
        typeof restaurant.email === "string"
          ? restaurant.email
          : undefined,

      website:
        typeof restaurant.website === "string"
          ? restaurant.website
          : undefined,

      logo:
        restaurant.logo ??
        undefined,

      coverImage:
        restaurant.coverImage ??
        restaurant.logo ??
        undefined,

      location: {
        address:
          restaurant.location?.address ??
          undefined,

        city:
          restaurant.location?.city ??
          undefined,

        googleMapsUrl:
          restaurant.location?.googleMapsUrl ??
          undefined,

        latitude:
          restaurant.location?.latitude,

        longitude:
          restaurant.location?.longitude,
      },

      rating:
        Number(restaurant.rating ?? 0),

      reviewCount:
        Number(restaurant.reviewCount ?? 0),

      verified:
        Boolean(
          restaurant.verified
        ),

      featured:
        Boolean(
          restaurant.featured
        ),

      services:
        Array.isArray(
          restaurant.services
        )
          ? restaurant.services.filter(
              (
                service
              ): service is string =>
                typeof service ===
                "string"
            )
          : [],

      tags:
        Array.isArray(
          restaurant.tags
        )
          ? restaurant.tags.filter(
              (tag): tag is string =>
                typeof tag === "string"
            )
          : [],

      hours,

      socials:
        socialLinks,

      updatedAt:
        typeof restaurant.updatedAt ===
        "string"
          ? restaurant.updatedAt
          : undefined,

      /*
       * Do not require ownerName from the
       * existing restaurant data.
       *
       * ProviderModal supports it when available.
       */
    } as unknown as Provider;
  });

/*
|--------------------------------------------------------------------------
| Other Local Providers
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| All Providers
|--------------------------------------------------------------------------
*/

const PROVIDERS: Provider[] = [
  ...RESTAURANT_PROVIDERS,
];

/*
|--------------------------------------------------------------------------
| Category Page
|--------------------------------------------------------------------------
*/

export default function CategoryPage() {
  const params = useParams<{
    category: string;
  }>();

  const { language } = useLanguage();

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  const currentLanguage: LanguageCode =
    isLanguageCode(language)
      ? language
      : "ckb";

  const t =
    UI_TEXT[currentLanguage];

  const isRTL =
    currentLanguage !== "en";

  const ArrowIcon =
    isRTL
      ? ArrowLeft
      : ArrowRight;

  const categorySlug =
    typeof params.category === "string"
      ? params.category
      : "";

  /*
  |--------------------------------------------------------------------------
  | Current Category
  |--------------------------------------------------------------------------
  */

  const category = useMemo(() => {
    return (
      CATEGORIES.find(
        (item) =>
          item.slug === categorySlug &&
          item.is_active
      ) ?? null
    );
  }, [categorySlug]);

  /*
  |--------------------------------------------------------------------------
  | Providers
  |--------------------------------------------------------------------------
  */

  const providers = useMemo(() => {
    if (!category) {
      return [];
    }

    if (
      category.id ===
      "restaurants"
    ) {
      return [
        ...RESTAURANT_PROVIDERS,
      ]
        .filter(
          (provider) =>
            Boolean(provider)
        )
        .sort(
          (a, b) =>
            Number(
              Boolean(b.featured)
            ) -
              Number(
                Boolean(a.featured)
              ) ||
            Number(
              b.rating ?? 0
            ) -
              Number(
                a.rating ?? 0
              )
        );
    }

    return PROVIDERS
      .filter(
        (provider) =>
          category.id ===
          "vehicles" &&
          provider.id ===
            "bazian-transport-test"
      )
      .sort(
        (a, b) =>
          Number(
            Boolean(b.featured)
          ) -
            Number(
              Boolean(a.featured)
            ) ||
          Number(
            b.rating ?? 0
          ) -
            Number(
              a.rating ?? 0
            )
      );
  }, [category]);

  /*
  |--------------------------------------------------------------------------
  | Invalid Category
  |--------------------------------------------------------------------------
  */

  if (!category) {
    return (
      <main
        dir={
          isRTL
            ? "rtl"
            : "ltr"
        }
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
          px-4
          dark:bg-slate-950
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            text-center
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >
            <BriefcaseBusiness
              className="h-7 w-7"
              aria-hidden="true"
            />
          </div>

          <h1
            className="
              mt-5
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {t.noProvidersTitle}
          </h1>

          <Link
            href="/#services"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-primary
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-opacity
              hover:opacity-90
            "
          >
            <ArrowIcon
              className="h-4 w-4"
              aria-hidden="true"
            />

            {t.back}
          </Link>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Category Header Data
  |--------------------------------------------------------------------------
  */

  const categoryTitle =
    getCategoryTitle(
      category,
      currentLanguage
    );

  const categoryDescription =
    getCategoryDescription(
      category,
      currentLanguage
    );

  const CategoryIcon =
    CATEGORY_ICONS[
      category.icon ?? ""
    ];

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
              text-primary
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
                bg-primary/10
                text-primary
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
                  text-primary
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
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {categoryDescription}
              </p>
            </div>
          </div>
        </header>

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
            {providers.length}
          </span>
        </div>

        {/* =========================================================
            Empty State
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
                text-primary
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
                text-slate-500
                dark:text-slate-400
              "
            >
              {t.noProvidersDescription}
            </p>
          </section>
        ) : (
          /* =========================================================
             Provider Grid
          ========================================================== */

          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {providers.map(
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