export default function LegalPage() {
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100"
    >
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="border-b border-slate-200 bg-[#14532D] px-6 py-10 text-white sm:px-10">
            <h1 className="text-2xl font-bold sm:text-3xl">
              مەرجەکانی بەکارهێنان و سیاسەتی تایبەتمەندی
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-white/75">
              ئەم پەڕەیە ڕوونکردنەوەی مەرجەکانی بەکارهێنانی
              BazianHub و شێوازی پاراستن و بەکارهێنانی زانیارییەکانی
              بەکارهێنەرانە.
            </p>
          </div>

          <div className="space-y-10 px-6 py-10 sm:px-10">
            {/* Terms */}
            <section>
              <h2 className="text-xl font-bold text-[#14532D] dark:text-green-400">
                مەرجەکانی بەکارهێنان
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                <p>
                  بەکارهێنانی BazianHub واتە ڕەزامەندی لەگەڵ ئەو
                  مەرج و ڕێسایانەی کە لەم پەڕەیەدا باسکراون.
                </p>

                <p>
                  بەکارهێنەر بەرپرسیارە لە بەکارهێنانی دروست و
                  یاساییی ناوەڕۆک و خزمەتگوزارییەکانی وێبسایت.
                </p>

                <p>
                  BazianHub هەوڵ دەدات زانیارییەکان بە شێوەیەکی
                  دروست و نوێ پیشان بدات، بەڵام هەموو زانیارییەکان
                  لە هەموو کاتێکدا دڵنیایی تەواویان نییە.
                </p>
              </div>
            </section>

            {/* Privacy */}
            <section className="border-t border-slate-200 pt-10 dark:border-slate-800">
              <h2 className="text-xl font-bold text-[#14532D] dark:text-green-400">
                سیاسەتی تایبەتمەندی
              </h2>

              <div className="mt-4 space-y-4 text-sm leading-8 text-slate-600 dark:text-slate-300">
                <p>
                  ئێمە گرنگی بە پاراستنی تایبەتمەندی بەکارهێنەران
                  دەدەین و هەوڵ دەدەین زانیارییەکانیان بە شێوەیەکی
                  پارێزراو بەکاربهێنین.
                </p>

                <p>
                  زانیارییەکانی بەکارهێنەر نابێت بە شێوەیەکی نایاسایی
                  بۆ کەسانی سێیەم بڵاوبکرێنەوە، مەگەر لەو حاڵەتانەی
                  کە یاسا پێویستی پێ بکات.
                </p>

                <p>
                  BazianHub دەتوانێت زانیارییە تەکنیکییەکان و
                  بەکارهێنانی وێبسایت بۆ باشترکردنی ئەزموونی
                  بەکارهێنەر و خزمەتگوزارییەکان بەکاربهێنێت.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">
              <h2 className="text-base font-bold">
                پەیوەندی
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                ئەگەر سەبارەت بە مەرجەکان یان سیاسەتی
                تایبەتمەندی پرسیارێکت هەیە، دەتوانیت ڕاستەوخۆ
                پەیوەندی بە تیمی بازیان هەب بکەیت.
              </p>

              <a
                href="mailto:info@bazyanhub.com"
                className="mt-3 inline-block text-sm font-semibold text-[#16A34A] hover:underline"
              >
                info@bazyanhub.com
              </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}