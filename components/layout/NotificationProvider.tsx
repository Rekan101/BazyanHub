"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import NotificationPanel from "@/components/layout/NotificationPanel";
import type { AppNotification } from "@/lib/data/notifications";

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
*/

interface NotificationContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const NotificationContext =
  createContext<NotificationContextValue | null>(
    null
  );

export function NotificationProvider({
  children,
  notifications = [],
}: {
  children: ReactNode;

  /*
   * Fetched on the server in app/layout.tsx and threaded through to the
   * single panel instance. Defaults to empty so the provider still works in
   * isolation — the panel then shows its built-in welcome item.
   */
  notifications?: AppNotification[];
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  const pathname = usePathname();

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

  /* ---------------------------------------------------------
     Close when the route changes
  --------------------------------------------------------- */

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const value =
    useMemo<NotificationContextValue>(
      () => ({
        isOpen,
        open,
        close,
        toggle,
      }),
      [isOpen, open, close, toggle]
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
