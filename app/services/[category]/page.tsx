"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Car,
  CheckCircle2,
  GraduationCap,
  HeartPulse,
  House,
  Scissors,
  ShoppingCart,
  Smartphone,
  Star,
  Utensils,
  Wrench,
  X,
  Phone,
  MapPin,
  Clock,
  Tag,
  type LucideIcon,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";

import { restaurants } from "@/lib/data/services/restaurants";

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

type ProviderHour = {
  day: string;
  open: string;
  close: string;
};

type ProviderSocials = {
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  viber?: string;
};

type Provider = {
  id: string;
  category_id: string;
  slug: string;

  name_ckb: string;
  name_ar: string;
  name_en: string;

  description_ckb: string | null;
  description_ar: string | null;
  description_en: string | null;

  address_ckb: string | null;
  address_ar: string | null;
  address_en: string | null;

  city_ckb: string | null;
  city_ar: string | null;
  city_en: string | null;

  avatar_url: string | null;
  cover_image_url: string | null;

  phone: string | null;
  google_maps_url: string | null;
  socials: ProviderSocials | null;
  services: string[];
  tags: string[];
  hours: ProviderHour[];

  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;

  average_rating: number;
  review_count: number;
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
| Restaurant Mapper
|--------------------------------------------------------------------------
*/

const RESTAURANT_PROVIDERS: Provider[] = restaurants.map(
  (restaurant) => ({
    id: restaurant.id,

    category_id: "restaurants",

    slug:
      restaurant.slug ??
      restaurant.id.replace(/^restaurant-/, ""),

    name_ckb: restaurant.name,
    name_ar: restaurant.name,
    name_en: restaurant.name,

    description_ckb:
      restaurant.description ?? null,
    description_ar:
      restaurant.description ?? null,
    description_en:
      restaurant.description ?? null,

    address_ckb:
      restaurant.location?.address ?? null,
    address_ar:
      restaurant.location?.address ?? null,
    address_en:
      restaurant.location?.address ?? null,

    city_ckb:
      restaurant.location?.city ?? null,
    city_ar:
      restaurant.location?.city ?? null,
    city_en:
      restaurant.location?.city ?? null,

    avatar_url:
      restaurant.logo ?? null,

    cover_image_url:
      restaurant.coverImage ?? null,

    phone:
      restaurant.phone ?? null,

    google_maps_url:
      restaurant.location?.googleMapsUrl ?? null,

    socials:
      restaurant.socials ?? null,

    services:
      restaurant.services ?? [],

    tags:
      restaurant.tags ?? [],

    hours:
      (restaurant.hours ?? []).map((hour) => ({
        day: hour.day,
        open: hour.open ?? "--",
        close: hour.close ?? "--",
      })),

    is_verified:
      restaurant.verified ?? false,

    is_featured:
      restaurant.featured ?? false,

    is_active:
      restaurant.active ?? true,

    average_rating:
      restaurant.rating ?? 0,

    review_count:
      restaurant.reviewCount ?? 0,
  })
);

/*
|--------------------------------------------------------------------------
| Other Local Providers
|--------------------------------------------------------------------------
*/

const OTHER_PROVIDERS: Provider[] = [
  {
    id: "bazian-transport-test",

    category_id: "vehicles",

    slug: "bazian-transport-test",

    name_ckb: "گواستنەوەی بازیان",
    name_ar: "نقل بازیان",
    name_en: "Bazian Transport",

    description_ckb:
      "خزمەتگوزاری گواستنەوە و ئۆتۆمبێل لە بازیان.",
    description_ar:
      "خدمة النقل والمواصلات في بازیان.",
    description_en:
      "Transportation and vehicle services in Bazian.",

    address_ckb: "ناوچەی تایقەرەدۆمە، بازیان",
    address_ar: "منطقة تاكيگردومة، بازیان",
    address_en: "Taqaradoma Area, Bazian",

    city_ckb: "بازیان",
    city_ar: "بازیان",
    city_en: "Bazian",

    avatar_url: null,
    cover_image_url: null,

    phone: null,
    google_maps_url: null,
    socials: null,
    services: [],
    tags: [],
    hours: [],

    is_verified: false,
    is_featured: false,
    is_active: true,

    average_rating: 0,
    review_count: 0,
  },
];

/*
|--------------------------------------------------------------------------
| All Providers
|--------------------------------------------------------------------------
*/

const PROVIDERS: Provider[] = [
  ...OTHER_PROVIDERS,
  ...RESTAURANT_PROVIDERS,
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
    viewDetails: "بینینی زانیارییەکان",
    verified: "پشتڕاستکراوە",
    reviews: "پێداچوونەوە",
    phone: "تەلەفۆن",
    location: "شوێن",
    services: "خزمەتگوزارییەکان",
    tags: "تاگەکان",
    hours: "کاتەکانی کار",
    close: "داخستن",
    open: "کردنەوە",
  },

  ar: {
    back: "العودة إلى الخدمات",
    providersTitle: "الخدمات والأماكن",
    noProvidersTitle:
      "لم تتم إضافة خدمات بعد",
    noProvidersDescription:
      "ستتم إضافة الخدمات والأعمال الجديدة هنا قريبًا.",
    viewDetails: "عرض التفاصيل",
    verified: "موثق",
    reviews: "مراجعة",
    phone: "الهاتف",
    location: "الموقع",
    services: "الخدمات",
    tags: "العلامات",
    hours: "ساعات العمل",
    close: "إغلاق",
    open: "فتح",
  },

  en: {
    back: "Back to services",
    providersTitle: "Services & Places",
    noProvidersTitle:
      "No services have been added yet",
    noProvidersDescription:
      "New services and businesses will be added here soon.",
    viewDetails: "View details",
    verified: "Verified",
    reviews: "reviews",
    phone: "Phone",
    location: "Location",
    services: "Services",
    tags: "Tags",
    hours: "Opening hours",
    close: "Close",
    open: "Open",
  },
} satisfies Record<
  LanguageCode,
  Record<string, string>
