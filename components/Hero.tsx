"use client";

import { type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LazyMotion,
  domAnimation,
  m,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import Stories from "@/components/Stories";

/* ==========================================================================
   HERO
   ========================================================================== */

export default function Hero() {
  const { language } = useLanguage();

  /* ------------------------------------------------------------------------
     SCROLL TO SERVICES
     ------------------------------------------------------------------------ */

  const handleServicesScroll = (
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    const servicesSection =
      document.getElementById(
        "services"
      );

    if (!servicesSection) {
      return;
    }

    servicesSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(
      null,
      "",
      "#services"
    );
  };

  return (
    <LazyMotion features={domAnimation}>
      <section
        dir={
          language === "en"
            ? "ltr"
            : "rtl"
        }
        className="
          relative
          min-h-fit
          overflow-hidden
        "
      >
        {/* ====================================================================
            BACKGROUND — LCP
            ==================================================================== */}

        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={60}
          sizes="100vw"
          className="
            object-cover
            object-[center_35%]
            sm:object-top
          "
        />

        {/* ====================================================================
            DARK OVERLAY
            ==================================================================== */}

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/90
            via-black/50
            to-black/20
          "
        />

        {/* ====================================================================
            BLUE LIGHT EFFECT
            ==================================================================== */}

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-l
            from-blue-600/25
            via-transparent
            to-transparent
          "
        />

        {/* ====================================================================
            HERO CONTENT
            ==================================================================== */}

        <div
          className="
            relative
            mx-auto
            flex
            min-h-fit
            w-full
            max-w-[1440px]
            items-start
            px-4
            pb-8
            pt-3
            sm:px-6
            sm:pb-14
            sm:pt-14
            lg:px-10
            lg:pt-16
          "
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-3xl
              flex-col
              items-center
              text-center
            "
          >
            {/* ==================================================================
                BADGE
                ================================================================== */}

            <m.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                ease: "easeOut",
              }}
              className="
                mb-3
                inline-flex
                items-center
                rounded-full
                border
                border-white/20
                bg-white/10
                px-3
                py-1.5
                text-[11px]
                font-semibold
                text-white
                shadow-lg
                shadow-black/20
                backdrop-blur-md
                sm:mb-5
                sm:px-4
                sm:py-2
                sm:text-sm
              "
            >
              <span>
                ✨ پلاتفۆرمی گشتگیری قەزای بازیان
              </span>
            </m.div>

            {/* ==================================================================
                STORIES CAROUSEL
                ================================================================== */}

            <m.div
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
              className="w-full"
            >
              <Stories />
            </m.div>

            {/* ==================================================================
                MOBILE SCROLL INDICATOR
                ================================================================== */}

            <m.div
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: "easeOut",
              }}
              className="
                mt-4
                flex
                flex-col
                items-center
                sm:mt-6
                sm:hidden
              "
            >
              <Link
                href="#services"
                onClick={
                  handleServicesScroll
                }
                aria-label="بۆ بینینی خزمەتگوزاریەکان"
                className="
                  flex
                  flex-col
                  items-center
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white/70
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-black/20
                "
              >
                {/* TEXT */}

                <m.span
                  className="
                    text-[11px]
                    font-bold
                    text-white
                    drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]
                  "
                >
                  بۆ بینینی خزمەتگوزاریەکان
                </m.span>

                {/* ARROW */}

                <m.span
                  className="
                    mt-1
                    inline-flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/25
                    bg-black/20
                    text-white
                    shadow-lg
                    shadow-black/30
                    backdrop-blur-md
                  "
                  aria-hidden="true"
                >
                  <ChevronDown
                    className="
                      h-5
                      w-5
                    "
                    strokeWidth={3}
                  />
                </m.span>
              </Link>
            </m.div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
