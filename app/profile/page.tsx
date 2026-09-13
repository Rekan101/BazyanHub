"use client";

import Link from "next/link";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Globe,
  Heart,
  Mail,
  MapPin,
  Moon,
  Phone,
  Sun,
  User,
} from "lucide-react";

import { LANGUAGES, useLanguage } from "@/lib/i18n";
import { useTheme } from "@/components/ThemeProvider";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/data/faqs";

import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  ViberIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";

const SOCIAL_LINKS = [
  {
    id: "facebook",
    href: "#",
    label: "بازیان هەب لە فەیسبووک",
    Icon: FacebookIcon,
    hoverClass:
      "hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:shadow-[#1877F2]/20",
  },
  {
    id: "instagram",
    href: "#",
    label: "بازیان هەب لە ئینستاگرام",
    Icon: InstagramIcon,
    hoverClass:
      "hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white hover:shadow-[#E4405F]/20",
  },
  {
    id: "tiktok",
    href: "#",
    label: "بازیان هەب لە تیکتۆک",
    Icon: TikTokIcon,
    hoverClass:
      "hover:border-black hover:bg-black hover:text-white hover:shadow-black/20 dark:hover:bg-black",
  },
  {
    id: "whatsapp",
    href: "#",
    label: "بازیان هەب لە واتسەپ",
    Icon: WhatsAppIcon,
    hoverClass:
      "hover:border-[#25D366] hover:bg-[#25D366] hover:text-white hover:shadow-[#25D366]/20",
  },
  {
    id: "viber",
    href: "#",
    label: "بازیان هەب لە ڤایبەر",
    Icon: ViberIcon,
    hoverClass:
      "hover:border-[#7360F2] hover:bg-[#7360F2] hover:text-white hover:shadow-[#7360F2]/20",
  },
] as const;

