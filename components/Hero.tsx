"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Map,
  Heart,
  ListChecks,
  ChevronDown,
} from "lucide-react";
import type { QuickAction } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

const QUICK_ACTION_ICON = {
  map: Map,
  favorites: Heart,
  list: ListChecks,
  outage: ListChecks,
} as const;

export default function Hero() {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");

  const translatedActions: QuickAction[] = [
    {
      label: t("map"),
      href: "https://www.google.com/maps/search/?api=1&query=35.5947,45.13686",
      icon: "map",
    },
    {
      label: t("favorites"),
      href: "/favorites",
      icon: "favorites",
    },
        {
      label: t("servicesList"),
      href: "#services",
      icon: "list",
    },
  ];

  const handleSearch = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) return;

    window.location.href = `/search?q=${encodeURIComponent(
      trimmedQuery
    )}`;
  };

  return (
    <section
      dir={language === "en" ? "ltr" : "rtl"}
      className="relative min-h-[620px] overflow-hidden"
    >
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_35%] sm:object-top"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-l from-[#16A34A]/25 via-transparent to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-14 pt-28 sm:px-6 sm:pt-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">

          {/* HERO HEADLINE + SUBHEADING */}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            {/* Glassmorphism Badge */}
            <motion.div
              animate={{
                y: [0, -3, 0, 3, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-xl sm:mb-5 sm:px-4 sm:py-2 sm:text-sm"
            >
              <span>
                ✨ پلاتفۆرمی گشتگیری قەزای بازیان
              </span>
            </motion.div>

            {/* Main Animated Headline */}
            <motion.h1
              animate={{
                y: [0, -5, 0, 5, 0],
                backgroundPosition: [
                  "0% 50%",
                  "100% 50%",
                  "0% 50%",
                ],
              }}
              transition={{
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                backgroundPosition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              className="text-balance bg-[linear-gradient(90deg,rgb(4,120,87),rgb(255,255,255),rgb(180,110,8))] bg-[length:200%_auto] bg-clip-text text-2xl font-extrabold leading-tight text-transparent drop-shadow-[0_5px_15px_rgba(0,0,0,0.95)] sm:text-4xl lg:text-5xl"
            >
              {t("heroTitle")}
            </motion.h1>

            {/* Animated Subheading */}
            <motion.p
              animate={{
                opacity: [0.82, 1, 0.82],
                y: [0, -2, 0],
              }}
              transition={{
                opacity: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="mx-auto mt-3 line-clamp-3 max-w-xl text-balance text-xs leading-relaxed text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)] sm:mt-4 sm:line-clamp-none sm:max-w-2xl sm:text-base"
            >
              {t("heroDescription")}
            </motion.p>
          </motion.div>

          {/* SEARCH */}

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: "easeOut",
            }}
            className="mx-auto mt-5 flex max-w-xl flex-col gap-1.5 rounded-[1.35rem] border border-white/30 bg-white/90 p-1.5 shadow-xl shadow-black/20 backdrop-blur-md dark:bg-slate-900/90 sm:mt-8 sm:max-w-2xl sm:flex-row sm:gap-2 sm:rounded-2xl sm:p-2"
          >
            <label
              htmlFor="hero-search"
              className="sr-only"
            >
              {t("searchAriaLabel")}
            </label>

            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF] dark:text-slate-400 ${
                  language === "en"
                    ? "left-4"
                    : "right-4"
                }`}
              />

              <input
                id="hero-search"
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchAriaLabel")}
                className={`w-full rounded-xl bg-transparent py-3 text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF] dark:text-white dark:placeholder:text-slate-400 sm:py-3.5 ${
                  language === "en"
                    ? "pl-11 pr-4"
                    : "pe-14 ps-10"
                }`}
              />
            </div>

            <button
              type="submit"
              className="shrink-0 rounded-[1rem] bg-[#16A34A] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#16A34A]/30 transition-all hover:bg-[#15803D] active:scale-[0.98] sm:rounded-xl sm:py-3.5"
            >
              {t("searchButton")}
            </button>
          </motion.form>

          {/* QUICK ACTIONS */}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2.5 sm:mt-6"
          >
            {translatedActions.map((action) => {
              const Icon =
                QUICK_ACTION_ICON[action.icon];

              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:text-sm"
                >
                  <Icon
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={2}
                  />

                  {action.label}
                </Link>
              );
            })}
          </motion.div>

          {/* MOBILE SERVICES SCROLL INDICATOR */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.5,
              ease: "easeOut",
            }}
            className="mt-5 flex flex-col items-center sm:hidden"
          >
            <Link
              href="#services"
              aria-label="بۆ بینینی خزمەتگوزاریەکان"
              className="flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
            >
              <motion.span
                animate={{
                  opacity: [0.8, 1, 0.8],
                  y: [0, -2, 0, 2, 0],
                  color: [
                    "#ffffff",
                    "#34d399",
                    "#fbbf24",
                    "#ffffff",
                  ],
                }}
                transition={{
                  opacity: {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  color: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="text-sm font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
              >
                بۆ بینینی خزمەتگوزاریەکان
              </motion.span>

              <motion.span
                animate={{
                  y: [0, 7, 0],
                  scale: [1, 1.08, 1],
                  color: [
                    "#ffffff",
                    "#34d399",
                    "#fbbf24",
                    "#ffffff",
                  ],
                }}
                transition={{
                  y: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  scale: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  color: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                className="mt-1.5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/20 shadow-lg shadow-black/30 backdrop-blur-md"
                aria-hidden="true"
              >
                <ChevronDown
                  className="h-7 w-7"
                  strokeWidth={3}
                />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}