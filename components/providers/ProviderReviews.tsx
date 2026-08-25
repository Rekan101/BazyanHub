"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Star,
  User,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type LanguageCode = "ckb" | "ar" | "en";

type ProviderReview = {
  id: string;
  provider_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: string;
  created_at: string;
};

type ProviderReviewsProps = {
  providerId: string;
  language: LanguageCode;
};

const UI_TEXT = {
  ckb: {
    title: "پێداچوونەوەکان",
    review: "پێداچوونەوە",
    noReviews: "هێشتا هیچ پێداچوونەوەیەک نییە.",
    noComment: "هیچ کۆمێنتێک نییە.",
    loading: "پێداچوونەوەکان بار دەکرێن...",
    error: "کێشەیەک لە بارکردنی پێداچوونەوەکان ڕوویدا.",
    anonymous: "بەکارهێنەر",
  },

  ar: {
    title: "المراجعات",
    review: "مراجعة",
    noReviews: "لا توجد مراجعات حتى الآن.",
    noComment: "لا يوجد تعليق.",
    loading: "جارٍ تحميل المراجعات...",
    error: "حدث خطأ أثناء تحميل المراجعات.",
    anonymous: "مستخدم",
  },

  en: {
    title: "Reviews",
    review: "review",
    noReviews: "No reviews yet.",
    noComment: "No comment.",
    loading: "Loading reviews...",
    error: "Something went wrong while loading reviews.",
    anonymous: "User",
  },
} satisfies Record<
  LanguageCode,
  Record<string, string>
>;

function formatDate(
  date: string,
  language: LanguageCode
) {
  const locale =
    language === "ckb"
      ? "ckb-IQ"
      : language === "ar"
        ? "ar-IQ"
        : "en-US";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function RatingStars({
  rating,
}: {
  rating: number;
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${rating} / 5`}
    >
      {Array.from({ length: 5 }).map(
        (_, index) => {
          const starNumber = index + 1;

          return (
            <Star
              key={starNumber}
              className={`h-4 w-4 ${
                starNumber <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 dark:text-slate-700"
              }`}
            />
          );
        }
      )}
    </div>
  );
}

export default function ProviderReviews({
  providerId,
  language,
}: ProviderReviewsProps) {
  const t = UI_TEXT[language];

  const isRTL = language !== "en";

  const [reviews, setReviews] =
    useState<ProviderReview[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("provider_reviews")
        .select(
          `
            id,
            provider_id,
            user_id,
            rating,
            title,
            comment,
            status,
            created_at
          `
        )
        .eq("provider_id", providerId)
        .eq("status", "approved")
        .order("created_at", {
          ascending: false,
        });

      if (cancelled) {
        return;
      }

      if (error) {
        console.error(
          "Failed to load provider reviews:",
          error
        );

        setError(t.error);
        setReviews([]);
        setIsLoading(false);

        return;
      }

      setReviews(
        (data ?? []) as ProviderReview[]
      );

      setIsLoading(false);
    }

    if (providerId) {
      loadReviews();
    }

    return () => {
      cancelled = true;
    };
  }, [providerId, t.error]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (sum, review) =>
            sum + Number(review.rating),
          0
        ) / reviews.length
      : 0;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="
        rounded-2xl
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
        sm:p-6
      "
    >
      {/* Header */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <h2
            className="
              flex
              items-center
              gap-2
              text-lg
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            <MessageSquare
              className="h-5 w-5 text-primary"
            />

            {t.title}
          </h2>

          {reviews.length > 0 && (
            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {reviews.length} {t.review}
            </p>
          )}
        </div>

        {/* Average rating */}

        {reviews.length > 0 && (
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-amber-50
              px-4
              py-2.5
              dark:bg-amber-950/20
            "
          >
            <Star
              className="
                h-5
                w-5
                fill-amber-400
                text-amber-400
              "
            />

            <span
              className="
                text-lg
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {averageRating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Loading */}

      {isLoading && (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  animate-pulse
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  dark:border-slate-800
                "
              >
                <div className="flex gap-3">
                  <div
                    className="
                      h-10
                      w-10
                      rounded-full
                      bg-slate-200
                      dark:bg-slate-800
                    "
                  />

                  <div className="flex-1">
                    <div
                      className="
                        h-4
                        w-32
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                      "
                    />

                    <div
                      className="
                        mt-2
                        h-3
                        w-24
                        rounded
                        bg-slate-200
                        dark:bg-slate-800
                      "
                    />
                  </div>
                </div>

                <div
                  className="
                    mt-4
                    h-4
                    w-full
                    rounded
                    bg-slate-200
                    dark:bg-slate-800
                  "
                />
              </div>
            )
          )}
        </div>
      )}

      {/* Error */}

      {!isLoading && error && (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-4
            text-sm
            text-red-600
            dark:border-red-900/40
            dark:bg-red-950/20
            dark:text-red-400
          "
        >
          {error}
        </div>
      )}

      {/* Empty */}

      {!isLoading &&
        !error &&
        reviews.length === 0 && (
          <div
            className="
              mt-6
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-slate-50
              px-5
              py-8
              text-center
              dark:border-slate-700
              dark:bg-slate-950/40
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-400
                dark:bg-slate-800
              "
            >
              <MessageSquare
                className="h-5 w-5"
              />
            </div>

            <p
              className="
                mt-3
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {t.noReviews}
            </p>
          </div>
        )}

      {/* Reviews */}

      {!isLoading &&
        !error &&
        reviews.length > 0 && (
          <div className="mt-6 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="
                  rounded-xl
                  border
                  border-slate-200
                  p-4
                  transition
                  hover:border-slate-300
                  dark:border-slate-800
                  dark:hover:border-slate-700
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  {/* User */}

                  <div className="flex min-w-0 gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                        text-slate-500
                        dark:bg-slate-800
                        dark:text-slate-400
                      "
                    >
                      <User
                        className="h-5 w-5"
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {t.anonymous}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-slate-400
                        "
                      >
                        {formatDate(
                          review.created_at,
                          language
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}

                  <RatingStars
                    rating={Number(
                      review.rating
                    )}
                  />
                </div>

                {/* Title */}

                {review.title && (
                  <h3
                    className="
                      mt-4
                      text-sm
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {review.title}
                  </h3>
                )}

                {/* Comment */}

                <p
                  className="
                    mt-2
                    whitespace-pre-line
                    text-sm
                    leading-7
                    text-slate-600
                    dark:text-slate-300
                  "
                >
                  {review.comment ||
                    t.noComment}
                </p>
              </article>
            ))}
          </div>
        )}
    </section>
  );
}