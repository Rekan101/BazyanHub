import { notFound } from "next/navigation";
import { categories } from "@/lib/data/categories";

type LanguageCode = "ckb" | "ar" | "en";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

const CATEGORY_TITLES: Record<
  string,
  {
    ckb: string;
    ar: string;
    en: string;
  }
> = {
  jobs: {
    ckb: "هەلی کار",
    ar: "فرص العمل",
    en: "Job Opportunities",
  },
};

const CATEGORY_DESCRIPTIONS: Record<
  string,
  {
    ckb: string;
    ar: string;
    en: string;
  }
> = {
  jobs: {
    ckb: "دەرفەتی کار و هەلی پیشەیی لە بازیان بدۆزەرەوە.",
    ar: "اكتشف فرص العمل والوظائف المتاحة في بازيان.",
    en: "Discover job opportunities and available positions in Bazian.",
  },
};

const FILTER_TRANSLATIONS: Record<
  string,
  {
    ckb: string;
    ar: string;
    en: string;
  }
> = {
  "full-time": {
    ckb: "تەواوکات",
    ar: "دوام كامل",
    en: "Full-time",
  },

  "part-time": {
    ckb: "نیوەکات",
    ar: "دوام جزئي",
    en: "Part-time",
  },

  "daily-work": {
    ckb: "کار بۆ ڕۆژ",
    ar: "عمل يومي",
    en: "Daily Work",
  },

  internship: {
    ckb: "کارامۆزی",
    ar: "تدريب",
    en: "Internship",
  },
};

function getLanguage(): LanguageCode {
  return "ckb";
}

function getCategoryTitle(
  categoryId: string,
  fallback: string,
  language: LanguageCode
) {
  return (
    CATEGORY_TITLES[categoryId]?.[language] ??
    fallback
  );
}

function getCategoryDescription(
  categoryId: string,
  language: LanguageCode
) {
  return (
    CATEGORY_DESCRIPTIONS[categoryId]?.[language] ??
    {
      ckb: "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە",
      ar: "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
      en: "Discover services and businesses in this category.",
    }[language]
  );
}

function getFilterLabel(
  filterId: string,
  fallback: string,
  language: LanguageCode
) {
  return (
    FILTER_TRANSLATIONS[filterId]?.[language] ??
    fallback
  );
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;

  const currentCategory = categories.find(
    (item) => item.id === category
  );

  if (!currentCategory) {
    notFound();
  }

  /*
   * LanguageProvider controls the language on the client.
   * The category title for jobs is also defined here
   * so the route remains compatible with the new category.
   */
  const language = getLanguage();

  const categoryTitle = getCategoryTitle(
    currentCategory.id,
    currentCategory.title,
    language
  );

  const categoryDescription =
    getCategoryDescription(
      currentCategory.id,
      language
    );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            BazianHub
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {categoryTitle}
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            {categoryDescription}
          </p>
        </div>

        {currentCategory.filters.length > 0 ? (
          <div className="mb-8 flex flex-wrap gap-3">
            {currentCategory.filters.map(
              (filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className="
                    rounded-full
                    border border-gray-200
                    bg-white
                    px-4 py-2
                    text-sm font-medium
                    text-gray-700
                    transition-colors
                    hover:border-blue-500
                    hover:bg-blue-50
                    hover:text-blue-600
                    dark:border-white/10
                    dark:bg-zinc-900
                    dark:text-zinc-300
                    dark:hover:border-blue-500
                    dark:hover:bg-blue-500/10
                    dark:hover:text-blue-400
                  "
                >
                  {getFilterLabel(
                    filter.id,
                    filter.label,
                    language
                  )}
                </button>
              )
            )}
          </div>
        ) : null}

        <section
          className="
            rounded-3xl
            border border-dashed border-gray-300
            bg-white
            p-10
            text-center
            dark:border-white/10
            dark:bg-zinc-900
          "
        >
          <div className="mx-auto max-w-md">
            <div
              className="
                mx-auto mb-5
                flex h-16 w-16
                items-center justify-center
                rounded-2xl
                bg-gray-100
                text-2xl
                dark:bg-zinc-800
              "
            >
              {currentCategory.icon ===
              "briefcase-business"
                ? "💼"
                : currentCategory.icon}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {language === "en"
                ? "No jobs have been added yet"
                : language === "ar"
                  ? "لم تتم إضافة وظائف بعد"
                  : "هیچ هەلی کارێک هێشتا زیاد نەکراوە"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-zinc-400">
              {language === "en"
                ? "New job opportunities and listings will be added here soon."
                : language === "ar"
                  ? "ستتم إضافة فرص العمل والإعلانات الجديدة هنا قريبًا."
                  : "هەلی کار و ئاگادارییە نوێکانی کار بە زوویی لێرە زیاد دەکرێن."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}