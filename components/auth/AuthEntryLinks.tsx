"use client";

import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

import { useLanguage } from "@/lib/i18n";

/*
|--------------------------------------------------------------------------
| Auth entry links
|--------------------------------------------------------------------------
|
| The Login / Signup button pair, shared by app/profile/page.tsx and
| MenuSheet.tsx — the two entry points into /login and /signup. A single
| implementation guarantees the two places look identical rather than two
| hand-tuned copies drifting apart.
|
| Uses the shared TranslationKey strings (authLoginButton / authSignupButton,
| lib/i18n.tsx), not components/auth/authText.ts — that file is scoped to
| the auth PAGES themselves; these buttons live on unrelated pages, so they
| follow the ordinary "every user-facing string goes in TRANSLATIONS" rule.
|
*/

type AuthEntryLinksProps = {
  className?: string;

  /*
   * Called after navigation is triggered, in addition to following the
   * link — MenuSheet passes its onClose here so the sheet closes the same
   * way its other nav links already do.
   */
  onNavigate?: () => void;
};

export default function AuthEntryLinks({
  className,
  onNavigate,
}: AuthEntryLinksProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`grid grid-cols-2 gap-3 ${className ?? ""}`}
    >
      <Link
        href="/login"
        onClick={onNavigate}
        className="
          flex h-12
          items-center justify-center gap-2
          rounded-2xl
          bg-blue-600
          px-3
          text-[14px] font-bold
          text-white
          shadow-[0_10px_24px_-12px_rgba(37,99,235,0.95)]
          outline-none
          transition-all duration-200

          hover:-translate-y-0.5
          hover:bg-blue-700

          focus-visible:ring-2
          focus-visible:ring-blue-600
          focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-slate-900

          active:translate-y-0

          dark:bg-blue-500
          dark:hover:bg-blue-600
          dark:focus-visible:ring-blue-500
        "
      >
        <LogIn
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        />

        <span className="truncate">
          {t("authLoginButton")}
        </span>
      </Link>

      <Link
        href="/signup"
        onClick={onNavigate}
        className="
          flex h-12
          items-center justify-center gap-2
          rounded-2xl
          border-2 border-blue-600
          bg-white
          px-3
          text-[14px] font-bold
          text-blue-600
          outline-none
          transition-all duration-200

          hover:-translate-y-0.5
          hover:bg-sky-50

          focus-visible:ring-2
          focus-visible:ring-blue-600
          focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-slate-900

          active:translate-y-0

          dark:border-blue-500
          dark:bg-transparent
          dark:text-blue-500
          dark:hover:bg-blue-500/10
          dark:focus-visible:ring-blue-500
        "
      >
        <UserPlus
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        />

        <span className="truncate">
          {t("authSignupButton")}
        </span>
      </Link>
    </div>
  );
}
