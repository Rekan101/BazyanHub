"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import NotificationPanel from "@/components/layout/NotificationPanel";
import { useLanguage } from "@/lib/i18n";
import { fetchNotificationsFromBrowser } from "@/lib/supabase/queries.client";
import {
  countUnread,
  type AppNotification,
} from "@/lib/data/notifications";
import type { LanguageCode } from "@/lib/data/categories";

/*
|--------------------------------------------------------------------------
| Notification context
|--------------------------------------------------------------------------
|
| The panel used to be owned by AppHeader, which made it unreachable from
| any page. Lifting the state here keeps exactly one panel instance in the
| tree while letting any trigger — the header bell, the profile row — open
| the same thing.
|
| Data is fetched HERE, in the browser, not on the server. See
| lib/supabase/queries.client.ts for why: it keeps the static routes static,
| and it is the only place the user's chosen language is actually known.
|
| Fetch timing is lazy — the first time the panel opens, not on mount. The
| panel is closed by default, so a mount fetch would cost a request on every
| page load for data most visitors never look at. Once loaded it is cached
| for the session and refetched only when the language changes.
|
*/

interface NotificationContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;

  /* Force a re-read, e.g. after marking something read. */
  refresh: () => void;
}

const NotificationContext =
  createContext<NotificationContextValue | null>(
    null
  );

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState<AppNotification[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const pathname = usePathname();

  const { language } = useLanguage();

  const currentLanguage =
    language as LanguageCode;

  /*
   * Tracks which language we last successfully loaded, so the effect can
   * tell "never fetched" from "fetched, but in another language". Using a
   * ref rather than state keeps it out of the render cycle.
   */
  const loadedLanguageRef = useRef<
    LanguageCode | null
  >(null);

  const open = useCallback(
    () => setIsOpen(true),
    []
  );

  const close = useCallback(
    () => setIsOpen(false),
    []
  );

  const toggle = useCallback(
    () => setIsOpen((value) => !value),
    []
  );

  const refresh = useCallback(() => {
    loadedLanguageRef.current = null;
    setIsOpen((value) => value);
  }, []);

  /* ---------------------------------------------------------
     Close when the route changes
  --------------------------------------------------------- */

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* ---------------------------------------------------------
     Lazy load on first open, and on language change
  --------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (
      loadedLanguageRef.current ===
      currentLanguage
    ) {
      return;
    }

    /*
     * Guards against a late response overwriting a newer one — e.g. the
     * user switches language twice quickly, or closes and reopens.
     */
    let cancelled = false;

    setIsLoading(true);

    fetchNotificationsFromBrowser(
      currentLanguage
    )
      .then((rows) => {
        if (cancelled) {
          return;
        }

        /*
         * null means the query could not answer (Supabase unconfigured or
         * errored). Keep whatever is already on screen rather than
         * blanking it; the panel falls back to its built-in welcome item
         * when the list is empty.
         */
        if (rows) {
          setNotifications(rows);
          loadedLanguageRef.current =
            currentLanguage;
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, currentLanguage]);

  const unreadCount = useMemo(
    () => countUnread(notifications),
    [notifications]
  );

  const value =
    useMemo<NotificationContextValue>(
      () => ({
        isOpen,
        open,
        close,
        toggle,
        notifications,
        unreadCount,
        isLoading,
        refresh,
      }),
      [
        isOpen,
        open,
        close,
        toggle,
        notifications,
        unreadCount,
        isLoading,
        refresh,
      ]
    );

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}

      <NotificationPanel
        open={isOpen}
        onClose={close}
        notifications={notifications}
        isLoading={isLoading}
      />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(
    NotificationContext
  );

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}
