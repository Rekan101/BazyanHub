"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  BellRing,
  Megaphone,
  Newspaper,
  Sparkles,
  Store,
  X,
  type LucideIcon,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import {
  countUnread,
  type AppNotification,
} from "@/lib/data/notifications";

/*
 * Allow-list for the `icon` column. Anything unrecognised (or null) falls
 * back to Sparkles, which is the glyph the built-in welcome item has always
 * used — so an unknown icon degrades to the familiar look rather than a gap.
 */
const NOTIFICATION_ICONS: Record<
  string,
  LucideIcon
> = {
  sparkles: Sparkles,
  megaphone: Megaphone,
  newspaper: Newspaper,
  store: Store,
  bell: BellRing,
};

function resolveIcon(
  icon: string | null
): LucideIcon {
  if (!icon) {
    return Sparkles;
  }

  return (
    NOTIFICATION_ICONS[icon.toLowerCase()] ??
    Sparkles
  );
}

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;

  /*
   * Fetched in the browser by NotificationProvider the first time the panel
   * opens. An empty list is the normal state before any rows exist, and
   * makes the panel render its built-in welcome item — the same thing it
   * showed before the database existed.
   */
  notifications?: AppNotification[];

  isLoading?: boolean;
}

export default function NotificationPanel({
  open,
  onClose,
  notifications = [],
  isLoading = false,
}: NotificationPanelProps) {
  const { t, direction } = useLanguage();

  const hasRows = notifications.length > 0;

  /*
   * The welcome fallback is always shown as unread, matching the hardcoded
   * "1" badge this panel carried before it was wired to data.
   */
  const unreadCount = hasRows
    ? countUnread(notifications)
    : 1;

  /* ---------------------------------------------------------
     Close on Escape
  --------------------------------------------------------- */

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed inset-0 z-[55]
            mx-auto w-full max-w-md
          "
        >
          {/* =================================================
              BACKDROP
          ================================================= */}

          <motion.button
            type="button"
            aria-label={t("closeMenu")}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="
              absolute inset-0
              cursor-default
              bg-slate-950/30
              backdrop-blur-[2px]
            "
          />

          {/* =================================================
              PANEL — drops down under the header
          ================================================= */}

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("notifications")}
            dir={direction}
            initial={{
              opacity: 0,
              y: -14,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.97,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 32,
            }}
            className="
              absolute inset-x-0 top-[78px]
              mx-3
              overflow-hidden
              rounded-3xl
              border border-slate-200
              bg-white
              shadow-[0_24px_60px_rgba(15,23,42,0.22)]

              dark:border-slate-800
              dark:bg-slate-900
              dark:shadow-[0_24px_60px_rgba(0,0,0,0.55)]
            "
          >
            {/* ===============================================
                PANEL HEADER
            =============================================== */}

            <div
              className="
                relative
                flex items-center justify-between
                gap-3
                overflow-hidden
                border-b border-slate-200
                bg-gradient-to-br
                from-sky-50
                to-blue-50/60
                px-4 py-3.5

                dark:border-slate-800
                dark:from-blue-500/[0.12]
                dark:to-sky-500/[0.06]
              "
            >
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute -end-4 -top-6
                  h-20 w-20
                  rounded-full
                  bg-sky-400/20
                  blur-2xl
                "
              />

              <div className="relative flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="
                    flex h-9 w-9 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-sky-500/15
                    dark:bg-sky-500/20
                    text-blue-600

                    dark:text-blue-500
                  "
                >
                  <BellRing className="h-[18px] w-[18px]" />
                </span>

                <p
                  className="
                    truncate
                    text-[14px] font-extrabold
                    text-slate-900

                    dark:text-white
                  "
                >
                  {t("notifications")}
                </p>

                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-blue-600
                    px-1.5 py-0.5
                    dark:bg-blue-500
                    text-[10px] font-bold
                    leading-none
                    text-white
                  "
                >
                  {unreadCount}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label={t("closeMenu")}
                className="
                  relative
                  flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-lg
                  text-slate-600
                  outline-none
                  transition-colors duration-200

                  hover:bg-white/70
                  hover:text-slate-900

                  focus-visible:ring-2
                  focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500

                  dark:text-slate-400
                  dark:hover:bg-white/[0.08]
                  dark:hover:text-white
                "
              >
                <X
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* ===============================================
                NOTIFICATION LIST
            =============================================== */}

            {/* ===============================================
                LOADING BAR

                A 2px indeterminate line rather than a spinner or
                skeleton rows: it sits in the border's own space, so
                the list never shifts while data arrives.
            =============================================== */}

            {isLoading ? (
              <div
                aria-hidden="true"
                className="
                  h-0.5 w-full overflow-hidden
                  bg-sky-100
                  dark:bg-sky-900/40
                "
              >
                <div
                  className="
                    h-full w-1/3
                    animate-[notif-loading_1.1s_ease-in-out_infinite]
                    bg-blue-600
                    dark:bg-blue-500
                  "
                />
              </div>
            ) : null}

            <ul
              aria-busy={isLoading}
              className="max-h-[60vh] overflow-y-auto overscroll-contain p-2"
            >
              {hasRows ? (
                notifications.map(
                  (notification) => {
                    const Icon = resolveIcon(
                      notification.icon
                    );

                    /*
                     * Read rows lose the tinted background and the unread
                     * dot, but keep the same geometry so the list does not
                     * jump as items are read.
                     */
                    const body = (
                      <div
                        className={`
                          flex gap-3
                          rounded-2xl
                          p-3
                          ${
                            notification.isRead
                              ? "bg-transparent"
                              : "bg-sky-50/60 dark:bg-sky-900/30"
                          }
                        `}
                      >
                        <span
                          aria-hidden="true"
                          className="
                            flex h-10 w-10 shrink-0
                            items-center justify-center
                            rounded-full
                            bg-gradient-to-br from-blue-600 to-sky-500
                            text-white
                            shadow-[0_8px_18px_-8px_rgba(37,99,235,0.9)]
                          "
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              text-[13px] font-bold leading-snug
                              text-slate-900

                              dark:text-white
                            "
                          >
                            {notification.title}
                          </p>

                          {notification.body ? (
                            <p
                              className="
                                mt-1
                                text-[12px] leading-relaxed
                                text-slate-600

                                dark:text-slate-400
                              "
                            >
                              {notification.body}
                            </p>
                          ) : null}
                        </div>

                        {!notification.isRead ? (
                          <span
                            aria-hidden="true"
                            className="
                              mt-1.5 h-2 w-2 shrink-0
                              rounded-full
                              bg-blue-600
                              dark:bg-blue-500
                            "
                          />
                        ) : null}
                      </div>
                    );

                    return (
                      <li key={notification.id}>
                        {notification.linkUrl ? (
                          <Link
                            href={
                              notification.linkUrl
                            }
                            onClick={onClose}
                            className="block outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-500 rounded-2xl"
                          >
                            {body}
                          </Link>
                        ) : (
                          body
                        )}
                      </li>
                    );
                  }
                )
              ) : (
                /*
                 * Fallback when the database has no rows (or is not
                 * configured). Text comes from the i18n dictionary, not from
                 * a row — this is exactly what the panel showed before it
                 * was wired to Supabase.
                 */
                <li>
                  <div
                    className="
                      flex gap-3
                      rounded-2xl
                      bg-sky-50/60
                      p-3

                      dark:bg-sky-900/30
                    "
                  >
                    <span
                      aria-hidden="true"
                      className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-full
                        bg-gradient-to-br from-blue-600 to-sky-500
                        text-white
                        shadow-[0_8px_18px_-8px_rgba(37,99,235,0.9)]
                      "
                    >
                      <Sparkles className="h-5 w-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          text-[13px] font-bold leading-snug
                          text-slate-900

                          dark:text-white
                        "
                      >
                        {t("notificationWelcomeTitle")}
                      </p>

                      <p
                        className="
                          mt-1
                          text-[12px] leading-relaxed
                          text-slate-600

                          dark:text-slate-400
                        "
                      >
                        {t("notificationWelcomeBody")}
                      </p>

                      <p
                        className="
                          mt-1.5
                          text-[10.5px] font-semibold
                          text-blue-600

                          dark:text-blue-500
                        "
                      >
                        {t("notificationNow")}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="
                        mt-1.5 h-2 w-2 shrink-0
                        rounded-full
                        bg-blue-600
                        dark:bg-blue-500
                      "
                    />
                  </div>
                </li>
              )}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
