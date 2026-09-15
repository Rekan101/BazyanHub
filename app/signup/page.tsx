import type { Metadata } from "next";

import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "دروستکردنی هەژمار | BazianHub",
  description:
    "دروستکردنی هەژماری نوێ لە بازیان هەب",
};

/*
 * Static, same as /login — see the note there.
 */
export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
