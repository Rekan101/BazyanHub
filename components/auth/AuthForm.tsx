"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  AtSign,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  Phone,
  ShieldCheck,
  TriangleAlert,
  User,
  UserRound,
} from "lucide-react";

import { useLanguage } from "@/lib/i18n";
import { FacebookIcon } from "@/components/icons/SocialIcons";
import {
  getAuthText,
  type AuthTextBlock,
} from "@/components/auth/authText";
import {
  isSupabaseConfigured,
  isValidPhone,
  isValidUsername,
  signInWithEmail,
  signInWithFacebook,
  signInWithPhone,
  signInWithUsername,
  signUpWithEmail,
  signUpWithPhone,
  signUpWithUsername,
  verifyPhoneOtp,
} from "@/lib/supabase/client";

/*
|--------------------------------------------------------------------------
| Auth form
|--------------------------------------------------------------------------
|
| One component serving both /login and /signup, switched by `mode`. The
| three password-based methods share almost all of their markup and
| validation, so splitting them into separate components would mean three
| copies of the same submit handler.
|
| All four agreed methods are here:
|   1. Email    + password
|   2. Username + password  (synthetic-email mapping, handled in lib/supabase/client.ts)
|   3. Phone    + password  (UI complete; inert until SMS is configured)
|   4. Facebook OAuth
|
| Every call goes through lib/supabase/client.ts, which resolves rather than
| throws — so there is no try/catch here, just an `error` field to read.
|
*/

type AuthMode = "login" | "signup";

type Method = "email" | "username" | "phone";

type AuthFormProps = {
  mode: AuthMode;
};

