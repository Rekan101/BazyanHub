"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  Globe,
  Mail,
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
    <div className="flex items-center gap-1" dir="ltr">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < Math.round(safeRating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300"
          }`}
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

  const mapUrl =
    provider.location?.googleMapsUrl ??
    (provider.location?.latitude !== undefined &&
    provider.location?.longitude !== undefined
      ? `https://www.google.com/maps/search/?api=1&query=${provider.location.latitude},${provider.location.longitude}`
      : undefined);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
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
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[95vh] w-full overflow-hidden rounded-t-[2rem] bg-white shadow-2xl dark:bg-slate-950 sm:max-w-3xl sm:rounded-[2rem]">
        {/* Header image */}
        <div className="relative h-48 sm:h-56">
          {provider.coverImage ? (
            <Image
              src={provider.coverImage}
              alt={provider.name}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-400" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/15" />

          <button
            type="button"
            onClick={onClose}
            className="absolute left-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="داخستن"
          >
            <X className="h-5 w-5" />
          </button>

          {provider.verified && (
            <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-green-700 shadow-lg">
              <BadgeCheck className="h-4 w-4" />
              پشتڕاستکراوەتەوە
            </span>
          )}

          <div className="absolute bottom-5 right-5 left-5 flex items-end justify-between gap-4">
            <div className="min-w-0 text-white">
              <p className="mb-1 text-xs font-medium text-white/80">
                {provider.category}
              </p>

              <h2
                id="provider-modal-title"
                className="truncate text-2xl font-black sm:text-3xl"
              >
                {provider.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[calc(95vh-12rem)] overflow-y-auto px-5 py-5 sm:px-7 sm:py-7">
          {/* Identity */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {provider.logo ? (
                <Image
                  src={provider.logo}
                  alt={`${provider.name} logo`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-black text-green-600">
                  {getInitials(provider.name)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {provider.name}
                </h3>

                {provider.featured && (
                  <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-bold text-yellow-800">
                    تایبەت
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm font-medium text-green-600">
                {provider.subcategory ?? provider.category}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <RatingStars rating={provider.rating} />

                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {(provider.rating ?? 0).toFixed(1)}
                  </span>
                </div>

                {provider.reviewCount !== undefined && (
                  <span className="text-xs text-slate-400">
                    {provider.reviewCount} هەڵسەنگاندن
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {provider.description && (
            <section className="mt-6">
              <h4 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
                دەربارەی خزمەتگوزار
              </h4>

              <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                {provider.description}
              </p>
            </section>
          )}

          {/* Services */}
          {provider.services && provider.services.length > 0 && (
            <section className="mt-6">
              <h4 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                خزمەتگوزارییەکان
              </h4>

              <div className="flex flex-wrap gap-2">
                {provider.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 dark:border-green-900/30 dark:bg-green-950/30 dark:text-green-400"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Contact */}
          <section className="mt-6">
            <h4 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
              زانیاری پەیوەندی
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              {provider.phone && (
                <a
                  href={`tel:${provider.phone}`}
                  dir="ltr"
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left transition-colors hover:border-green-200 hover:bg-green-50 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Phone className="h-4 w-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[11px] text-slate-400">
                      پەیوەندی
                    </span>

                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {provider.phone}
                    </span>
                  </span>
                </a>
              )}

              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  dir="ltr"
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left transition-colors hover:border-green-200 hover:bg-green-50 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Mail className="h-4 w-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[11px] text-slate-400">
                      ئیمەیڵ
                    </span>

                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {provider.email}
                    </span>
                  </span>
                </a>
              )}

              {provider.website && (
                <a
                  href={
                    provider.website.startsWith("http")
                      ? provider.website
                      : `https://${provider.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-left transition-colors hover:border-green-200 hover:bg-green-50 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Globe className="h-4 w-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[11px] text-slate-400">
                      وێبسایت
                    </span>

                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {provider.website}
                    </span>
                  </span>
                </a>
              )}

              {provider.location?.address && (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <MapPin className="h-4 w-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[11px] text-slate-400">
                      ناونیشان
                    </span>

                    <span className="block text-sm font-semibold leading-6 text-slate-800 dark:text-slate-200">
                      {provider.location.address}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700"
              >
                <MapPin className="h-4 w-4" />
                کردنەوەی لە نەخشە
              </a>
            )}
          </section>

          {/* Working Hours */}
          {sortedHours.length > 0 && (
            <section className="mt-6">
              <div className="mb-3 flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-green-600" />

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  کاتەکانی کار
                </h4>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                {sortedHours.map((item, index) => (
                  <div
                    key={`${item.day}-${index}`}
                    className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
                      index !== sortedHours.length - 1
                        ? "border-b border-slate-100 dark:border-slate-800"
                        : ""
                    }`}
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.day}
                    </span>

                    <span
                      dir="ltr"
                      className={
                        item.closed
                          ? "font-semibold text-red-500"
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

          {/* Socials */}
          {provider.socials && (
            <section className="mt-6">
              <h4 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">
                تۆڕە کۆمەڵایەتییەکان
              </h4>

              <ProviderSocials
                socials={provider.socials}
                phone={provider.phone}
                size="md"
                showLabels
              />
            </section>
          )}

          {/* Tags */}
          {provider.tags && provider.tags.length > 0 && (
            <section className="mt-6">
              <div className="flex flex-wrap gap-2">
                {provider.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="mt-7 border-t border-slate-100 pt-5 dark:border-slate-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CalendarDays className="h-4 w-4" />

                <span>
                  {provider.updatedAt
                    ? `نوێکراوەتەوە: ${new Date(
                        provider.updatedAt
                      ).toLocaleDateString("ku-Arab-IQ")}`
                    : "زانیارییەکە بەردەستە"}
                </span>
              </div>

              <div className="text-xs text-slate-400">
                ناسنامە: {provider.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}