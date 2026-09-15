import type { Metadata, Viewport } from "next";

import "./globals.css";

import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import { vazirmatn } from "@/lib/fonts";

import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { NotificationProvider } from "@/components/layout/NotificationProvider";

export const metadata: Metadata = {
  title: "BazianHub",
  description: "پلاتفۆرمی سەرەکی دیجیتاڵی بازیان",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

/*
 * Deliberately NOT async and deliberately fetch-free.
 *
 * Any server read here that touches cookies() — notifications being the
 * obvious candidate — opts every route in the app into dynamic rendering.
 * Keeping this layout static is what lets /, /about, /news, /profile,
 * /favorites and /legal stay prerendered (`○` in the build output), which
 * is the point of a PWA shell.
 *
 * Notifications are therefore fetched in the browser by
 * NotificationProvider. That also fixes the language problem: the user's
 * chosen language lives in localStorage, so only the client can pick the
 * right title_/body_ column.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ckb"
      dir="rtl"
      suppressHydrationWarning
      className={`${vazirmatn.variable} scroll-smooth`}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
            {/* =============================================
                DESKTOP BACKDROP
            ============================================== */}

            <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
              {/* ===========================================
                  APP SHELL — PHONE FRAME ON DESKTOP
              =========================================== */}

              <div
                className="
                  relative
                  mx-auto flex
                  min-h-screen w-full max-w-md
                  flex-col
                  bg-slate-50
                  text-slate-900

                  dark:bg-slate-950
                  dark:text-slate-100

                  md:border-x
                  md:border-slate-200
                  md:shadow-[0_0_60px_rgba(15,23,42,0.14)]

                  dark:md:border-slate-800
                  dark:md:shadow-[0_0_60px_rgba(0,0,0,0.55)]
                "
              >
                <AppHeader />

                <main className="flex-1 pb-24 pt-[73px]">
                  {children}
                </main>

                <BottomNav />
              </div>
            </div>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