export default function ProfilePage() {
  const { t, language, direction } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const isRTL = direction === "rtl";

  const currentLanguage =
    LANGUAGES.find(
      (item) => item.code === language
    ) ?? LANGUAGES[0];

  const ChevronIcon = isRTL
    ? ChevronLeft
    : ChevronRight;

  const rowClass = `
    flex min-h-[58px] w-full
    items-center gap-3
    rounded-2xl
    border border-slate-200
    bg-white
    px-4 py-3
    text-[15px] font-semibold
    text-slate-700
    shadow-sm
    outline-none
    transition-all duration-200

    hover:border-emerald-300
    hover:bg-emerald-50/50
    hover:text-emerald-600

    focus-visible:ring-2
    focus-visible:ring-emerald-500

    dark:border-white/[0.08]
    dark:bg-slate-900
    dark:text-slate-200
    dark:hover:border-emerald-400/30
    dark:hover:bg-emerald-400/[0.06]
    dark:hover:text-emerald-400
  `;

  const iconWrapClass = `
    flex h-9 w-9 shrink-0
    items-center justify-center
    rounded-xl
    bg-emerald-50
    text-emerald-600

    dark:bg-emerald-400/[0.08]
    dark:text-emerald-400
  `;

  const cardClass = `
    rounded-2xl
    border border-slate-200
    bg-white
    p-4
    shadow-sm

    dark:border-white/[0.08]
    dark:bg-slate-900
  `;

  const sectionLabelClass = `
    mb-3 px-1
    text-[13px] font-bold
    text-slate-500
    dark:text-slate-400
  `;

  return (
    <div
      dir={direction}
      className="px-4 py-8 sm:px-6"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="
            flex h-20 w-20
            items-center justify-center
            rounded-3xl
            border border-emerald-500/20
            bg-emerald-500/10
            text-emerald-600
            shadow-sm

            dark:text-emerald-400
          "
        >
          <User className="h-9 w-9" />
        </span>

        <h1
          className="
            mt-4
            text-xl font-extrabold tracking-tight
            text-slate-900
            dark:text-white
          "
        >
          {t("profileTitle")}
        </h1>

        <p
          className="
            mt-2 max-w-sm
            text-[13px] leading-relaxed
            text-slate-600
            dark:text-slate-400
          "
        >
          {t("profileSubtitle")}
        </p>
      </div>

      {/* =====================================================
          QUICK SETTINGS
      ====================================================== */}

      <div className="mt-8 space-y-3">
        <Link
          href="/favorites"
          className={rowClass}
        >
          <span className={iconWrapClass}>
            <Heart
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </span>

          <span className="flex-1 truncate text-start">
            {t("tabFavorites")}
          </span>

          <ChevronIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 opacity-60"
          />
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            isDark
              ? t("darkModeLight")
              : t("darkModeDark")
          }
          className={rowClass}
        >
          <span className={iconWrapClass}>
            {isDark ? (
              <Sun
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            ) : (
              <Moon
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            )}
          </span>

          <span className="flex-1 truncate text-start">
            {isDark
              ? t("darkModeLight")
              : t("darkModeDark")}
          </span>

          <ChevronIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 opacity-60"
          />
        </button>

        <div className={rowClass}>
          <span className={iconWrapClass}>
            <Globe
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </span>

          <span className="flex-1 truncate text-start">
            {t("language")}
          </span>

          <span
            className="
              shrink-0
              text-[12px] font-medium
              text-slate-500
              dark:text-slate-400
            "
          >
            {currentLanguage.label}
          </span>
        </div>

        <div className={rowClass}>
          <span className={iconWrapClass}>
            <Bell
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </span>

          <span className="flex-1 truncate text-start">
            {t("notifications")}
          </span>
        </div>

        <Link
          href="/legal"
          className={rowClass}
        >
          <span className={iconWrapClass}>
            <FileText
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </span>

          <span className="flex-1 truncate text-start">
            {t("legalTitle")}
          </span>

          <ChevronIcon
            aria-hidden="true"
            className="h-4 w-4 shrink-0 opacity-60"
          />
        </Link>
      </div>

      {/* =====================================================
          CONTACT US
      ====================================================== */}

      <div className="mt-8">
        <p className={sectionLabelClass}>
          {t("contactTitle")}
        </p>

        <div className="space-y-3">
          <a
            href="tel:+9647757997904"
            dir="ltr"
            className={rowClass}
          >
            <span className={iconWrapClass}>
              <Phone
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            </span>

            <span
              dir="ltr"
              className="flex-1 truncate text-start"
            >
              +964 775 799 7904
            </span>
          </a>

          <a
            href="mailto:info@bazyanhub.com"
            dir="ltr"
            className={rowClass}
          >
            <span className={iconWrapClass}>
              <Mail
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            </span>

            <span
              dir="ltr"
              className="flex-1 truncate text-start"
            >
              info@bazyanhub.com
            </span>
          </a>

          {/* SOCIALS */}

          <div className={cardClass}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {SOCIAL_LINKS.map(
                ({
                  id,
                  href,
                  label,
                  Icon,
                  hoverClass,
                }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`
                      flex h-11 w-11
                      items-center justify-center
                      rounded-full
                      border border-slate-200
                      bg-slate-50
                      text-slate-500
                      shadow-sm
                      transition-all duration-300

                      hover:-translate-y-1
                      hover:scale-110
                      hover:shadow-lg

                      dark:border-white/10
                      dark:bg-white/[0.04]
                      dark:text-slate-300

                      ${hoverClass}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* WORKING HOURS */}

          <div className={cardClass}>
            <span className={iconWrapClass}>
              <Clock3
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            </span>

            <h3
              className="
                mt-3
                text-[14px] font-bold
                text-slate-900
                dark:text-white
              "
            >
              {t("workingHoursTitle")}
            </h3>

            <p
              className="
                mt-1
                text-[13px] leading-relaxed
                text-slate-500
                dark:text-slate-400
              "
            >
              {t("workingHours")}
            </p>
          </div>

          {/* ADDRESS */}

          <div className={cardClass}>
            <span className={iconWrapClass}>
              <MapPin
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            </span>

            <h3
              className="
                mt-3
                text-[14px] font-bold
                text-slate-900
                dark:text-white
              "
            >
              {t("addressTitle")}
            </h3>

            <p
              className="
                mt-1
                text-[13px] leading-relaxed
                text-slate-500
                dark:text-slate-400
              "
            >
              {t("address")}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FAQ
      ====================================================== */}

      <div className="mt-8">
        <p className={sectionLabelClass}>
          {t("faqTitle")}
        </p>

        <Accordion
          type="single"
          collapsible
          className="flex flex-col gap-3"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
            >
              <AccordionTrigger>
                {item.question}
              </AccordionTrigger>

              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* =====================================================
          COMING SOON
      ====================================================== */}

      <p
        className="
          mt-8
          rounded-2xl
          border border-dashed border-slate-300
          bg-white/70
          px-4 py-5
          text-center
          text-[13px] leading-relaxed
          text-slate-500

          dark:border-slate-700
          dark:bg-white/[0.02]
          dark:text-slate-400
        "
      >
        {t("profileComingSoon")}
      </p>
    </div>
  );
}
