"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  BadgeCheck,
  CheckCircle2,
  Heart,
  ImagePlus,
  MessageCircle,
  Newspaper,
  SendHorizontal,
  User,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";

/* ==========================================================================
   MOCK FEED
   Already-approved posts. New submissions never land here — they go to
   the admin queue, which is why the composer only ever shows a toast.
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

  const [draft, setDraft] = useState("");

  const [likedPosts, setLikedPosts] =
    useState<Record<string, boolean>>({});

  const [toastOpen, setToastOpen] =
    useState(false);

  const toastTimer = useRef<number | null>(
    null
  );

  /* ------------------------------------------------------------------
     SUBMIT — moderation queue, never straight to the feed
     ------------------------------------------------------------------ */

  const handlePublish = () => {
    if (!draft.trim()) {
      return;
    }

    setDraft("");
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

  /* ------------------------------------------------------------------
     LIKE — local only
     ------------------------------------------------------------------ */

  const toggleLike = (postId: string) => {
    setLikedPosts((previous) => ({
      ...previous,
      [postId]: !previous[postId],
    }));
  };

  const canPublish =
    draft.trim().length > 0;

  const actionButtonClass = `
    flex flex-1
    items-center justify-center gap-2
    rounded-xl
    py-2
    text-[13px] font-semibold
    outline-none
    transition-colors duration-200

    focus-visible:ring-2
    focus-visible:ring-blue-600
    dark:focus-visible:ring-blue-500
  `;

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
            border border-blue-600/20
            bg-sky-500/10
            text-blue-600
            shadow-sm

            dark:border-blue-500/20
            dark:bg-sky-500/15
            dark:text-blue-500
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
              text-slate-600
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
          bg-slate-50
          p-3
          shadow-sm

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full
              bg-slate-200
              text-slate-500

              dark:bg-white/[0.06]
              dark:text-slate-400
            "
          >
            <User className="h-5 w-5" />
          </span>

          <textarea
            value={draft}
            onChange={(event) =>
              setDraft(event.target.value)
            }
            rows={3}
            placeholder={t(
              "newsComposerPlaceholder"
            )}
            className="
              min-w-0 flex-1
              resize-none
              rounded-2xl
              border border-slate-200
              bg-white
              px-4 py-2.5
              text-[13px] leading-relaxed
              text-slate-800
              outline-none
              transition-colors duration-200

              placeholder:text-slate-400

              focus:border-blue-600/40
              focus-visible:ring-2
              focus-visible:ring-blue-600/30

              dark:border-slate-800
              dark:bg-slate-950
              dark:text-slate-200
              dark:placeholder:text-slate-500
              dark:focus:border-blue-500/40
              dark:focus-visible:ring-blue-500/30
            "
          />
        </div>

        <div
          className="
            mt-3 flex items-center gap-2
            border-t border-slate-200
            pt-3

            dark:border-slate-800
          "
        >
          {/* ATTACH IMAGE / VIDEO */}

          <button
            type="button"
            aria-label={t("newsAddPost")}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-slate-200
              bg-white
              text-slate-600
              outline-none
              transition-all duration-200

              hover:border-sky-400
              hover:text-blue-600

              focus-visible:ring-2
              focus-visible:ring-blue-600
              dark:focus-visible:ring-blue-500

              dark:border-slate-800
              dark:bg-white/[0.03]
              dark:text-slate-400
              dark:hover:border-sky-400/40
              dark:hover:text-blue-500
            "
          >
            <ImagePlus
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            />
          </button>

          {/* PUBLISH */}

          <button
            type="button"
            onClick={handlePublish}
            disabled={!canPublish}
            className="
              flex h-10 flex-1
              items-center justify-center gap-2
              rounded-xl
              bg-gradient-to-r from-blue-600 to-sky-500
              px-4
              text-[13px] font-bold
              text-white
              shadow-[0_8px_20px_-8px_rgba(37,99,235,0.9)]
              outline-none
              transition-all duration-200

              hover:-translate-y-0.5
              hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,1)]

              focus-visible:ring-2
              focus-visible:ring-blue-600
              focus-visible:ring-offset-2
              dark:focus-visible:ring-blue-500
              dark:focus-visible:ring-offset-slate-900

              active:translate-y-0

              disabled:cursor-not-allowed
              disabled:opacity-40
              disabled:shadow-none
              disabled:hover:translate-y-0
            "
          >
            <SendHorizontal
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            />

            <span className="truncate">
              {t("newsPublish")}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          FEED
      ====================================================== */}

      <div className="mt-5 space-y-4">
        {MOCK_POSTS.map((post) => {
          const liked = Boolean(
            likedPosts[post.id]
          );

          const likeCount =
            post.likes + (liked ? 1 : 0);

          return (
            <article
              key={post.id}
              className="
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-slate-50
                shadow-sm

                dark:border-slate-800
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
                    bg-gradient-to-br from-blue-600 to-sky-500
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
                        className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-500"
                        aria-hidden="true"
                      />
                    )}
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[11px] font-medium
                      text-slate-400

                      dark:text-slate-400
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

              {/* ENGAGEMENT */}

              <div
                className="
                  flex items-center gap-2
                  border-t border-slate-200
                  p-2

                  dark:border-slate-800
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    toggleLike(post.id)
                  }
                  aria-pressed={liked}
                  className={`
                    ${actionButtonClass}
                    ${
                      liked
                        ? "text-blue-600 dark:text-blue-500"
                        : `
                          text-slate-600

                          hover:bg-slate-100
                          hover:text-blue-600

                          dark:text-slate-400
                          dark:hover:bg-white/[0.06]
                          dark:hover:text-blue-500
                        `
                    }
                  `}
                >
                  <Heart
                    className={`h-4 w-4 shrink-0 ${
                      liked
                        ? "fill-current"
                        : ""
                    }`}
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {t("newsLike")}
                  </span>

                  <span className="text-[12px] font-bold">
                    {likeCount}
                  </span>
                </button>

                <button
                  type="button"
                  className={`
                    ${actionButtonClass}
                    text-slate-600

                    hover:bg-slate-100
                    hover:text-blue-600

                    dark:text-slate-400
                    dark:hover:bg-white/[0.06]
                    dark:hover:text-blue-500
                  `}
                >
                  <MessageCircle
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {t("newsComment")}
                  </span>

                  <span className="text-[12px] font-bold">
                    {post.comments}
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* =====================================================
          TOAST — submitted for admin approval
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
                border border-blue-400/30
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
                  bg-blue-500/20
                  text-blue-400
                "
              >
                <CheckCircle2 className="h-[18px] w-[18px]" />
              </span>

              <p className="min-w-0 text-[12.5px] font-semibold leading-relaxed text-white">
                {t("newsPostSubmitted")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
