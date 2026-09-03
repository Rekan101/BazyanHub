"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  Clock3,
  MapPin,
  Phone,
  Star,
  X,
} from "lucide-react";

import type {
  Provider,
  ProviderModalProps,
} from "@/lib/types/provider";

import ProviderSocials from "./ProviderSocials";

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
      aria-label={`نمرە: ${safeRating.toFixed(1)} لە 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < Math.round(safeRating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300"
          }`}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      ))}
    </div>
  );
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

export default function ProviderModal({
  provider,
  isOpen,
  onClose,
}: ProviderModalProps) {
  /*
   * IMPORTANT:
   * All hooks must run on every render.
   * Do NOT put a conditional return before these hooks.
   */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen, onClose]);

  /*
   * Keep hours safe even when provider is not
   * available during the initial render.
   *
   * No hook is needed here.
   */
  const sortedHours = provider?.hours ?? [];

  /*
   * IMPORTANT:
   * This useMemo is BEFORE the conditional return.
   * Therefore the hook order is always identical.
   */
  const workingHoursSummary = useMemo(() => {
    if (!sortedHours.length) {
      return "";
    }

    const closedDays = sortedHours
      .filter((item) => item.closed)
      .map((item) => item.day);

    const openDays = sortedHours.filter(
      (item) =>
        !item.closed &&
        item.open &&
        item.close
    );

    /*
     * No open days.
     */
    if (openDays.length === 0) {
      if (closedDays.length > 0) {
        return `داخراوە لە ${closedDays.join(
          " و "
        )}.`;
      }

      return "کاتی کار دیاری نەکراوە.";
    }

    const firstOpen = openDays[0];

    /*
     * Check whether all open days have
     * the same schedule.
     */
    const sameHours = openDays.every(
      (item) =>
        item.open === firstOpen.open &&
        item.close === firstOpen.close
    );

    /*
     * Some days closed + same working hours.
     */
    if (closedDays.length > 0 && sameHours) {
      return `هەموو ڕۆژێک هەیە جگە لە ${closedDays.join(
        " و "
      )} - لە کاتژمێر ${
        firstOpen.open
      }ی بەیانی بۆ ${
        firstOpen.close
      }ی شەو کراوەیە.`;
    }

    /*
     * Every open day has the same hours.
     */
    if (sameHours) {
      return `هەموو ڕۆژێک لە کاتژمێر ${
        firstOpen.open
      } بۆ ${
        firstOpen.close
      } کراوەیە.`;
    }

    /*
     * Different schedules.
     */
    const uniqueSchedules = Array.from(
      new Map(
        openDays.map((item) => [
          `${item.open}-${item.close}`,
          `${item.open} - ${item.close}`,
        ])
      ).values()
    );

    return `کاتەکانی کار: ${uniqueSchedules.join(
      "، "
    )}.`;
  }, [sortedHours]);

  /*
   * Optional extended provider fields.
   */
  const extendedProvider = provider as
    | (Provider & {
        ownerName?: string;
      })
    | undefined;

  const ownerName =
    extendedProvider?.ownerName;

  /*
   * Only now can we conditionally render.
   * All hooks have already been executed.
   */
  if (!isOpen || !provider) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/60
        p-0
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-modal-title"
    >
      {/* ================= BACKDROP ================= */}

      <button
        type="button"
        aria-label="داخستن"
        onClick={onClose}
        className="
          absolute
          inset-0
          cursor-default
          touch-manipulation
        "
      />

      {/* ================= MODAL ================= */}

      <div
        className="
          relative
          z-10
          flex
          max-h-[95vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[2rem]
          bg-white
          shadow-2xl
          dark:bg-slate-950
          sm:max-w-md
          sm:rounded-[2rem]
        "
      >
        {/* ================= COVER ================= */}

        <div
          className="
            relative
            h-48
            w-full
            shrink-0
            sm:h-52
          "
        >
          {provider.coverImage ? (
            <Image
              src={provider.coverImage}
              alt={provider.name}
              fill
              sizes="
                (max-width: 640px) 100vw,
                448px
              "
              className="object-cover"
              priority
            />
          ) : provider.logo ? (
            <Image
              src={provider.logo}
              alt={provider.name}
              fill
              sizes="
                (max-width: 640px) 100vw,
                448px
              "
              className="object-cover"
              priority
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
              from-black/65
              via-black/10
              to-black/10
            "
          />

          {/* ================= CLOSE BUTTON ================= */}

          <button
            type="button"
            onClick={onClose}
            className="
              absolute
              left-4
              top-4
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-black/35
              text-white
              backdrop-blur-md
              transition-[transform,background-color]
              duration-200
              hover:scale-105
              hover:bg-black/55
              focus:outline-none
              focus:ring-2
              focus:ring-white/50
              touch-manipulation
            "
            aria-label="داخستن"
          >
            <X
              className="h-5 w-5"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* ================= CONTENT ================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div
            className="
              px-5
              pb-5
              pt-5
              sm:px-6
              sm:pb-6
            "
          >
            {/* ================= BUSINESS IDENTITY ================= */}

            <div className="flex items-start gap-3">
              {/* Logo */}

              <div
                className="
                  relative
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-2xl
                  border-2
                  border-white
                  bg-slate-100
                  shadow-md
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                {provider.logo ? (
                  <Image
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="
                      text-lg
                      font-black
                      text-green-600
                    "
                  >
                    {getInitials(
                      provider.name
                    )}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {/* Category */}

                <div className="mb-1 flex items-center gap-1.5">
                  <span
                    className="
                      text-sm
                      font-semibold
                      text-green-600
                    "
                  >
                    {provider.category}
                  </span>

                  {provider.subcategory && (
                    <>
                      <span className="text-slate-300">
                        •
                      </span>

                      <span
                        className="
                          truncate
                          text-xs
                          font-medium
                          text-slate-400
                        "
                      >
                        {
                          provider.subcategory
                        }
                      </span>
                    </>
                  )}
                </div>

                {/* Business name */}

                <h2
                  id="provider-modal-title"
                  className="
                    text-xl
                    font-black
                    leading-tight
                    text-slate-900
                    dark:text-white
                  "
                >
                  {provider.name}
                </h2>

                {/* Rating + Verified */}

                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <RatingStars
                      rating={
                        provider.rating
                      }
                    />

                    <span
                      dir="ltr"
                      className="
                        text-sm
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
                      <span
                        className="
                          text-[11px]
                          text-slate-400
                        "
                      >
                        (
                        {
                          provider.reviewCount
                        }
                        )
                      </span>
                    )}
                  </div>

                  {provider.verified && (
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1
                        rounded-full
                        bg-green-50
                        px-2
                        py-1
                        text-[10px]
                        font-bold
                        text-green-700
                        dark:bg-green-950/40
                        dark:text-green-400
                      "
                    >
                      <BadgeCheck
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />

                      پشتڕاستکراوە
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ================= MOST REQUESTED ================= */}

            {provider.featured && (
              <div className="mt-4">
                <span
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    bg-yellow-50
                    px-3
                    py-1.5
                    text-[11px]
                    font-bold
                    text-yellow-700
                    ring-1
                    ring-inset
                    ring-yellow-200
                    dark:bg-yellow-950/30
                    dark:text-yellow-400
                    dark:ring-yellow-900/50
                  "
                >
                  پڕداواکاریترین
                </span>
              </div>
            )}

            {/* ================= DIVIDER ================= */}

            <div
              className="
                my-5
                border-t
                border-slate-100
                dark:border-slate-800
              "
            />

            {/* ================= OWNER ================= */}

            {ownerName && (
              <div className="mb-4">
                <p
                  className="
                    text-xs
                    font-medium
                    text-slate-400
                  "
                >
                  ناوی خاوەن کار
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-bold
                    text-slate-800
                    dark:text-slate-200
                  "
                >
                  {ownerName}
                </p>
              </div>
            )}

            {/* ================= PHONE ================= */}

            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                dir="ltr"
                className="
                  mb-4
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3.5
                  text-left
                  transition-[border-color,background-color,box-shadow]
                  duration-200
                  hover:border-green-200
                  hover:bg-green-50
                  hover:shadow-sm
                  dark:border-slate-800
                  dark:bg-slate-900
                  dark:hover:border-green-900/50
                  touch-manipulation
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
                    text-green-700
                    dark:bg-green-950/40
                    dark:text-green-400
                  "
                >
                  <Phone
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </span>

                <span className="min-w-0">
                  <span
                    className="
                      block
                      text-[10px]
                      text-slate-400
                    "
                  >
                    ژمارەی پەیوەندی
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      truncate
                      text-sm
                      font-bold
                      text-slate-800
                      dark:text-slate-200
                    "
                  >
                    {provider.phone}
                  </span>
                </span>
              </a>
            )}

            {/* ================= ADDRESS ================= */}

            {provider.location?.address && (
              <div
                className="
                  mb-4
                  flex
                  items-start
                  gap-3
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3.5
                  dark:border-slate-800
                  dark:bg-slate-900
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
                    text-green-700
                    dark:bg-green-950/40
                    dark:text-green-400
                  "
                >
                  <MapPin
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </span>

                <span className="min-w-0">
                  <span
                    className="
                      block
                      text-[10px]
                      text-slate-400
                    "
                  >
                    ناونیشان
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      text-sm
                      font-semibold
                      leading-6
                      text-slate-800
                      dark:text-slate-200
                    "
                  >
                    {
                      provider.location
                        .address
                    }
                  </span>
                </span>
              </div>
            )}

            {/* ================= DESCRIPTION ================= */}

            {provider.description && (
              <section className="mb-6">
                <h3
                  className="
                    mb-3
                    text-sm
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  وەسف و زانیاری:
                </h3>

                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-4
                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <p
                    className="
                      text-sm
                      leading-8
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {provider.description}
                  </p>
                </div>
              </section>
            )}

            {/* ================= WORKING HOURS ================= */}

            {workingHoursSummary && (
              <section className="mb-5">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3
                    className="h-4 w-4 text-green-600"
                    aria-hidden="true"
                  />

                  <h3
                    className="
                      text-sm
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    کاتی کارکردن
                  </h3>
                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-4
                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <p
                    className="
                      text-sm
                      font-medium
                      leading-7
                      text-slate-700
                      dark:text-slate-300
                    "
                  >
                    {workingHoursSummary}
                  </p>
                </div>
              </section>
            )}

            {/* ================= SOCIAL MEDIA ================= */}

            <section
              className="
                mt-6
                border-t
                border-slate-100
                pt-5
                dark:border-slate-800
              "
            >
              <ProviderSocials
                socials={provider.socials}
                phone={provider.phone}
                size="md"
                showLabels
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}