>;

function getCategoryTitle(
  category: Category,
  language: LanguageCode
) {
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
) {
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

function getProviderName(
  provider: Provider,
  language: LanguageCode
) {
  if (language === "ckb") {
    return provider.name_ckb;
  }

  if (language === "ar") {
    return provider.name_ar;
  }

  return provider.name_en;
}

function getProviderDescription(
  provider: Provider,
  language: LanguageCode
) {
  if (language === "ckb") {
    return provider.description_ckb;
  }

  if (language === "ar") {
    return provider.description_ar;
  }

  return provider.description_en;
}

function getProviderLocation(
  provider: Provider,
  language: LanguageCode
) {
  const address =
    language === "ckb"
      ? provider.address_ckb
      : language === "ar"
        ? provider.address_ar
        : provider.address_en;

  const city =
    language === "ckb"
      ? provider.city_ckb
      : language === "ar"
        ? provider.city_ar
        : provider.city_en;

  return [address, city]
    .filter(
      (value): value is string =>
        Boolean(value)
    )
    .join("، ") || null;
}

export default function CategoryPage() {
  const params = useParams<{
    category: string;
  }>();

  const { language } = useLanguage();

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  const currentLanguage =
    (language as LanguageCode) || "ckb";

  const t = UI_TEXT[currentLanguage];

  const isRTL =
    currentLanguage !== "en";

  const ArrowIcon = isRTL
    ? ArrowLeft
    : ArrowRight;

  const categorySlug =
    params.category;

  const category = useMemo(() => {
    return (
      CATEGORIES.find(
        (item) =>
          item.slug === categorySlug &&
          item.is_active
      ) ?? null
    );
  }, [categorySlug]);

  const providers = useMemo(() => {
    if (!category) {
      return [];
    }

    return PROVIDERS.filter(
      (provider) =>
        provider.category_id ===
          category.id &&
        provider.is_active
    ).sort(
      (a, b) =>
        Number(b.is_featured) -
          Number(a.is_featured) ||
        b.average_rating -
          a.average_rating
    );
  }, [category]);

  if (!category) {
    return (
      <main
        dir={isRTL ? "rtl" : "ltr"}
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
            rounded-2xl
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
          <h1
            className="
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {t.noProvidersTitle}
          </h1>

          <Link
            href="/services"
            className="
              mt-4
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-primary
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

  const selectedProviderName =
    selectedProvider
      ? getProviderName(
          selectedProvider,
          currentLanguage
        )
      : "";

  const selectedProviderDescription =
    selectedProvider
      ? getProviderDescription(
          selectedProvider,
          currentLanguage
        )
      : null;

  const selectedProviderLocation =
    selectedProvider
      ? getProviderLocation(
          selectedProvider,
          currentLanguage
        )
      : null;

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
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
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}

        <div className="mb-8">

          <Link
            href="/services"
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

          <div className="mt-6 flex items-start gap-4">

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
                <span className="text-xl font-bold">
                  •
                </span>
              )}
            </div>

            <div className="min-w-0">

              <p className="text-sm font-semibold text-primary">
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

        </div>

        {/* Provider Section */}

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
                <span className="text-xl">
                  •
                </span>
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

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >

            {providers.map(
              (provider) => {

                const providerName =
                  getProviderName(
                    provider,
                    currentLanguage
                  );

                const providerDescription =
                  getProviderDescription(
                    provider,
                    currentLanguage
                  );

                const location =
                  getProviderLocation(
                    provider,
                    currentLanguage
                  );

                const rating =
                  Number(
                    provider.average_rating ?? 0
                  );

                return (

                  <button
                    key={provider.id}
                    type="button"
                    onClick={() =>
                      setSelectedProvider(
                        provider
                      )
                    }
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200/80
                      bg-white
                      text-start
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-primary/40
                      hover:shadow-xl
                      hover:shadow-primary/10
                      focus:outline-none
                      focus:ring-2
                      focus:ring-primary/40
                      dark:border-slate-800
                      dark:bg-slate-900
                    "
                  >

                    {/* Cover */}

                    <div
                      className="
                        relative
                        h-40
                        w-full
                        overflow-hidden
                        bg-slate-100
                        dark:bg-slate-800
                      "
                    >

                      {provider.cover_image_url ? (

                        <Image
                          src={
                            provider.cover_image_url
                          }
                          alt={providerName}
                          fill
                          sizes="
                            (max-width: 640px) 100vw,
                            (max-width: 1024px) 50vw,
                            33vw
                          "
                          className="
                            object-cover
                            transition-transform
                            duration-700
                            group-hover:scale-105
                          "
                        />

                      ) : (

                        <div
                          className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            bg-primary/5
                            text-primary
                          "
                        >
                          {CategoryIcon ? (
                            <CategoryIcon
                              className="h-10 w-10"
                              aria-hidden="true"
                            />
                          ) : (
                            <BriefcaseBusiness
                              className="h-10 w-10"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      )}

                      {provider.is_featured && (

                        <span
                          className="
                            absolute
                            left-3
                            top-3
                            rounded-full
                            bg-purple-100
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            text-purple-700
                            ring-1
                            ring-purple-200
                            dark:bg-purple-950/60
                            dark:text-purple-300
                            dark:ring-purple-800
                          "
                        >
                          {currentLanguage ===
                          "ckb"
                            ? "تایبەت"
                            : currentLanguage ===
                                "ar"
                              ? "مميز"
                              : "Featured"}
                        </span>
                      )}

                    </div>

                    {/* Content */}

                    <div className="p-4">

                      <div className="flex items-start gap-3">

                        <div
                          className="
                            relative
                            -mt-9
                            flex
                            h-14
                            w-14
                            shrink-0
                            overflow-hidden
                            rounded-xl
                            border-4
                            border-white
                            bg-slate-100
                            shadow-sm
                            dark:border-slate-900
                            dark:bg-slate-800
                          "
                        >

                          {provider.avatar_url ? (

                            <Image
                              src={
                                provider.avatar_url
                              }
                              alt={providerName}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />

                          ) : (

                            <div
                              className="
                                flex
                                h-full
                                w-full
                                items-center
                                justify-center
                                text-primary
                              "
                            >
                              {CategoryIcon ? (
                                <CategoryIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              ) : (
                                <BriefcaseBusiness
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                          )}

                        </div>

                        <div className="min-w-0 flex-1 pt-1">

                          <div className="flex items-center gap-1.5">

                            <h3
                              className="
                                truncate
                                text-base
                                font-bold
                                text-slate-900
                                group-hover:text-primary
                                dark:text-white
                              "
                            >
                              {providerName}
                            </h3>

                            {provider.is_verified && (

                              <CheckCircle2
                                className="
                                  h-4
                                  w-4
                                  shrink-0
                                  fill-primary
                                  text-white
                                "
                                aria-label={
                                  t.verified
                                }
                              />
                            )}

                          </div>

                          <div className="mt-1 flex items-center gap-1.5">

                            <Star
                              className="
                                h-3.5
                                w-3.5
                                fill-amber-400
                                text-amber-400
                              "
                              aria-hidden="true"
                            />

                            <span
                              className="
                                text-xs
                                font-bold
                                text-slate-700
                                dark:text-slate-200
                              "
                            >
                              {rating.toFixed(1)}
                            </span>

                            <span
                              className="
                                text-[11px]
                                text-slate-400
                              "
                            >
                              ({provider.review_count}{" "}
                              {t.reviews})
                            </span>

                          </div>

                        </div>

                      </div>

                      {providerDescription && (

                        <p
                          className="
                            mt-4
                            line-clamp-2
                            text-sm
                            leading-6
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {providerDescription}
                        </p>
                      )}

                      {location && (

                        <p
                          className="
                            mt-3
                            line-clamp-1
                            text-xs
                            font-medium
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          📍 {location}
                        </p>
                      )}

                      <div
                        className="
                          mt-4
                          flex
                          items-center
                          justify-between
                          border-t
                          border-slate-100
                          pt-3
                          dark:border-slate-800
                        "
                      >

                        <span
                          className="
                            text-xs
                            font-semibold
                            text-primary
                          "
                        >
                          {t.viewDetails}
                        </span>

                        <ArrowIcon
                          className="
                            h-4
                            w-4
                            text-primary
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                          aria-hidden="true"
                        />

                      </div>

                    </div>

                  </button>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* Provider Details Modal */}

      {selectedProvider && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-slate-950/60
            p-3
            backdrop-blur-sm
            sm:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-label={selectedProviderName}
          onClick={() =>
            setSelectedProvider(null)
          }
        >

          <div
            className="
              relative
              max-h-[92vh]
              w-full
              max-w-3xl
              overflow-y-auto
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-2xl
              dark:border-slate-800
              dark:bg-slate-900
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Close */}

            <button
              type="button"
              onClick={() =>
                setSelectedProvider(null)
              }
              aria-label={t.close}
              className="
                absolute
                right-4
                top-4
                z-20
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-slate-700
                shadow-md
                backdrop-blur
                transition
                hover:bg-white
                hover:text-red-500
                focus:outline-none
                focus:ring-2
                focus:ring-primary/40
                dark:bg-slate-900/90
                dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >
              <X
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>

            {/* Cover */}

            <div
              className="
                relative
                h-48
                w-full
                overflow-hidden
                bg-slate-100
                dark:bg-slate-800
                sm:h-64
              "
            >

              {selectedProvider.cover_image_url ? (

                <Image
                  src={
                    selectedProvider.cover_image_url
                  }
                  alt={selectedProviderName}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />

              ) : (

                <div
                  className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-primary/5
                    text-primary
                  "
                >
                  {CategoryIcon ? (
                    <CategoryIcon
                      className="h-16 w-16"
                      aria-hidden="true"
                    />
                  ) : (
                    <BriefcaseBusiness
                      className="h-16 w-16"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )}

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-24
                  bg-gradient-to-t
                  from-black/60
                  to-transparent
                "
              />

            </div>

            {/* Main Details */}

            <div className="p-5 sm:p-7">

              <div
                className="
                  -mt-12
                  flex
                  items-end
                  gap-4
                "
              >

                <div
                  className="
                    relative
                    flex
                    h-20
                    w-20
                    shrink-0
                    overflow-hidden
                    rounded-2xl
                    border-4
                    border-white
                    bg-slate-100
                    shadow-lg
                    dark:border-slate-900
                    dark:bg-slate-800
                  "
                >

                  {selectedProvider.avatar_url ? (

                    <Image
                      src={
                        selectedProvider.avatar_url
                      }
                      alt={selectedProviderName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />

                  ) : (

                    <div
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        text-primary
                      "
                    >
                      {CategoryIcon ? (
                        <CategoryIcon
                          className="h-8 w-8"
                          aria-hidden="true"
                        />
                      ) : (
                        <BriefcaseBusiness
                          className="h-8 w-8"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  )}

                </div>

              </div>

              {/* Name + Rating */}

              <div className="mt-4">

                <div className="flex flex-wrap items-center gap-2">

                  <h2
                    className="
                      text-2xl
                      font-bold
                      tracking-tight
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {selectedProviderName}
                  </h2>

                  {selectedProvider.is_verified && (

                    <CheckCircle2
                      className="
                        h-5
                        w-5
                        fill-primary
                        text-white
                      "
                      aria-label={t.verified}
                    />
                  )}

                  {selectedProvider.is_featured && (

                    <span
                      className="
                        rounded-full
                        bg-purple-100
                        px-2.5
                        py-1
                        text-[10px]
                        font-bold
                        text-purple-700
                        dark:bg-purple-950/60
                        dark:text-purple-300
                      "
                    >
                      {currentLanguage ===
                      "ckb"
                        ? "تایبەت"
                        : currentLanguage ===
                            "ar"
                          ? "مميز"
                          : "Featured"}
                    </span>
                  )}

                </div>

                <div className="mt-2 flex items-center gap-2">

                  <Star
                    className="
                      h-4
                      w-4
                      fill-amber-400
                      text-amber-400
                    "
                    aria-hidden="true"
                  />

                  <span
                    className="
                      text-sm
                      font-bold
                      text-slate-800
                      dark:text-slate-200
                    "
                  >
                    {Number(
                      selectedProvider.average_rating
                    ).toFixed(1)}
                  </span>

                  <span
                    className="
                      text-sm
                      text-slate-400
                    "
                  >
                    ({selectedProvider.review_count}{" "}
                    {t.reviews})
                  </span>

                </div>

              </div>

              {/* Description */}

              {selectedProviderDescription && (

                <p
                  className="
                    mt-5
                    text-sm
                    leading-7
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  {selectedProviderDescription}
                </p>
              )}

              {/* Basic Information */}

              <div
                className="
                  mt-6
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >

                {selectedProviderLocation && (

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      bg-slate-50
                      p-4
                      dark:bg-slate-800/70
                    "
                  >
                    <MapPin
                      className="
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                        text-primary
                      "
                      aria-hidden="true"
                    />

                    <div className="min-w-0">

                      <p
                        className="
                          text-xs
                          font-semibold
                          text-slate-400
                        "
                      >
                        {t.location}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-medium
                          text-slate-800
                          dark:text-slate-200
                        "
                      >
                        {selectedProviderLocation}
                      </p>

                    </div>

                  </div>
                )}

                {selectedProvider.phone && (

                  <a
                    href={`tel:${selectedProvider.phone}`}
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      bg-slate-50
                      p-4
                      transition
                      hover:bg-primary/5
                      dark:bg-slate-800/70
                    "
                  >
                    <Phone
                      className="
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                        text-primary
                      "
                      aria-hidden="true"
                    />

                    <div className="min-w-0">

                      <p
                        className="
                          text-xs
                          font-semibold
                          text-slate-400
                        "
                      >
                        {t.phone}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          font-medium
                          text-slate-800
                          dark:text-slate-200
                        "
                      >
                        {selectedProvider.phone}
                      </p>

                    </div>

                  </a>
                )}

              </div>

              {/* Services */}

              {selectedProvider.services.length > 0 && (

                <section className="mt-7">

                  <div className="mb-3 flex items-center gap-2">

                    <Tag
                      className="
                        h-5
                        w-5
                        text-primary
                      "
                      aria-hidden="true"
                    />

                    <h3
                      className="
                        text-base
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {t.services}
                    </h3>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {selectedProvider.services.map(
                      (service) => (

                        <span
                          key={service}
                          className="
                            rounded-full
                            bg-primary/10
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            text-primary
                          "
                        >
                          {service}
                        </span>
                      )
                    )}

                  </div>

                </section>
              )}

              {/* Tags */}

              {selectedProvider.tags.length > 0 && (

                <section className="mt-6">

                  <h3
                    className="
                      mb-3
                      text-base
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {t.tags}
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {selectedProvider.tags.map(
                      (tag) => (

                        <span
                          key={tag}
                          className="
                            rounded-full
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-1.5
                            text-xs
                            font-medium
                            text-slate-600
                            dark:border-slate-700
                            dark:bg-slate-900
                            dark:text-slate-300
                          "
                        >
                          #{tag}
                        </span>
                      )
                    )}

                  </div>

                </section>
              )}

              {/* Opening Hours */}

              {selectedProvider.hours.length > 0 && (

                <section className="mt-7">

                  <div className="mb-3 flex items-center gap-2">

                    <Clock
                      className="
                        h-5
                        w-5
                        text-primary
                      "
                      aria-hidden="true"
                    />

                    <h3
                      className="
                        text-base
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {t.hours}
                    </h3>

                  </div>

                  <div
                    className="
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      dark:border-slate-800
                    "
                  >

                    {selectedProvider.hours.map(
                      (hour, index) => (

                        <div
                          key={`${hour.day}-${index}`}
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            border-b
                            border-slate-100
                            px-4
                            py-3
                            last:border-b-0
                            dark:border-slate-800
                          "
                        >

                          <span
                            className="
                              text-sm
                              font-medium
                              text-slate-700
                              dark:text-slate-300
                            "
                          >
                            {hour.day}
                          </span>

                          <span
                            className="
                              text-sm
                              font-semibold
                              text-slate-900
                              dark:text-white
                            "
                          >
                            {hour.open} - {hour.close}
                          </span>

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

              {/* Social / External Actions */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-3
                  border-t
                  border-slate-100
                  pt-6
                  dark:border-slate-800
                "
              >

                {selectedProvider.google_maps_url && (

                  <a
                    href={
                      selectedProvider.google_maps_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
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
                      transition
                      hover:opacity-90
                    "
                  >
                    <MapPin
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    {t.location}
                  </a>
                )}

                {selectedProvider.phone && (

                  <a
                    href={`tel:${selectedProvider.phone}`}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-slate-700
                      transition
                      hover:border-primary/40
                      hover:text-primary
                      dark:border-slate-700
                      dark:bg-slate-900
                      dark:text-slate-200
                    "
                  >
                    <Phone
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    {t.phone}
                  </a>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}