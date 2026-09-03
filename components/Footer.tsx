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

const QUICK_LINKS = [
  { label: "سەرەتا", href: "/" },
  { label: "خزمەتگوزارییەکان", href: "/services" },
  { label: "دەربارەی بازیان", href: "/#about" },
  { label: "دڵخوازەکان", href: "/favorites" },
  { label: "پرسیارە باوەکان", href: "/#contact" },
];

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M13.5 22v-8h2.75l.5-3h-3.25V9.1c0-.87.29-1.46 1.55-1.46h1.65V4.96c-.29-.04-1.28-.13-2.43-.13-2.4 0-4.05 1.47-4.05 4.17V11H7.5v3h2.72v8h3.28Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
      />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.3"
        cy="6.7"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M15.2 3c.2 1.7 1.2 3.1 2.8 3.8.7.3 1.4.5 2.2.5v3.1a8.5 8.5 0 0 1-2.2-.3 8.1 8.1 0 0 1-2.8-1.4v6.1c0 3.4-2.7 6.2-6.2 6.2A6.2 6.2 0 0 1 2.8 15c0-3.4 2.7-6.2 6.2-6.2.3 0 .6 0 .9.1V12a3.2 3.2 0 0 0-.9-.1A3.1 3.1 0 1 0 12.1 15V3h3.1Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 17.9c-1.5 0-2.9-.4-4.1-1.2l-.3-.2-3.1.8.8-3-.2-.3A7.9 7.9 0 1 1 12 19.9Zm4.3-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.3-1.3-1.5-.1-.2 0-.3.1-.4l.4-.5c.1-.1.1-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.1-.4-.2Z" />
    </svg>
  );
}

function ViberIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M17.7 2.7C14.8.8 8.7.7 5.8 2.5 3.2 4.1 2.5 7.3 2.5 11c0 3.8.7 6.9 3.2 8.5l.9.5-.6 2.8c-.1.5.4.8.8.5l3.2-1.9c1.6.3 4.3.3 6-.1 2.9-.8 4.7-2.8 5.1-6 .5-3.7.2-9.8-3.4-12.6ZM19 14.8c-.3 2.4-1.5 3.8-3.7 4.4-1.5.4-4 .4-5.5.1l-.4-.1-2.2 1.3.4-2-.4-.2c-1.9-.9-2.5-2.9-2.5-5.4 0-3.1.5-5.5 2.4-6.7 2.3-1.4 7.5-1.3 9.8.2 2.5 1.6 2.5 6.8 2.1 8.4Zm-3.4-1.6c-.3-.2-1.8-1-2.1-1.1-.3-.1-.5-.2-.7.2-.2.3-.7 1.1-.9 1.3-.2.2-.3.2-.6.1-1.4-.7-2.4-1.6-3.2-3-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-.9-2.3-.2-.6-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.9.6.3 1.1.5 1.5.6.6.2 1.1.2 1.5.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.1-.5-.2Z" />
    </svg>
  );
}

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
          <div className="group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-[#111827]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#15803D]" />

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16A34A]/10 text-[#16A34A] shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Phone className="h-5 w-5" />
              </div>

              <h3 className="text-base font-extrabold tracking-tight text-[#1F2937] dark:text-white">
                ڕاستەوخۆ پەیوەندی بە تیمی بازیان هەب بکە :
              </h3>

              <div className="mt-4 w-full space-y-2.5">
                <a
                  href="tel:+9647757997904"
                  dir="ltr"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#374151] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:bg-[#16A34A]/5 hover:text-[#16A34A] dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200 dark:hover:border-[#16A34A]/40"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>+964 775 799 7904</span>
                </a>

                <a
                  href="mailto:info@bazyanhub.com"
                  dir="ltr"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#374151] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A34A]/40 hover:bg-[#16A34A]/5 hover:text-[#16A34A] dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-200 dark:hover:border-[#16A34A]/40"
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
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:shadow-lg hover:shadow-[#1877F2]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  <FacebookIcon />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە ئینستاگرام"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white hover:shadow-lg hover:shadow-[#E4405F]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  <InstagramIcon />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە تیکتۆک"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-black hover:bg-black hover:text-white hover:shadow-lg hover:shadow-black/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-black"
                >
                  <TikTokIcon />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە واتسەپ"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white hover:shadow-lg hover:shadow-[#25D366]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  <WhatsAppIcon />
                </a>

                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="بازیان هەب لە ڤایبەر"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#7360F2] hover:bg-[#7360F2] hover:text-white hover:shadow-lg hover:shadow-[#7360F2]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                >
                  <ViberIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-[#111827]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#16A34A]/10 text-[#16A34A]">
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
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-[#111827]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#16A34A]/10 text-[#16A34A]">
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
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] shadow-[0_10px_35px_rgba(15,23,42,0.04)] dark:border-white/10">
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
      <div className="bg-[#14532D] text-white">
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
                  className="mt-3 w-full rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#14532D] transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ناردنی فییدباک
                </button>

                {submitted && (
                  <p className="mt-2 text-xs font-semibold text-green-200">
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