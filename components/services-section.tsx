"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SERVICE_CATEGORIES,
  SERVICE_FILTERS,
  type ServiceFilterKey,
} from "@/lib/data/services";
import {
  useLanguage,
  type TranslationKey,
} from "@/lib/i18n";

const GRID_ANIMATION = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: index * 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  }),

  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.2,
    },
  },
} as const;

export function ServicesSection() {
  const { t, language } = useLanguage();

  const [activeFilter, setActiveFilter] =
    useState<ServiceFilterKey>("all");

  const visibleCategories = useMemo(() => {
    if (activeFilter === "all") {
      return SERVICE_CATEGORIES;
    }

    return SERVICE_CATEGORIES.filter(
      (category) =>
        category.filterKey === activeFilter
    );
  }, [activeFilter]);

  const locale =
    language === "en"
      ? "en-US"
      : language === "ar"
        ? "ar-IQ"
        : "ckb";

  return (
    <section
      id="services"
      className="w-full py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center">
          <span
            className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
            aria-hidden="true"
          >
            🏪
          </span>

          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            {t("servicesTitle")}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-text/70 sm:text-base">
            {t("servicesDescription")}
          </p>
        </div>

        {/* Filters */}
        <div
          role="tablist"
          aria-label={t("servicesFilter")}
          className="mt-8 flex snap-x gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible"
        >
          {SERVICE_FILTERS.map((filter) => {
            const isActive =
              activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() =>
                  setActiveFilter(filter.key)
                }
                className={cn(
                  "shrink-0 snap-start rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
                  isActive
                    ? "border-primary bg-primary text-white shadow-sm shadow-primary/30"
                    : "border-border bg-white text-text/70 hover:border-primary/40 hover:text-primary dark:bg-slate-800 dark:text-slate-200"
                )}
              >
                {t(
                  filter.labelKey as TranslationKey
                )}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {visibleCategories.map(
              (category, index) => {
                const Icon = category.icon;

                return (
                  <motion.div
                    key={category.id}
                    custom={index}
                    variants={GRID_ANIMATION}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                  >
                    <Link
                      href={category.href}
                      className={cn(
                        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
                        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
                      )}
                    >
                      {/* Card title */}
                      <div className="flex items-center gap-3 p-4 pb-3">
                        <span
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                            category.badgeClassName,
                            "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          <Icon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>

                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-base font-semibold text-text dark:text-slate-100">
                            {t(
                              category.titleKey
                            )}
                          </span>

                          <span className="text-xs text-text/50 dark:text-slate-400">
                            {category.providerCount.toLocaleString(
                              locale
                            )}{" "}
                            {t("providers")}
                          </span>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="relative mt-auto h-24 w-full overflow-hidden sm:h-28">
                        <Image
                          src={category.imageSrc}
                          alt={t(
                            category.imageAltKey
                          )}
                          fill
                          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              }
            )}
          </AnimatePresence>
        </div>

        {/* View all */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/services"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary",
              "transition-colors duration-300 hover:bg-primary hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
            )}
          >
            {t("viewAllServices")}

            <ArrowLeft
              className="h-4 w-4"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}