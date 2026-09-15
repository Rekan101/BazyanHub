"use client";

import { useState } from "react";
import { LogIn, LogOut } from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthEntryLinks from "@/components/auth/AuthEntryLinks";
import { isSyntheticEmail } from "@/lib/supabase/client";

/*
|--------------------------------------------------------------------------
| Auth status panel
|--------------------------------------------------------------------------
|
| The single block that swaps between signed-out and signed-in, shared by
| app/profile/page.tsx and components/layout/MenuSheet.tsx. It owns the
| wrapper as well as the contents, so the two surfaces differ only by a
| `variant` and never re-implement the state logic.
|
| Three states:
|   1. loading    — a skeleton, not a guess. The page is statically
|                   prerendered, so the server cannot know who is signed in;
|                   rendering "signed out" first would flash for anyone who
|                   is. Skipped entirely when Supabase is unconfigured.
|   2. signed out — the AuthEntryLinks button pair.
|   3. signed in  — identity + sign out.
|
*/

type Variant = "card" | "banner";

type AuthStatusPanelProps = {
  variant: Variant;
  className?: string;

  /* MenuSheet passes its onClose so any navigation dismisses the sheet. */
  onNavigate?: () => void;
};

/*
 * Never render the synthetic address used by username accounts
 * (<username>@users.bazyanhub.app) — it is an internal mapping detail and
 * reads as a broken email. Those accounts show @username instead.
 */
function getIdentity(
  user: ReturnType<typeof useAuth>["user"],
  profile: ReturnType<typeof useAuth>["profile"]
): { name: string; detail: string | null } {
  const metadata =
    (user?.user_metadata ?? {}) as {
      full_name?: string;
      name?: string;
    };

  const emailIsReal =
    user?.email &&
    !isSyntheticEmail(user.email);

  const name =
    profile?.full_name ??
    metadata.full_name ??
    metadata.name ??
    profile?.username ??
    (emailIsReal
      ? user!.email!.split("@")[0]
      : null) ??
    user?.phone ??
    "—";

  const detail = emailIsReal
    ? user!.email!
    : profile?.username
      ? `@${profile.username}`
      : (user?.phone ?? null);

  return { name, detail };
}

function getInitials(value: string): string {
  const parts = value
    .trim()
    .split(/\s+/)
    .slice(0, 2);

  const initials = parts
    .map((part) => part.charAt(0))
    .join("");

  return initials.toUpperCase() || "؟";
}

