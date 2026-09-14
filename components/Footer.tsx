"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Mountain,
  Star,
} from "lucide-react";

import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  ViberIcon,
  WhatsAppIcon,
} from "@/components/icons/SocialIcons";

const QUICK_LINKS = [
  { label: "سەرەتا", href: "/" },
  { label: "خزمەتگوزارییەکان", href: "/services" },
  { label: "دەربارەی بازیان", href: "/about" },
  { label: "دڵخوازەکان", href: "/favorites" },
  { label: "پرسیارە باوەکان", href: "/profile" },
];

export default function Footer() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = () => {
    const trimmedFeedback = feedback.trim();

    if (!rating && !trimmedFeedback) {
      return;
    }

    const feedbackData = {
      rating,
      feedback: trimmedFeedback,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingFeedback = localStorage.getItem(
        "bazian-feedback"
      );

      const feedbackList: Array<{
        rating: number;
        feedback: string;
        createdAt: string;
      }> = existingFeedback
        ? JSON.parse(existingFeedback)
        : [];

      feedbackList.push(feedbackData);

      localStorage.setItem(
        "bazian-feedback",
        JSON.stringify(feedbackList)
      );
    } catch {
      // Ignore localStorage errors.
    }

    setFeedback("");
    setRating(0);
    setSubmitted(true);

    window.setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <footer
      dir="rtl"
      className="bg-[#F9FAFB] dark:bg-[#0B1220]"
    >
      {/* Info strip */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contact Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-[#111827]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500" />

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Phone className="h-5 w-5" />
              </div>

              <h3 className="text-base font-extrabold tracking-tight text-[#1F2937] dark:text-white">
                ڕاستەوخۆ پەیوەندی بە تیمی بازیان هەب بکە :
              </h3>

              <div className="mt-4 w-full space-y-2.5">
                <a
                  href="tel:+9647757997904"
                  dir="ltr"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#374151] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600/40 dark:hover:border-blue-500/40 hover:bg-blue-600/5 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 dark:border-slate-800 dark:bg-white/[0.03] dark:text-gray-200"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+964 775 799 7904</span>
                </a>

                <a
                  href="mailto:info@bazyanhub.com"
                  dir="ltr"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#374151] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600/40 dark:hover:border-blue-500/40 hover:bg-blue-600/5 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-500 dark:border-slate-800 dark:bg-white/[0.03] dark:text-gray-200"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>info@bazyanhub.com</span>
                </a>
              </div>

              <div className="mt-6 flex w-full flex-row flex-wrap items-center justify-center gap-4">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە فەیسبووک"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:shadow-lg hover:shadow-[#1877F2]/20 dark:border-slate-800 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  <FacebookIcon />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە ئینستاگرام"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white hover:shadow-lg hover:shadow-[#E4405F]/20 dark:border-slate-800 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  <InstagramIcon />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە تیکتۆک"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-black hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/20 dark:border-slate-800 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-black"
                >
                  <TikTokIcon />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە واتسەپ"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white hover:shadow-lg hover:shadow-[#25D366]/20 dark:border-slate-800 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  <WhatsAppIcon />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە ڤایبەر"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#7360F2] hover:bg-[#7360F2] hover:text-white hover:shadow-lg hover:shadow-[#7360F2]/20 dark:border-slate-800 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  <ViberIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-[#111827]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500">
              <Clock3 className="h-5 w-5" />
            </div>

            <h3 className="mb-2 text-sm font-bold text-[#1F2937] dark:text-white">
              کاتەکانی کارکردن
            </h3>

            <p className="text-sm text-[#4B5563] dark:text-gray-400">
              هەموو ڕۆژێک: 8:00 پێش نیوەڕۆ تا 12:00 شەو
            </p>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-[#111827]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500">
              <MapPin className="h-5 w-5" />
            </div>

            <h3 className="mb-2 text-sm font-bold text-[#1F2937] dark:text-white">
              ناونیشان
            </h3>

            <p className="text-sm leading-relaxed text-[#4B5563] dark:text-gray-400">
              بازیان، سلێمانی، هەرێمی کوردستان، عێراق
            </p>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] shadow-[0_10px_35px_rgba(15,23,42,0.04)] dark:border-slate-800">
            <iframe
              title="نەخشەی شوێنی بازیان"
              src="https://maps.google.com/maps?q=Bazyan,Sulaymaniyah,Iraq&z=11&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[168px] w-full border-0"
            />
          </div>
        </div>
      </div>

      {/* Dark bottom bar */}
      <div className="bg-blue-900 dark:bg-blue-950 text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link
                href="/"
                className="flex items-center gap-2.5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Mountain
                    className="h-5 w-5"
                    strokeWidth={2.25}
                  />
                </span>

                <span className="flex flex-col leading-tight">
                  <span className="text-base font-bold">
                    بازیان هۆب
                  </span>

                  <span className="text-[11px] text-white/70">
                    نەخشەی گەڕانی بازیان
                  </span>
                </span>
              </Link>

              <p className="mt-4 text-sm leading-relaxed text-white/70">
                پلاتفۆرمی سەرەکی دیجیتاڵی بازیان بۆ گەیشتن بە خزمەتگوزاری،
                بازرگانی و گەشتیاری.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">
                لینکە خێراکان
              </h3>

              <ul className="flex flex-col gap-2.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal + Feedback */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">
                یاسا و تایبەتمەندی
              </h3>

              <Link
                href="/legal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-bold text-white transition-colors hover:text-gray-200"
              >
                مەرجەکانی بەکارهێنان و سیاسەتی تایبەتمەندی
              </Link>

              <div className="mt-7 border-t border-white/10 pt-6">
                <h3 className="text-base font-bold text-white">
                  فییدباک و ڕاپۆرت
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                  هەر ڕا و پێشنیار یان کێشەیەکت هەیە، لێرە بە شێوەیەکی
                  کورت و بێ ناو بنووسە.
                </p>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-white/90">
                    هەڵسەنگاندنی وێبسایت
                  </p>

                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setRating(value)
                        }
                        aria-label={`${value} لە 5`}
                        className="rounded-md p-1 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            value <= rating
                              ? "fill-[#FACC15] text-[#FACC15]"
                              : "text-white/40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={feedback}
                  onChange={(event) =>
                    setFeedback(event.target.value)
                  }
                  rows={3}
                  placeholder="فییدباک یان ڕاپۆرتەکەت لێرە بنووسە..."
                  className="mt-3 w-full resize-none rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/45 focus:border-white/30 focus:ring-2 focus:ring-white/10"
                />

                <button
                  type="button"
                  onClick={submitFeedback}
                  disabled={
                    !rating && !feedback.trim()
                  }
                  className="mt-3 w-full rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-900 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ناردنی فییدباک
                </button>

                {submitted && (
                  <p className="mt-2 text-xs font-semibold text-sky-200">
                    سوپاس بۆ فییدباکەکەت 🌿
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
            © 2026 بازیان هەب. هەموو مافەکان پارێزراون.
          </div>
        </div>
      </div>
    </footer>
  );
}