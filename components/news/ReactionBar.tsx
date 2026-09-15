"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { SmilePlus } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import {
  DEFAULT_REACTION,
  REACTIONS,
  getReaction,
  type NewsReactionType,
} from "@/lib/data/news";

/*
|--------------------------------------------------------------------------
| Reaction bar
|--------------------------------------------------------------------------
|
| Facebook-style reactions: a single action button that applies the default
| reaction on a plain tap, and opens a floating picker on hover (desktop) or
| long-press (mobile).
|
| Comments do not exist — this is the only engagement control on a post.
|
| Opening rules, and why they differ per input type:
|   * Pointer devices get hover-to-open with a short close delay, so moving
|     the cursor from the button up into the popover does not dismiss it.
|   * Touch devices have no hover. A 450ms long-press opens the picker, and
|     `pressedRef` suppresses the click that the browser fires afterwards —
|     without it, long-pressing would open the picker AND immediately apply
|     the default reaction.
|
*/

type ReactionBarProps = {
  postId: string;

  /* Aggregate from the news_feed view, excluding the viewer's own. */
  baseCount: number;

  /* Distinct types the post received, most-used first. */
  baseTypes: NewsReactionType[];

  /* The viewer's current reaction, or null. */
  myReaction: NewsReactionType | null;

  onReact: (
    postId: string,
    reaction: NewsReactionType | null
  ) => void;
};

const LONG_PRESS_MS = 450;
const CLOSE_DELAY_MS = 220;

