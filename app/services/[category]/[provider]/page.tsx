"use client";

import ProviderFeedback from "@/components/feedback/ProviderFeedback";
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
  Clock3,
  Facebook,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Scissors,
  ShoppingCart,
  Smartphone,
  Star,
  Store,
  Utensils,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";

type LanguageCode = "ckb" | "ar" | "en";

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

  phone: string | null;
  whatsapp: string | null;
  email: string | null;

  address_ckb: string | null;
  address_ar: string | null;
  address_en: string | null;

  city_ckb: string | null;
  city_ar: string | null;
  city_en: string | null;

  latitude: number | null;
  longitude: number | null;

  avatar_url: string | null;
  cover_image_url: string | null;

  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;

  average_rating: number;
  review_count: number;
};

type Category = {
  id: string;
  slug: string;
  name_ckb: string;
  name_ar: string;
  name_en: string;
  icon: string | null;
};

type SocialLink = {
  id: string;
  provider_id: string;
  platform: string;
  url: string;
  sort_order: number;
  is_active: boolean;
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  car: Car,
  utensils: Utensils,
  "shopping-cart": ShoppingCart,
  smartphone: Smartphone,
  scissors: Scissors,
  wrench: Wrench,
  store: Store,
  briefcase: BriefcaseBusiness,
};

const UI_TEXT = {
  ckb: {
    back: "گەڕانەوە بۆ خزمەتگوزارییەکان",
    contact: "پەیوەندی",
    about: "دەربارەی",
    location: "شوێن",
    social: "تۆڕە کۆمەڵایەتییەکان",
    phone: "تەلەفۆن",
    whatsapp: "واتساپ",
    email: "ئیمەیڵ",
    verified: "پشتڕاستکراوە",
    featured: "تایبەت",
    reviews: "پێداچوونەوە",
    noDescription:
      "هیچ زانیارییەکی زیاتر لەبارەی ئەم شوێنە بەردەست نییە.",
    noLocation: "زانیاریی شوێن بەردەست نییە.",
    openMap: "کردنەوەی نەخشە",
    loading: "چاوەڕوان بە...",
    notFound: "ئەم خزمەتگوزارییە نەدۆزرایەوە.",
    error: "کێشەیەک لە بارکردنی زانیارییەکان ڕوویدا.",
  },

  ar: {
    back: "العودة إلى الخدمات",
    contact: "اتصل بنا",
    about: "حول",
    location: "الموقع",
    social: "وسائل التواصل الاجتماعي",
    phone: "الهاتف",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    verified: "موثق",
    featured: "مميز",
    reviews: "مراجعة",
    noDescription:
      "لا توجد معلومات إضافية متاحة عن هذا المكان.",
    noLocation: "معلومات الموقع غير متوفرة.",
    openMap: "فتح الخريطة",
    loading: "جارٍ التحميل...",
    notFound: "لم يتم العثور على هذه الخدمة.",
    error: "حدث خطأ أثناء تحميل البيانات.",
  },

  en: {
    back: "Back to services",
    contact: "Contact",
    about: "About",
    location: "Location",
    social: "Social media",
    phone: "Phone",
    whatsapp: "WhatsApp",
    email: "Email",
    verified: "Verified",
    featured: "Featured",
    reviews: "reviews",
    noDescription:
      "No additional information is available about this place.",
    noLocation: "Location information is not available.",
    openMap: "Open map",
    loading: "Loading...",
    notFound: "This service could not be found.",
    error: "Something went wrong while loading the data.",
  },
} satisfies Record<LanguageCode, Record<string, string>>;

function getProviderName(
  provider: Provider,
  language: LanguageCode
) {
  if (language === "ckb") return provider.name_ckb;
  if (language === "ar") return provider.name_ar;
  return provider.name_en;
}

function getProviderDescription(
  provider: Provider,
  language: LanguageCode
) {
  if (language === "ckb") return provider.description_ckb;
  if (language === "ar") return provider.description_ar;
  return provider.description_en;
}

function getCategoryName(
  category: Category,
  language: LanguageCode
) {
  if (language === "ckb") return category.name_ckb;
  if (language === "ar") return category.name_ar;
  return category.name_en;
}

function getAddress(
  provider: Provider,
  language: LanguageCode
) {
  if (language === "ckb") return provider.address_ckb;
  if (language === "ar") return provider.address_ar;
  return provider.address_en;
}

