"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Check,
  Moon,
  Sun,
  X,
  Home,
  LayoutGrid,
  Landmark,
  Heart,
  User,
  FileText,
  type LucideIcon,
} from "lucide-react";

import {
  LANGUAGES,
  useLanguage,
  type Language,
  type TranslationKey,
} from "@/lib/i18n";

import { useTheme } from "@/components/ThemeProvider";

/* ---------------------------------------------------------
   Sheet navigation links
--------------------------------------------------------- */

const SHEET_LINKS: Array<{
  label: TranslationKey;
  href: string;
  icon: LucideIcon;
}> = [
  { label: "tabHome", href: "/", icon: Home },
  {
    label: "navServices",
    href: "/#services",
    icon: LayoutGrid,
  },
  {
    label: "tabAbout",
    href: "/about",
    icon: Landmark,
  },
  {
    label: "tabFavorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    label: "tabProfile",
    href: "/profile",
    icon: User,
  },
  {
    label: "legalTitle",
    href: "/legal",
    icon: FileText,
  },
];

interface MenuSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function MenuSheet({
  open,
  onClose,
}: MenuSheetProps) {
  const { language, setLanguage, direction, t } =
    useLanguage();

  const { isDark, toggleTheme } = useTheme();

  const pathname = usePathname();

  const isRTL = direction === "rtl";

  /* ---------------------------------------------------------
     Lock body scroll while the sheet is open
  --------------------------------------------------------- */

  useEffect(() => {
    document.body.style.overflow = open
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* ---------------------------------------------------------
     Close on Escape
  --------------------------------------------------------- */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  /* ---------------------------------------------------------
     Language change
  --------------------------------------------------------- */

  const handleLanguageChange = (
    nextLanguage: Language
  ) => {
    setLanguage(nextLanguage);
    onClose();
  };

  /* ---------------------------------------------------------
     Active link — only real routes can be active
  --------------------------------------------------------- */

  const isActive = (href: string) => {
    if (href.includes("#")) {
      return false;
    }

    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed inset-0 z-[60]
            mx-auto w-full max-w-md
          "
        >
          {/* =================================================
              OVERLAY
          ================================================= */}

          <motion.button
            type="button"
            aria-label={t("closeMenu")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              absolute inset-0
              cursor-default
              bg-slate-950/50
              backdrop-blur-sm
            "
          />

          {/* =================================================
              PANEL
          ================================================= */}

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("menuTitle")}
            dir={direction}
            initial={{
              x: isRTL ? "-100%" : "100%",
            }}
            animate={{ x: 0 }}
            exit={{
              x: isRTL ? "-100%" : "100%",
            }}
            transition={{
              type: "tween",
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute inset-y-0 end-0
              flex w-[88%] max-w-[330px]
              flex-col
              border-slate-200
              bg-white
              shadow-[0_20px_60px_rgba(15,23,42,0.22)]

              dark:border-slate-800
              dark:bg-slate-950
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.55)]
            "
          >
            {/* ===============================================
                PANEL HEADER — BRAND
            =============================================== */}

            <div
              className="
                flex shrink-0
                items-center justify-between
                gap-3
                border-b border-slate-200
                px-4 py-4

                dark:border-slate-800
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    overflow-hidden
                    rounded-xl
                    bg-sky-50
                    dark:bg-sky-900/30
                  "
                >
                  <Image
                    src="/images/logo.webp"
                    alt={t("brand")}
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-[15px] font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {t("brand")}
                  </p>

                  <p
                    className="
                      mt-0.5 truncate
                      text-[11px] font-medium
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {t("brandTagline")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={t("closeMenu")}
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  border border-slate-200
                  bg-white/80
                  text-slate-700
                  shadow-sm
                  outline-none
                  transition-all duration-200

                  hover:border-sky-400
                  hover:bg-sky-50
                  hover:text-blue-600

                  focus-visible:ring-2
                  focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500

                  dark:border-slate-800
                  dark:bg-white/[0.04]
                  dark:text-slate-200
                  dark:hover:border-sky-400/40
                  dark:hover:bg-sky-900/30
                  dark:hover:text-blue-500
                "
              >
                <X
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </button>
            </div>

            {/* ===============================================
                SCROLLABLE CONTENT
            =============================================== */}

            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-5">
              {/* PAGE LINKS */}

              <nav
                aria-label={t("menuTitle")}
                className="
                  rounded-2xl
                  border border-slate-200/80
                  bg-slate-50/80
                  p-2

                  dark:border-slate-800
                  dark:bg-white/[0.025]
                "
              >
                {SHEET_LINKS.map((link) => {
                  const active = isActive(
                    link.href
                  );

                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={`
                        flex min-h-[52px]
                        items-center gap-3
                        rounded-xl
                        px-3 py-3
                        text-[15px] font-semibold
                        outline-none
                        transition-all duration-200

                        focus-visible:ring-2
                        focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500

                        ${
                          active
                            ? `
                              bg-white
                              text-blue-600
                              shadow-sm

                              dark:bg-white/[0.07]
                              dark:text-blue-500
                            `
                            : `
                              text-slate-700

                              hover:bg-white
                              hover:text-blue-600
                              hover:shadow-sm

                              dark:text-slate-200
                              dark:hover:bg-white/[0.06]
                              dark:hover:text-blue-500
                            `
                        }
                      `}
                    >
                      <Icon
                        aria-hidden="true"
                        className="h-[18px] w-[18px] shrink-0"
                        strokeWidth={2}
                      />

                      <span className="truncate">
                        {t(link.label)}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* LANGUAGE SWITCHER */}

              <div
                className="
                  mt-5
                  border-t border-slate-200
                  pt-5

                  dark:border-slate-800
                "
              >
                <p
                  className="
                    mb-3 px-1
                    text-[13px] font-bold
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  {t("language")}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {LANGUAGES.map((lang) => {
                    const active =
                      language === lang.code;

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() =>
                          handleLanguageChange(
                            lang.code
                          )
                        }
                        className={`
                          flex min-h-[50px]
                          items-center justify-center
                          gap-1.5
                          rounded-xl
                          border
                          px-2 py-3
                          text-[13px] font-semibold
                          outline-none
                          transition-all duration-200

                          focus-visible:ring-2
                          focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500

                          ${
                            active
                              ? `
                                border-blue-600
                                bg-sky-50
                                text-blue-600

                                dark:border-blue-500
                                dark:bg-sky-900/30
                                dark:text-blue-500
                              `
                              : `
                                border-slate-200
                                bg-white
                                text-slate-700

                                hover:border-sky-400
                                hover:text-blue-600

                                dark:border-slate-800
                                dark:bg-white/[0.03]
                                dark:text-slate-200
                                dark:hover:border-sky-400/40
                                dark:hover:text-blue-500
                              `
                          }
                        `}
                      >
                        <span className="truncate">
                          {lang.label}
                        </span>

                        {active && (
                          <Check
                            aria-hidden="true"
                            className="h-3.5 w-3.5 shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* THEME TOGGLE */}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  isDark
                    ? t("darkModeLight")
                    : t("darkModeDark")
                }
                className="
                  mt-4
                  flex min-h-[52px] w-full
                  items-center justify-between
                  rounded-2xl
                  border border-slate-200
                  bg-white
                  px-4
                  text-[15px] font-semibold
                  text-slate-700
                  outline-none
                  transition-all duration-200

                  hover:border-sky-400
                  hover:bg-sky-50
                  hover:text-blue-600

                  focus-visible:ring-2
                  focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500

                  dark:border-slate-800
                  dark:bg-white/[0.03]
                  dark:text-slate-200
                  dark:hover:border-sky-400/40
                  dark:hover:bg-sky-900/30
                  dark:hover:text-blue-500
                "
              >
                <span>
                  {isDark
                    ? t("darkModeLight")
                    : t("darkModeDark")}
                </span>

                <span
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-xl
                    bg-slate-100
                    dark:bg-white/[0.06]
                  "
                >
                  {isDark ? (
                    <Sun
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  ) : (
                    <Moon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  )}
                </span>
              </button>
            </div>

            {/* ===============================================
                FOOTER — ABOUT THE APP
            =============================================== */}

            <div
              className="
                shrink-0
                border-t border-slate-200
                bg-slate-50/80
                px-4 py-4
                pb-[calc(1rem_+_env(safe-area-inset-bottom))]

                dark:border-slate-800
                dark:bg-white/[0.02]
              "
            >
              <p
                className="
                  text-[12px] leading-relaxed
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {t("footerDescription")}
              </p>

              <div
                className="
                  mt-3 space-y-1
                  text-[11px] font-medium
                  text-slate-600
                  dark:text-slate-400
                "
              >
                <p>{t("address")}</p>
                <p>{t("workingHours")}</p>
              </div>

              <p
                className="
                  mt-3
                  border-t border-slate-200
                  pt-3
                  text-[11px]
                  text-slate-600

                  dark:border-slate-800
                  dark:text-slate-400
                "
              >
                {t("copyright")}
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
