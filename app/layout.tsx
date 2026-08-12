import type { Metadata } from "next";

import "./globals.css";

import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import { vazirmatn } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "BazianHub",
  description: "پلاتفۆرمی سەرەکی دیجیتاڵی بازیان",
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
      <body>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}