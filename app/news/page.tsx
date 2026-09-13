"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  BadgeCheck,
  Heart,
  ImagePlus,
  Info,
  MessageCircle,
  Newspaper,
  Send,
  ShieldCheck,
  SquarePen,
  User,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";

/* ==========================================================================
   MOCK FEED
   Placeholder posts, here only to show the feed design.
   ========================================================================== */

type FeedPost = {
  id: string;
  author: string;
  authorInitials: string;
  verified: boolean;
  time: string;
  body: string;
  image: string;
  likes: number;
  comments: number;
};

const MOCK_POSTS: FeedPost[] = [
  {
    id: "post-1",
    author: "ئیدارەی بازیان هەب",
    authorInitials: "بھ",
    verified: true,
    time: "٢ کاتژمێر لەمەوپێش",
    body: "ڕێگای بازیان پاش چاککردنەوە کرایەوە بۆ هاتوچۆ. تکایە ئاگاداری هێمای ڕێگا و خێرایی بن لە کاتی تێپەڕبوون. 🚗",
    image: "/images/bazian-pass.webp",
    likes: 128,
    comments: 14,
  },

  {
    id: "post-2",
    author: "هەلی کاری بازیان",
    authorInitials: "هک",
    verified: false,
    time: "دوێنێ",
    body: "چەند هەلێکی کاری نوێ لە بازیان زیادکران: فرۆشیار، وەستای کارەبا و شۆفێری پیکاپ. بۆ زانیاری زیاتر پەیوەندی بە ژمارەی ناو پۆستەکە بکە. 💼",
    image: "/images/jobs.webp",
    likes: 76,
    comments: 9,
  },
];

/* ==========================================================================
   NEWS PAGE
   ========================================================================== */

