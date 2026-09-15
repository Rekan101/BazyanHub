import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

import { getCategoryBySlug } from "@/lib/data/categories.server";
import { getProvidersByCategory } from "@/lib/data/providers";

import CategoryPageClient from "./CategoryPageClient";

/*
|--------------------------------------------------------------------------
| Category Page (server)
|--------------------------------------------------------------------------
|
| Fetches the category, its providers and its filter chips on the server,
| then hands them to the client component that owns the modal and the filter
| pills.
|
| This file previously carried a second, divergent copy of the 10 categories
| plus a hand-rolled restaurants -> Provider adapter. Both are gone: category
| data now comes from lib/data/categories.ts (Supabase-backed, mock
| fallback) and provider data from the lib/data/providers.ts seam, so there
| is exactly one source of truth for each.
|
*/

/*
 * ISR, same rationale as the home page: all reads go through the
 * cookie-free public client, so these pages can be prerendered per slug and
 * refreshed periodically instead of rendered on every request.
 */
export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { category: categorySlug } =
    await params;

  const category =
    await getCategoryBySlug(categorySlug);

  /*
  |--------------------------------------------------------------------------
  | Invalid Category
  |--------------------------------------------------------------------------
  */

  if (!category) {
    return (
      <main
        dir="rtl"
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-slate-50
          px-4
          dark:bg-slate-950
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            text-center
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-600/10 dark:bg-blue-500/10
              text-blue-600 dark:text-blue-500
            "
          >
            <BriefcaseBusiness
              className="h-7 w-7"
              aria-hidden="true"
            />
          </div>

          <h1
            className="
              mt-5
              text-xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            هیچ خزمەتگوزارییەک هێشتا زیاد نەکراوە
          </h1>

          <Link
            href="/#services"
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600 dark:bg-blue-500
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-opacity
              hover:opacity-90
            "
          >
            گەڕانەوە بۆ خزمەتگوزارییەکان
          </Link>
        </div>
      </main>
    );
  }

  const providers = await getProvidersByCategory(
    category.id
  );

  /*
   * Filter chips come along with the category itself - mapCategoryRow()
   * embeds them from the joined `filters` rows, and the mock categories
   * carry their own inline arrays. Either way this is the same shape.
   */
  return (
    <CategoryPageClient
      category={category}
      providers={providers}
      filters={category.filters}
    />
  );
}
