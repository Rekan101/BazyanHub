"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  BadgeCheck,
  CheckCircle2,
  ImagePlus,
  Newspaper,
  SendHorizontal,
  User,
  X,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/components/auth/AuthProvider";
import ReactionBar from "@/components/news/ReactionBar";
import {
  type FeedPost,
  type NewsReactionType,
} from "@/lib/data/news";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  clearMyReaction,
  fetchMyReactions,
  setMyReaction,
  submitNewsPost,
} from "@/lib/supabase/queries.client";

/*
|--------------------------------------------------------------------------
| News page (client)
|--------------------------------------------------------------------------
|
| Receives already-fetched, already-approved posts from the server component
| in page.tsx, so /news stays statically prerendered. Only the parts that
| genuinely need a session happen here:
|
|   * which reaction the VIEWER picked (user-specific, needs auth)
|   * submitting a post (writes as the signed-in user)
|
| *** Comments are gone. *** No comment state, no thread, no input. The
| feature was removed from the product; do not reintroduce it here.
|
*/

type NewsPageClientProps = {
  posts: FeedPost[];
};

export default function NewsPageClient({
  posts,
}: NewsPageClientProps) {
  const { t, direction } = useLanguage();

  const { isAuthenticated } = useAuth();

  const [draft, setDraft] = useState("");

  const [toast, setToast] = useState<
    string | null
  >(null);

  const toastTimer = useRef<number | null>(
    null
  );

  const showToast = (message: string) => {
    setToast(message);

    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current);
    }

    toastTimer.current = window.setTimeout(
      () => setToast(null),
      3600
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
     REACTIONS — the viewer's own choice, per post
  ------------------------------------------------------------------ */

  const [myReactions, setMyReactions] =
    useState<
      Record<string, NewsReactionType>
    >({});

  /*
   * Load the viewer's existing reactions once they are known to be signed
   * in. Signed out (or with no Supabase configured) the map simply stays
   * empty and reactions live in local state for the session.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      setMyReactions({});
      return;
    }

    let cancelled = false;

    fetchMyReactions(
      posts.map((post) => post.id)
    ).then((rows) => {
      if (cancelled || !rows) {
        return;
      }

      setMyReactions(rows);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, posts]);

  const handleReact = async (
    postId: string,
    reaction: NewsReactionType | null
  ) => {
    const previous = myReactions[postId] ?? null;

    /*
     * Optimistic: the picker should feel instant. The write is reconciled
     * below and rolled back if the server rejects it.
     */
    setMyReactions((current) => {
      const next = { ...current };

      if (reaction) {
        next[postId] = reaction;
      } else {
        delete next[postId];
      }

      return next;
    });

    /*
     * With no backend at all there is nothing to persist and nothing to
     * sign into — the optimistic state IS the feature, for demo purposes.
     */
    if (!isSupabaseConfigured()) {
      return;
    }

    if (!isAuthenticated) {
      showToast(t("newsSignInToReact"));
      return;
    }

    const { error } = reaction
      ? await setMyReaction(postId, reaction)
      : await clearMyReaction(postId);

    if (error) {
      /* Roll back to exactly what it was before. */
      setMyReactions((current) => {
        const next = { ...current };

        if (previous) {
          next[postId] = previous;
        } else {
          delete next[postId];
        }

        return next;
      });

      showToast(error.message);
    }
  };

  /* ------------------------------------------------------------------
     MEDIA ATTACHMENT — local preview only, nothing is uploaded
  ------------------------------------------------------------------ */

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState<{
    url: string;
    type: "image" | "video";
    name: string;
  } | null>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setMedia({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video")
        ? "video"
        : "image",
      name: file.name,
    });
  };

  const clearMedia = () => {
    setMedia(null);

    /*
     * Reset the input so picking the *same* file again still
     * fires onChange (the browser skips it otherwise).
     */
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * Revoke the blob URL when it is replaced or the page unmounts —
   * the cleanup runs with the previous `media`, so each URL is freed
   * exactly once.
   */
  useEffect(() => {
    if (!media) {
      return;
    }

    const { url } = media;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [media]);

  /* ------------------------------------------------------------------
     SUBMIT — moderation queue, never straight to the feed
  ------------------------------------------------------------------ */

  const [isPublishing, setIsPublishing] =
    useState(false);

  const handlePublish = async () => {
    const text = draft.trim();

    if (!text) {
      return;
    }

    /*
     * No backend: keep the original demo behaviour — clear the composer and
     * show the moderation toast, which stays accurate either way.
     */
    if (!isSupabaseConfigured()) {
      setDraft("");
      clearMedia();
      showToast(t("newsPostSubmitted"));
      return;
    }

    if (!isAuthenticated) {
      showToast(t("newsAuthRequired"));
      return;
    }

    setIsPublishing(true);

    const { error } = await submitNewsPost(text);

    setIsPublishing(false);

    if (error) {
      showToast(error.message);
      return;
    }

    /*
     * The post is NOT appended to the feed. RLS forces status='pending', so
     * it genuinely is not published yet — the toast says so.
     */
    setDraft("");
    clearMedia();
    showToast(t("newsPostSubmitted"));
  };

  const canPublish =
    draft.trim().length > 0 && !isPublishing;

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

        {/* MEDIA PREVIEW */}

        {media && (
          <div
            className="
              mt-3 flex items-center gap-3
              rounded-xl
              border border-slate-200
              bg-white
              p-2

              dark:border-slate-800
              dark:bg-slate-950
            "
          >
            <div
              className="
                relative h-16 w-16 shrink-0
                overflow-hidden
                rounded-lg
                bg-slate-200

                dark:bg-slate-800
              "
            >
              {media.type === "video" ? (
                <video
                  src={media.url}
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={media.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <p
              dir="ltr"
              className="
                min-w-0 flex-1 truncate
                text-start
                text-[12px] font-medium
                text-slate-600

                dark:text-slate-400
              "
            >
              {media.name}
            </p>

            <button
              type="button"
              onClick={clearMedia}
              aria-label="داخستن"
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                text-slate-600
                outline-none
                transition-colors duration-200

                hover:bg-slate-100
                hover:text-rose-600

                focus-visible:ring-2
                focus-visible:ring-blue-600
                dark:focus-visible:ring-blue-500

                dark:text-slate-400
                dark:hover:bg-white/[0.06]
                dark:hover:text-rose-400
              "
            >
              <X
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </div>
        )}

        <div
          className="
            mt-3 flex items-center gap-2
            border-t border-slate-200
            pt-3

            dark:border-slate-800
          "
        >
          {/* ATTACH IMAGE / VIDEO */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={openFilePicker}
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
        {posts.map((post) => (
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

            {post.body ? (
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
            ) : null}

            {/* POST MEDIA */}

            {post.image ? (
              <div className="relative aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800">
                {post.mediaType === "video" ? (
                  <video
                    src={post.image}
                    controls
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 448px"
                    className="object-cover"
                  />
                )}
              </div>
            ) : null}

            {/* REACTIONS */}

            <ReactionBar
              postId={post.id}
              baseCount={post.totalReactions}
              baseTypes={post.topReactionTypes}
              myReaction={
                myReactions[post.id] ?? null
              }
              onReact={handleReact}
            />
          </article>
        ))}
      </div>

      {/* =====================================================
          TOAST
      ====================================================== */}

      <AnimatePresence>
        {toast && (
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

              <p className="min-w-0 flex-1 text-[12.5px] font-semibold leading-relaxed text-white">
                {toast}
              </p>

              {/*
                When the toast is a sign-in prompt, make it actionable —
                a prompt with no way to act on it is just a scolding.
              */}
              {toast ===
              t("newsSignInToReact") ? (
                <Link
                  href="/login"
                  className="
                    shrink-0
                    rounded-lg
                    bg-blue-500
                    px-3 py-1.5
                    text-[12px] font-bold
                    text-white
                    outline-none
                    transition-colors

                    hover:bg-blue-400

                    focus-visible:ring-2
                    focus-visible:ring-white
                  "
                >
                  {t("authLoginButton")}
                </Link>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