export default function NewsPage() {
  const { t, direction } = useLanguage();

  const [toastOpen, setToastOpen] =
    useState(false);

  const toastTimer = useRef<number | null>(
    null
  );

  /* ------------------------------------------------------------------
     Toast — shown when a guest tries to post
     ------------------------------------------------------------------ */

  const showAuthToast = () => {
    setToastOpen(true);

    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
    }

    toastTimer.current = window.setTimeout(
      () => setToastOpen(false),
      3200
    );
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) {
        window.clearTimeout(
          toastTimer.current
        );
      }
    };
  }, []);

  return (
    <div
      dir={direction}
      className="px-4 py-6 sm:px-6"
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="
            flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-2xl
            border border-emerald-500/20
            bg-emerald-500/10
            text-emerald-600
            shadow-sm

            dark:text-emerald-400
          "
        >
          <Newspaper className="h-6 w-6" />
        </span>

        <div className="min-w-0">
          <h1
            className="
              truncate
              text-lg font-extrabold tracking-tight
              text-slate-900
              dark:text-white
            "
          >
            {t("newsTitle")}
          </h1>

          <p
            className="
              mt-0.5
              text-[12px] leading-relaxed
              text-slate-500
              dark:text-slate-400
            "
          >
            {t("newsSubtitle")}
          </p>
        </div>
      </div>

      {/* =====================================================
          COMPOSER
      ====================================================== */}

      <div
        className="
          mt-6
          rounded-2xl
          border border-slate-200
          bg-white
          p-3
          shadow-sm

          dark:border-white/[0.08]
          dark:bg-slate-900
        "
      >
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full
              bg-slate-100
              text-slate-400

              dark:bg-white/[0.06]
              dark:text-slate-500
            "
          >
            <User className="h-5 w-5" />
          </span>

          <button
            type="button"
            onClick={showAuthToast}
            className="
              flex h-10 min-w-0 flex-1
              items-center
              rounded-full
              bg-slate-100
              px-4
              text-start
              text-[13px] font-medium
              text-slate-500
              outline-none
              transition-colors duration-200

              hover:bg-slate-200/70

              focus-visible:ring-2
              focus-visible:ring-emerald-500

              dark:bg-white/[0.06]
              dark:text-slate-400
              dark:hover:bg-white/[0.1]
            "
          >
            <span className="truncate">
              {t("newsComposerPlaceholder")}
            </span>
          </button>
        </div>

        <div
          className="
            mt-3 flex items-center gap-2
            border-t border-slate-100
            pt-3

            dark:border-white/[0.06]
          "
        >
          <button
            type="button"
            onClick={showAuthToast}
            className="
              flex h-10 flex-1
              items-center justify-center gap-2
              rounded-xl
              bg-gradient-to-r from-emerald-500 to-emerald-600
              px-4
              text-[13px] font-bold
              text-white
              shadow-[0_8px_20px_-8px_rgba(16,185,129,0.9)]
              outline-none
              transition-all duration-200

              hover:-translate-y-0.5
              hover:shadow-[0_12px_24px_-8px_rgba(16,185,129,1)]

              focus-visible:ring-2
              focus-visible:ring-emerald-500
              focus-visible:ring-offset-2
              dark:focus-visible:ring-offset-slate-900

              active:translate-y-0
            "
          >
            <SquarePen
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            />

            <span className="truncate">
              {t("newsAddPost")}
            </span>
          </button>

          <button
            type="button"
            onClick={showAuthToast}
            aria-label={t("newsAddPost")}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-500
              outline-none
              transition-all duration-200

              hover:border-emerald-300
              hover:text-emerald-600

              focus-visible:ring-2
              focus-visible:ring-emerald-500

              dark:border-white/[0.08]
              dark:bg-white/[0.03]
              dark:text-slate-400
              dark:hover:border-emerald-400/30
              dark:hover:text-emerald-400
            "
          >
            <ImagePlus
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* =====================================================
          ADMIN APPROVAL BANNER
      ====================================================== */}

      <div
        className="
          relative mt-4
          overflow-hidden
          rounded-2xl
          border border-emerald-500/20
          bg-gradient-to-br
          from-emerald-50
          via-emerald-50/60
          to-teal-50
          p-4

          dark:border-emerald-400/20
          dark:from-emerald-500/[0.12]
          dark:via-emerald-500/[0.06]
          dark:to-teal-500/[0.08]
        "
      >
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute -end-6 -top-6
            h-24 w-24
            rounded-full
            bg-emerald-400/15
            blur-2xl
          "
        />

        <div className="relative flex gap-3">
          <span
            aria-hidden="true"
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              bg-emerald-500/15
              text-emerald-600

              dark:text-emerald-400
            "
          >
            <ShieldCheck className="h-5 w-5" />
          </span>

          <div className="min-w-0">
            <p
              className="
                flex items-center gap-1.5
                text-[13px] font-bold
                text-emerald-800

                dark:text-emerald-300
              "
            >
              <Info
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />

              {t("newsApprovalTitle")}
            </p>

            <p
              className="
                mt-1
                text-[12px] leading-relaxed
                text-emerald-900/75

                dark:text-emerald-100/70
              "
            >
              {t("newsApprovalNote")}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FEED
      ====================================================== */}

      <div className="mt-5 space-y-4">
        {MOCK_POSTS.map((post) => (
          <article
            key={post.id}
            className="
              overflow-hidden
              rounded-2xl
              border border-slate-200
              bg-white
              shadow-sm

              dark:border-white/[0.08]
              dark:bg-slate-900
            "
          >
            {/* POST HEADER */}

            <div className="flex items-center gap-3 p-3.5">
              <span
                aria-hidden="true"
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-gradient-to-br from-emerald-500 to-teal-600
                  text-[13px] font-black
                  text-white
                  shadow-sm
                "
              >
                {post.authorInitials}
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className="
                    flex items-center gap-1
                    text-[14px] font-bold
                    text-slate-900

                    dark:text-white
                  "
                >
                  <span className="truncate">
                    {post.author}
                  </span>

                  {post.verified && (
                    <BadgeCheck
                      className="h-4 w-4 shrink-0 text-emerald-500"
                      aria-hidden="true"
                    />
                  )}
                </p>

                <p
                  className="
                    mt-0.5
                    text-[11px] font-medium
                    text-slate-400

                    dark:text-slate-500
                  "
                >
                  {post.time}
                </p>
              </div>
            </div>

            {/* POST BODY */}

            <p
              className="
                px-3.5 pb-3
                text-[13px] leading-relaxed
                text-slate-700

                dark:text-slate-300
              "
            >
              {post.body}
            </p>

            {/* POST IMAGE */}

            <div className="relative aspect-[4/3] w-full">
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-cover"
              />
            </div>

            {/* POST STATS */}

            <div
              className="
                flex items-center gap-4
                px-3.5 py-3
                text-[12px] font-semibold
                text-slate-500

                dark:text-slate-400
              "
            >
              <span className="flex items-center gap-1.5">
                <Heart
                  className="h-4 w-4 text-rose-500"
                  aria-hidden="true"
                />
                {post.likes}
              </span>

              <span className="flex items-center gap-1.5">
                <MessageCircle
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                {post.comments}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* =====================================================
          TOAST — account required
      ====================================================== */}

      <AnimatePresence>
        {toastOpen && (
          <motion.div
            role="status"
            aria-live="polite"
            dir={direction}
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 30,
            }}
            className="
              pointer-events-none
              fixed inset-x-0
              bottom-[calc(76px_+_env(safe-area-inset-bottom))]
              z-[60]
              mx-auto w-full max-w-md
              px-4
            "
          >
            <div
              className="
                flex items-center gap-3
                rounded-2xl
                border border-emerald-400/30
                bg-slate-900/95
                px-4 py-3
                shadow-[0_18px_45px_rgba(0,0,0,0.35)]
                backdrop-blur-md

                dark:bg-slate-800/95
              "
            >
              <span
                aria-hidden="true"
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-emerald-500/20
                  text-emerald-400
                "
              >
                <Send className="h-[18px] w-[18px]" />
              </span>

              <p className="min-w-0 text-[12.5px] font-semibold leading-relaxed text-white">
                {t("newsAuthRequired")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
