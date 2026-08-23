"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Utensils,
  ShoppingCart,
  HeartPulse,
  Smartphone,
  Scissors,
  House,
  GraduationCap,
  Wrench,
  Heart,
  Sparkles,
  Flame,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  categories,
  type ServiceCategory,
  type ServiceFilter,
} from "@/lib/data/categories";
import { useLanguage } from "@/lib/i18n";

type ServiceFilterKey = "all" | string;

type CategoryWithFilter = ServiceCategory & {
  filterKey?: ServiceFilterKey;
};

const GRID_ANIMATION = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.96,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: index * 0.04,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: {
      duration: 0.2,
    },
  },
} as const;

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
};

const SERVICE_FILTERS = [
  {
    id: "all",
    label: "هەموو",
  },
  {
    id: "popular",
    label: "پڕداواکاریترین",
  },
  {
    id: "featured",
    label: "تایبەت",
  },
  ...categories.flatMap((category) => category.filters),
];

export function ServicesSection() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<ServiceFilterKey>("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const isRTL = language !== "en";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const visibleCategories = useMemo(() => {
    if (activeFilter === "all") {
      return categories;
    }
    if (activeFilter === "popular") {
      return categories.filter((category) => category.popular);
    }
    if (activeFilter === "featured") {
      return categories.filter((category) => category.featured);
    }

    return categories.filter((category: CategoryWithFilter) =>
      category.filters.some(
        (filter: ServiceFilter) => filter.id === activeFilter
      )
    );
  }, [activeFilter]);

  const locale =
    language === "en" ? "en-US" : language === "ar" ? "ar-IQ" : "ckb";

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="services" className="w-full py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span
            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl text-primary border border-primary/20 shadow-sm"
            aria-hidden="true"
          >
            🏪
          </span>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            {t("servicesTitle")}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {t("servicesDescription")}
          </p>
        </div>

        {/* Filters */}
        <div
          role="tablist"
          aria-label={t("servicesFilter")}
          className="mt-10 flex snap-x gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center sm:overflow-visible"
        >
          {SERVICE_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "relative shrink-0 snap-start rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2",
                  isActive
                    ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                    : "border-slate-200 bg-white/80 text-slate-700 hover:border-primary/40 hover:text-primary dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
                )}
              >
                {filter.id === "all" ? t("allServices") : filter.label}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
         <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">          <AnimatePresence mode="popLayout">
            {visibleCategories.map(
              (category: ServiceCategory, index: number) => {
                const Icon = CATEGORY_ICONS[category.icon];
                const isFavorite = !!favorites[category.id];

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
                      href={`/services/${category.id}`}
                      className={cn(
                        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-500",
                        "hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
                        "dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-primary/50 dark:hover:shadow-primary/20",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
                      )}
                    >
                      {/* Top Info Area */}
                      <div className="flex flex-col p-5 pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
                              "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/30"
                            )}
                          >
                            {Icon ? (
                              <Icon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            ) : (
                              <span className="text-xs" aria-hidden="true">
                                •
                              </span>
                            )}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {category.featured && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                <Sparkles className="h-3 w-3" />
                                تایبەت
                              </span>
                            )}
                            {category.popular && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
                                <Flame className="h-3 w-3" />
                                پڕداواکاری
                              </span>
                            )}

                            {/* Favorite Button */}
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(e, category.id)}
                              aria-label="تۆمارکردن لە دڵخوازەکان"
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
                                "bg-slate-100/80 hover:bg-rose-50 dark:bg-slate-800/80 dark:hover:bg-rose-950/40",
                                isFavorite
                                  ? "text-rose-500"
                                  : "text-slate-400 hover:text-rose-500"
                              )}
                            >
                              <Heart
                                className={cn(
                                  "h-4 w-4 transition-transform duration-300 active:scale-125",
                                  isFavorite && "fill-current scale-110"
                                )}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h3 className="truncate text-lg font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
                            {category.title}
                          </h3>
                          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            {category.filters.length > 0
                              ? `${category.filters.length.toLocaleString(locale)} جۆر / خزمەتگوزاری`
                              : t("servicesList")}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Cover Image */}
                      <div className="relative mt-auto h-40 w-full overflow-hidden border-t border-slate-100 dark:border-slate-800/80">
                        <Image
                          src={category.imageSrc}
                          alt={category.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent transition-opacity duration-300 group-hover:opacity-75" />

                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                          <span className="text-xs font-semibold drop-shadow-sm">
                            بینینی زانیارییەکان
                          </span>
                          <ArrowIcon
                            className={cn(
                              "h-4 w-4 text-white transition-transform duration-300",
                              isRTL
                                ? "group-hover:-translate-x-1.5"
                                : "group-hover:translate-x-1.5"
                            )}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              }
            )}
          </AnimatePresence>
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/80 px-8 py-3.5 text-sm font-semibold text-primary shadow-sm backdrop-blur-md",
              "transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 dark:bg-slate-900/80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
            )}
          >
            {t("viewAllServices")}
            <ArrowIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
} 