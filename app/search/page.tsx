"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";
import { categories, type LanguageCode } from "@/lib/data/categories";
import { useLanguage } from "@/lib/i18n";

export default function SearchPage() {
  const { language } = useLanguage();

  const currentLanguage = language as LanguageCode;

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const query = params?.get("q")?.trim() ?? "";

  const isRTL = currentLanguage !== "en";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const results = useMemo(() => {
    if (!query) return [];

    const searchText = query.toLocaleLowerCase();

    return categories.filter((category) => {
      const title =
        category.title?.toLocaleLowerCase() ?? "";

      const filters = category.filters
        .map((filter) =>
          `${filter.label} ${filter.id}`.toLocaleLowerCase()
        )
        .join(" ");

      return (
        title.includes(searchText) ||
        filters.includes(searchText) ||
        category.id
          .toLocaleLowerCase()
          .includes(searchText)
      );
    });
  }, [query]);

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 py-12 dark:bg-slate-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Search className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            {currentLanguage === "ckb"
              ? "ئەنجامی گەڕان"
              : currentLanguage === "ar"
                ? "نتائج البحث"
                : "Search Results"}
          </h1>

          {query && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {currentLanguage === "ckb"
                ? `ئەنجام بۆ: ${query}`
                : currentLanguage === "ar"
                  ? `نتائج البحث عن: ${query}`
                  : `Results for: ${query}`}
            </p>
          )}
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {results.map((category) => (
              <Link
                key={category.id}
                href={`/services/${category.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-36 w-full overflow-hidden sm:h-44">
                  <Image
                    src={category.imageSrc}
                    alt={category.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="p-4">
                  <h2 className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-primary dark:text-white">
                    {category.title}
                  </h2>

                  <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span>
                      {category.filters.length}{" "}
                      {currentLanguage === "ckb"
                        ? "جۆر"
                        : currentLanguage === "ar"
                          ? "أنواع"
                          : "types"}
                    </span>

                    <ArrowIcon className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Search className="mx-auto mb-4 h-10 w-10 text-slate-400" />

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentLanguage === "ckb"
                ? "هیچ ئەنجامێک نەدۆزرایەوە"
                : currentLanguage === "ar"
                  ? "لم يتم العثور على نتائج"
                  : "No results found"}
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {currentLanguage === "ckb"
                ? "وشەیەکی تری بگەڕێ."
                : currentLanguage === "ar"
                  ? "حاول البحث بكلمة أخرى."
                  : "Try searching for something else."}
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {currentLanguage === "ckb"
                ? "بینینی هەموو خزمەتگوزارییەکان"
                : currentLanguage === "ar"
                  ? "عرض جميع الخدمات"
                  : "View all services"}

              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}