"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  BellRing,
  Sparkles,
  X,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationPanel({
  open,
  onClose,
}: NotificationPanelProps) {
  const { t, direction } = useLanguage();

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

              dark:border-white/[0.08]
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
                border-b border-slate-100
                bg-gradient-to-br
                from-emerald-50
                to-teal-50/60
                px-4 py-3.5

                dark:border-white/[0.06]
                dark:from-emerald-500/[0.12]
                dark:to-teal-500/[0.06]
              "
            >
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute -end-4 -top-6
                  h-20 w-20
                  rounded-full
                  bg-emerald-400/20
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
                    bg-emerald-500/15
                    text-emerald-600

                    dark:text-emerald-400
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
                    bg-emerald-500
                    px-1.5 py-0.5
                    text-[10px] font-bold
                    leading-none
                    text-white
                  "
                >
                  1
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
                  text-slate-500
                  outline-none
                  transition-colors duration-200

                  hover:bg-white/70
                  hover:text-slate-900

                  focus-visible:ring-2
                  focus-visible:ring-emerald-500

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

            <ul className="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
              <li>
                <div
                  className="
                    flex gap-3
                    rounded-2xl
                    bg-emerald-50/60
                    p-3

                    dark:bg-emerald-400/[0.06]
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      flex h-10 w-10 shrink-0
                      items-center justify-center
                      rounded-full
                      bg-gradient-to-br from-emerald-500 to-teal-600
                      text-white
                      shadow-[0_8px_18px_-8px_rgba(16,185,129,0.9)]
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
                        text-emerald-600

                        dark:text-emerald-400
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
                      bg-emerald-500
                    "
                  />
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
