"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { BadgeCheck, Star } from "lucide-react";

import type {
  Provider,
  ProviderCardProps,
} from "@/lib/types/provider";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

/* ============================================================
   DYNAMIC OPEN / CLOSED STATUS
   Compares the visitor's current local time against the
   provider's `hours` entry for today's Kurdish day name.
   ============================================================ */

const KURDISH_WEEKDAYS = [
  "یەکشەممە",
  "دووشەممە",
  "سێشەممە",
  "چوارشەممە",
  "پێنجشەممە",
  "هەینی",
  "شەممە",
] as const;

function parseTimeToMinutes(
  value?: string
): number | null {
  if (!value) {
    return null;
  }

  const match = value
    .trim()
    .match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function getOpenStatus(
  hours: Provider["hours"],
  now: Date
): {
  isOpen: boolean;
  label: string;
} {
  const CLOSED = {
    isOpen: false,
    label: "داخراوە",
  };

  if (!hours || hours.length === 0) {
    return CLOSED;
  }

  const todayName =
    KURDISH_WEEKDAYS[now.getDay()];

  const today = hours.find(
    (item) => item.day === todayName
  );

  if (!today || today.closed) {
    return CLOSED;
  }

  const openMinutes = parseTimeToMinutes(
    today.open
  );

  const closeMinutes = parseTimeToMinutes(
    today.close
  );

  if (
    openMinutes === null ||
    closeMinutes === null
  ) {
    return CLOSED;
  }

  const nowMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  /*
   * Overnight ranges (e.g. 20:00 -> 02:00) wrap past
   * midnight, so "open" spans across the day boundary.
   */
  const isOpenNow =
    closeMinutes > openMinutes
      ? nowMinutes >= openMinutes &&
        nowMinutes < closeMinutes
      : nowMinutes >= openMinutes ||
        nowMinutes < closeMinutes;

  return {
    isOpen: isOpenNow,
    label: isOpenNow
      ? "کراوەیە"
      : "داخراوە",
  };
}

/*
 * The open/closed check depends on the VISITOR's local
 * clock and timezone, which almost never matches the
 * server's at render time. Reading `Date.now()` during
 * the initial render (including SSR) would make the
 * server-rendered HTML disagree with the client's first
 * render and trigger a hydration mismatch.
 *
 * So we render a stable, deterministic placeholder for
 * both the SSR pass and the client's first render, then
 * only switch to the real, clock-based status inside an
 * effect — strictly after hydration has committed — and
 * keep it fresh by re-checking once a minute.
 */
function useOpenStatus(
  hours: Provider["hours"]
) {
  const [mounted, setMounted] =
    useState(false);

  const [now, setNow] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());

    const interval = window.setInterval(
      () => setNow(Date.now()),
      60 * 1000
    );

    return () =>
      window.clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!mounted) {
      return {
        isOpen: false,
        label: "داخراوە",
      };
    }

    return getOpenStatus(
      hours,
      new Date(now)
    );
  }, [mounted, hours, now]);
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
      className="flex items-center gap-0.5"
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
              className={`h-3 w-3 ${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300 dark:text-slate-700"
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
  const handleCardClick = () => {
    onClick?.(provider);
  };

  const badgeLabel =
    provider.subcategory ??
    provider.category;

  const status = useOpenStatus(
    provider.hours
  );

  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl",
        "border border-slate-200/80 bg-white",
        "shadow-sm transition-[transform,box-shadow] duration-300",
        "hover:-translate-y-1",
        "hover:shadow-lg hover:shadow-slate-200/60",
        "dark:border-slate-800 dark:bg-slate-900",
        "dark:hover:shadow-black/20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dir="rtl"
    >
      {/* =========================================================
          FULL-CARD CLICK TARGET
          Opens the same ProviderModal with all provider data
          (socials, hours, location, phone) untouched.
      ========================================================== */}

      <button
        type="button"
        onClick={handleCardClick}
        className="flex h-full w-full flex-col text-right touch-manipulation"
        aria-label={`بینینی زانیاری ${provider.name}`}
      >
        {/* =======================================================
            COVER
        ======================================================== */}

        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
          {provider.coverImage ? (
            <Image
              src={provider.coverImage}
              alt={provider.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-green-600
                via-green-500
                to-emerald-400
              "
            >
              <span className="text-xl font-black text-white/90">
                {getInitials(provider.name)}
              </span>
            </div>
          )}

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/20
              via-transparent
              to-transparent
            "
          />

          {/* Most Requested */}
          {provider.featured && (
            <span
              className="
                absolute
                end-2
                top-2
                max-w-[calc(100%-2.5rem)]
                truncate
                rounded-full
                bg-yellow-400
                px-2
                py-0.5
                text-[9px]
                font-bold
                text-yellow-950
                shadow-md
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
                start-2
                top-2
                flex
                items-center
                gap-0.5
                rounded-full
                bg-white/95
                px-1.5
                py-0.5
                text-[10px]
                font-semibold
                text-green-700
                shadow-sm
                backdrop-blur
              "
            >
              <BadgeCheck
                className="h-3 w-3"
                aria-hidden="true"
              />
            </span>
          )}

          {/* Logo */}
          {provider.logo && (
            <span
              className="
                absolute
                -bottom-4
                start-3
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border-2
                border-white
                bg-slate-100
                shadow-md
                dark:border-slate-900
                dark:bg-slate-800
              "
            >
              <Image
                src={provider.logo}
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
          )}
        </div>

        {/* =======================================================
            BODY
        ======================================================== */}

        <div
          className={`
            flex flex-1 flex-col gap-1
            px-3 pb-3
            ${
              provider.logo
                ? "pt-6"
                : "pt-3"
            }
          `}
        >
          <div className="flex flex-wrap items-center gap-1">
            {badgeLabel && (
              <span
                className="
                  w-fit
                  max-w-full
                  truncate
                  rounded-full
                  bg-green-50
                  px-2
                  py-0.5
                  text-[10px]
                  font-semibold
                  text-green-700
                  dark:bg-green-950/40
                  dark:text-green-400
                "
              >
                {badgeLabel}
              </span>
            )}

            {/* Open / Closed status */}
            <span
              className={`
                inline-flex
                w-fit
                items-center
                gap-1
                rounded-full
                px-2
                py-0.5
                text-[10px]
                font-semibold
                ${
                  status.isOpen
                    ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                }
              `}
            >
              <span
                aria-hidden="true"
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${
                    status.isOpen
                      ? "bg-green-500"
                      : "bg-rose-500"
                  }
                `}
              />

              {status.label}
            </span>
          </div>

          <h3
            className="
              line-clamp-1
              text-sm
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            {provider.name}
          </h3>

          <div className="mt-auto flex items-center gap-1.5 pt-1">
            <RatingStars
              rating={provider.rating}
            />

            <span
              className="
                text-xs
                font-bold
                text-slate-800
                dark:text-slate-200
              "
            >
              {(
                provider.rating ?? 0
              ).toFixed(1)}
            </span>

            {provider.reviewCount !==
              undefined && (
              <span className="truncate text-[10px] text-slate-400">
                ({provider.reviewCount})
              </span>
            )}
          </div>
        </div>
      </button>
    </article>
  );
}
