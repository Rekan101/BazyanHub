"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
  Check,
} from "lucide-react";

import {
  LANGUAGES,
  useLanguage,
  type Language,
} from "@/lib/i18n";

import { useTheme } from "@/components/ThemeProvider";

const NAV_LINKS = [
  {
    label: "navHome",
    href: "#hero",
  },
  {
    label: "navServices",
    href: "#services",
  },
  {
    label: "navAbout",
    href: "#about",
  },
  {
    label: "navContact",
    href: "#contact",
  },
] as const;

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

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
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ---------------------------------------------------------
     Lock body scroll when mobile menu is open
  --------------------------------------------------------- */

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  /* ---------------------------------------------------------
     Close menus when route changes
  --------------------------------------------------------- */

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsLangOpen(false);
  }, [pathname]);

  /* ---------------------------------------------------------
     Current language
  --------------------------------------------------------- */

  const currentLanguage =
    LANGUAGES.find(
      (item) => item.code === language
    ) ?? LANGUAGES[0];

  /* ---------------------------------------------------------
     Language change
  --------------------------------------------------------- */

  const handleLanguageChange = (
    nextLanguage: Language
  ) => {
    setLanguage(nextLanguage);
    setIsLangOpen(false);
    setIsMobileMenuOpen(false);
  };

  /* ---------------------------------------------------------
     Active navigation item
     Hash links are active based on current URL hash.
  --------------------------------------------------------- */

  const isActive = (href: string) => {
    if (typeof window === "undefined") {
      return false;
    }

    return (
      pathname === "/" &&
      window.location.hash === href
    );
  };

  return (
    <>
      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}

      <header
        className={`
          sticky top-0 z-50 w-full
          transition-all duration-300
          ${
            isScrolled
              ? "px-3 pt-3 sm:px-5 lg:px-6"
              : "px-0 pt-0"
          }
        `}
      >
        <div
          className={`
            relative mx-auto w-full max-w-[1480px]
            transition-all duration-300

            ${
              isScrolled
                ? `
                  rounded-3xl
                  border border-slate-200/70
                  bg-white/85
                  shadow-[0_12px_45px_rgba(15,23,42,0.08)]
                  backdrop-blur-2xl

                  dark:border-white/[0.08]
                  dark:bg-slate-900/85
                  dark:shadow-[0_12px_45px_rgba(0,0,0,0.28)]
                `
                : `
                  border-b border-slate-200/70
                  bg-white/95
                  backdrop-blur-xl

                  dark:border-white/[0.08]
                  dark:bg-slate-950/95
                `
            }
          `}
        >
          <div
            className="
              mx-auto flex
              min-h-[76px]
              items-center
              justify-between
              gap-4
              px-4
              sm:px-6
              lg:min-h-[82px]
              lg:px-8
              xl:px-10
            "
          >
            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              href="#hero"
              aria-label={t("brand")}
              className="
                group flex shrink-0
                items-center gap-3
                rounded-2xl
                outline-none
                focus-visible:ring-2
                focus-visible:ring-emerald-500
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
                  group-hover:shadow-[0_10px_30px_rgba(22,163,74,0.12)]

                  sm:h-[62px]
                  sm:w-[62px]

                  lg:h-[66px]
                  lg:w-[66px]
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    absolute inset-0
                    rounded-2xl
                    bg-emerald-50/70
                    dark:bg-emerald-400/[0.06]
                  "
                />

                <Image
                  src="/images/logo.png"
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
                    sm:h-[60px]
                    sm:w-[60px]
                    sm:scale-125
                    lg:h-[64px]
                    lg:w-[64px]
                    lg:scale-125
                  "
                />
              </div>

              <div
                className="
                  hidden
                  min-w-0
                  sm:flex
                  sm:flex-col
                "
              >
                <span
                  className="
                    truncate
                    text-[18px]
                    font-extrabold
                    leading-tight
                    tracking-[-0.02em]
                    text-slate-900
                    dark:text-white
                    lg:text-[20px]
                  "
                >
                  {t("brand")}
                </span>

                <span
                  className="
                    mt-1
                    max-w-[190px]
                    truncate
                    text-[10px]
                    font-medium
                    leading-tight
                    text-slate-500
                    dark:text-slate-400
                    lg:text-[11px]
                  "
                >
                  {t("brandTagline")}
                </span>
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav
              aria-label={t("navHome")}
              className="
                hidden
                items-center
                gap-1
                rounded-2xl
                border
                border-slate-200/80
                bg-slate-50/80
                p-1.5
                shadow-sm
                backdrop-blur-md
                lg:flex

                dark:border-white/[0.08]
                dark:bg-white/[0.035]
              "
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={
                      active ? "page" : undefined
                    }
                    className={`
                      rounded-xl
                      px-4
                      py-3
                      text-[15px]
                      font-semibold
                      leading-none
                      outline-none
                      transition-all
                      duration-200

                      focus-visible:ring-2
                      focus-visible:ring-emerald-500
                      focus-visible:ring-offset-1

                      ${
                        active
                          ? `
                            bg-white
                            text-emerald-600
                            shadow-sm

                            dark:bg-white/[0.08]
                            dark:text-emerald-400
                          `
                          : `
                            text-slate-600

                            hover:bg-white
                            hover:text-emerald-600
                            hover:shadow-sm

                            dark:text-slate-300
                            dark:hover:bg-white/[0.07]
                            dark:hover:text-emerald-400
                          `
                      }
                    `}
                  >
                    {t(link.label)}
                  </Link>
                );
              })}
            </nav>

            {/* =================================================
                RIGHT CONTROLS
            ================================================= */}

            <div
              className="
                flex shrink-0
                items-center gap-2
              "
            >
              {/* LANGUAGE */}

              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() =>
                    setIsLangOpen(
                      (value) => !value
                    )
                  }
                  aria-haspopup="listbox"
                  aria-expanded={isLangOpen}
                  className="
                    flex h-11
                    items-center gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white/80
                    px-3.5
                    text-[14px]
                    font-semibold
                    text-slate-700
                    shadow-sm
                    outline-none
                    transition-all duration-200

                    hover:border-emerald-300
                    hover:bg-emerald-50/50
                    hover:text-emerald-600

                    focus-visible:ring-2
                    focus-visible:ring-emerald-500
                    focus-visible:ring-offset-2

                    dark:border-white/[0.09]
                    dark:bg-white/[0.04]
                    dark:text-slate-200
                    dark:hover:border-emerald-400/30
                    dark:hover:bg-emerald-400/[0.07]
                    dark:hover:text-emerald-400
                    dark:focus-visible:ring-offset-slate-950
                  "
                >
                  <span>
                    {currentLanguage.label}
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`
                      h-4 w-4
                      transition-transform duration-200
                      ${
                        isLangOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

                {isLangOpen && (
                  <ul
                    role="listbox"
                    aria-label={t("language")}
                    className="
                      absolute
                      end-0
                      top-[calc(100%+10px)]
                      z-50
                      w-44
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white/95
                      p-1.5
                      shadow-[0_18px_55px_rgba(15,23,42,0.14)]
                      backdrop-blur-2xl

                      dark:border-white/[0.09]
                      dark:bg-slate-800/95
                      dark:shadow-[0_18px_55px_rgba(0,0,0,0.3)]
                    "
                  >
                    {LANGUAGES.map((lang) => {
                      const active =
                        language === lang.code;

                      return (
                        <li key={lang.code}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() =>
                              handleLanguageChange(
                                lang.code
                              )
                            }
                            className={`
                              flex w-full
                              items-center
                              justify-between
                              rounded-xl
                              px-3.5
                              py-3
                              text-start
                              text-[14px]
                              outline-none
                              transition-all
                              duration-150

                              focus-visible:ring-2
                              focus-visible:ring-emerald-500

                              ${
                                active
                                  ? `
                                    bg-emerald-50
                                    font-bold
                                    text-emerald-600

                                    dark:bg-emerald-400/10
                                    dark:text-emerald-400
                                  `
                                  : `
                                    font-medium
                                    text-slate-700

                                    hover:bg-slate-50
                                    hover:text-emerald-600

                                    dark:text-slate-200
                                    dark:hover:bg-white/[0.06]
                                    dark:hover:text-emerald-400
                                  `
                              }
                            `}
                          >
                            <span>
                              {lang.label}
                            </span>

                            {active && (
                              <Check
                                aria-hidden="true"
                                className="h-4 w-4"
                              />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* DARK / LIGHT MODE */}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  isDark
                    ? t("darkModeLight")
                    : t("darkModeDark")
                }
                className="
                  group flex
                  h-11 w-11
                  items-center justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white/80
                  text-slate-700
                  shadow-sm
                  outline-none
                  transition-all duration-200

                  hover:border-emerald-300
                  hover:bg-emerald-50/50
                  hover:text-emerald-600

                  focus-visible:ring-2
                  focus-visible:ring-emerald-500
                  focus-visible:ring-offset-2

                  dark:border-white/[0.09]
                  dark:bg-white/[0.04]
                  dark:text-slate-200
                  dark:hover:border-emerald-400/30
                  dark:hover:bg-emerald-400/[0.07]
                  dark:hover:text-emerald-400
                  dark:focus-visible:ring-offset-slate-950
                "
              >
                {isDark ? (
                  <Sun
                    aria-hidden="true"
                    className="
                      h-[19px] w-[19px]
                      transition-transform
                      duration-300
                      group-hover:rotate-12
                    "
                  />
                ) : (
                  <Moon
                    aria-hidden="true"
                    className="
                      h-[19px] w-[19px]
                      transition-transform
                      duration-300
                      group-hover:-rotate-12
                    "
                  />
                )}
              </button>

              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setIsMobileMenuOpen(
                    (value) => !value
                  )
                }
                aria-label={
                  isMobileMenuOpen
                    ? t("closeMenu")
                    : t("openMenu")
                }
                aria-expanded={
                  isMobileMenuOpen
                }
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white/80
                  text-slate-700
                  shadow-sm
                  outline-none
                  transition-all duration-200

                  hover:border-emerald-300
                  hover:bg-emerald-50/50
                  hover:text-emerald-600

                  focus-visible:ring-2
                  focus-visible:ring-emerald-500
                  focus-visible:ring-offset-2

                  dark:border-white/[0.09]
                  dark:bg-white/[0.04]
                  dark:text-slate-200
                  dark:hover:border-emerald-400/30
                  dark:hover:bg-emerald-400/[0.07]
                  dark:hover:text-emerald-400
                  dark:focus-visible:ring-offset-slate-950

                  lg:hidden
                "
              >
                {isMobileMenuOpen ? (
                  <X
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                ) : (
                  <Menu
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        {isMobileMenuOpen && (
          <div
            className="
              fixed
              inset-x-0
              top-[76px]
              z-40
              max-h-[calc(100dvh-76px)]
              overflow-y-auto

              border-t
              border-slate-200

              bg-white/95
              shadow-[0_20px_60px_rgba(15,23,42,0.12)]
              backdrop-blur-2xl

              dark:border-white/[0.08]
              dark:bg-slate-950/95
              dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]

              lg:hidden
            "
          >
            <div
              className="
                mx-auto
                flex
                max-w-7xl
                flex-col
                px-4
                pb-8
                pt-5
                sm:px-6
              "
            >
              {/* MOBILE NAVIGATION */}

              <nav
                aria-label={t("navHome")}
                className="
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-slate-50/80
                  p-2

                  dark:border-white/[0.07]
                  dark:bg-white/[0.025]
                "
              >
                {NAV_LINKS.map((link) => {
                  const active =
                    isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      onClick={() =>
                        setIsMobileMenuOpen(
                          false
                        )
                      }
                      className={`
                        flex
                        min-h-[54px]
                        items-center
                        rounded-xl
                        px-4
                        py-3
                        text-[16px]
                        font-semibold
                        outline-none
                        transition-all
                        duration-200

                        focus-visible:ring-2
                        focus-visible:ring-emerald-500

                        ${
                          active
                            ? `
                              bg-white
                              text-emerald-600
                              shadow-sm

                              dark:bg-white/[0.07]
                              dark:text-emerald-400
                            `
                            : `
                              text-slate-700

                              hover:bg-white
                              hover:text-emerald-600
                              hover:shadow-sm

                              dark:text-slate-200
                              dark:hover:bg-white/[0.06]
                              dark:hover:text-emerald-400
                            `
                        }
                      `}
                    >
                      {t(link.label)}
                    </Link>
                  );
                })}
              </nav>

              {/* MOBILE LANGUAGE */}

              <div
                className="
                  mt-5
                  border-t
                  border-slate-200
                  pt-5

                  dark:border-white/[0.08]
                "
              >
                <p
                  className="
                    mb-3
                    px-1
                    text-[13px]
                    font-bold
                    text-slate-500
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
                          flex
                          min-h-[50px]
                          items-center
                          justify-center
                          gap-1.5
                          rounded-xl
                          border
                          px-2
                          py-3
                          text-[13px]
                          font-semibold
                          outline-none
                          transition-all duration-200

                          focus-visible:ring-2
                          focus-visible:ring-emerald-500

                          ${
                            active
                              ? `
                                border-emerald-500
                                bg-emerald-50
                                text-emerald-600

                                dark:border-emerald-400
                                dark:bg-emerald-400/10
                                dark:text-emerald-400
                              `
                              : `
                                border-slate-200
                                bg-white
                                text-slate-700

                                hover:border-emerald-300
                                hover:text-emerald-600

                                dark:border-white/[0.08]
                                dark:bg-white/[0.03]
                                dark:text-slate-200
                                dark:hover:border-emerald-400/30
                                dark:hover:text-emerald-400
                              `
                          }
                        `}
                      >
                        <span>
                          {lang.label}
                        </span>

                        {active && (
                          <Check
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MOBILE THEME */}

              <button
                type="button"
                onClick={toggleTheme}
                className="
                  mt-4
                  flex
                  min-h-[52px]
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-[15px]
                  font-semibold
                  text-slate-700
                  outline-none
                  transition-all duration-200

                  hover:border-emerald-300
                  hover:bg-emerald-50/50
                  hover:text-emerald-600

                  focus-visible:ring-2
                  focus-visible:ring-emerald-500

                  dark:border-white/[0.08]
                  dark:bg-white/[0.03]
                  dark:text-slate-200
                  dark:hover:border-emerald-400/30
                  dark:hover:bg-emerald-400/[0.06]
                  dark:hover:text-emerald-400
                "
                aria-label={
                  isDark
                    ? t("darkModeLight")
                    : t("darkModeDark")
                }
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

              {/* MOBILE BRAND */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white/70
                  px-4
                  py-4

                  dark:border-white/[0.07]
                  dark:bg-white/[0.025]
                "
              >
                <div
                  className="
                    flex
                    h-11 w-11
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-emerald-50
                    dark:bg-emerald-400/[0.06]
                  "
                >
                  <Image
                    src="/images/logo.png"
                    alt={t("brand")}
                    width={48}
                    height={48}
                    className="
                      h-10 w-10
                      object-contain
                    "
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate
                      text-[15px]
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {t("brand")}
                  </p>

                  <p
                    className="
                      mt-1
                      truncate
                      text-[11px]
                      font-medium
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {t("brandTagline")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}