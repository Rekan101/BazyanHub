import type { Metadata, Viewport } from "next";

import "./globals.css";

import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import { vazirmatn } from "@/lib/fonts";

import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { NotificationProvider } from "@/components/layout/NotificationProvider";
import { getNotifications } from "@/lib/data/notifications.server";

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
 * Async so notifications can be fetched for the single app-wide panel.
 *
 * Trade-off worth knowing: once Supabase is configured this read calls
 * cookies(), which opts every route into dynamic rendering. With no
 * credentials present getSupabaseServerClient() returns before touching
 * cookies(), so the static pages stay static. Moving this fetch client-side
 * would restore static rendering at the cost of a first-paint flash on the
 * unread badge.
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = await getNotifications();

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
            <NotificationProvider
              notifications={notifications}
            >
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
