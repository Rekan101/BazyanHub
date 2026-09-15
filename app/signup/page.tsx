import type { Metadata } from "next";

import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "خۆتۆمارکردن | BazianHub",
  description:
    "خۆتۆمارکردن و دروستکردنی هەژمارێکی نوێ لە بازیان هەب",
};

/*
 * Static, same as /login — see the note there.
 */
export default function SignupPage() {
  return <AuthPage mode="signup" />;
}
