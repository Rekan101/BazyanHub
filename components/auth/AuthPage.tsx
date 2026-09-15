"use client";

import { useLanguage } from "@/lib/i18n";
import AuthShell from "@/components/auth/AuthShell";
import AuthForm from "@/components/auth/AuthForm";
import { getAuthText } from "@/components/auth/authText";

/*
|--------------------------------------------------------------------------
| Auth page
|--------------------------------------------------------------------------
|
| The client boundary for /login and /signup. Both route files are server
| components that do nothing but set metadata and render this — which keeps
| them statically prerenderable while the interactive form lives here.
|
| The copy is selected here rather than inside AuthShell so the shell stays a
| dumb presentational wrapper.
|
*/

type AuthPageProps = {
  mode: "login" | "signup";
};

export default function AuthPage({
  mode,
}: AuthPageProps) {
  const { language } = useLanguage();

  const text = getAuthText(language);

  const isSignup = mode === "signup";

  return (
    <AuthShell
      title={
        isSignup
          ? text.signupTitle
          : text.loginTitle
      }
      subtitle={
        isSignup
          ? text.signupSubtitle
          : text.loginSubtitle
      }
      footerPrompt={
        isSignup
          ? text.hasAccount
          : text.noAccount
      }
      footerLinkLabel={
        isSignup
          ? text.goLogin
          : text.goSignup
      }
      footerHref={
        isSignup ? "/login" : "/signup"
      }
    >
      <AuthForm mode={mode} />
    </AuthShell>
  );
}
