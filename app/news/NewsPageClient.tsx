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
  Loader2,
  Newspaper,
  SendHorizontal,
  ShieldCheck,
  Trash2,
  User,
  X,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/components/auth/AuthProvider";
import ReactionBar from "@/components/news/ReactionBar";
import AdminQueue from "@/components/news/AdminQueue";
import {
  type FeedPost,
  type NewsReactionType,
} from "@/lib/data/news";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  clearMyReaction,
  deleteNewsPost,
  fetchMyReactions,
  setMyReaction,
  submitNewsPost,
  uploadNewsMedia,
  MAX_MEDIA_BYTES,
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
  posts: serverPosts,
}: NewsPageClientProps) {
  const { t, direction } = useLanguage();

  const { isAuthenticated, profile } = useAuth();

  /*
   * Presentation gate only. RLS is the real boundary — see AdminQueue's
   * header comment. `profile` is null until the browser resolves the session,
   * so the tabs simply are not rendered during that window rather than
   * flashing in.
   */
  const isAdmin = profile?.is_admin === true;

  const [tab, setTab] = useState<
    "feed" | "pending"
  >("feed");

  /*
   * An admin who signs out mid-session must not be left looking at a
   * moderation tab that can no longer load anything.
   */
  useEffect(() => {
    if (!isAdmin) {
      setTab("feed");
    }
  }, [isAdmin]);

  /*
   * A local copy of the server's posts, so an admin delete can remove a card
   * immediately. The feed itself is still server-rendered and ISR-cached —
   * this only ever *removes* from what the server sent.
   */
  const [posts, setPosts] =
    useState<FeedPost[]>(serverPosts);

  /*
   * Re-seed when the server sends a new list (ISR revalidation, or navigating
   * back to /news). Without this, a deleted-then-revalidated feed would keep
   * showing the stale local copy for the rest of the session.
   */
  useEffect(() => {
    setPosts(serverPosts);
  }, [serverPosts]);

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
     ADMIN DELETE

     Two-step on purpose. A single tap on a trash icon is far too easy to hit
     by accident on a phone, and this is irreversible — the row is gone, not
     flagged. The first tap arms the card; the second confirms.
  ------------------------------------------------------------------ */

  const [confirmingId, setConfirmingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<
    string | null
  >(null);

  const handleDelete = async (
    post: FeedPost
  ) => {
    setDeletingId(post.id);

    const { error } = await deleteNewsPost(
      post.id,
      post.image
    );

    setDeletingId(null);
    setConfirmingId(null);

    if (error) {
      showToast(t("newsDeleteFailed"));
      return;
    }

    setPosts((current) =>
      current.filter(
        (item) => item.id !== post.id
      )
    );

    showToast(t("newsDeletedToast"));
  };

  /* ------------------------------------------------------------------
     MEDIA ATTACHMENT

     The preview is a local blob (instant, no wait); the FILE itself is kept
     aside and uploaded to Supabase Storage on publish. Uploading on publish
     rather than on pick means a user who attaches something and then changes
     their mind never costs a byte of storage.
  ------------------------------------------------------------------ */

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [media, setMedia] = useState<{
    url: string;
    type: "image" | "video";
    name: string;
    file: File;
  } | null>(null);

  const [isUploading, setIsUploading] =
    useState(false);

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

    /*
     * Checked here as well as in the bucket's file_size_limit, so an
     * oversized file is refused instantly instead of after a long upload
     * that the server then rejects.
     */
    if (file.size > MAX_MEDIA_BYTES) {
      showToast(t("newsFileTooLarge"));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setMedia({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video")
        ? "video"
        : "image",
      name: file.name,
      file,
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

    /*
     * A post needs text OR media — matching the news_posts_not_empty CHECK
     * constraint, so the button can never submit something the DB refuses.
     */
    if (!text && !media) {
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

    /*
     * Upload first. If it fails, the post is NOT submitted — publishing a
     * caption whose image silently vanished would be worse than failing
     * loudly and letting the user retry.
     */
    let uploaded = null;

    if (media) {
      setIsUploading(true);

      const { media: result, error: uploadError } =
        await uploadNewsMedia(media.file);

      setIsUploading(false);

      if (uploadError) {
        setIsPublishing(false);

        showToast(
          uploadError.message ===
            "FILE_TOO_LARGE"
            ? t("newsFileTooLarge")
            : t("newsUploadFailed")
        );

        return;
      }

      uploaded = result;
    }

    const { error } = await submitNewsPost(
      text,
      uploaded
    );

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
    (draft.trim().length > 0 ||
      media !== null) &&
    !isPublishing;

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
          ADMIN TABS

          Rendered only for an admin. Everyone else sees the feed
          with no hint that a moderation view exists.
      ====================================================== */}

      {isAdmin ? (
        <div
          role="tablist"
          aria-label={t("newsAdminOnly")}
          className="
            mt-5 grid grid-cols-2 gap-1
            rounded-2xl
            bg-slate-100
            p-1

            dark:bg-slate-900
          "
        >
          {(
            [
              {
                id: "feed" as const,
                label: t("newsTabFeed"),
                icon: Newspaper,
              },
              {
                id: "pending" as const,
                label: t("newsTabPending"),
                icon: ShieldCheck,
              },
            ]
          ).map((item) => {
            const isActive = tab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(item.id)}
                className={`
                  flex items-center justify-center gap-1.5
                  rounded-xl
                  px-2 py-2.5
                  text-[12.5px] font-bold
                  outline-none
                  transition-all duration-200

                  focus-visible:ring-2
                  focus-visible:ring-blue-600
                  dark:focus-visible:ring-blue-500

                  ${
                    isActive
                      ? `
                          bg-white
                          text-blue-600
                          shadow-sm

                          dark:bg-slate-800
                          dark:text-blue-500
                        `
                      : `
                          text-slate-500
                          hover:text-slate-800

                          dark:text-slate-400
                          dark:hover:text-slate-200
                        `
                  }
                `}
                style={{
                  WebkitTapHighlightColor:
                    "transparent",
                }}
              >
                <Icon
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />

                <span className="truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {/* =====================================================
          MODERATION QUEUE — admin, pending tab only
      ====================================================== */}

      {isAdmin && tab === "pending" ? (
        <AdminQueue onDone={showToast} />
      ) : null}

      {/* =====================================================
          COMPOSER
      ====================================================== */}

      {tab === "feed" ? (
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
              aria-label={t("newsRemoveMedia")}
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
            {isPublishing ? (
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <SendHorizontal
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />
            )}

            <span className="truncate">
              {isUploading
                ? t("newsUploading")
                : t("newsPublish")}
            </span>
          </button>
        </div>
      </div>
      ) : null}

      {/* =====================================================
          FEED
      ====================================================== */}

      {tab === "feed" ? (
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

              {/*
                ADMIN DELETE — hidden entirely from everyone else. The
                real boundary is the `news_posts: delete own` policy,
                which allows the author or an admin and nobody else.
              */}
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() =>
                    setConfirmingId(
                      confirmingId === post.id
                        ? null
                        : post.id
                    )
                  }
                  aria-label={t("newsDelete")}
                  aria-expanded={
                    confirmingId === post.id
                  }
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    text-slate-400
                    outline-none
                    transition-colors duration-200

                    hover:bg-rose-50
                    hover:text-rose-600

                    focus-visible:ring-2
                    focus-visible:ring-rose-500

                    dark:hover:bg-rose-500/10
                    dark:hover:text-rose-400
                    dark:focus-visible:ring-rose-400
                  "
                  style={{
                    WebkitTapHighlightColor:
                      "transparent",
                  }}
                >
                  <Trash2
                    className="h-[18px] w-[18px]"
                    aria-hidden="true"
                  />
                </button>
              ) : null}
            </div>

            {/* DELETE CONFIRMATION */}

            <AnimatePresence initial={false}>
              {isAdmin &&
              confirmingId === post.id ? (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  transition={{
                    duration: 0.18,
                  }}
                  className="overflow-hidden"
                >
                  <div
                    className="
                      mx-3.5 mb-3
                      rounded-xl
                      border border-rose-300/70
                      bg-rose-50
                      p-3

                      dark:border-rose-500/30
                      dark:bg-rose-950/40
                    "
                  >
                    <p
                      className="
                        text-[12px] font-semibold leading-relaxed
                        text-rose-800

                        dark:text-rose-300
                      "
                    >
                      {t("newsDeleteConfirm")}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(post)
                        }
                        disabled={
                          deletingId === post.id
                        }
                        className="
                          flex h-10 flex-1
                          items-center justify-center gap-1.5
                          rounded-lg
                          bg-rose-600
                          px-3
                          text-[12.5px] font-bold
                          text-white
                          outline-none
                          transition-colors duration-200

                          hover:bg-rose-700

                          focus-visible:ring-2
                          focus-visible:ring-rose-600
                          focus-visible:ring-offset-2
                          dark:focus-visible:ring-offset-slate-900

                          active:scale-[0.98]

                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                        style={{
                          WebkitTapHighlightColor:
                            "transparent",
                        }}
                      >
                        {deletingId ===
                        post.id ? (
                          <Loader2
                            className="h-3.5 w-3.5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <Trash2
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        )}

                        <span className="truncate">
                          {t("newsDeleteYes")}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConfirmingId(null)
                        }
                        disabled={
                          deletingId === post.id
                        }
                        className="
                          flex h-10 flex-1
                          items-center justify-center
                          rounded-lg
                          border border-slate-300
                          bg-white
                          px-3
                          text-[12.5px] font-bold
                          text-slate-700
                          outline-none
                          transition-colors duration-200

                          hover:bg-slate-50

                          focus-visible:ring-2
                          focus-visible:ring-slate-400

                          disabled:cursor-not-allowed
                          disabled:opacity-60

                          dark:border-slate-700
                          dark:bg-slate-900
                          dark:text-slate-200
                          dark:hover:bg-slate-800
                        "
                        style={{
                          WebkitTapHighlightColor:
                            "transparent",
                        }}
                      >
                        {t("newsCancel")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

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
      ) : null}

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
