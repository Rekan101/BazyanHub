"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  TriangleAlert,
  UserRound,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { getAuthText } from "@/components/auth/authText";
import {
  isSupabaseConfigured,
  isValidUsername,
  signInWithUsername,
  signUpWithUsername,
} from "@/lib/supabase/client";

/*
|--------------------------------------------------------------------------
| Auth form — username + password only
|--------------------------------------------------------------------------
|
| One component serving both /login and /signup, switched by `mode`.
|
| THERE IS NO EMAIL FIELD, BY DESIGN. Supabase Auth requires an email, so
| lib/supabase/client.ts maps the username to a synthetic address
| (<username>@users.bazyanhub.app) that is never shown to the user and never
| receives mail. That is what keeps signups off Supabase's email pipeline and
| clear of its rate limits.
|
| Consequences, accepted deliberately:
|   * "Confirm email" MUST be OFF in the Supabase dashboard, or every signup
|     returns a session-less user and nobody can ever sign in.
|   * There is no password reset. No real address exists to send one to.
|
| Every call goes through lib/supabase/client.ts, which resolves rather than
| throws — so there is no try/catch here, just `error` and `code` to read.
|
*/

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

const MIN_PASSWORD_LENGTH = 6;

export default function AuthForm({
  mode,
}: AuthFormProps) {
  const { language, direction } =
    useLanguage();

  const text = getAuthText(language);

  const router = useRouter();

  const isSignup = mode === "signup";

  const configured = useMemo(
    () => isSupabaseConfigured(),
    []
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  /* ------------------------------------------------------------------
     VALIDATION

     Runs BEFORE any network call, so a malformed username never reaches
     Supabase — and never reaches the profiles_username_format CHECK
     constraint, which would come back as a raw Postgres error.
  ------------------------------------------------------------------ */

  function validate(): string | null {
    if (!username.trim() || !password.trim()) {
      return text.errorRequired;
    }

    if (!isValidUsername(username)) {
      return text.errorUsernameFormat;
    }

    /*
     * Length and confirmation are only enforced on signup. Checking them at
     * login would leak the password policy and, worse, reject a legitimate
     * older password that predates the rule.
     */
    if (isSignup) {
      if (
        password.length < MIN_PASSWORD_LENGTH
      ) {
        return text.errorPasswordShort;
      }

      if (password !== confirmPassword) {
        return text.errorPasswordMismatch;
      }
    }

    return null;
  }

  /* ------------------------------------------------------------------
     SUBMIT
  ------------------------------------------------------------------ */

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    const validationError = validate();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);

    const result = isSignup
      ? await signUpWithUsername(
          username,
          password
        )
      : await signInWithUsername(
          username,
          password
        );

    setIsSubmitting(false);

    /*
     * `code` is set by the client helpers so the message shown here is
     * localised copy, not Supabase's English error text.
     */
    if (result.code === "username_taken") {
      setErrorMessage(text.errorUsernameTaken);
      return;
    }

    if (
      result.code === "invalid_credentials"
    ) {
      setErrorMessage(
        text.errorInvalidCredentials
      );
      return;
    }

    if (result.error) {
      setErrorMessage(result.error.message);
      return;
    }

    /*
     * A signup with no session means "Confirm email" is still ON in the
     * dashboard — the synthetic address can never be confirmed, so say the
     * account exists rather than pretending the user is signed in.
     */
    if (isSignup && !result.session) {
      setSuccessMessage(
        text.signupSuccessBody
      );

      return;
    }

    router.push("/profile");
    router.refresh();
  }

  /* ------------------------------------------------------------------
     SHARED CLASSES — mirrors the Profile page's card/row vocabulary
  ------------------------------------------------------------------ */

  const fieldWrapClass = `
    group relative flex items-center gap-2.5
    rounded-2xl
    border border-slate-200
    bg-slate-50
    px-3.5
    transition-all duration-200

    focus-within:border-blue-600
    focus-within:bg-white
    focus-within:ring-4
    focus-within:ring-blue-600/10

    dark:border-slate-800
    dark:bg-slate-950/60
    dark:focus-within:border-blue-500
    dark:focus-within:bg-slate-950
    dark:focus-within:ring-blue-500/15
  `;

  const inputClass = `
    h-12 w-full min-w-0
    border-0 bg-transparent
    text-[15px] font-medium
    text-slate-900
    outline-none

    placeholder:font-normal
    placeholder:text-slate-400

    dark:text-white
    dark:placeholder:text-slate-500
  `;

  const fieldIconClass = `
    h-[18px] w-[18px] shrink-0
    text-slate-400
    transition-colors

    group-focus-within:text-blue-600
    dark:group-focus-within:text-blue-500
  `;

  const labelClass = `
    mb-1.5 block px-1
    text-[12.5px] font-bold
    text-slate-700

    dark:text-slate-300
  `;

  const hintClass = `
    mt-1.5 px-1
    text-[11.5px] leading-relaxed
    text-slate-500

    dark:text-slate-500
  `;

  /* ------------------------------------------------------------------
     FORM
  ------------------------------------------------------------------ */

  return (
    <form
      onSubmit={handleSubmit}
      dir={direction}
      className="flex flex-col gap-4"
    >
      {/* ===================================================
          NOT-CONFIGURED NOTICE

          Shown instead of failing silently when there are no
          Supabase credentials.
      =================================================== */}

      {!configured ? (
        <div
          className="
            flex gap-2.5
            rounded-2xl
            border border-amber-300/70
            bg-amber-50
            p-3

            dark:border-amber-500/30
            dark:bg-amber-500/10
          "
        >
          <TriangleAlert
            className="
              mt-0.5 h-4 w-4 shrink-0
              text-amber-600
              dark:text-amber-400
            "
            aria-hidden="true"
          />

          <div className="min-w-0">
            <p
              className="
                text-[12.5px] font-bold
                text-amber-900
                dark:text-amber-200
              "
            >
              {text.notConfiguredTitle}
            </p>

            <p
              className="
                mt-0.5
                text-[11.5px] leading-relaxed
                text-amber-800/90
                dark:text-amber-200/70
              "
            >
              {text.notConfiguredBody}
            </p>
          </div>
        </div>
      ) : null}

      {/* ===================================================
          USERNAME
      =================================================== */}

      <div>
        <label
          htmlFor="auth-username"
          className={labelClass}
        >
          {text.usernameLabel}
        </label>

        <div className={fieldWrapClass}>
          <UserRound
            className={fieldIconClass}
            aria-hidden="true"
          />

          <input
            id="auth-username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            dir="ltr"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value.toLowerCase()
              )
            }
            placeholder={
              text.usernamePlaceholder
            }
            className={inputClass}
          />
        </div>

        {isSignup ? (
          <p className={hintClass}>
            {text.usernameHint}
          </p>
        ) : null}
      </div>

      {/* ===================================================
          PASSWORD
      =================================================== */}

      <div>
        <label
          htmlFor="auth-password"
          className={labelClass}
        >
          {text.passwordLabel}
        </label>

        <div className={fieldWrapClass}>
          <Lock
            className={fieldIconClass}
            aria-hidden="true"
          />

          <input
            id="auth-password"
            name="password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            autoComplete={
              isSignup
                ? "new-password"
                : "current-password"
            }
            dir="ltr"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder={
              text.passwordPlaceholder
            }
            className={inputClass}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (value) => !value
              )
            }
            aria-label={
              showPassword
                ? text.hidePassword
                : text.showPassword
            }
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-lg
              text-slate-400
              outline-none
              transition-colors

              hover:text-slate-700

              focus-visible:ring-2
              focus-visible:ring-blue-600

              dark:hover:text-slate-200
              dark:focus-visible:ring-blue-500
            "
          >
            {showPassword ? (
              <EyeOff className="h-[18px] w-[18px]" />
            ) : (
              <Eye className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>

      {/* ===================================================
          CONFIRM PASSWORD — signup only
      =================================================== */}

      {isSignup ? (
        <div>
          <label
            htmlFor="auth-confirm"
            className={labelClass}
          >
            {text.confirmPasswordLabel}
          </label>

          <div className={fieldWrapClass}>
            <Lock
              className={fieldIconClass}
              aria-hidden="true"
            />

            <input
              id="auth-confirm"
              name="confirmPassword"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              dir="ltr"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder={
                text.passwordPlaceholder
              }
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

      {/* ===================================================
          MESSAGES
      =================================================== */}

      {errorMessage ? (
        <ErrorBanner message={errorMessage} />
      ) : null}

      {successMessage ? (
        <div
          className="
            flex gap-2.5
            rounded-2xl
            border border-green-300/70
            bg-green-50
            p-3

            dark:border-green-500/30
            dark:bg-green-950/40
          "
        >
          <ShieldCheck
            className="
              mt-0.5 h-4 w-4 shrink-0
              text-green-600
              dark:text-green-400
            "
            aria-hidden="true"
          />

          <p
            className="
              min-w-0
              text-[12.5px] font-semibold leading-relaxed
              text-green-800

              dark:text-green-300
            "
          >
            {successMessage}
          </p>
        </div>
      ) : null}

      {/* ===================================================
          SUBMIT
      =================================================== */}

      <SubmitButton
        isSubmitting={isSubmitting}
        label={
          isSignup
            ? text.signupButton
            : text.loginButton
        }
        loadingLabel={text.loadingButton}
      />
    </form>
  );
}

/* ==========================================================================
   SHARED PIECES
   ========================================================================== */

function SubmitButton({
  isSubmitting,
  label,
  loadingLabel,
}: {
  isSubmitting: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="
        flex h-12 w-full
        items-center justify-center gap-2
        rounded-2xl
        bg-blue-600
        px-4
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

        disabled:cursor-not-allowed
        disabled:opacity-60
        disabled:hover:translate-y-0

        dark:bg-blue-500
        dark:hover:bg-blue-600
        dark:focus-visible:ring-blue-500
      "
    >
      {isSubmitting ? (
        <>
          <Loader2
            className="h-4 w-4 animate-spin"
            aria-hidden="true"
          />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

/*
 * Inline, in-page error — deliberately not window.alert(). role="alert" makes
 * a screen reader announce it, it inherits RTL and dark mode from the page,
 * and unlike a native dialog the browser cannot suppress it after repeated
 * failures ("prevent this page from creating additional dialogs").
 */
function ErrorBanner({
  message,
}: {
  message: string;
}) {
  return (
    <div
      role="alert"
      className="
        flex gap-2.5
        rounded-2xl
        border border-rose-300/70
        bg-rose-50
        p-3

        dark:border-rose-500/30
        dark:bg-rose-950/40
      "
    >
      <TriangleAlert
        className="
          mt-0.5 h-4 w-4 shrink-0
          text-rose-600
          dark:text-rose-400
        "
        aria-hidden="true"
      />

      <p
        className="
          min-w-0
          text-[12.5px] font-semibold leading-relaxed
          text-rose-800

          dark:text-rose-300
        "
      >
        {message}
      </p>
    </div>
  );
}
