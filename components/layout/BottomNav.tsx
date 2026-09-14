"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  Landmark,
  Newspaper,
  User,
  type LucideIcon,
} from "lucide-react";

import {
  useLanguage,
  type TranslationKey,
} from "@/lib/i18n";

/* ---------------------------------------------------------
   Bottom tabs — News sits in the middle
--------------------------------------------------------- */

const TABS: Array<{
  label: TranslationKey;
  href: string;
  icon: LucideIcon;
}> = [
  {
    label: "tabHome",
    href: "/",
    icon: Home,
  },
  {
    label: "tabAbout",
    href: "/about",
    icon: Landmark,
  },
  {
    label: "tabNews",
    href: "/news",
    icon: Newspaper,
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
];

export default function BottomNav() {
  const { t } = useLanguage();

  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <nav
      aria-label={t("menuTitle")}
      className="
        fixed inset-x-0 bottom-0 z-50
        mx-auto w-full max-w-md

        overflow-hidden
        rounded-t-[1.5rem]
        border-t border-slate-200/70
        bg-white/95
        pb-[env(safe-area-inset-bottom)]
        shadow-[0_-10px_30px_rgba(15,23,42,0.07)]
        backdrop-blur-md

        dark:border-white/10
        dark:bg-[#003B6D]
        dark:shadow-[0_-10px_30px_rgba(0,0,0,0.4)]
      "
    >
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = isActive(tab.href);

          const Icon = tab.icon;

          return (
            <li key={tab.href} className="min-w-0">
              <Link
                href={tab.href}
                aria-current={
                  active ? "page" : undefined
                }
                className={`
                  flex min-h-[64px] min-w-0
                  flex-col
                  items-center justify-center
                  gap-1
                  px-0.5 py-2
                  outline-none
                  transition-colors duration-200

                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500

                  ${
                    active
                      ? "text-blue-600 dark:text-white"
                      : `
                        text-slate-600

                        hover:text-blue-600

                        dark:text-slate-300
                        dark:hover:text-white
                      `
                  }
                `}
              >
                <span
                  className={`
                    flex h-7 w-11
                    items-center justify-center
                    rounded-full
                    transition-all duration-300

                    ${
                      active
                        ? `
                          bg-sky-50
                          dark:bg-white/15
                        `
                        : "bg-transparent"
                    }
                  `}
                >
                  <Icon
                    aria-hidden="true"
                    className={`
                      h-5 w-5
                      transition-transform duration-300
                      ${
                        active
                          ? "scale-110"
                          : "scale-100"
                      }
                    `}
                    strokeWidth={active ? 2.4 : 2}
                    fill={
                      active &&
                      tab.label === "tabFavorites"
                        ? "currentColor"
                        : "none"
                    }
                  />
                </span>

                <span
                  className={`
                    max-w-full truncate
                    text-[9px]
                    leading-tight
                    tracking-tight
                    ${
                      active
                        ? "font-bold"
                        : "font-semibold"
                    }
                  `}
                >
                  {t(tab.label)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
