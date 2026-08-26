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
    <div className="flex items-center gap-0.5" dir="ltr">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < Math.round(safeRating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300"
          }`}
          strokeWidth={1.7}
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
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sortedHours = useMemo(() => {
    if (!provider?.hours) {
      return [];
    }

    return provider.hours;
  }, [provider?.hours]);

  if (!isOpen || !provider) {
    return null;
  }

  /*
   * These optional fields are supported without changing
   * the existing Provider type.
   */
  const extendedProvider = provider as Provider & {
    ownerName?: string;
  };

  const ownerName = extendedProvider.ownerName;

  const mapUrl =
    provider.location?.googleMapsUrl ??
    (provider.location?.latitude !== undefined &&
    provider.location?.longitude !== undefined
      ? `https://www.google.com/maps/search/?api=1&query=${provider.location.latitude},${provider.location.longitude}`
      : undefined);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="داخستن"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl dark:bg-slate-950 sm:max-w-md sm:rounded-[2rem]">
        {/* ================= COVER ================= */}
        <div className="relative h-48 w-full shrink-0 sm:h-52">
          {provider.coverImage ? (
            <Image
              src={provider.coverImage}
              alt={provider.name}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-cover"
              priority
            />
          ) : provider.logo ? (
            <Image
              src={provider.logo}
              alt={provider.name}
              fill
              sizes="(max-width: 640px) 100vw, 448px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-400" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/10" />

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="داخستن"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
            {/* Business identity */}
            <div className="flex items-start gap-3">
              {/* Logo */}
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-md dark:border-slate-800 dark:bg-slate-900">
                {provider.logo ? (
                  <Image
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-lg font-black text-green-600">
                    {getInitials(provider.name)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {/* Category */}
                <div className="mb-1 flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-green-600">
                    {provider.category}
                  </span>

                  {provider.subcategory && (
                    <>
                      <span className="text-slate-300">•</span>

                      <span className="truncate text-xs font-medium text-slate-400">
                        {provider.subcategory}
                      </span>
                    </>
                  )}
                </div>

                {/* Business name */}
                <h2
                  id="provider-modal-title"
                  className="text-xl font-black leading-tight text-slate-900 dark:text-white"
                >
                  {provider.name}
                </h2>

                {/* Rating + Verified */}
                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={provider.rating} />

                    <span
                      dir="ltr"
                      className="text-sm font-bold text-slate-800 dark:text-slate-200"
                    >
                      {(provider.rating ?? 0).toFixed(1)}
                    </span>

                    {provider.reviewCount !== undefined && (
                      <span className="text-[11px] text-slate-400">
                        ({provider.reviewCount})
                      </span>
                    )}
                  </div>

                  {provider.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      پشتڕاستکراوە
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ================= MOST REQUESTED ================= */}
            {provider.featured && (
              <div className="mt-4">
                <span className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1.5 text-[11px] font-bold text-yellow-700 ring-1 ring-inset ring-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:ring-yellow-900/50">
                  پڕداواکاریترین
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

            {/* ================= OWNER ================= */}
            {ownerName && (
              <div className="mb-4">
                <p className="text-xs font-medium text-slate-400">
                  ناوی خاوەن کار
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {ownerName}
                </p>
              </div>
            )}

            {/* ================= PHONE ================= */}
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                dir="ltr"
                className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-left transition-colors hover:border-green-200 hover:bg-green-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-green-900/50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  <Phone className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[10px] text-slate-400">
                    ژمارەی پەیوەندی
                  </span>

                  <span className="mt-0.5 block truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                    {provider.phone}
                  </span>
                </span>
              </a>
            )}

            {/* ================= ADDRESS ================= */}
            {provider.location?.address && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  <MapPin className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[10px] text-slate-400">
                    ناونیشان
                  </span>

                  <span className="mt-0.5 block text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200">
                    {provider.location.address}
                  </span>
                </span>
              </div>
            )}

            {/* Map */}
            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-green-700"
              >
                <MapPin className="h-4 w-4" />
                کردنەوەی لە نەخشە
              </a>
            )}

            {/* ================= DESCRIPTION ================= */}
            {provider.description && (
              <section className="mb-5">
                <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                  وەسف
                </h3>

                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {provider.description}
                </p>
              </section>
            )}

            {/* ================= WORKING HOURS ================= */}
            {sortedHours.length > 0 && (
              <section className="mb-5">
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-green-600" />

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    کاتی کارکردن
                  </h3>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  {sortedHours.map((item, index) => (
                    <div
                      key={`${item.day}-${index}`}
                      className={`flex items-center justify-between gap-4 px-4 py-3 text-xs ${
                        index !== sortedHours.length - 1
                          ? "border-b border-slate-100 dark:border-slate-800"
                          : ""
                      }`}
                    >
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {item.day}
                      </span>

                      <span
                        dir="ltr"
                        className={
                          item.closed
                            ? "font-bold text-red-500"
                            : "font-medium text-slate-500 dark:text-slate-400"
                        }
                      >
                        {item.closed
                          ? "داخراوە"
                          : item.open && item.close
                          ? `${item.open} - ${item.close}`
                          : "دیاری نەکراوە"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ================= SOCIAL MEDIA ================= */}
            <section className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-800">
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