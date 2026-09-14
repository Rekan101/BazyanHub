import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Info,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

import { getProviderById } from "@/lib/data/providers";
import ProviderSocials from "@/components/providers/ProviderSocials";

interface ProviderPageProps {
  params: Promise<{
    category: string;
    providerId: string;
  }>;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

const cardClass = `
  rounded-3xl
  border border-slate-200
  bg-white
  p-5
  shadow-sm

  dark:border-slate-800
  dark:bg-slate-900
`;

const sectionLabelClass = `
  mb-3 px-1
  text-[13px] font-bold
  text-slate-600
  dark:text-slate-400
`;

export default async function ProviderPage({
  params,
}: ProviderPageProps) {
  const { category, providerId } =
    await params;

  const provider =
    getProviderById(providerId);

  /* ====================================================================
     BACK LINK — shared by both states
     ==================================================================== */

  const backLink = (
    <Link
      href={`/services/${category}`}
      className="
        inline-flex items-center gap-2
        rounded-xl
        border border-slate-200
        bg-white
        px-4 py-2.5
        text-sm font-semibold
        text-slate-700
        shadow-sm
        transition-colors

        hover:border-blue-600/40
        hover:text-blue-600

        dark:border-slate-800
        dark:bg-slate-900
        dark:text-slate-200
        dark:hover:border-blue-500/40
        dark:hover:text-blue-500
      "
    >
      <ArrowRight
        className="h-4 w-4"
        aria-hidden="true"
      />
      گەڕانەوە
    </Link>
  );

  /* ====================================================================
     NOT AVAILABLE YET

     The mock dataset only carries a handful of providers. Rather than
     a hard 404 for every story that points at a not-yet-seeded row,
     show a friendly placeholder. Swap this for notFound() once the
     database is the source of truth.
     ==================================================================== */

  if (!provider) {
    return (
      <main
        dir="rtl"
        className="px-4 py-8 sm:px-6"
      >
        {backLink}

        <div
          className={`mt-6 text-center ${cardClass}`}
        >
          <span
            aria-hidden="true"
            className="
              mx-auto flex h-14 w-14
              items-center justify-center
              rounded-2xl
              bg-blue-600/10
              text-blue-600

              dark:bg-blue-500/10
              dark:text-blue-500
            "
          >
            <Info className="h-7 w-7" />
          </span>

          <h1
            className="
              mt-4
              text-lg font-extrabold
              text-slate-900
              dark:text-white
            "
          >
            ئەم خزمەتگوزارییە هێشتا بەردەست نییە
          </h1>

          <p
            className="
              mx-auto mt-2 max-w-sm
              text-[13px] leading-relaxed
              text-slate-600
              dark:text-slate-400
            "
          >
            زانیاری ئەم دابینکەرە بەم زووانە زیاد دەکرێت.
            لەم کاتەدا دەتوانیت خزمەتگوزارییەکانی تری ئەم
            بەشە ببینیت.
          </p>
        </div>
      </main>
    );
  }

  const safeRating = Math.max(
    0,
    Math.min(5, provider.rating ?? 0)
  );

  const openHours = (
    provider.hours ?? []
  ).filter(
    (hour) =>
      !hour.closed &&
      hour.open &&
      hour.close
  );

  return (
    <main
      dir="rtl"
      className="pb-8"
    >
      {/* ====================================================================
          COVER
          ==================================================================== */}

      <div className="relative h-48 w-full sm:h-56">
        {provider.coverImage ??
        provider.logo ? (
          <Image
            src={
              (provider.coverImage ??
                provider.logo) as string
            }
            alt={provider.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 448px"
            className="object-cover"
          />
        ) : (
          <div
            className="
              absolute inset-0
              bg-gradient-to-br
              from-blue-600
              via-blue-500
              to-sky-400
            "
          />
        )}

        <div
          aria-hidden="true"
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/70
            via-black/10
            to-black/20
          "
        />

        <div className="absolute end-4 top-4">
          {backLink}
        </div>
      </div>

      <div className="px-4 sm:px-6">
        {/* ==================================================================
            IDENTITY
            ================================================================== */}

        <div
          className={`-mt-10 relative ${cardClass}`}
        >
          <div className="flex items-start gap-3">
            <div
              className="
                relative
                flex h-16 w-16 shrink-0
                items-center justify-center
                overflow-hidden
                rounded-2xl
                border-2 border-white
                bg-slate-100
                shadow-md

                dark:border-slate-800
                dark:bg-slate-800
              "
            >
              {provider.logo ? (
                <Image
                  src={provider.logo}
                  alt={`${provider.name} logo`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <span
                  className="
                    text-lg font-black
                    text-blue-600
                    dark:text-blue-500
                  "
                >
                  {getInitials(
                    provider.name
                  )}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-sm font-semibold
                  text-blue-600
                  dark:text-blue-500
                "
              >
                {provider.subcategory ??
                  provider.category}
              </p>

              <h1
                className="
                  mt-1
                  text-xl font-black leading-tight
                  text-slate-900
                  dark:text-white
                "
              >
                {provider.name}
              </h1>

              {/* RATING + BADGES */}

              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <div
                  className="flex items-center gap-1.5"
                  dir="ltr"
                >
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`نمرە: ${safeRating.toFixed(1)} لە 5`}
                  >
                    {Array.from({
                      length: 5,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index <
                          Math.round(
                            safeRating
                          )
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <span
                    className="
                      text-sm font-bold
                      text-slate-800
                      dark:text-slate-200
                    "
                  >
                    {safeRating.toFixed(1)}
                  </span>

                  {provider.reviewCount !==
                    undefined && (
                    <span className="text-[11px] text-slate-400">
                      ({provider.reviewCount})
                    </span>
                  )}
                </div>

                {provider.verified && (
                  <span
                    className="
                      inline-flex items-center gap-1
                      rounded-full
                      bg-sky-50
                      px-2 py-1
                      text-[10px] font-bold
                      text-blue-700

                      dark:bg-sky-900/30
                      dark:text-blue-500
                    "
                  >
                    <BadgeCheck
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                    پشتڕاستکراوە
                  </span>
                )}

                {provider.featured && (
                  <span
                    className="
                      inline-flex items-center
                      rounded-full
                      bg-yellow-50
                      px-2 py-1
                      text-[10px] font-bold
                      text-yellow-700
                      ring-1 ring-inset ring-yellow-200

                      dark:bg-yellow-950/30
                      dark:text-yellow-400
                      dark:ring-yellow-900/50
                    "
                  >
                    پڕداواکاریترین
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            CONTACT
            ================================================================== */}

        {(provider.phone ||
          provider.location?.address) && (
          <div className="mt-6">
            <p className={sectionLabelClass}>
              پەیوەندی
            </p>

            <div className="space-y-3">
              {provider.phone && (
                <a
                  href={`tel:${provider.phone}`}
                  dir="ltr"
                  className={`flex items-center gap-3 ${cardClass}`}
                >
                  <span
                    className="
                      flex h-6 w-6 shrink-0
                      items-center justify-center
                      text-blue-600
                      dark:text-blue-500
                    "
                  >
                    <Phone
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>

                  <span
                    className="
                      flex-1 truncate text-start
                      text-[15px] font-semibold
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    {provider.phone}
                  </span>
                </a>
              )}

              {provider.location
                ?.address && (
                <div className={cardClass}>
                  <span
                    className="
                      flex h-6 w-6
                      items-center justify-center
                      text-blue-600
                      dark:text-blue-500
                    "
                  >
                    <MapPin
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </span>

                  <h2
                    className="
                      mt-3
                      text-[14px] font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    ناونیشان
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[13px] leading-relaxed
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {
                      provider.location
                        .address
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================
            DESCRIPTION
            ================================================================== */}

        {provider.description && (
          <div className="mt-6">
            <p className={sectionLabelClass}>
              وەسف و زانیاری
            </p>

            <div className={cardClass}>
              <p
                className="
                  text-[13px] leading-7
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {provider.description}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================================
            WORKING HOURS
            ================================================================== */}

        {openHours.length > 0 && (
          <div className="mt-6">
            <p className={sectionLabelClass}>
              کاتی کارکردن
            </p>

            <div className={cardClass}>
              <span
                className="
                  flex h-6 w-6
                  items-center justify-center
                  text-blue-600
                  dark:text-blue-500
                "
              >
                <Clock3
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>

              <ul className="mt-3 space-y-2">
                {openHours.map((hour) => (
                  <li
                    key={hour.day}
                    className="
                      flex items-center justify-between
                      gap-3
                      text-[13px]
                    "
                  >
                    <span
                      className="
                        font-semibold
                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {hour.day}
                    </span>

                    <span
                      dir="ltr"
                      className="
                        font-medium
                        text-slate-600
                        dark:text-slate-400
                      "
                    >
                      {hour.open} - {hour.close}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ==================================================================
            SOCIALS
            ================================================================== */}

        <div className="mt-6">
          <p className={sectionLabelClass}>
            سۆشیال میدیا
          </p>

          <div className={cardClass}>
            <ProviderSocials
              socials={provider.socials}
              phone={provider.phone}
              size="md"
              showLabels
            />
          </div>
        </div>
      </div>
    </main>
  );
}