export default function AuthStatusPanel({
  variant,
  className,
  onNavigate,
}: AuthStatusPanelProps) {
  const { t } = useLanguage();

  const {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signOut,
  } = useAuth();

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  const isCard = variant === "card";

  /* ------------------------------------------------------------------
     WRAPPERS — card reads as a Profile section, banner as a CTA
  ------------------------------------------------------------------ */

  const wrapperClass = isCard
    ? `
        rounded-3xl
        border border-slate-200
        bg-white
        p-5
        text-center
        shadow-sm

        dark:border-slate-800
        dark:bg-slate-900
      `
    : `
        overflow-hidden
        rounded-2xl
        border border-blue-600/15
        bg-gradient-to-br
        from-sky-50
        to-blue-50/60
        p-4

        dark:border-blue-500/20
        dark:from-blue-500/[0.12]
        dark:to-sky-500/[0.06]
      `;

  const wrapper = (children: React.ReactNode) => (
    <div
      className={`${wrapperClass} ${className ?? ""}`}
    >
      {children}
    </div>
  );

  /* ------------------------------------------------------------------
     1. LOADING
  ------------------------------------------------------------------ */

  if (isLoading) {
    return wrapper(
      <div
        aria-busy="true"
        className={`flex animate-pulse flex-col gap-3 ${
          isCard ? "items-center" : ""
        }`}
      >
        <div
          className="
            h-4 w-32
            rounded-full
            bg-slate-200
            dark:bg-slate-800
          "
        />

        <div
          className="
            h-3 w-48 max-w-full
            rounded-full
            bg-slate-200/70
            dark:bg-slate-800/70
          "
        />

        <div
          className="
            mt-1 h-12 w-full
            rounded-2xl
            bg-slate-200/70
            dark:bg-slate-800/70
          "
        />
      </div>
    );
  }

  /* ------------------------------------------------------------------
     2. SIGNED OUT
  ------------------------------------------------------------------ */

  if (!isAuthenticated) {
    return wrapper(
      <>
        {isCard ? (
          <span
            aria-hidden="true"
            className="
              mx-auto flex h-12 w-12
              items-center justify-center
              rounded-2xl
              bg-blue-600/10
              text-blue-600

              dark:bg-blue-500/10
              dark:text-blue-500
            "
          >
            <LogIn className="h-6 w-6" />
          </span>
        ) : null}

        <p
          className={`
            font-bold
            text-slate-900
            dark:text-white
            ${isCard ? "mt-3 text-[15px]" : "text-[13.5px]"}
          `}
        >
          {t("authEntryTitle")}
        </p>

        <p
          className={`
            mt-1
            leading-relaxed
            text-slate-600
            dark:text-slate-400
            ${isCard ? "text-[13px]" : "text-[12px]"}
          `}
        >
          {t("authEntrySubtitle")}
        </p>

        <AuthEntryLinks
          className={isCard ? "mt-4" : "mt-3"}
          onNavigate={onNavigate}
        />
      </>
    );
  }

  /* ------------------------------------------------------------------
     3. SIGNED IN
  ------------------------------------------------------------------ */

  const { name, detail } = getIdentity(
    user,
    profile
  );

  const handleSignOut = async () => {
    setIsSigningOut(true);

    await signOut();

    setIsSigningOut(false);

    onNavigate?.();
  };

  return wrapper(
    <>
      <p
        className={`
          font-bold
          text-slate-600
          dark:text-slate-400
          ${isCard ? "text-[12.5px]" : "text-[12px]"}
        `}
      >
        {t("authAccountTitle")}
      </p>

      {/* IDENTITY ROW — start-aligned even inside the centered card,
          so a long email wraps predictably instead of centring ragged */}
      <div
        className={`
          mt-3 flex items-center gap-3
          rounded-2xl
          text-start
          ${
            isCard
              ? "bg-slate-50 p-3 dark:bg-slate-950/50"
              : ""
          }
        `}
      >
        <span
          aria-hidden="true"
          className="
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-full
            bg-blue-600
            text-[14px] font-extrabold
            text-white
            shadow-sm shadow-blue-600/25

            dark:bg-blue-500
            dark:shadow-blue-500/25
          "
        >
          {getInitials(name)}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className="
              truncate
              text-[14px] font-bold
              text-slate-900

              dark:text-white
            "
          >
            {name}
          </p>

          {detail ? (
            <p
              dir="ltr"
              className="
                mt-0.5 truncate
                text-[12px] font-medium
                text-slate-600
                text-start

                dark:text-slate-400
              "
            >
              {detail}
            </p>
          ) : null}
        </div>
      </div>

      {/* SIGN OUT — subtle destructive: rose outline, not a filled
          red button. Signing out is reversible, so it should not
          shout the way a delete action would. */}
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className={`
          flex h-12 w-full
          items-center justify-center gap-2
          rounded-2xl
          border
          border-rose-300
          bg-white
          px-4
          text-[14px] font-bold
          text-rose-600
          outline-none
          transition-all duration-200

          hover:border-rose-400
          hover:bg-rose-50

          focus-visible:ring-2
          focus-visible:ring-rose-500
          focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-slate-900

          active:translate-y-0

          disabled:cursor-not-allowed
          disabled:opacity-60

          dark:border-rose-500/40
          dark:bg-transparent
          dark:text-rose-400
          dark:hover:border-rose-500/60
          dark:hover:bg-rose-950/40

          ${isCard ? "mt-4" : "mt-3"}
        `}
      >
        <LogOut
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        />

        <span className="truncate">
          {isSigningOut
            ? t("authSigningOut")
            : t("authSignOutButton")}
        </span>
      </button>
    </>
  );
}