function getCity(
  provider: Provider,
  language: LanguageCode
) {
  if (language === "ckb") return provider.city_ckb;
  if (language === "ar") return provider.city_ar;
  return provider.city_en;
}

function getSocialIcon(platform: string) {
  const value = platform.toLowerCase();

  if (value.includes("facebook")) {
    return Facebook;
  }

  if (value.includes("instagram")) {
    return MessageCircle;
  }

  if (value.includes("whatsapp")) {
    return MessageCircle;
  }

  return MessageCircle;
}

function getSocialLabel(
  platform: string,
  language: LanguageCode
) {
  const value = platform.toLowerCase();

  if (value.includes("facebook")) {
    return "Facebook";
  }

  if (value.includes("instagram")) {
    return "Instagram";
  }

  if (value.includes("whatsapp")) {
    return "WhatsApp";
  }

  if (language === "ckb") {
    return "تۆڕی کۆمەڵایەتی";
  }

  if (language === "ar") {
    return "وسائل التواصل";
  }

  return "Social";
}

export default function ProviderPage() {
  const params = useParams<{
    category: string;
    provider: string;
  }>();

  const { language } = useLanguage();

  const currentLanguage =
    (language as LanguageCode) || "ckb";

  const t = UI_TEXT[currentLanguage];

  const isRTL = currentLanguage !== "en";

  const ArrowIcon = isRTL
    ? ArrowLeft
    : ArrowRight;

  const categorySlug = params.category;
  const providerSlug = params.provider;

  const [provider, setProvider] =
    useState<Provider | null>(null);

  const [category, setCategory] =
    useState<Category | null>(null);

  const [socialLinks, setSocialLinks] =
    useState<SocialLink[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProvider() {
      setIsLoading(true);
      setError(null);

      const {
        data: categoryData,
        error: categoryError,
      } = await supabase
        .from("service_categories")
        .select(`
          id,
          slug,
          name_ckb,
          name_ar,
          name_en,
          icon
        `)
        .eq("slug", categorySlug)
        .eq("is_active", true)
        .maybeSingle();

      if (cancelled) return;

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
        setProvider(null);
        setCategory(null);
        setIsLoading(false);
        return;
      }

      const {
        data: providerData,
        error: providerError,
      } = await supabase
        .from("service_providers")
        .select(`
          id,
          category_id,
          slug,
          name_ckb,
          name_ar,
          name_en,
          description_ckb,
          description_ar,
          description_en,
          phone,
          whatsapp,
          email,
          address_ckb,
          address_ar,
          address_en,
          city_ckb,
          city_ar,
          city_en,
          latitude,
          longitude,
          avatar_url,
          cover_image_url,
          is_verified,
          is_featured,
          is_active,
          average_rating,
          review_count
        `)
        .eq("category_id", categoryData.id)
        .eq("slug", providerSlug)
        .eq("is_active", true)
        .maybeSingle();

      if (cancelled) return;

      if (providerError) {
        console.error(
          "Failed to load provider:",
          providerError
        );

        setError(t.error);
        setIsLoading(false);
        return;
      }

      if (!providerData) {
        setProvider(null);
        setCategory(
          categoryData as Category
        );
        setIsLoading(false);
        return;
      }

      const {
        data: socialData,
        error: socialError,
      } = await supabase
        .from("provider_social_links")
        .select(`
          id,
          provider_id,
          platform,
          url,
          sort_order,
          is_active
        `)
        .eq(
          "provider_id",
          providerData.id
        )
        .eq("is_active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (cancelled) return;

      if (socialError) {
        console.error(
          "Failed to load social links:",
          socialError
        );
      }

      setCategory(
        categoryData as Category
      );

      setProvider(
        providerData as Provider
      );

      setSocialLinks(
        (socialData ?? []) as SocialLink[]
      );

      setIsLoading(false);
    }

    if (
      categorySlug &&
      providerSlug
    ) {
      loadProvider();
    }

    return () => {
      cancelled = true;
    };
  }, [
    categorySlug,
    providerSlug,
    t.error,
  ]);

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
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-6 h-72 rounded-3xl bg-slate-200 dark:bg-slate-800" />

            <div className="mt-6 h-8 w-64 rounded bg-slate-200 dark:bg-slate-800" />

            <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
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
            p-6
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

  if (!provider || !category) {
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
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-slate-100
              text-primary
              dark:bg-slate-800
            "
          >
            <BriefcaseBusiness className="h-7 w-7" />
          </div>

          <h1
            className="
              mt-4
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {t.notFound}
          </h1>

          <Link
            href={`/services/${categorySlug}`}
            className="
              mt-5
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

  const categoryName =
    getCategoryName(
      category,
      currentLanguage
    );

  const address =
    getAddress(
      provider,
      currentLanguage
    );

  const city =
    getCity(
      provider,
      currentLanguage
    );

  const CategoryIcon =
    CATEGORY_ICONS[
      category.icon ?? ""
    ];

  const rating = Number(
    provider.average_rating ?? 0
  );

  const locationParts =
    [address, city].filter(Boolean);

  const locationText =
    locationParts.join(
      currentLanguage === "en"
        ? ", "
        : "، "
    );

  const mapUrl =
    provider.latitude !== null &&
    provider.longitude !== null
      ? `https://www.google.com/maps/search/?api=1&query=${provider.latitude},${provider.longitude}`
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

        {/* Back */}

        <Link
          href={`/services/${category.slug}`}
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

        {/* Hero */}

        <section
          className="
            relative
            mt-6
            overflow-hidden
            rounded-3xl
            border
            border-slate-200/80
            bg-white
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              relative
              h-56
              w-full
              overflow-hidden
              bg-slate-100
              dark:bg-slate-800
              sm:h-72
              lg:h-80
            "
          >
            {provider.cover_image_url ? (
              <Image
                src={provider.cover_image_url}
                alt={providerName}
                fill
                priority
                sizes="
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) 90vw,
                  1200px
                "
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
                    className="h-20 w-20"
                    aria-hidden="true"
                  />
                ) : (
                  <BriefcaseBusiness
                    className="h-20 w-20"
                    aria-hidden="true"
                  />
                )}
              </div>
            )}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-slate-950/80
                via-slate-950/20
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-4
                left-4
                right-4
                flex
                items-end
                justify-between
                gap-4
                sm:bottom-6
                sm:left-6
                sm:right-6
              "
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-white/80">
                  {categoryName}
                </p>

                <h1
                  className="
                    mt-1
                    truncate
                    text-2xl
                    font-bold
                    text-white
                    sm:text-3xl
                  "
                >
                  {providerName}
                </h1>
              </div>

              <button
                type="button"
                aria-label={
                  currentLanguage === "ckb"
                    ? "زیادکردن بۆ دڵخوازەکان"
                    : currentLanguage === "ar"
                      ? "إضافة إلى المفضلة"
                      : "Add to favorites"
                }
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/95
                  text-slate-500
                  shadow-lg
                  backdrop-blur
                  transition
                  hover:text-rose-500
                  dark:bg-slate-900/95
                "
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center gap-2">

              {provider.is_verified && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-blue-50
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-blue-700
                    ring-1
                    ring-blue-200
                    dark:bg-blue-950/40
                    dark:text-blue-300
                    dark:ring-blue-900/50
                  "
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />

                  {t.verified}
                </span>
              )}

              {provider.is_featured && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-purple-100
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    text-purple-700
                    ring-1
                    ring-purple-200
                    dark:bg-purple-950/50
                    dark:text-purple-300
                    dark:ring-purple-900/50
                  "
                >
                  {t.featured}
                </span>
              )}

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-amber-50
                  px-3
                  py-1.5
                  text-xs
                  font-bold
                  text-amber-700
                  ring-1
                  ring-amber-200
                  dark:bg-amber-950/40
                  dark:text-amber-300
                  dark:ring-amber-900/50
                "
              >
                <Star className="h-3.5 w-3.5 fill-current" />

                {rating.toFixed(1)}

                <span className="font-medium">
                  ({provider.review_count} {t.reviews})
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}

        <div
          className="
            mt-6
            grid
            grid-cols-1
            gap-6
            lg:grid-cols-3
          "
        >

          {/* About */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-white
              p-5
              shadow-sm
              lg:col-span-2
              sm:p-6
              dark:border-slate-800
              dark:bg-slate-900
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
              {t.about}
            </h2>

            <p
              className="
                mt-4
                whitespace-pre-line
                text-sm
                leading-7
                text-slate-600
                dark:text-slate-300
              "
            >
              {providerDescription || t.noDescription}
            </p>
          </section>

          {/* Contact */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-white
              p-5
              shadow-sm
              sm:p-6
              dark:border-slate-800
              dark:bg-slate-900
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
              {t.contact}
            </h2>

            <div className="mt-5 space-y-3">

              {provider.phone && (
                <a
                  href={`tel:${provider.phone}`}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-slate-200
                    p-3
                    transition
                    hover:border-primary/40
                    hover:bg-primary/5
                    dark:border-slate-800
                  "
                >
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Mail className="hidden" />
                    <MessageCircle className="hidden" />
                    <span className="text-lg">☎</span>
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      {t.phone}
                    </p>

                    <p
                      dir="ltr"
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {provider.phone}
                    </p>
                  </div>
                </a>
              )}

              {provider.whatsapp && (
                <a
                  href={`https://wa.me/${provider.whatsapp.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-slate-200
                    p-3
                    transition
                    hover:border-green-400/50
                    hover:bg-green-50
                    dark:border-slate-800
                    dark:hover:bg-green-950/20
                  "
                >
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-green-100
                      text-green-600
                      dark:bg-green-950/40
                      dark:text-green-400
                    "
                  >
                    <MessageCircle className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      {t.whatsapp}
                    </p>

                    <p
                      dir="ltr"
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {provider.whatsapp}
                    </p>
                  </div>
                </a>
              )}

              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-slate-200
                    p-3
                    transition
                    hover:border-primary/40
                    hover:bg-primary/5
                    dark:border-slate-800
                  "
                >
                  <span
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-primary/10
                      text-primary
                    "
                  >
                    <Mail className="h-5 w-5" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      {t.email}
                    </p>

                    <p
                      dir="ltr"
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                        dark:text-slate-200
                      "
                    >
                      {provider.email}
                    </p>
                  </div>
                </a>
              )}

              {!provider.phone &&
                !provider.whatsapp &&
                !provider.email && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t.noLocation}
                  </p>
                )}
            </div>
          </section>

          {/* Location */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-white
              p-5
              shadow-sm
              lg:col-span-2
              sm:p-6
              dark:border-slate-800
              dark:bg-slate-900
            "
          >
            <h2
              className="
                flex
                items-center
                gap-2
                text-lg
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              <MapPin className="h-5 w-5 text-primary" />

              {t.location}
            </h2>

            {locationText ? (
              <div className="mt-4">
                <p
                  className="
                    text-sm
                    leading-6
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  {locationText}
                </p>

                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      mt-4
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
                    <MapPin className="h-4 w-4" />

                    {t.openMap}
                  </a>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {t.noLocation}
              </p>
            )}
          </section>

          {/* Social Links */}

          {socialLinks.length > 0 && (
            <section
              className="
                rounded-2xl
                border
                border-slate-200/80
                bg-white
                p-5
                shadow-sm
                sm:p-6
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <h2
                className="
                  flex
                  items-center
                  gap-2
                  text-lg
                  font-bold
                  text-slate-900
                  dark:text-white
                "
              >
                <MessageCircle className="h-5 w-5 text-primary" />

                {t.social}
              </h2>

              <div className="mt-5 space-y-3">
                {socialLinks.map((social) => {
                  const SocialIcon =
                    getSocialIcon(
                      social.platform
                    );

                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        p-3
                        transition
                        hover:border-primary/40
                        hover:bg-primary/5
                        dark:border-slate-800
                      "
                    >
                      <span
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-primary/10
                          text-primary
                        "
                      >
                        <SocialIcon className="h-5 w-5" />
                      </span>

                      <span
                        className="
                          text-sm
                          font-semibold
                          text-slate-800
                          dark:text-slate-200
                        "
                      >
                        {getSocialLabel(
                          social.platform,
                          currentLanguage
                        )}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* Additional Info */}

          <section
            className="
              rounded-2xl
              border
              border-slate-200/80
              bg-white
              p-5
              shadow-sm
              sm:p-6
              dark:border-slate-800
              dark:bg-slate-900
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
              {t.contact}
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex items-center gap-3">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Clock3 className="h-5 w-5" />
                </span>

                <div>
                  <p className="text-xs text-slate-400">
                    {t.reviews}
                  </p>

                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {provider.review_count}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-amber-50
                    text-amber-500
                    dark:bg-amber-950/30
                  "
                >
                  <Star className="h-5 w-5 fill-current" />
                </span>

                <div>
                  <p className="text-xs text-slate-400">
                    {t.reviews}
                  </p>

                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {rating.toFixed(1)}
                  </p>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* Provider Feedback */}

        <ProviderFeedback
          providerId={provider.id}
        />

      </div>
    </main>
  );
}