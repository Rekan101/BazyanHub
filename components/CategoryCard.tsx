"use client";

import Link from "next/link";
import type { ServiceCategory } from "@/lib/data/categories";

type CategoryCardProps = {
  category: ServiceCategory;
};

export default function CategoryCard({
  category,
}: CategoryCardProps) {
  return (
    <Link
      href={`/services/${category.id}`}
      className="group block"
    >
      <article
        className="
          relative overflow-hidden rounded-3xl
          border border-gray-200/70
          bg-white
          p-6
          shadow-sm
          transition-all duration-300
          hover:-translate-y-1
          hover:shadow-xl
          dark:border-white/10
          dark:bg-zinc-900
        "
      >
        <div
          className="
            absolute -right-10 -top-10
            h-28 w-28
            rounded-full
            bg-blue-500/5
            blur-2xl
            transition-all duration-300
            group-hover:bg-blue-500/10
          "
        />

        <div
          className="
            relative z-10
            flex items-start justify-between gap-4
          "
        >
          {/* Category Icon */}
          <div
            className="
              flex h-14 w-14 shrink-0
              items-center justify-center
              rounded-2xl
              bg-gray-100
              text-gray-900
              transition-all duration-300
              group-hover:scale-105
              group-hover:bg-blue-600
              group-hover:text-white
              dark:bg-zinc-800
              dark:text-white
              dark:group-hover:bg-blue-500
            "
          >
            <span className="text-xl font-semibold">
              {category.icon}
            </span>
          </div>

          {/* Fixed Action Area */}
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-full
              bg-gray-100
              text-gray-500
              transition-all duration-300
              group-hover:translate-x-1
              group-hover:bg-blue-50
              group-hover:text-blue-600
              dark:bg-zinc-800
              dark:text-zinc-400
              dark:group-hover:bg-blue-500/10
              dark:group-hover:text-blue-400
            "
            aria-hidden="true"
          >
            →
          </div>
        </div>

        <div className="relative z-10 mt-6">
          <h3
            className="
              text-lg font-bold
              tracking-tight
              text-gray-900
              transition-colors duration-300
              group-hover:text-blue-600
              dark:text-white
              dark:group-hover:text-blue-400
            "
          >
            {category.title}
          </h3>

          <p
            className="
              mt-2 text-sm
              leading-6
              text-gray-500
              dark:text-zinc-400
            "
          >
            {category.filters.length > 0
              ? `${category.filters.length} خزمەتگوزاری و جۆر`
              : "خزمەتگوزارییەکان ببینە"}
          </p>
        </div>

        <div className="relative z-10 mt-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />

          <span
            className="
              text-xs font-medium
              text-gray-400
              transition-colors duration-300
              group-hover:text-blue-600
              dark:text-zinc-500
              dark:group-hover:text-blue-400
            "
          >
            BazyanHub
          </span>
        </div>
      </article>
    </Link>
  );
}