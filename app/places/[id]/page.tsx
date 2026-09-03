import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Star,
  Clock3,
  Info,
  BookOpen,
} from "lucide-react";

import { places } from "@/lib/data/places";

interface PlaceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlaceDetailsPage({
  params,
}: PlaceDetailsPageProps) {
  const { id } = await params;

  const place = places.find((item) => item.id === id);

  if (!place) {
    notFound();
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#F8FAFC] text-[#1F2937] dark:bg-[#020617] dark:text-white"
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] shadow-sm transition-colors hover:border-[#16A34A]/40 hover:text-[#16A34A] dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
          >
            <ArrowRight className="h-4 w-4" />
            گەڕانەوە
          </Link>
        </div>

        {/* Article */}
        <article className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-xl shadow-black/[0.04] dark:border-white/10 dark:bg-[#0F172A]">
          {/* Hero Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 sm:aspect-[16/8]">
            <Image
              src={place.image}
              alt={place.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-0 right-0 left-0 p-5 sm:p-8">
              <div className="mb-3 inline-flex rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#16A34A] shadow-sm backdrop-blur">
                {place.category}
              </div>

              <h1 className="max-w-3xl text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                {place.translations.ckb}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/90">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {place.location}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {place.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-10 p-5 sm:p-8 lg:p-10">
            {/* Intro */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16A34A]/10 text-[#16A34A]">
                  <BookOpen className="h-5 w-5" />
                </span>

                <h2 className="text-xl font-bold sm:text-2xl">
                  دەربارەی شوێنەکە
                </h2>
              </div>

              <p className="text-base leading-8 text-[#4B5563] dark:text-gray-300 sm:text-lg">
                {place.description}
              </p>
            </section>

            {/* Quick Information */}
            <section className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16A34A]/10 text-[#16A34A]">
                  <Info className="h-5 w-5" />
                </span>

                <h2 className="text-xl font-bold">
                  زانیارییە سەرەکییەکان
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold text-[#6B7280] dark:text-gray-400">
                    جۆر
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {place.category}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold text-[#6B7280] dark:text-gray-400">
                    شوێن
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {place.location}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold text-[#6B7280] dark:text-gray-400">
                    هەڵسەنگاندن
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-sm font-bold">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {place.rating.toFixed(1)}
                  </div>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <p className="text-xs font-semibold text-[#6B7280] dark:text-gray-400">
                    ژمارەی هەڵسەنگاندنەکان
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    {place.reviewCount.toLocaleString("ckb-IQ")}
                  </p>
                </div>
              </div>
            </section>

            {/* Narrative */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16A34A]/10 text-[#16A34A]">
                  <Clock3 className="h-5 w-5" />
                </span>

                <h2 className="text-xl font-bold sm:text-2xl">
                  وردەکاری و ناساندن
                </h2>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.02] sm:p-7">
                <p className="text-base leading-8 text-[#4B5563] dark:text-gray-300 sm:text-lg">
                  {place.description}
                </p>

                <div className="my-6 h-px bg-[#E5E7EB] dark:bg-white/10" />

                <p className="text-sm leading-8 text-[#6B7280] dark:text-gray-400 sm:text-base">
                  ئەم بەشە بۆ زیادکردنی زانیارییە
                  مێژوویی، چیرۆک، پاشخان، تایبەتمەندی و
                  وردەکارییەکانی زیاتر لەبارەی ئەم شوێنە
                  دانراوە. کاتێک زانیاریی تەواو و
                  پشتڕاستکراو بۆ ئەم شوێنە زیاد بکرێت،
                  دەتوانرێت بە شێوەی چیرۆکی و پەرتووک-
                  ئاسا لێرە پیشان بدرێت.
                </p>
              </div>
            </section>

            {/* Image / Gallery */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16A34A]/10 text-[#16A34A]">
                  <Info className="h-5 w-5" />
                </span>

                <h2 className="text-xl font-bold sm:text-2xl">
                  وێنەی شوێنەکە
                </h2>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-slate-100 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                  <Image
                    src={place.image}
                    alt={place.translations.ckb}
                    fill
                    sizes="(max-width: 768px) 100vw, 900px"
                    className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>
            </section>

            {/* Bottom Summary */}
            <section className="rounded-2xl border border-[#16A34A]/20 bg-[#16A34A]/5 p-5 dark:bg-[#16A34A]/10 sm:p-7">
              <h2 className="text-xl font-bold">
                کورتەی زانیاری
              </h2>

              <p className="mt-3 text-sm leading-8 text-[#4B5563] dark:text-gray-300 sm:text-base">
                {place.translations.ckb} لە
                {` ${place.location}`} ـە و بە شێوەی
                {` ${place.category}`} ناسراوە. هەڵسەنگاندنی
                ئەم شوێنە {place.rating.toFixed(1)} ـە و
                {` ${place.reviewCount.toLocaleString("ckb-IQ")}`}
                کەس هەڵسەنگاندنیان بۆ تۆمار کردووە.
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}