export default function ReactionBar({
  postId,
  baseCount,
  baseTypes,
  myReaction,
  onReact,
}: ReactionBarProps) {
  const { t } = useLanguage();

  const [isPickerOpen, setIsPickerOpen] =
    useState(false);

  const closeTimer = useRef<number | null>(null);
  const pressTimer = useRef<number | null>(null);

  /* Set by a completed long-press; swallows the synthetic click after it. */
  const pressedRef = useRef(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  /* ------------------------------------------------------------------
     TIMERS — every one is cleared on unmount
  ------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }

      if (pressTimer.current !== null) {
        window.clearTimeout(pressTimer.current);
      }
    };
  }, []);

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();

    closeTimer.current = window.setTimeout(
      () => setIsPickerOpen(false),
      CLOSE_DELAY_MS
    );
  };

  /* ------------------------------------------------------------------
     DISMISS — outside click and Escape, for the touch/keyboard paths
  ------------------------------------------------------------------ */

  useEffect(() => {
    if (!isPickerOpen) {
      return;
    }

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setIsPickerOpen(false);
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isPickerOpen]);

  /* ------------------------------------------------------------------
     TOUCH — long-press to open
  ------------------------------------------------------------------ */

  const handleTouchStart = () => {
    pressedRef.current = false;

    pressTimer.current = window.setTimeout(
      () => {
        pressedRef.current = true;
        setIsPickerOpen(true);
      },
      LONG_PRESS_MS
    );
  };

  const handleTouchEnd = () => {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  /* ------------------------------------------------------------------
     ACTIONS
  ------------------------------------------------------------------ */

  const handleMainClick = () => {
    /*
     * Swallow the click the browser synthesises at the end of a long-press,
     * then reset so the next genuine tap works.
     */
    if (pressedRef.current) {
      pressedRef.current = false;
      return;
    }

    /* Tapping again with the same reaction removes it. */
    onReact(
      postId,
      myReaction ? null : DEFAULT_REACTION
    );
  };

  const handlePick = (
    reaction: NewsReactionType
  ) => {
    setIsPickerOpen(false);
    cancelClose();

    onReact(
      postId,
      myReaction === reaction
        ? null
        : reaction
    );
  };

  /* ------------------------------------------------------------------
     DISPLAY
  ------------------------------------------------------------------ */

  const active = getReaction(myReaction);

  /*
   * The server aggregate excludes the viewer's own reaction (it is resolved
   * client-side), so it is added back here. This keeps the count correct
   * optimistically, before any refetch.
   */
  const totalCount =
    baseCount + (myReaction ? 1 : 0);

  /*
   * The icon cluster: the post's distinct types, plus the viewer's own if it
   * is not already represented. Capped at 3 — beyond that the overlap stops
   * being legible.
   */
  const clusterTypes = (() => {
    const types = [...baseTypes];

    if (
      myReaction &&
      !types.includes(myReaction)
    ) {
      types.unshift(myReaction);
    }

    return types.slice(0, 3);
  })();

  return (
    <div
      className="
        border-t border-slate-200
        dark:border-slate-800
      "
    >
      {/* ===================================================
          SUMMARY — overlapping icons + total
      =================================================== */}

      {totalCount > 0 ? (
        <div
          className="
            flex items-center gap-2
            px-3.5 pt-2.5
          "
        >
          <div
            aria-hidden="true"
            className="flex items-center"
          >
            {clusterTypes.map(
              (type, index) => {
                const config =
                  getReaction(type);

                if (!config) {
                  return null;
                }

                return (
                  <span
                    key={type}
                    style={{
                      marginInlineStart:
                        index === 0
                          ? 0
                          : "-6px",
                      zIndex:
                        clusterTypes.length -
                        index,
                    }}
                    className="
                      flex h-[22px] w-[22px]
                      items-center justify-center
                      rounded-full
                      border-2 border-slate-50
                      bg-white
                      text-[11px]
                      shadow-sm

                      dark:border-slate-900
                      dark:bg-slate-800
                    "
                  >
                    {config.emoji}
                  </span>
                );
              }
            )}
          </div>

          <span
            className="
              text-[12px] font-bold
              text-slate-600

              dark:text-slate-400
            "
          >
            {totalCount}
          </span>

          <span className="sr-only">
            {t("newsReactionsLabel")}
          </span>
        </div>
      ) : null}

      {/* ===================================================
          ACTION BUTTON + PICKER
      =================================================== */}

      <div
        ref={containerRef}
        className="relative p-2"
        onMouseEnter={() => {
          cancelClose();
          setIsPickerOpen(true);
        }}
        onMouseLeave={scheduleClose}
      >
        <AnimatePresence>
          {isPickerOpen ? (
            <motion.div
              role="menu"
              aria-label={t("newsReact")}
              initial={{
                opacity: 0,
                y: 8,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 6,
                scale: 0.94,
              }}
              transition={{
                type: "spring",
                stiffness: 460,
                damping: 30,
              }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="
                absolute bottom-full start-2 z-30
                mb-1.5
                flex items-center gap-0.5
                rounded-full
                border border-slate-200
                bg-white
                p-1.5
                shadow-[0_12px_32px_-10px_rgba(15,23,42,0.35)]

                dark:border-slate-700
                dark:bg-slate-800
                dark:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.8)]
              "
            >
              {REACTIONS.map((reaction) => {
                const isChosen =
                  myReaction === reaction.type;

                return (
                  <button
                    key={reaction.type}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isChosen}
                    aria-label={t(
                      reaction.labelKey
                    )}
                    title={t(reaction.labelKey)}
                    onClick={() =>
                      handlePick(reaction.type)
                    }
                    className={`
                      flex h-9 w-9
                      items-center justify-center
                      rounded-full
                      text-[20px]
                      leading-none
                      outline-none
                      transition-transform duration-150

                      hover:scale-125
                      hover:-translate-y-0.5

                      focus-visible:ring-2
                      focus-visible:ring-blue-600
                      dark:focus-visible:ring-blue-500

                      active:scale-110

                      ${
                        isChosen
                          ? "bg-slate-100 dark:bg-white/10"
                          : ""
                      }
                    `}
                  >
                    <span aria-hidden="true">
                      {reaction.emoji}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleMainClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onContextMenu={(event) => {
            /* Long-press on mobile otherwise raises the context menu. */
            if (pressedRef.current) {
              event.preventDefault();
            }
          }}
          onFocus={cancelClose}
          aria-haspopup="menu"
          aria-expanded={isPickerOpen}
          aria-pressed={myReaction !== null}
          className={`
            flex w-full
            items-center justify-center gap-2
            rounded-xl
            py-2
            text-[13px] font-semibold
            outline-none
            transition-colors duration-200
            select-none

            focus-visible:ring-2
            focus-visible:ring-blue-600
            dark:focus-visible:ring-blue-500

            ${
              active
                ? active.activeClass
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
          style={{
            WebkitTapHighlightColor:
              "transparent",
          }}
        >
          {active ? (
            <span
              aria-hidden="true"
              className="text-[16px] leading-none"
            >
              {active.emoji}
            </span>
          ) : (
            <SmilePlus
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          )}

          <span className="truncate">
            {active
              ? t(active.labelKey)
              : t("newsReact")}
          </span>
        </button>
      </div>
    </div>
  );
}