const METHODS: Array<{
  id: Method;
  labelKey: keyof AuthTextBlock;
  icon: typeof AtSign;
}> = [
  {
    id: "email",
    labelKey: "methodEmail",
    icon: AtSign,
  },
  {
    id: "username",
    labelKey: "methodUsername",
    icon: UserRound,
  },
  {
    id: "phone",
    labelKey: "methodPhone",
    icon: Phone,
  },
];

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

  const [method, setMethod] =
    useState<Method>("email");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
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

  /*
   * Phone signup can return without a session when Supabase is configured
   * to confirm the number by SMS. That switches the card into OTP mode
   * rather than navigating away.
   */
  const [awaitingOtp, setAwaitingOtp] =
    useState(false);

  const [otp, setOtp] = useState("");

  /* ------------------------------------------------------------------
     VALIDATION
  ------------------------------------------------------------------ */

  function validate(): string | null {
    if (!password.trim()) {
      return text.errorRequired;
    }

    if (
      method === "email" &&
      !email.trim()
    ) {
      return text.errorRequired;
    }

    if (method === "username") {
      if (!username.trim()) {
        return text.errorRequired;
      }

      if (!isValidUsername(username)) {
        return text.errorUsernameFormat;
      }
    }

    if (method === "phone") {
      if (!phone.trim()) {
        return text.errorRequired;
      }

      if (!isValidPhone(phone)) {
        return text.errorPhoneFormat;
      }
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

    const result = await runAuthCall();

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error.message);
      return;
    }

    /*
     * A signup that returns no session means Supabase wants a confirmation
     * step — an SMS code for phone, or an email link otherwise.
     */
    if (isSignup && !result.session) {
      if (method === "phone") {
        setAwaitingOtp(true);
        return;
      }

      setSuccessMessage(
        text.signupSuccessBody
      );

      return;
    }

    router.push("/profile");
    router.refresh();
  }

  async function runAuthCall() {
    if (method === "email") {
      return isSignup
        ? signUpWithEmail(email, password, {
            fullName: fullName || undefined,
          })
        : signInWithEmail(email, password);
    }

    if (method === "username") {
      return isSignup
        ? signUpWithUsername(
            username,
            password,
            {
              fullName: fullName || undefined,
            }
          )
        : signInWithUsername(
            username,
            password
          );
    }

    return isSignup
      ? signUpWithPhone(phone, password, {
          fullName: fullName || undefined,
        })
      : signInWithPhone(phone, password);
  }

  async function handleVerifyOtp(
    event: FormEvent
  ) {
    event.preventDefault();

    setErrorMessage(null);

    if (otp.trim().length < 4) {
      setErrorMessage(text.errorRequired);
      return;
    }

    setIsSubmitting(true);

    const result = await verifyPhoneOtp(
      phone,
      otp
    );

    setIsSubmitting(false);

    if (result.error) {
      setErrorMessage(result.error.message);
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  async function handleFacebook() {
    setErrorMessage(null);
    setIsSubmitting(true);

    const { error } =
      await signInWithFacebook(
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined
      );

    /*
     * On success the browser is redirected away, so reaching this line at
     * all effectively means it failed.
     */
    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
    }
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
     OTP STEP
  ------------------------------------------------------------------ */

  if (awaitingOtp) {
    return (
      <form
        onSubmit={handleVerifyOtp}
        dir={direction}
        className="flex flex-col gap-4"
      >
        <div className="text-center">
          <span
            className="
              mx-auto mb-3 flex
              h-12 w-12
              items-center justify-center
              rounded-2xl
              bg-blue-600/10
              text-blue-600

              dark:bg-blue-500/10
              dark:text-blue-500
            "
          >
            <ShieldCheck className="h-6 w-6" />
          </span>

          <p
            className="
              text-[15px] font-extrabold
              text-slate-900
              dark:text-white
            "
          >
            {text.otpTitle}
          </p>

          <p
            className="
              mt-1
              text-[12.5px]
              text-slate-600
              dark:text-slate-400
            "
          >
            {text.otpSubtitle}
          </p>
        </div>

        <div>
          <label
            htmlFor="auth-otp"
            className={labelClass}
          >
            {text.otpLabel}
          </label>

          <div className={fieldWrapClass}>
            <ShieldCheck
              className={fieldIconClass}
              aria-hidden="true"
            />

            <input
              id="auth-otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              dir="ltr"
              maxLength={8}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              placeholder={text.otpPlaceholder}
              className={`${inputClass} tracking-[0.4em]`}
            />
          </div>
        </div>

        {errorMessage ? (
          <ErrorBanner
            message={errorMessage}
          />
        ) : null}

        <SubmitButton
          isSubmitting={isSubmitting}
          label={text.otpButton}
          loadingLabel={text.loadingButton}
        />

        <button
          type="button"
          onClick={() => {
            setAwaitingOtp(false);
            setOtp("");
            setErrorMessage(null);
          }}
          className="
            mx-auto
            text-[12.5px] font-semibold
            text-slate-500
            outline-none
            transition-colors

            hover:text-blue-600
            focus-visible:underline

            dark:text-slate-400
            dark:hover:text-blue-500
          "
        >
          {text.otpBack}
        </button>
      </form>
    );
  }

  /* ------------------------------------------------------------------
     MAIN FORM
  ------------------------------------------------------------------ */

  return (
    <form
      onSubmit={handleSubmit}
      dir={direction}
      className="flex flex-col gap-4"
    >
      {/* ===================================================
          METHOD SWITCHER — segmented control
      =================================================== */}

      <div
        role="tablist"
        aria-label={text.methodEmail}
        className="
          grid grid-cols-3 gap-1
          rounded-2xl
          bg-slate-100
          p-1

          dark:bg-slate-950/60
        "
      >
        {METHODS.map((item) => {
          const isActive =
            method === item.id;

          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setMethod(item.id);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
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
            >
              <Icon
                className="h-4 w-4 shrink-0"
                aria-hidden="true"
              />

              <span className="truncate">
                {text[item.labelKey]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ===================================================
          NOT-CONFIGURED NOTICE

          Shown instead of failing silently when there are no
          Supabase credentials — which is the current state of
          this repo.
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
          PHONE NOTE — SMS provider not wired yet
      =================================================== */}

      {method === "phone" ? (
        <div
          className="
            flex gap-2.5
            rounded-2xl
            border border-sky-200
            bg-sky-50
            p-3

            dark:border-sky-500/25
            dark:bg-sky-500/10
          "
        >
          <Info
            className="
              mt-0.5 h-4 w-4 shrink-0
              text-blue-600
              dark:text-blue-500
            "
            aria-hidden="true"
          />

          <p
            className="
              min-w-0
              text-[11.5px] leading-relaxed
              text-slate-700

              dark:text-slate-300
            "
          >
            {text.phoneNotReadyNote}
          </p>
        </div>
      ) : null}

      {/* ===================================================
          IDENTIFIER FIELD
      =================================================== */}

      {method === "email" ? (
        <div>
          <label
            htmlFor="auth-email"
            className={labelClass}
          >
            {text.emailLabel}
          </label>

          <div className={fieldWrapClass}>
            <AtSign
              className={fieldIconClass}
              aria-hidden="true"
            />

            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              dir="ltr"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder={
                text.emailPlaceholder
              }
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

      {method === "username" ? (
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
      ) : null}

      {method === "phone" ? (
        <div>
          <label
            htmlFor="auth-phone"
            className={labelClass}
          >
            {text.phoneLabel}
          </label>

          <div className={fieldWrapClass}>
            <Phone
              className={fieldIconClass}
              aria-hidden="true"
            />

            <input
              id="auth-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              dir="ltr"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder={
                text.phonePlaceholder
              }
              className={inputClass}
            />
          </div>

          <p className={hintClass}>
            {text.phoneHint}
          </p>
        </div>
      ) : null}

      {/* ===================================================
          FULL NAME — signup only, optional
      =================================================== */}

      {isSignup ? (
        <div>
          <label
            htmlFor="auth-fullname"
            className={labelClass}
          >
            {text.fullNameLabel}
          </label>

          <div className={fieldWrapClass}>
            <User
              className={fieldIconClass}
              aria-hidden="true"
            />

            <input
              id="auth-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder={
                text.fullNamePlaceholder
              }
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

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

      {/* ===================================================
          DIVIDER
      =================================================== */}

      <div
        className="flex items-center gap-3 py-0.5"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

        <span
          className="
            text-[11.5px] font-bold uppercase
            tracking-wider
            text-slate-400

            dark:text-slate-600
          "
        >
          {text.orDivider}
        </span>

        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* ===================================================
          FACEBOOK OAUTH

          #1877F2 is Facebook's own brand blue, used verbatim
          rather than mapped to the palette — the same rule the
          profile page's social buttons follow.
      =================================================== */}

      <button
        type="button"
        onClick={handleFacebook}
        disabled={isSubmitting}
        className="
          flex h-12 w-full
          items-center justify-center gap-2.5
          rounded-2xl
          bg-[#1877F2]
          px-4
          text-[14px] font-bold
          text-white
          shadow-[0_10px_24px_-12px_rgba(24,119,242,0.9)]
          outline-none
          transition-all duration-200

          hover:-translate-y-0.5
          hover:bg-[#1568DB]

          focus-visible:ring-2
          focus-visible:ring-[#1877F2]
          focus-visible:ring-offset-2
          dark:focus-visible:ring-offset-slate-900

          active:translate-y-0

          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:hover:translate-y-0
        "
      >
        <FacebookIcon className="h-5 w-5" />
        {text.facebookButton}
      </button>
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
