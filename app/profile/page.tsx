"use client";

import Link from "next/link";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Globe,
  LogIn,
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
  ViberIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";

import { useNotifications } from "@/components/layout/NotificationProvider";
import AuthEntryLinks from "@/components/auth/AuthEntryLinks";

/*
 * Premium social buttons — true brand colors, white glyphs, soft
 * brand-tinted glows and a glossy top highlight. WhatsApp is the
 * hero: exactly 1.5x the others (72px vs 48px) and centered under
 * RTL, which the array order below already produces.
 */
const SOCIAL_LINKS = [
  {
    id: "facebook",
    href: "#",
    label: "بازیان هەب لە فەیسبووک",
    Icon: FacebookIcon,
    sizeClass: "h-12 w-12 rounded-2xl",
    iconClass: "h-[22px] w-[22px]",
    brandClass:
      "bg-[#1877F2] shadow-[0_8px_20px_-6px_rgba(24,119,242,0.85)] hover:shadow-[0_14px_28px_-8px_rgba(24,119,242,0.95)]",
  },
  {
    id: "whatsapp",
    href: "#",
    label: "بازیان هەب لە واتسەپ",
    Icon: WhatsAppIcon,
    sizeClass: "h-[4.5rem] w-[4.5rem] rounded-[1.375rem]",
    iconClass: "h-[33px] w-[33px]",
    brandClass:
      "bg-[#25D366] shadow-[0_12px_28px_-8px_rgba(37,211,102,0.95)] hover:shadow-[0_18px_36px_-10px_rgba(37,211,102,1)]",
  },
  {
    id: "viber",
    href: "#",
    label: "بازیان هەب لە ڤایبەر",
    Icon: ViberIcon,
    sizeClass: "h-12 w-12 rounded-2xl",
    iconClass: "h-[22px] w-[22px]",
    brandClass:
      "bg-[#7360F2] shadow-[0_8px_20px_-6px_rgba(115,96,242,0.85)] hover:shadow-[0_14px_28px_-8px_rgba(115,96,242,0.95)]",
  },
] as const;

export default function ProfilePage() {
  const { t, language, direction } = useLanguage();

  const { open: openNotifications } =
    useNotifications();

  const isRTL = direction === "rtl";

  const currentLanguage =
    LANGUAGES.find(
      (item) => item.code === language
    ) ?? LANGUAGES[0];

  const ChevronIcon = isRTL
    ? ChevronLeft
    : ChevronRight;

  const rowClass = `
    flex min-h-[60px] w-full
    items-center gap-3
    rounded-3xl
    border border-slate-200
    bg-white
    p-4
    text-[15px] font-semibold
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
    dark:bg-slate-900
    dark:text-slate-200
    dark:hover:border-sky-400/40
    dark:hover:bg-sky-900/30
    dark:hover:text-blue-500
  `;

  /*
   * Plain glyphs, no tinted tile behind them — settings rows read
   * neutral, contact/accent rows read blue.
   */
  const settingsIconClass = `
    flex h-6 w-6 shrink-0
    items-center justify-center
    text-slate-700

    dark:text-slate-300
  `;

  const accentIconClass = `
    flex h-6 w-6 shrink-0
    items-center justify-center
    text-blue-600

    dark:text-blue-500
  `;

  const cardClass = `
    rounded-3xl
    border border-slate-200
    bg-white
    p-5
    shadow-sm

    dark:border-slate-800
    dark:bg-slate-900
  `;

  const sectionLabelClass = `
    mb-3 px-1
    text-[13px] font-bold
    text-slate-600
    dark:text-slate-400
  `;

  return (
    <div
      dir={direction}
      className="
        bg-slate-50
        px-4 py-8
        sm:px-6

        dark:bg-slate-950
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="
            flex h-24 w-24
            items-center justify-center
            rounded-full
            bg-blue-600
            text-white
            shadow-lg shadow-blue-600/25

            dark:bg-blue-500
            dark:shadow-blue-500/25
          "
        >
          <User className="h-11 w-11" />
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
          <span className={settingsIconClass}>
            <Globe
              className="h-5 w-5"
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
              text-slate-600
              dark:text-slate-400
            "
          >
            {currentLanguage.label}
          </span>
        </div>

        <button
          type="button"
          onClick={openNotifications}
          className={rowClass}
        >
          <span
            className={`relative ${settingsIconClass}`}
          >
            <Bell
              className="h-5 w-5"
              aria-hidden="true"
            />

            {/* Unread dot — mirrors the header bell */}
            <span
              aria-hidden="true"
              className="
                absolute -end-0.5 -top-0.5
                h-2 w-2
                rounded-full
                bg-rose-500
                ring-2 ring-white

                dark:ring-slate-900
              "
            />
          </span>

          <span className="flex-1 truncate text-start">
            {t("notifications")}
          </span>
        </button>

        <Link
          href="/legal"
          className={rowClass}
        >
          <span className={settingsIconClass}>
            <FileText
              className="h-5 w-5"
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
            <span className={accentIconClass}>
              <Phone
                className="h-5 w-5"
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
            <span className={accentIconClass}>
              <Mail
                className="h-5 w-5"
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
            <div className="flex items-center justify-center gap-4">
              {SOCIAL_LINKS.map(
                ({
                  id,
                  href,
                  label,
                  Icon,
                  sizeClass,
                  iconClass,
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
                      flex shrink-0
                      items-center justify-center
                      overflow-hidden
                      text-white
                      outline-none
                      transition-all duration-300

                      ${sizeClass}

                      hover:-translate-y-1
                      hover:scale-[1.06]

                      focus-visible:ring-2
                      focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500
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

                    <Icon
                      className={`relative drop-shadow-sm ${iconClass}`}
                    />
                  </a>
                )
              )}
            </div>
          </div>

          {/* WORKING HOURS */}

          <div className={cardClass}>
            <span className={accentIconClass}>
              <Clock3
                className="h-5 w-5"
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
                text-slate-600
                dark:text-slate-400
              "
            >
              {t("workingHours")}
            </p>
          </div>

          {/* ADDRESS */}

          <div className={cardClass}>
            <span className={accentIconClass}>
              <MapPin
                className="h-5 w-5"
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
                text-slate-600
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
              className="rounded-3xl"
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
          AUTH ENTRY — sign in / create account

          Replaces the earlier "coming soon" placeholder now that
          /login and /signup exist. Centered iOS-style card, same
          cardClass as Working Hours/Address above.
      ====================================================== */}

      <div
        className={`${cardClass} mt-8 text-center`}
      >
        <span
          aria-hidden="true"
          className="
            mx-auto flex h-12 w-12
            items-center justify-center
            rounded-2xl
            bg-blue-600/10
            text-blue-600

            dark:bg-blue-500/10
            dark:text-blue-500
          "
        >
          <LogIn className="h-6 w-6" />
        </span>

        <h3
          className="
            mt-3
            text-[15px] font-bold
            text-slate-900
            dark:text-white
          "
        >
          {t("authEntryTitle")}
        </h3>

        <p
          className="
            mt-1
            text-[13px] leading-relaxed
            text-slate-600
            dark:text-slate-400
          "
        >
          {t("authEntrySubtitle")}
        </p>

        <AuthEntryLinks className="mt-4" />
      </div>
    </div>
  );
}
