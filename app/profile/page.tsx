"use client";

import Link from "next/link";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { LANGUAGES, useLanguage } from "@/lib/i18n";

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

/*
 * Premium social buttons — real brand colors, white glyphs and a
 * soft brand-tinted glow. Instagram gets its signature gradient,
 * TikTok its sleek black with a cyan/pink split glow.
 */
const SOCIAL_LINKS = [
  {
    id: "facebook",
    href: "#",
    label: "بازیان هەب لە فەیسبووک",
    Icon: FacebookIcon,
    brandClass:
      "bg-[#1877F2] shadow-[0_8px_20px_-6px_rgba(24,119,242,0.85)] hover:shadow-[0_14px_28px_-8px_rgba(24,119,242,0.95)]",
  },
  {
    id: "instagram",
    href: "#",
    label: "بازیان هەب لە ئینستاگرام",
    Icon: InstagramIcon,
    brandClass:
      "bg-[linear-gradient(45deg,#F9CE34_0%,#EE2A7B_45%,#6228D7_100%)] shadow-[0_8px_20px_-6px_rgba(238,42,123,0.85)] hover:shadow-[0_14px_28px_-8px_rgba(238,42,123,0.95)]",
  },
  {
    id: "tiktok",
    href: "#",
    label: "بازیان هەب لە تیکتۆک",
    Icon: TikTokIcon,
    brandClass:
      "bg-[#111827] ring-1 ring-white/15 shadow-[0_8px_20px_-6px_rgba(37,244,238,0.65),0_8px_20px_-6px_rgba(254,44,85,0.55)] hover:shadow-[0_14px_28px_-8px_rgba(37,244,238,0.8),0_14px_28px_-8px_rgba(254,44,85,0.7)]",
  },
  {
    id: "whatsapp",
    href: "#",
    label: "بازیان هەب لە واتسەپ",
    Icon: WhatsAppIcon,
    brandClass:
      "bg-[#25D366] shadow-[0_8px_20px_-6px_rgba(37,211,102,0.85)] hover:shadow-[0_14px_28px_-8px_rgba(37,211,102,0.95)]",
  },
  {
    id: "viber",
    href: "#",
    label: "بازیان هەب لە ڤایبەر",
    Icon: ViberIcon,
    brandClass:
      "bg-[#7360F2] shadow-[0_8px_20px_-6px_rgba(115,96,242,0.85)] hover:shadow-[0_14px_28px_-8px_rgba(115,96,242,0.95)]",
  },
] as const;

export default function ProfilePage() {
  const { t, language, direction } = useLanguage();

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
                  brandClass,
                }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`
                      group relative
                      flex h-12 w-12
                      items-center justify-center
                      overflow-hidden
                      rounded-2xl
                      text-white
                      outline-none
                      transition-all duration-300

                      hover:-translate-y-1
                      hover:scale-[1.06]

                      focus-visible:ring-2
                      focus-visible:ring-emerald-500
                      focus-visible:ring-offset-2
                      dark:focus-visible:ring-offset-slate-900

                      active:scale-95

                      ${brandClass}
                    `}
                  >
                    {/* Glossy top highlight */}
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute inset-x-0 top-0
                        h-1/2
                        bg-gradient-to-b
                        from-white/25
                        to-transparent
                      "
                    />

                    <Icon className="relative h-[22px] w-[22px] drop-shadow-sm" />
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
