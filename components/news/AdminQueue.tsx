"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Check,
  Clock3,
  Inbox,
  Loader2,
  X,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import {
  fetchPendingPosts,
  moderateNewsPost,
  type PendingPost,
} from "@/lib/supabase/queries.client";

/*
|--------------------------------------------------------------------------
| Admin moderation queue
|--------------------------------------------------------------------------
|
| Rendered only when the signed-in profile has is_admin = true — but that is
| PRESENTATION ONLY. The real gate is RLS: `news_posts: read approved` lets a
| non-admin select nothing but approved rows and their own, and
| `news_posts: admin moderate` restricts UPDATE to is_admin(). A non-admin who
| forced this component to render would see an empty list and could not write.
|
| Fetches in the browser, like every other user-specific read in this app, so
| /news keeps its static prerender (CLAUDE.md §8, the cookies() rule).
|
*/

type AdminQueueProps = {
  onDone: (message: string) => void;
};

export default function AdminQueue({
  onDone,
}: AdminQueueProps) {
  const { t, direction } = useLanguage();

  const [posts, setPosts] = useState<
    PendingPost[] | null
  >(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /* Post ids currently being written, so their row can show a spinner. */
  const [busyIds, setBusyIds] = useState<
    Set<string>
  >(new Set());

  const load = useCallback(async () => {
    setIsLoading(true);

    const rows = await fetchPendingPosts();

    setPosts(rows ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchPendingPosts().then((rows) => {
      if (cancelled) {
        return;
      }

      setPosts(rows ?? []);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleModerate = async (
    postId: string,
    status: "approved" | "rejected"
  ) => {
    setBusyIds((current) =>
      new Set(current).add(postId)
    );

    const { error } = await moderateNewsPost(
      postId,
      status
    );

    setBusyIds((current) => {
      const next = new Set(current);
      next.delete(postId);
      return next;
    });

    if (error) {
      onDone(t("newsModerationFailed"));
      return;
    }

    /*
     * Drop the row locally rather than refetching: the list is already
     * correct, and a refetch would make the card flicker back in before
     * disappearing.
     */
    setPosts((current) =>
      (current ?? []).filter(
        (post) => post.id !== postId
      )
    );

    onDone(
      status === "approved"
        ? t("newsApprovedToast")
        : t("newsRejectedToast")
    );
  };

  /* ------------------------------------------------------------------
     LOADING
  ------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <div
        className="
          mt-5 flex items-center justify-center gap-2.5
          rounded-2xl
          border border-slate-200
          bg-slate-50
          py-10

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <Loader2
          className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-500"
          aria-hidden="true"
        />

        <p
          className="
            text-[12.5px] font-semibold
            text-slate-600
            dark:text-slate-400
          "
        >
          {t("newsPendingLoading")}
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------
     EMPTY
  ------------------------------------------------------------------ */

  if (!posts || posts.length === 0) {
    return (
      <div
        className="
          mt-5
          rounded-2xl
          border border-slate-200
          bg-slate-50
          px-6 py-12
          text-center

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <span
          aria-hidden="true"
          className="
            mx-auto mb-3 flex
            h-14 w-14
            items-center justify-center
            rounded-2xl
            bg-sky-500/10
            text-blue-600

            dark:bg-sky-500/15
            dark:text-blue-500
          "
        >
          <Inbox className="h-7 w-7" />
        </span>

        <p
          className="
            text-[13px] font-bold
            text-slate-700
            dark:text-slate-300
          "
        >
          {t("newsPendingEmpty")}
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------
     QUEUE
  ------------------------------------------------------------------ */

  return (
    <div
      dir={direction}
      className="mt-5 space-y-4"
    >
      <AnimatePresence initial={false}>
        {posts.map((post) => {
          const isBusy = busyIds.has(post.id);

          return (
            <motion.article
              key={post.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.96,
                transition: { duration: 0.18 },
              }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 34,
              }}
              className="
                overflow-hidden
                rounded-2xl
                border border-amber-300/60
                bg-slate-50
                shadow-sm

                dark:border-amber-500/25
                dark:bg-slate-900
              "
            >
              {/* PENDING STRIP */}

              <div
                className="
                  flex items-center gap-2
                  border-b border-amber-300/50
                  bg-amber-50
                  px-3.5 py-2

                  dark:border-amber-500/20
                  dark:bg-amber-500/10
                "
              >
                <Clock3
                  className="
                    h-3.5 w-3.5 shrink-0
                    text-amber-600
                    dark:text-amber-400
                  "
                  aria-hidden="true"
                />

                <span
                  className="
                    text-[11px] font-bold
                    text-amber-800
                    dark:text-amber-300
                  "
                >
                  {t("newsPendingBadge")}
                </span>

                <span
                  dir="ltr"
                  className="
                    ms-auto
                    text-[11px] font-medium
                    text-amber-700/80

                    dark:text-amber-300/70
                  "
                >
                  {new Date(
                    post.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>

              {/* AUTHOR */}

              <p
                className="
                  px-3.5 pt-3
                  text-[13px] font-bold
                  text-slate-900

                  dark:text-white
                "
              >
                {post.authorName ?? "—"}
              </p>

              {/* BODY */}

              {post.textContent ? (
                <p
                  className="
                    px-3.5 pt-1.5
                    text-[13px] leading-relaxed
                    text-slate-700

                    dark:text-slate-300
                  "
                >
                  {post.textContent}
                </p>
              ) : null}

              {/* MEDIA */}

              {post.mediaUrl ? (
                <div className="relative mt-3 aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800">
                  {post.mediaType ===
                  "video" ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={post.mediaUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 448px"
                      className="object-cover"
                    />
                  )}
                </div>
              ) : null}

              {/* ACTIONS */}

              <div
                className="
                  mt-3 flex items-center gap-2
                  border-t border-slate-200
                  p-2.5

                  dark:border-slate-800
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    handleModerate(
                      post.id,
                      "approved"
                    )
                  }
                  disabled={isBusy}
                  className="
                    flex h-11 flex-1
                    items-center justify-center gap-2
                    rounded-xl
                    bg-green-600
                    px-4
                    text-[13px] font-bold
                    text-white
                    shadow-[0_8px_20px_-8px_rgba(22,163,74,0.9)]
                    outline-none
                    transition-all duration-200

                    hover:bg-green-700

                    focus-visible:ring-2
                    focus-visible:ring-green-600
                    focus-visible:ring-offset-2
                    dark:focus-visible:ring-offset-slate-900

                    active:scale-[0.98]

                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                  style={{
                    WebkitTapHighlightColor:
                      "transparent",
                  }}
                >
                  {isBusy ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Check
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                  )}

                  <span className="truncate">
                    {t("newsApprove")}
                  </span>
                </button>

                {/*
                  Reject is an outline, not a filled red button: rejecting is
                  reversible (the row keeps its content and can be approved
                  later) and should not carry the visual weight of a delete.
                  Same rule as the sign-out button.
                */}
                <button
                  type="button"
                  onClick={() =>
                    handleModerate(
                      post.id,
                      "rejected"
                    )
                  }
                  disabled={isBusy}
                  className="
                    flex h-11 flex-1
                    items-center justify-center gap-2
                    rounded-xl
                    border-2 border-rose-300
                    px-4
                    text-[13px] font-bold
                    text-rose-600
                    outline-none
                    transition-all duration-200

                    hover:bg-rose-50

                    focus-visible:ring-2
                    focus-visible:ring-rose-500
                    focus-visible:ring-offset-2
                    dark:focus-visible:ring-offset-slate-900

                    active:scale-[0.98]

                    disabled:cursor-not-allowed
                    disabled:opacity-50

                    dark:border-rose-500/40
                    dark:text-rose-400
                    dark:hover:bg-rose-500/10
                  "
                  style={{
                    WebkitTapHighlightColor:
                      "transparent",
                  }}
                >
                  <X
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />

                  <span className="truncate">
                    {t("newsReject")}
                  </span>
                </button>
              </div>
            </motion.article>
          );
        })}
      </AnimatePresence>

      {/*
        Manual refresh — a moderator working through a queue wants to pull in
        anything submitted since the tab was opened without a full reload.
      */}
      <button
        type="button"
        onClick={load}
        className="
          mx-auto block
          rounded-full
          px-4 py-2
          text-[12px] font-bold
          text-slate-500
          outline-none
          transition-colors

          hover:text-blue-600

          focus-visible:ring-2
          focus-visible:ring-blue-600

          dark:text-slate-400
          dark:hover:text-blue-500
          dark:focus-visible:ring-blue-500
        "
      >
        {t("newsRefresh")}
      </button>
    </div>
  );
}
