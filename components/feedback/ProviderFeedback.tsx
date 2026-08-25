"use client";

import { useState } from "react";
import {
  Flag,
  MessageSquare,
  Send,
  Star,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";

type LanguageCode = "ckb" | "ar" | "en";

type ProviderFeedbackProps = {
  providerId: string;
};

type ReportReason =
  | "spam"
  | "wrong_information"
  | "inappropriate"
  | "fake"
  | "other";

const UI_TEXT = {
  ckb: {
    title: "ڕەیتینگ و فیدباک",
    description:
      "هەڵسەنگاندن و فیدباکی خۆت بە شێوەی سادە بنێرە.",
    rating: "هەڵسەنگاندن",
    ratingRequired: "تکایە نمرەیەک هەڵبژێرە.",
    feedback: "فیدباک",
    feedbackPlaceholder:
      "بۆمان بنووسە چیت لە خزمەتگوزارییەکە بەدڵ بوو یان چی پێویستی بە چاککردن هەیە...",
    report: "ڕاپۆرتکردن",
    reportDescription:
      "ئەگەر کێشەیەک یان زانیارییەکی هەڵە هەیە، دەتوانیت ڕاپۆرتی بکەیت.",
    reportReason: "هۆکاری ڕاپۆرت",
    spam: "سپام / پەیامی ناخوازی",
    wrongInformation: "زانیاریی هەڵە",
    inappropriate: "ناگونجاو",
    fake: "خزمەتگوزاریی ساختە",
    other: "هۆکارێکی تر",
    send: "ناردن",
    sending: "دەنێردرێت...",
    success:
      "سوپاس! هەڵسەنگاندن و فیدباکەکەت بە سەرکەوتوویی نێردرا.",
    error:
      "کێشەیەک ڕوویدا. تکایە دووبارە هەوڵ بدەرەوە.",
    loginRequired:
      "بۆ ناردنی هەڵسەنگاندن دەبێت بچیتە ژوورەوە.",
    reportRequired:
      "تکایە هۆکاری ڕاپۆرت هەڵبژێرە.",
    anonymous:
      "زانیاری ناسنامەی تۆ لە ناو فۆڕمەکەدا پیشان نادرێت.",
  },

  ar: {
    title: "التقييم والملاحظات",
    description:
      "أرسل تقييمك وملاحظتك بطريقة بسيطة.",
    rating: "التقييم",
    ratingRequired: "يرجى اختيار تقييم.",
    feedback: "ملاحظتك",
    feedbackPlaceholder:
      "اكتب لنا ما أعجبك في الخدمة أو ما يحتاج إلى تحسين...",
    report: "إبلاغ",
    reportDescription:
      "إذا كانت هناك مشكلة أو معلومات غير صحيحة، يمكنك الإبلاغ عنها.",
    reportReason: "سبب الإبلاغ",
    spam: "رسائل مزعجة / Spam",
    wrongInformation: "معلومات غير صحيحة",
    inappropriate: "محتوى غير مناسب",
    fake: "خدمة وهمية",
    other: "سبب آخر",
    send: "إرسال",
    sending: "جارٍ الإرسال...",
    success:
      "شكرًا! تم إرسال التقييم والملاحظة بنجاح.",
    error:
      "حدث خطأ. يرجى المحاولة مرة أخرى.",
    loginRequired:
      "يجب تسجيل الدخول لإرسال التقييم.",
    reportRequired:
      "يرجى اختيار سبب الإبلاغ.",
    anonymous:
      "لن يتم عرض معلومات هويتك داخل النموذج.",
  },

  en: {
    title: "Rating & Feedback",
    description:
      "Send your rating and feedback in a simple way.",
    rating: "Rating",
    ratingRequired: "Please select a rating.",
    feedback: "Feedback",
    feedbackPlaceholder:
      "Tell us what you liked about the service or what could be improved...",
    report: "Report",
    reportDescription:
      "If there is a problem or incorrect information, you can report it.",
    reportReason: "Report reason",
    spam: "Spam",
    wrongInformation: "Wrong information",
    inappropriate: "Inappropriate",
    fake: "Fake service",
    other: "Other",
    send: "Send",
    sending: "Sending...",
    success:
      "Thank you! Your rating and feedback were submitted successfully.",
    error:
      "Something went wrong. Please try again.",
    loginRequired:
      "You must be signed in to submit a rating.",
    reportRequired:
      "Please select a report reason.",
    anonymous:
      "Your identity information is not displayed in this form.",
  },
} satisfies Record<
  LanguageCode,
  Record<string, string>
>;

export default function ProviderFeedback({
  providerId,
}: ProviderFeedbackProps) {
  const { language } = useLanguage();

  const currentLanguage = language as LanguageCode;
  const t = UI_TEXT[currentLanguage];

  const isRTL = currentLanguage !== "en";

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const [message, setMessage] = useState("");

  const [isReport, setIsReport] = useState(false);

  const [reportReason, setReportReason] =
    useState<ReportReason | "">("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (rating === 0) {
      setErrorMessage(t.ratingRequired);
      return;
    }

    if (isReport && !reportReason) {
      setErrorMessage(t.reportRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * Get current user.
       *
       * provider_reviews requires user_id,
       * so rating cannot be inserted without
       * an authenticated user.
       */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "Failed to get current user:",
          userError
        );

        setErrorMessage(t.error);
        return;
      }

      /*
       * Rating
       *
       * provider_reviews:
       * provider_id
       * user_id
       * rating
       * comment
       * status
       */
      if (user) {
        const reviewPayload = {
          provider_id: providerId,
          user_id: user.id,
          rating,
          comment:
            message.trim().length > 0
              ? message.trim()
              : null,
          status: "pending",
        };

        const {
          error: reviewError,
        } = await supabase
          .from("provider_reviews")
          .insert(reviewPayload);

        if (reviewError) {
          console.error(
            "Failed to submit provider review:",
            reviewError
          );

          setErrorMessage(t.error);
          return;
        }
      } else {
        setErrorMessage(t.loginRequired);
        return;
      }

      /*
       * Report
       *
       * feedback_reports:
       * provider_id
       * message
       * type
       * subject
       * status
       *
       * We keep the report separate from
       * provider_reviews.
       */
      if (isReport) {
        const reportPayload = {
          provider_id: providerId,
          message:
            message.trim().length > 0
              ? message.trim()
              : "User submitted a report.",
          subject: reportReason,
          type: "provider_report",
          status: "pending",
        };

        const {
          error: reportError,
        } = await supabase
          .from("feedback_reports")
          .insert(reportPayload);

        if (reportError) {
          console.error(
            "Failed to submit provider report:",
            reportError
          );

          setErrorMessage(t.error);
          return;
        }
      }

      /*
       * Reset form
       */
      setRating(0);
      setHoverRating(0);
      setMessage("");
      setIsReport(false);
      setReportReason("");

      setSuccessMessage(t.success);
    } catch (error) {
      console.error(
        "Unexpected feedback error:",
        error
      );

      setErrorMessage(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedRating =
    hoverRating || rating;

  return (
    <section
      dir={isRTL ? "rtl" : "ltr"}
      className="
        mt-8
        rounded-3xl
        border
        border-slate-200/80
        bg-white
        p-5
        shadow-sm
        dark:border-slate-800
        dark:bg-slate-900
        sm:p-7
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
            rounded-2xl
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
        className="mt-7 space-y-6"
      >
        {/* Rating */}

        <div>
          <label
            className="
              text-sm
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {t.rating}
          </label>

          <div
            className="mt-3 flex items-center gap-1"
            onMouseLeave={() =>
              setHoverRating(0)
            }
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const active =
                value <= displayedRating;

              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} / 5`}
                  aria-pressed={
                    rating === value
                  }
                  onMouseEnter={() =>
                    setHoverRating(value)
                  }
                  onClick={() =>
                    setRating(value)
                  }
                  className="
                    rounded-lg
                    p-1
                    transition-transform
                    duration-200
                    hover:scale-110
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary/50
                  "
                >
                  <Star
                    className={
                      active
                        ? "h-7 w-7 fill-amber-400 text-amber-400"
                        : "h-7 w-7 text-slate-300 dark:text-slate-700"
                    }
                  />
                </button>
              );
            })}

            {rating > 0 && (
              <span
                className="
                  ms-2
                  text-sm
                  font-semibold
                  text-slate-600
                  dark:text-slate-300
                "
              >
                {rating}/5
              </span>
            )}
          </div>
        </div>

        {/* Feedback */}

        <div>
          <label
            htmlFor="provider-feedback-message"
            className="
              text-sm
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {t.feedback}
          </label>

          <textarea
            id="provider-feedback-message"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            maxLength={2000}
            rows={5}
            placeholder={
              t.feedbackPlaceholder
            }
            className="
              mt-2
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
              focus:border-primary
              focus:ring-2
              focus:ring-primary/10
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-white
              dark:placeholder:text-slate-500
            "
          />

          <div
            className="
              mt-1
              text-end
              text-[11px]
              text-slate-400
            "
          >
            {message.length}/2000
          </div>
        </div>

        {/* Report */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            p-4
            dark:border-slate-800
            dark:bg-slate-950
          "
        >
          <label
            className="
              flex
              cursor-pointer
              items-start
              gap-3
            "
          >
            <input
              type="checkbox"
              checked={isReport}
              onChange={(e) => {
                setIsReport(
                  e.target.checked
                );

                if (!e.target.checked) {
                  setReportReason("");
                }
              }}
              className="
                mt-1
                h-4
                w-4
                rounded
                border-slate-300
                text-primary
                focus:ring-primary
              "
            />

            <span>
              <span
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                <Flag
                  className="
                    h-4
                    w-4
                    text-rose-500
                  "
                  aria-hidden="true"
                />

                {t.report}
              </span>

              <span
                className="
                  mt-1
                  block
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {t.reportDescription}
              </span>
            </span>
          </label>

          {isReport && (
            <div className="mt-4">
              <label
                htmlFor="provider-report-reason"
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                {t.reportReason}
              </label>

              <select
                id="provider-report-reason"
                value={reportReason}
                onChange={(e) =>
                  setReportReason(
                    e.target.value as
                      | ReportReason
                      | ""
                  )
                }
                className="
                  mt-2
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-3
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  focus:border-primary
                  focus:ring-2
                  focus:ring-primary/10
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-white
                "
              >
                <option value="">
                  {t.reportReason}
                </option>

                <option value="spam">
                  {t.spam}
                </option>

                <option value="wrong_information">
                  {t.wrongInformation}
                </option>

                <option value="inappropriate">
                  {t.inappropriate}
                </option>

                <option value="fake">
                  {t.fake}
                </option>

                <option value="other">
                  {t.other}
                </option>
              </select>
            </div>
          )}
        </div>

        {/* Anonymous notice */}

        <p
          className="
            text-xs
            leading-5
            text-slate-400
            dark:text-slate-500
          "
        >
          {t.anonymous}
        </p>

        {/* Success */}

        {successMessage && (
          <div
            role="status"
            className="
              flex
              items-start
              gap-3
              rounded-2xl
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-3
              text-sm
              text-emerald-700
              dark:border-emerald-900/50
              dark:bg-emerald-950/30
              dark:text-emerald-400
            "
          >
            <CheckCircle2
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
              "
            />

            <span>
              {successMessage}
            </span>
          </div>
        )}

        {/* Error */}

        {errorMessage && (
          <div
            role="alert"
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              text-red-600
              dark:border-red-900/50
              dark:bg-red-950/30
              dark:text-red-400
            "
          >
            {errorMessage}
          </div>
        )}

        {/* Submit */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            inline-flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-primary
            px-5
            py-3.5
            text-sm
            font-bold
            text-white
            shadow-md
            shadow-primary/20
            transition-all
            duration-300
            hover:bg-primary/90
            hover:shadow-lg
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Send
            className="h-4 w-4"
            aria-hidden="true"
          />

          {isSubmitting
            ? t.sending
            : t.send}
        </button>
      </form>
    </section>
  );
}