"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Moon, Sun } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { useTheme } from "@/components/ThemeProvider";

import MenuSheet from "@/components/layout/MenuSheet";
import { useNotifications } from "@/components/layout/NotificationProvider";

/* ---------------------------------------------------------
   Shared styling for the header action buttons.
   Kept identical to the original Navbar controls.
--------------------------------------------------------- */

const ACTION_BUTTON_CLASS = `
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
  focus-visible:ring-offset-2

  dark:border-white/15
  dark:bg-white/10
  dark:text-white
  dark:hover:border-white/30
  dark:hover:bg-white/20
  dark:hover:text-white
  dark:focus-visible:ring-offset-[#002240]
`;

export default function AppHeader() {
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const pathname = usePathname();

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const {
    isOpen: isNotificationsOpen,
    toggle: toggleNotifications,
  } = useNotifications();

  /* ---------------------------------------------------------
     Scroll state
  --------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ---------------------------------------------------------
     Close the sheet when the route changes
  --------------------------------------------------------- */

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`
          fixed inset-x-0 top-0 z-50
          mx-auto w-full max-w-md

          border-b border-slate-200/70
          bg-[#EBEDF3]/95
          backdrop-blur-md
          transition-shadow duration-300

          dark:border-white/10
          dark:bg-[#002240]

          ${
            isScrolled
              ? `
                shadow-[0_10px_30px_rgba(15,23,42,0.08)]
                dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)]
              `
              : "shadow-none"
          }
        `}
      >
        <div
          className="
            flex min-h-[72px]
            items-center justify-between
            gap-3
            px-4
          "
        >
          {/* =================================================
              BRAND — LOGO + APP NAME
          ================================================= */}

          <Link
            href="/"
            aria-label={t("brand")}
            className="
              group flex min-w-0 shrink
              items-center gap-3
              rounded-2xl
              outline-none
              focus-visible:ring-2
              focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500
              focus-visible:ring-offset-2
              dark:focus-visible:ring-offset-slate-950
            "
          >
            <div
              className="
                relative flex
                h-14 w-14
                shrink-0
                items-center justify-center
                overflow-hidden
                rounded-2xl
                transition-all duration-300

                group-hover:scale-[1.035]
                group-hover:shadow-[0_10px_30px_rgba(37,99,235,0.12)]
              "
            >
              <div
                aria-hidden="true"
                className="
                  absolute inset-0
                  rounded-2xl
                  bg-sky-50/70
                  dark:bg-white/10
                "
              />

              <Image
                src="/images/logo.webp"
                alt={t("brand")}
                width={88}
                height={88}
                priority
                className="
                  relative z-10
                  h-14 w-14
                  scale-125
                  object-contain
                  transition-transform duration-300
                "
              />
            </div>

            <div className="flex min-w-0 flex-col">
              <span
                className="
                  truncate
                  text-[15px]
                  font-extrabold
                  leading-tight
                  tracking-[-0.02em]
                  text-slate-900
                  dark:text-white
                "
              >
                {t("brand")}
              </span>

              <span
                className="
                  mt-1
                  max-w-[130px]
                  truncate
                  text-[8px]
                  font-medium
                  leading-tight
                  text-slate-600
                  dark:text-slate-300
                "
              >
                {t("brandTagline")}
              </span>
            </div>
          </Link>

          {/* =================================================
              ACTIONS — THEME / NOTIFICATIONS / MENU
          ================================================= */}

          <div className="flex shrink-0 items-center gap-1.5">
            {/* DARK / LIGHT MODE */}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? t("darkModeLight")
                  : t("darkModeDark")
              }
              className={`group ${ACTION_BUTTON_CLASS}`}
            >
              {isDark ? (
                <Sun
                  aria-hidden="true"
                  className="
                    h-[18px] w-[18px]
                    transition-transform duration-300
                    group-hover:rotate-12
                  "
                />
              ) : (
                <Moon
                  aria-hidden="true"
                  className="
                    h-[18px] w-[18px]
                    transition-transform duration-300
                    group-hover:-rotate-12
                  "
                />
              )}
            </button>

            {/* NOTIFICATIONS */}

            <button
              type="button"
              onClick={toggleNotifications}
              aria-label={t("notifications")}
              aria-expanded={isNotificationsOpen}
              aria-haspopup="dialog"
              className={`relative ${ACTION_BUTTON_CLASS}`}
            >
              <Bell
                aria-hidden="true"
                className="h-[18px] w-[18px]"
              />

              <span
                aria-hidden="true"
                className="
                  absolute end-2.5 top-2.5
                  h-2 w-2
                  rounded-full
                  bg-rose-500
                  ring-2 ring-white
                  dark:ring-[#002240]
                "
              />
            </button>

            {/* HAMBURGER MENU */}

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label={t("openMenu")}
              aria-expanded={isMenuOpen}
              aria-haspopup="dialog"
              className={ACTION_BUTTON_CLASS}
            >
              <Menu
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE SHEET
      ====================================================== */}

      <MenuSheet
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
