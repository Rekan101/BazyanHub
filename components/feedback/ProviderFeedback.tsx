"use client";

import { FormEvent, useState } from "react";
import { MessageSquare, Star, Send } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";

type LanguageCode = "ckb" | "ar" | "en";

type ProviderFeedbackProps = {
  providerId: string;
};

const UI_TEXT = {
  ckb: {
    title: "فیدباک و هەڵسەنگاندن",
    description:
      "ئەزموونەکەت لەگەڵ ئەم خاوەن خزمەتگوزارییە بنووسە.",
    rating: "هەڵسەنگاندن",
    comment: "فیدباکەکەت",
    placeholder:
      "لەبارەی ئەزموونەکەت بنووسە...",
    submit: "ناردنی فیدباک",
    sending: "دەنێردرێت...",
    success:
      "سوپاس! فیدباکەکەت بە سەرکەوتوویی نێردرا.",
    error:
      "کێشەیەک لە ناردنی فیدباکەکە ڕوویدا.",
    selectRating:
      "تکایە هەڵسەنگاندنێک هەڵبژێرە.",
  },

  ar: {
    title: "التقييم والملاحظات",
    description:
      "شارك تجربتك مع مقدم الخدمة.",
    rating: "التقييم",
    comment: "ملاحظتك",
    placeholder:
      "اكتب تجربتك هنا...",
    submit: "إرسال التقييم",
    sending: "جارٍ الإرسال...",
    success:
      "شكراً! تم إرسال تقييمك بنجاح.",
    error:
      "حدث خطأ أثناء إرسال التقييم.",
    selectRating:
      "يرجى اختيار تقييم.",
  },

  en: {
    title: "Feedback & Rating",
    description:
      "Share your experience with this service provider.",
    rating: "Rating",
    comment: "Your feedback",
    placeholder:
      "Write about your experience...",
    submit: "Submit feedback",
    sending: "Sending...",
    success:
      "Thank you! Your feedback was submitted successfully.",
    error:
      "Something went wrong while submitting your feedback.",
    selectRating:
      "Please select a rating.",
  },
} satisfies Record<
  LanguageCode,
  Record<string, string>
>;

export default function ProviderFeedback({
  providerId,
}: ProviderFeedbackProps) {
  const { language } = useLanguage();

  const currentLanguage =
    (language as LanguageCode) || "ckb";

  const t = UI_TEXT[currentLanguage];

  const isRTL = currentLanguage !== "en";

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [isSuccess, setIsSuccess] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage(null);
    setIsSuccess(false);

    if (rating < 1 || rating > 5) {
      setMessage(t.selectRating);
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("provider_reviews")
        .insert({
          provider_id: providerId,
          user_id: user?.id ?? "",
          rating,
         comment: comment.trim() || "",
          status: "approved",
        });
  
        if (error) {
        console.error(
          "Failed to submit feedback:",
          error
        );

        throw error;
      }

      setRating(0);
      setHoverRating(0);
      setComment("");

      setIsSuccess(true);
      setMessage(t.success);
    } catch (error) {
      console.error(
        "Feedback submission error:",
        error
      );

      setIsSuccess(false);
      setMessage(t.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="mt-6"
    >
      <div
        className="
          rounded-3xl
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
        <div className="flex items-start gap-3">
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

          <div className="min-w-0">
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

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-slate-500
                dark:text-slate-400
              "
            >
              {t.description}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          {/* Rating */}
          <div>
            <p
              className="
                mb-3
                text-sm
                font-semibold
                text-slate-800
                dark:text-slate-200
              "
            >
              {t.rating}
            </p>

            <div
              className="flex items-center gap-1"
              onMouseLeave={() =>
                setHoverRating(0)
              }
            >
              {Array.from({ length: 5 }).map(
                (_, index) => {
                  const starNumber = index + 1;

                  const active =
                    starNumber <=
                    (hoverRating || rating);

                  return (
                    <button
                      key={starNumber}
                      type="button"
                      onClick={() =>
                        setRating(starNumber)
                      }
                      onMouseEnter={() =>
                        setHoverRating(
                          starNumber
                        )
                      }
                      aria-label={`${starNumber} / 5`}
                      className="
                        rounded-lg
                        p-1
                        transition
                        hover:scale-110
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/40
                      "
                    >
                      <Star
                        className={`
                          h-7
                          w-7
                          sm:h-8
                          sm:w-8
                          ${
                            active
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-100 text-slate-300 dark:fill-slate-800 dark:text-slate-600"
                          }
                        `}
                      />
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="mt-6">
            <label
              htmlFor="provider-feedback"
              className="
                mb-2
                block
                text-sm
                font-semibold
                text-slate-800
                dark:text-slate-200
              "
            >
              {t.comment}
            </label>

            <textarea
              id="provider-feedback"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              placeholder={t.placeholder}
              rows={4}
              className="
                w-full
                resize-none
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                leading-6
                text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-primary
                focus:ring-2
                focus:ring-primary/10
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
                dark:placeholder:text-slate-500
              "
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`
                mt-4
                rounded-xl
                px-4
                py-3
                text-sm
                font-medium
                ${
                  isSuccess
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                }
              `}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              mt-5
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-primary
              px-5
              py-3
              text-sm
              font-bold
              text-white
              transition
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
            "
          >
            <Send className="h-4 w-4" />

            {isSubmitting
              ? t.sending
              : t.submit}
          </button>
        </form>
      </div>
    </section>
  );
}