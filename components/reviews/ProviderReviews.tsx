"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Star,
  User,
} from "lucide-react";

import {
  getProviderReviews,
  getProviderRatingSummary,
  type ProviderReview,
} from "@/lib/reviews";
import { useLanguage } from "@/lib/i18n";

type LanguageCode = "ckb" | "ar" | "en";

type ProviderReviewsProps = {
  providerId: string;
};

const UI_TEXT = {
  ckb: {
    title: "پێداچوونەوەکان",
    noReviews: "هێشتا هیچ پێداچوونەوەیەک نییە",
    noReviewsDescription:
      "یەکەم کەس بە کۆمێنت و هەڵسەنگاندنێک ئەزموونەکەت بنووسە.",
    reviews: "پێداچوونەوە",
    loading: "بارکردنی پێداچوونەوەکان...",
    error:
      "کێشەیەک لە بارکردنی پێداچوونەوەکان ڕوویدا.",
    anonymous: "بەکارهێنەر",
    outOf: "لە ٥",
  },

  ar: {
    title: "المراجعات",
    noReviews: "لا توجد مراجعات بعد",
    noReviewsDescription:
      "كن أول من يشارك تجربته وتقييمه.",
    reviews: "مراجعة",
    loading: "جارٍ تحميل المراجعات...",
    error:
      "حدث خطأ أثناء تحميل المراجعات.",
    anonymous: "مستخدم",
    outOf: "من 5",
  },

  en: {
    title: "Reviews",
    noReviews: "No reviews yet",
    noReviewsDescription:
      "Be the first to share your experience and rating.",
    reviews: "reviews",
    loading: "Loading reviews...",
    error:
      "Something went wrong while loading reviews.",
    anonymous: "User",
    outOf: "out of 5",
  },
} satisfies Record<
  LanguageCode,
  Record<string, string>
>;

function formatReviewDate(
  date: string,
  language: LanguageCode
) {
  try {
    const locale =
      language === "ckb"
        ? "ku"
        : language === "ar"
          ? "ar"
          : "en";

    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

function RatingStars({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}) {
  const starClass =
    size === "md"
      ? "h-5 w-5"
      : "h-4 w-4";

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }).map(
        (_, index) => {
          const starNumber = index + 1;

          return (
            <Star
              key={starNumber}
              className={`${starClass} ${
                starNumber <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
              }`}
              aria-hidden="true"
            />
          );
        }
      )}
    </div>
  );
}

export default function ProviderReviews({
  providerId,
}: ProviderReviewsProps) {
  const { language } = useLanguage();

  const currentLanguage =
    language as LanguageCode;

  const t = UI_TEXT[currentLanguage];

  const isRTL =
    currentLanguage !== "en";

  const [reviews, setReviews] =
    useState<ProviderReview[]>([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [reviewCount, setReviewCount] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      setIsLoading(true);
      setError(null);

      try {
        const [
          reviewsData,
          summary,
        ] = await Promise.all([
          getProviderReviews(providerId),
          getProviderRatingSummary(
            providerId
          ),
        ]);

        if (cancelled) {
          return;
        }

        setReviews(reviewsData);
        setAverageRating(
          summary.averageRating
        );
        setReviewCount(
          summary.reviewCount
        );
      } catch (reviewError) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load provider reviews:",
          reviewError
        );

        setError(t.error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (providerId) {
      loadReviews();
    }

    return () => {
      cancelled = true;
    };
  }, [providerId, t.error]);

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-10"
    >
      {/* Header */}
      <div className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <MessageSquare
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>

          <div>
            <h2
              className="
                text-lg
                font-bold
                text-slate-900
                dark:text-white
                sm:text-xl
              "
            >
              {t.title}
            </h2>

            {!isLoading &&
              !error &&
              reviewCount > 0 && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {reviewCount} {t.reviews}
                </p>
              )}
          </div>
        </div>

        {/* Rating Summary */}
        {!isLoading &&
          !error &&
          reviewCount > 0 && (
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-4
                rounded-2xl
                bg-slate-50
                p-4
                dark:bg-slate-950
              "
            >
              <div className="text-center">
                <div
                  className="
                    text-3xl
                    font-extrabold
                    tracking-tight
                    text-slate-900
                    dark:text-white
                  "
                >
                  {averageRating.toFixed(1)}
                </div>

                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {t.outOf}
                </p>
              </div>

              <div>
                <RatingStars
                  rating={Math.round(
                    averageRating
                  )}
                  size="md"
                />

                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {reviewCount} {t.reviews}
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-5 space-y-3">
          {Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="
                  h-32
                  animate-pulse
                  rounded-2xl
                  bg-slate-200
                  dark:bg-slate-800
                "
              />
            )
          )}
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-red-200
            bg-red-50
            p-5
            text-center
            dark:border-red-900/50
            dark:bg-red-950/20
          "
        >
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading &&
        !error &&
        reviews.length === 0 && (
          <div
            className="
              mt-5
              rounded-3xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-6
              py-12
              text-center
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
                rounded-full
                bg-slate-100
                text-slate-400
                dark:bg-slate-800
              "
            >
              <MessageSquare
                className="h-6 w-6"
                aria-hidden="true"
              />
            </div>

            <h3
              className="
                mt-4
                text-base
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {t.noReviews}
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              {t.noReviewsDescription}
            </p>
          </div>
        )}

      {/* Reviews List */}
      {!isLoading &&
        !error &&
        reviews.length > 0 && (
          <div className="mt-5 space-y-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="
                  rounded-2xl
                  border
                  border-slate-200/80
                  bg-white
                  p-5
                  shadow-sm
                  dark:border-slate-800
                  dark:bg-slate-900
                "
              >
                {/* Review Header */}
                <div className="flex items-start gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-primary/10
                      text-primary
                    "
                  >
                    <User
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        justify-between
                        gap-2
                      "
                    >
                      <div>
                        <h3
                          className="
                            text-sm
                            font-bold
                            text-slate-900
                            dark:text-white
                          "
                        >
                          {t.anonymous}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {formatReviewDate(
                            review.created_at,
                            currentLanguage
                          )}
                        </p>
                      </div>

                      <RatingStars
                        rating={review.rating}
                      />
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mt-4">
                  {review.title && (
                    <h4
                      className="
                        text-sm
                        font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      {review.title}
                    </h4>
                  )}

                  {review.comment && (
                    <p
                      className="
                        mt-1.5
                        whitespace-pre-line
                        text-sm
                        leading-6
                        text-slate-600
                        dark:text-slate-300
                      "
                    >
                      {review.comment}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
    </section>
  );
}