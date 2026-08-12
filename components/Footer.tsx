import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Facebook,
  Instagram,
  Mountain,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "سەرەتا", href: "/" },
  { label: "خزمەتگوزارییەکان", href: "/services" },
  { label: "بازرگانییەکان", href: "/businesses" },
  { label: "دڵخوازەکان", href: "/favorites" },
  { label: "پرسیارە باوەکان", href: "/faq" },
];

const LEGAL_LINKS = [
  { label: "یاسا و مەرجەکان", href: "/terms" },
  { label: "سیاسەتی تایبەتمەندی", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer dir="rtl" className="bg-[#F9FAFB] dark:bg-[#0B1220]">
      {/* Info strip */}
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-white/10 dark:bg-[#111827]">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#16A34A]/10 text-[#16A34A]">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="mb-2 text-sm font-bold text-[#1F2937] dark:text-white">
              پەیوەندیمان پێوە بکە
            </h3>
            <p dir="ltr" className="text-end text-sm text-[#4B5563] dark:text-gray-400">
              +964 7XX XXX XXXX
            </p>
            <a
              href="mailto:info@bazyanhub.com"
              className="mt-1 flex items-center gap-1.5 text-sm text-[#4B5563] transition-colors hover:text-[#16A34A] dark:text-gray-400"
            >
              <Mail className="h-3.5 w-3.5" />
              info@bazyanhub.com
            </a>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-white/10 dark:bg-[#111827]">
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

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 dark:border-white/10 dark:bg-[#111827]">
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

          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] dark:border-white/10">
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
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Mountain className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-base font-bold">بازیان هۆب</span>
                  <span className="text-[11px] text-white/70">
                    نەخشەی گەڕانی بازیان
                  </span>
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                پلاتفۆرمی سەرەکی دیجیتاڵی بازیان بۆ گەیشتن بە خزمەتگوزاری،
                بازرگانی و گەشتیاری.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="بازیان هۆب لە فەیسبووک"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="بازیان هۆب لە ئینستاگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

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

            <div>
              <h3 className="mb-4 text-sm font-bold text-white">
                یاسا و مەرجەکان
              </h3>
              <ul className="flex flex-col gap-2.5">
                {LEGAL_LINKS.map((link) => (
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

            <div>
              <h3 className="mb-4 text-sm font-bold text-white">زمان</h3>
              <div className="flex flex-wrap gap-2">
                {["کوردی", "العربية", "English"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
            © 2026 بازیان هۆب. هەموو مافەکان پارێزراون.
          </div>
        </div>
      </div>
    </footer>
  );
}
