import { notFound } from "next/navigation";
import { categories } from "@/lib/data/categories";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

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

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
            BazyanHub
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {currentCategory.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
            خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە
          </p>
        </div>

        {currentCategory.filters.length > 0 ? (
          <div className="mb-8 flex flex-wrap gap-3">
            {currentCategory.filters.map((filter) => (
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
                {filter.label}
              </button>
            ))}
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
              {currentCategory.icon}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              هیچ کاروبارێک هێشتا زیاد نەکراوە
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-zinc-400">
              لەم بەشەدا کاروبار و خزمەتگوزارییە نوێکان بە زوویی زیاد دەکرێن.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}