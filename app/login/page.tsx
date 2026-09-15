import type { Metadata } from "next";

import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "چوونەژوورەوە | BazianHub",
  description:
    "چوونەژوورەوە بۆ هەژماری بازیان هەب",
};

/*
 * Static: the form is entirely client-side (it talks to Supabase from the
 * browser), so there is nothing to render per-request. Keeping it that way
 * means no cookies() anywhere in this tree.
 */
export default function LoginPage() {
  return <AuthPage mode="login" />;
}
