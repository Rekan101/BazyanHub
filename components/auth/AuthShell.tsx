"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { getAuthText } from "@/components/auth/authText";

/*
|--------------------------------------------------------------------------
| Auth shell
|--------------------------------------------------------------------------
|
| Shared chrome for /login and /signup: the navy brand header, the floating
| card, and the footer link between the two pages.
|
| Design vocabulary is lifted directly from app/profile/page.tsx so the two
| feel like the same app — rounded-3xl, border-slate-200/800, bg-white /
| dark:bg-slate-900, soft shadow. The navy (#003B6D / #002240) matches the
| BottomNav and AppHeader exactly.
|
| Note these pages render INSIDE the root layout, so AppHeader and BottomNav
| are present. The shell is sized to sit comfortably inside the phone frame's
| pt-[73px] pb-24 gutters rather than fighting them.
|
*/

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;

  footerPrompt: string;
  footerLinkLabel: string;
  footerHref: string;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footerPrompt,
  footerLinkLabel,
  footerHref,
}: AuthShellProps) {
  const { language, direction } =
    useLanguage();

  const text = getAuthText(language);

  const isRTL = direction === "rtl";

  const BackArrow = isRTL
    ? ArrowRight
    : ArrowLeft;

  return (
    <div
      dir={direction}
      className="
        min-h-[calc(100vh-73px-6rem)]
        bg-slate-50
        px-4 pb-10 pt-6

        dark:bg-slate-950
      "
    >
      <div className="mx-auto w-full max-w-md">
        {/* =====================================================
            BRAND HEADER

            The navy panel the card overlaps — gives the page a
            focal point without needing a hero image.
        ====================================================== */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            bg-[#003B6D]
            px-6 pb-16 pt-8
            text-center
            shadow-[0_18px_40px_-18px_rgba(0,59,109,0.7)]

            dark:bg-[#002240]
          "
        >
          {/* Soft light bloom, purely decorative */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -end-10 -top-12
              h-40 w-40
              rounded-full
              bg-sky-400/20
              blur-3xl
            "
          />

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -bottom-16 -start-10
              h-40 w-40
              rounded-full
              bg-blue-500/20
              blur-3xl
            "
          />

          <div className="relative">
            <span
              className="
                mx-auto mb-4 flex
                h-16 w-16
                items-center justify-center
                overflow-hidden
                rounded-2xl
                border border-white/25
                bg-white/10
                shadow-lg shadow-black/20
                backdrop-blur-sm
              "
            >
              <Image
                src="/images/logo.webp"
                alt="BazyanHub"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
                priority
              />
            </span>

            <h1
              className="
                text-2xl font-extrabold
                tracking-tight
                text-white
              "
            >
              {title}
            </h1>

            <p
              className="
                mx-auto mt-2
                max-w-xs
                text-[13px] leading-relaxed
                text-white/75
              "
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* =====================================================
            FLOATING CARD

            Pulled up over the navy panel — the iOS-style overlap
            used on the provider detail page's identity card.
        ====================================================== */}

        <div
          className="
            relative -mt-10
            rounded-3xl
            border border-slate-200
            bg-white
            p-5
            shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)]

            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)]
          "
        >
          {children}
        </div>

        {/* =====================================================
            FOOTER — swap between login and signup
        ====================================================== */}

        <p
          className="
            mt-6 text-center
            text-[13px] font-medium
            text-slate-600

            dark:text-slate-400
          "
        >
          {footerPrompt}{" "}
          <Link
            href={footerHref}
            className="
              font-bold
              text-blue-600
              underline-offset-4
              outline-none
              transition-opacity

              hover:underline
              hover:opacity-80

              focus-visible:underline

              dark:text-blue-500
            "
          >
            {footerLinkLabel}
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="
              inline-flex items-center gap-1.5
              rounded-full
              px-3 py-1.5
              text-[12px] font-semibold
              text-slate-500
              outline-none
              transition-colors

              hover:text-blue-600

              focus-visible:ring-2
              focus-visible:ring-blue-600

              dark:text-slate-500
              dark:hover:text-blue-500
              dark:focus-visible:ring-blue-500
            "
          >
            <BackArrow
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {text.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
