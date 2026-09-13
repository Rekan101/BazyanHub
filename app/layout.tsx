import type { Metadata, Viewport } from "next";

import "./globals.css";

import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import { vazirmatn } from "@/lib/fonts";

import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";

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
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
