"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  Landmark,
  User,
  type LucideIcon,
} from "lucide-react";

import {
  useLanguage,
  type TranslationKey,
} from "@/lib/i18n";

/* ---------------------------------------------------------
   Bottom tabs
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

        border-t border-slate-200/70
        bg-white/95
        pb-[env(safe-area-inset-bottom)]
        shadow-[0_-10px_30px_rgba(15,23,42,0.07)]
        backdrop-blur-md

        dark:border-white/[0.08]
        dark:bg-slate-950/95
        dark:shadow-[0_-10px_30px_rgba(0,0,0,0.4)]
      "
    >
      <ul className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active = isActive(tab.href);

          const Icon = tab.icon;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={
                  active ? "page" : undefined
                }
                className={`
                  flex min-h-[64px]
                  flex-col
                  items-center justify-center
                  gap-1
                  px-1 py-2
                  outline-none
                  transition-colors duration-200

                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-emerald-500

                  ${
                    active
                      ? "text-emerald-600 dark:text-emerald-400"
                      : `
                        text-slate-500

                        hover:text-emerald-600

                        dark:text-slate-400
                        dark:hover:text-emerald-400
                      `
                  }
                `}
              >
                <span
                  className={`
                    flex h-8 w-12
                    items-center justify-center
                    rounded-full
                    transition-all duration-300

                    ${
                      active
                        ? `
                          bg-emerald-50
                          dark:bg-emerald-400/10
                        `
                        : "bg-transparent"
                    }
                  `}
                >
                  <Icon
                    aria-hidden="true"
                    className={`
                      h-[21px] w-[21px]
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
                    text-[10px]
                    leading-none
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
