"use client";

import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  Clock3,
  MapPin,
  Star,
} from "lucide-react";

import type {
  Provider,
  ProviderCardProps,
} from "@/lib/types/provider";

import ProviderSocials from "./ProviderSocials";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function getTodayStatus(
  hours?: Provider["hours"]
): {
  label: string;
  isOpen: boolean;
} {
  if (!hours || hours.length === 0) {
    return {
      label: "کاتی کار دیاری نەکراوە",
      isOpen: false,
    };
  }

  const days = [
    "یەکشەممە",
    "دووشەممە",
    "سێشەممە",
    "چوارشەممە",
    "پێنجشەممە",
    "هەینی",
    "شەممە",
  ];

  const todayName = days[new Date().getDay()];

  const today =
    hours.find(
      (item) => item.day === todayName
    ) ?? hours[0];

  if (today.closed) {
    return {
      label: "داخراوە",
      isOpen: false,
    };
  }

  if (today.open && today.close) {
    return {
      label: `${today.open} - ${today.close}`,
      isOpen: true,
    };
  }

  return {
    label: "کاتی کار دیاری نەکراوە",
    isOpen: false,
  };
}

function RatingStars({
  rating,
}: {
  rating?: number;
}) {
  const safeRating = Math.max(
    0,
    Math.min(5, rating ?? 0)
  );

  return (
    <div
      className="flex items-center gap-1"
      dir="ltr"
      aria-label={`Rating ${safeRating} out of 5`}
    >
      {Array.from({ length: 5 }).map(
        (_, index) => {
          const filled =
            index <
            Math.round(safeRating);

          return (
            <Star
              key={index}
              className={`h-3.5 w-3.5 ${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300"
              }`}
              strokeWidth={1.6}
              aria-hidden="true"
            />
          );
        }
      )}
    </div>
  );
}

export default function ProviderCard({
  provider,
  onClick,
  className = "",
}: ProviderCardProps) {
  const todayStatus =
    getTodayStatus(provider.hours);

  const handleCardClick = () => {
    onClick?.(provider);
  };

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-3xl",
        "border border-slate-200/80 bg-white",
        "shadow-sm transition-all duration-300",
        "hover:-translate-y-1",
        "hover:shadow-xl hover:shadow-slate-200/50",
        "dark:border-slate-800 dark:bg-slate-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dir="rtl"
    >
      {/* =========================================================
          COVER
      ========================================================== */}

      <button
        type="button"
        onClick={handleCardClick}
        className="relative block h-48 w-full overflow-hidden text-right"
        aria-label={`بینینی زانیاری ${provider.name}`}
      >
        {provider.coverImage ? (
          <Image
            src={provider.coverImage}
            alt={provider.name}
            fill
            sizes="
              (max-width: 768px) 100vw,
              50vw
            "
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-green-600
              via-green-500
              to-emerald-400
            "
          />
        )}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/55
            via-black/5
            to-transparent
          "
        />

        {/* Most requested */}
        {provider.featured && (
          <span
            className="
              absolute
              right-4
              top-4
              rounded-full
              bg-yellow-400
              px-3
              py-1
              text-xs
              font-bold
              text-yellow-950
              shadow-lg
            "
          >
            پڕداواکاریترین
          </span>
        )}

        {/* Verified */}
        {provider.verified && (
          <span
            className="
              absolute
              left-4
              top-4
              flex
              items-center
              gap-1
              rounded-full
              bg-white/95
              px-2.5
              py-1
              text-xs
              font-semibold
              text-green-700
              shadow-md
              backdrop-blur
            "
          >
            <BadgeCheck
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            پشتڕاستکراوە
          </span>
        )}
      </button>

      {/* =========================================================
          BODY
      ========================================================== */}

      <div className="relative px-5 pb-5">
        {/* =======================================================
            LOGO + STATUS
        ======================================================== */}

        <div className="-mt-11 mb-4 flex items-end justify-between">
          <button
            type="button"
            onClick={handleCardClick}
            className="
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              border-4
              border-white
              bg-slate-100
              shadow-lg
              dark:border-slate-900
              dark:bg-slate-800
            "
            aria-label={`بینینی ${provider.name}`}
          >
            {provider.logo ? (
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <span
                className="
                  text-xl
                  font-black
                  text-green-600
                "
              >
                {getInitials(
                  provider.name
                )}
              </span>
            )}
          </button>

          <div className="pb-1">
            <span
              className={`
                inline-flex
                items-center
                gap-1
                rounded-full
                px-2.5
                py-1
                text-[11px]
                font-semibold
                ${
                  todayStatus.isOpen
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-100 text-slate-500"
                }
              `}
            >
              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${
                    todayStatus.isOpen
                      ? "bg-green-500"
                      : "bg-slate-400"
                  }
                `}
              />

              {todayStatus.isOpen
                ? "کراوەیە"
                : "داخراوە"}
            </span>
          </div>
        </div>

        {/* =======================================================
            MAIN CONTENT
        ======================================================== */}

        <button
          type="button"
          onClick={handleCardClick}
          className="
            block
            w-full
            text-right
          "
        >
          {/* Provider name + Arrow */}
          <div className="mb-1 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3
                  className="
                    truncate
                    text-lg
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {provider.name}
                </h3>

                {/* Arrow icon restored next to the name */}
                <span
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-100
                    text-slate-500
                    transition-all
                    duration-200
                    group-hover:-translate-x-0.5
                    group-hover:bg-green-50
                    group-hover:text-green-600
                    dark:bg-slate-800
                    dark:text-slate-400
                    dark:group-hover:bg-green-950/40
                    dark:group-hover:text-green-400
                  "
                  aria-hidden="true"
                >
                  <ArrowLeft
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                </span>
              </div>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-green-600
                "
              >
                {provider.subcategory ??
                  provider.category}
              </p>
            </div>
          </div>

          {provider.description && (
            <p
              className="
                mt-3
                line-clamp-2
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              {provider.description}
            </p>
          )}

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <RatingStars
              rating={
                provider.rating
              }
            />

            <span
              className="
                text-sm
                font-bold
                text-slate-800
                dark:text-slate-200
              "
            >
              {(
                provider.rating ??
                0
              ).toFixed(1)}
            </span>

            {provider.reviewCount !==
              undefined && (
              <span
                className="
                  text-xs
                  text-slate-400
                "
              >
                (
                {
                  provider.reviewCount
                }{" "}
                هەڵسەنگاندن)
              </span>
            )}
          </div>
        </button>

        {/* =======================================================
            META
        ======================================================== */}

        <div
          className="
            mt-4
            space-y-2
            border-t
            border-slate-100
            pt-4
            dark:border-slate-800
          "
        >
          {provider.location
            ?.address && (
            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              <MapPin
                className="
                  h-4
                  w-4
                  shrink-0
                  text-green-600
                "
                aria-hidden="true"
              />

              <span className="line-clamp-1">
                {
                  provider
                    .location
                    .address
                }
              </span>
            </div>
          )}

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            <Clock3
              className="
                h-4
                w-4
                shrink-0
                text-green-600
              "
              aria-hidden="true"
            />

            <span>
              {
                todayStatus.label
              }
            </span>
          </div>
        </div>

        {/* =======================================================
            SOCIAL MEDIA
            Labels enabled
        ======================================================== */}

        <div
          className="
            mt-4
            border-t
            border-slate-100
            pt-4
            dark:border-slate-800
          "
        >
          <ProviderSocials
            socials={
              provider.socials
            }
            phone={
              provider.phone
            }
            size="sm"
            showLabels
          />
        </div>
      </div>
    </article>
  );
}