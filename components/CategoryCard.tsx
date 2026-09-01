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
      className="group block min-w-0"
    >
      <article
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-gray-200/70
          bg-white
          p-1.5
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          dark:border-white/10
          dark:bg-zinc-900
          sm:rounded-3xl
          sm:p-6
        "
      >
        <div
          className="
            absolute
            -right-10
            -top-10
            h-20
            w-20
            rounded-full
            bg-blue-500/5
            blur-2xl
            transition-all
            duration-300
            group-hover:bg-blue-500/10
            sm:h-28
            sm:w-28
          "
        />

        <div
          className="
            relative
            z-10
            flex
            min-w-0
            items-start
            justify-between
            gap-1
            sm:gap-4
          "
        >
          {/* Category Icon */}
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-gray-100
              text-gray-900
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:bg-blue-600
              group-hover:text-white
              dark:bg-zinc-800
              dark:text-white
              dark:group-hover:bg-blue-500
              sm:h-14
              sm:w-14
              sm:rounded-2xl
            "
          >
            <span
              className="
                text-xs
                font-semibold
                sm:text-xl
              "
            >
              {category.icon}
            </span>
          </div>

          {/* Fixed Action Area */}
          <div
            className="
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-gray-100
              text-gray-500
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:bg-blue-50
              group-hover:text-blue-600
              dark:bg-zinc-800
              dark:text-zinc-400
              dark:group-hover:bg-blue-500/10
              dark:group-hover:text-blue-400
              sm:h-9
              sm:w-9
            "
            aria-hidden="true"
          >
            <span
              className="
                text-[10px]
                sm:text-base
              "
            >
              →
            </span>
          </div>
        </div>

        <div
          className="
            relative
            z-10
            mt-2
            min-w-0
            sm:mt-6
          "
        >
          <h3
            className="
              line-clamp-2
              break-words
              text-[10px]
              font-bold
              leading-4
              tracking-tight
              text-gray-900
              transition-colors
              duration-300
              group-hover:text-blue-600
              dark:text-white
              dark:group-hover:text-blue-400
              sm:text-lg
            "
          >
            {category.title}
          </h3>

          <p
            className="
              mt-0.5
              line-clamp-2
              text-[8px]
              leading-3
              text-gray-500
              dark:text-zinc-400
              sm:mt-2
              sm:text-sm
              sm:leading-6
            "
          >
            {category.filters.length > 0
              ? `${category.filters.length} خزمەتگوزاری و جۆر`
              : "خزمەتگوزارییەکان ببینە"}
          </p>
        </div>

        <div
          className="
            relative
            z-10
            mt-2
            flex
            items-center
            gap-1
            sm:mt-5
            sm:gap-2
          "
        >
          <span
            className="
              h-1
              w-1
              rounded-full
              bg-blue-600
              sm:h-1.5
              sm:w-1.5
            "
          />

          <span
            className="
              truncate
              text-[7px]
              font-medium
              text-gray-400
              transition-colors
              duration-300
              group-hover:text-blue-600
              dark:text-zinc-500
              dark:group-hover:text-blue-400
              sm:text-xs
            "
          >
            BazyanHub
          </span>
        </div>
      </article>
    </Link>
  );
}