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
      href: "/map",
      icon: "map",
    },
    {
      label: t("favorites"),
      href: "/favorites",
      icon: "favorites",
    },
    {
      label: t("servicesList"),
      href: "/services",
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

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-14 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">

          {/* =====================================================
              UPDATED HERO HEADLINE + SUBHEADING ONLY
          ====================================================== */}

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
              className="mx-auto mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-xl sm:text-sm"
            >
              <span>
                ✨ پلاتفۆرمی گشتگیری قەزای بازیان
              </span>
            </motion.div>

            {/* Main Animated Headline */}
                                                <motion.h1
  animate={{
    y: [0, -5, 0, 5, 0],
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
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
  className="text-balance bg-[linear-gradient(90deg,rgb(4,120,87),rgb(255,255,255),rgb(180,110,8))] bg-[length:200%_auto] bg-clip-text text-3xl font-extrabold leading-tight text-transparent drop-shadow-[0_5px_15px_rgba(0,0,0,0.95)] sm:text-4xl lg:text-5xl"
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
              className="mx-auto mt-4 max-w-2xl text-balance text-sm leading-relaxed text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)] sm:text-base"
            >
              {t("heroDescription")}
            </motion.p>
          </motion.div>

          {/* =====================================================
              EVERYTHING BELOW REMAINS UNCHANGED
          ====================================================== */}

          <motion.form
  onSubmit={handleSearch}
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.6,
    delay: 0.2,
    ease: "easeOut",
  }}
  className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white/95 p-2 shadow-xl shadow-black/20 backdrop-blur-md dark:bg-slate-900/95 sm:flex-row"
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
      className={`w-full rounded-xl bg-transparent py-3.5 text-sm text-[#1F2937] outline-none placeholder:text-[#9CA3AF] dark:text-white dark:placeholder:text-slate-400 ${
        language === "en"
          ? "pl-11 pr-4"
          : "pe-11 ps-4"
      }`}
    />
  </div>

  <button
    type="submit"
    className="shrink-0 rounded-xl bg-[#16A34A] px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-[#16A34A]/30 transition-all hover:bg-[#15803D] active:scale-[0.98]"
  >
    {t("searchButton")}
  </button>
</motion.form>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: "easeOut",
            }}
            className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2.5"
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
        </div>
      </div>
    </section>
  );
}