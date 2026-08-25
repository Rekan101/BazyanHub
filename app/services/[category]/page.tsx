"use client";

import { useEffect, useState } from "react";
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
  type LucideIcon,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";

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
  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;
  average_rating: number;
  review_count: number;
};

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
  briefcase: BriefcaseBusiness,
};

const DEFAULT_CATEGORY_DESCRIPTIONS: Record<
  LanguageCode,
  string
> = {
  ckb: "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
  ar: "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
  en: "Discover services and businesses in this category.",
};

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
    loading: "چاوەڕوان بە...",
    error: "کێشەیەک لە بارکردنی زانیارییەکان ڕوویدا.",
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
    loading: "جارٍ التحميل...",
    error: "حدث خطأ أثناء تحميل البيانات.",
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
    loading: "Loading...",
    error: "Something went wrong while loading the data.",
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
      DEFAULT_CATEGORY_DESCRIPTIONS.ckb
    );
  }

  if (language === "ar") {
    return (
      category.description_ar ??
      DEFAULT_CATEGORY_DESCRIPTIONS.ar
    );
  }

  return (
    category.description_en ??
    DEFAULT_CATEGORY_DESCRIPTIONS.en
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

  return (
    [address, city]
      .filter(Boolean)
      .join("، ") || null
  );
}

export default function CategoryPage() {
  const params = useParams<{
    category: string;
  }>();

  const { language } = useLanguage();

  const currentLanguage =
    language as LanguageCode;

  const t = UI_TEXT[currentLanguage];

  const isRTL =
    currentLanguage !== "en";

  const ArrowIcon = isRTL
    ? ArrowLeft
    : ArrowRight;

  const categorySlug =
    params.category;

  const [category, setCategory] =
    useState<Category | null>(null);

  const [providers, setProviders] =
    useState<Provider[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      setIsLoading(true);
      setError(null);

      const {
        data: categoryData,
        error: categoryError,
      } = await supabase
        .from("service_categories")
        .select(
          `
            id,
            slug,
            name_ckb,
            name_ar,
            name_en,
            description_ckb,
            description_ar,
            description_en,
            icon,
            image_url,
            is_active
          `
        )
        .eq("slug", categorySlug)
        .eq("is_active", true)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      if (categoryError) {
        console.error(
          "Failed to load category:",
          categoryError
        );

        setError(t.error);
        setIsLoading(false);

        return;
      }

      if (!categoryData) {
        setCategory(null);
        setProviders([]);
        setIsLoading(false);

        return;
      }

      const {
        data: providerData,
        error: providerError,
      } = await supabase
        .from("service_providers")
        .select(
          `
            id,
            category_id,
            slug,
            name_ckb,
            name_ar,
            name_en,
            description_ckb,
            description_ar,
            description_en,
            address_ckb,
            address_ar,
            address_en,
            city_ckb,
            city_ar,
            city_en,
            avatar_url,
            cover_image_url,
            is_verified,
            is_featured,
            is_active,
            average_rating,
            review_count
          `
        )
        .eq(
          "category_id",
          categoryData.id
        )
        .eq("is_active", true)
        .order("is_featured", {
          ascending: false,
        })
        .order("average_rating", {
          ascending: false,
        });

      if (cancelled) {
        return;
      }

      if (providerError) {
        console.error(
          "Failed to load providers:",
          providerError
        );
      }

      setCategory(
        categoryData as Category
      );

      setProviders(
        (providerData ?? []) as Provider[]
      );

      setIsLoading(false);
    }

    if (categorySlug) {
      loadPage();
    }

    return () => {
      cancelled = true;
    };
  }, [categorySlug, currentLanguage, t.error]);

  if (isLoading) {
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
          <div className="animate-pulse">
            <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-5 h-10 w-72 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-5 w-full max-w-xl rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-72
                    animate-pulse
                    rounded-2xl
                    bg-slate-200
                    dark:bg-slate-800
                  "
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
            border-red-200
            bg-white
            px-6
            py-5
            text-center
            shadow-sm
            dark:border-red-900/50
            dark:bg-slate-900
          "
        >
          <p className="font-semibold text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      </main>
    );
  }

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
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
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
                  className="h-7 w-7 sm:h-8 sm:w-8"
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

        <div className="mb-5 flex items-center justify-between gap-4">
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

                const rating = Number(
                  provider.average_rating ?? 0
                );

                return (
                  <Link
                    key={provider.id}
                    href={`/services/${category.slug}/${provider.slug}`}
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200/80
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-primary/40
                      hover:shadow-xl
                      hover:shadow-primary/10
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
                          {currentLanguage === "ckb"
                            ? "تایبەت"
                            : currentLanguage === "ar"
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
                  </Link>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}