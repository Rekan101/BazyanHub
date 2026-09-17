// components/auth/authText.ts

import type { LanguageCode } from "@/lib/data/categories";

/*
|--------------------------------------------------------------------------
| Auth UI strings
|--------------------------------------------------------------------------
|
| A local, feature-scoped text map rather than keys in lib/i18n.tsx.
|
| This follows the pattern already established by
| app/services/[category]/CategoryPageClient.tsx (UI_TEXT) and
| components/services-section.tsx (SERVICE_UI_TEXT): page-specific copy
| lives with the page. Auth adds ~40 strings, and folding those into the
| shared TranslationKey union would bloat a file every component depends on
| for strings only two routes ever use.
|
| `satisfies Record<LanguageCode, ...>` keeps the three blocks structurally
| identical, so a key missing from `ar` or `en` is a compile error here just
| as it would be in lib/i18n.tsx.
|
*/

const AUTH_TEXT = {
  ckb: {
    loginTitle: "بەخێربێیتەوە",
    loginSubtitle:
      "بە ناوی بەکارهێنەر و وشەی نهێنی بچۆ ژوورەوە",
    signupTitle: "خۆتۆمارکردن",
    signupSubtitle:
      "تەنها ناوێکی بەکارهێنەر و وشەیەکی نهێنی هەڵبژێرە",

    usernameLabel: "ناوی بەکارهێنەر",
    usernamePlaceholder: "bazyan_user",
    usernameHint:
      "٣ تا ٣٠ پیت، تەنها پیتی بچووکی ئینگلیزی، ژمارە و _",

    passwordLabel: "وشەی نهێنی",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "دووبارەکردنەوەی وشەی نهێنی",

    showPassword: "پیشاندانی وشەی نهێنی",
    hidePassword: "شاردنەوەی وشەی نهێنی",

    loginButton: "چوونەژوورەوە",
    signupButton: "خۆتۆمارکردن",
    loadingButton: "چاوەڕێ بکە…",

    noAccount: "هەژمارت نییە؟",
    goSignup: "خۆتۆمارکردن",
    hasAccount: "پێشتر هەژمارت هەیە؟",
    goLogin: "چوونەژوورەوە",

    errorRequired:
      "تکایە هەموو خانەکان پڕ بکەرەوە.",
    errorPasswordShort:
      "وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت.",
    errorPasswordMismatch:
      "وشە نهێنییەکان وەک یەک نین.",
    errorUsernameFormat:
      "ناوی بەکارهێنەر دروست نییە. ٣ تا ٣٠ پیتی بچووک، ژمارە و _ بەکاربهێنە.",

    /* Wording supplied verbatim by the product owner — do not reword. */
    errorUsernameTaken:
      "ئەم یوزەرنەیمە پێشتر بەکارهاتووە، تکایە یوزەرنەیمێکی تر بەکاربهێنە.",

    errorInvalidCredentials:
      "ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە.",

    notConfiguredTitle:
      "هێشتا پەیوەندی بە داتابەیسەوە نەکراوە",
    notConfiguredBody:
      "بۆ کارکردنی چوونەژوورەوە، پێویستە زانیاری Supabase لە ‎.env.local دابنرێت.",

    signupSuccessTitle: "هەژمارەکەت دروستکرا",
    signupSuccessBody:
      "ئێستا دەتوانیت بچیتە ژوورەوە.",

    backHome: "گەڕانەوە بۆ سەرەتا",
  },

  ar: {
    loginTitle: "مرحبًا بعودتك",
    loginSubtitle:
      "سجّل الدخول باسم المستخدم وكلمة المرور",
    signupTitle: "إنشاء حساب",
    signupSubtitle:
      "اختر اسم مستخدم وكلمة مرور فقط",

    usernameLabel: "اسم المستخدم",
    usernamePlaceholder: "bazyan_user",
    usernameHint:
      "٣ إلى ٣٠ حرفًا، أحرف إنجليزية صغيرة وأرقام و _ فقط",

    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "تأكيد كلمة المرور",

    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",

    loginButton: "تسجيل الدخول",
    signupButton: "إنشاء حساب",
    loadingButton: "يرجى الانتظار…",

    noAccount: "ليس لديك حساب؟",
    goSignup: "إنشاء حساب",
    hasAccount: "لديك حساب بالفعل؟",
    goLogin: "تسجيل الدخول",

    errorRequired:
      "يرجى تعبئة جميع الحقول.",
    errorPasswordShort:
      "يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل.",
    errorPasswordMismatch:
      "كلمتا المرور غير متطابقتين.",
    errorUsernameFormat:
      "اسم المستخدم غير صالح. استخدم ٣ إلى ٣٠ حرفًا صغيرًا وأرقامًا و _.",

    errorUsernameTaken:
      "اسم المستخدم هذا مستخدم بالفعل، يرجى اختيار اسم آخر.",

    errorInvalidCredentials:
      "اسم المستخدم أو كلمة المرور غير صحيحة.",

    notConfiguredTitle:
      "لم يتم ربط قاعدة البيانات بعد",
    notConfiguredBody:
      "لتفعيل تسجيل الدخول، يجب إضافة بيانات Supabase في ‎.env.local.",

    signupSuccessTitle: "تم إنشاء حسابك",
    signupSuccessBody:
      "يمكنك تسجيل الدخول الآن.",

    backHome: "العودة إلى الرئيسية",
  },

  en: {
    loginTitle: "Welcome back",
    loginSubtitle:
      "Sign in with your username and password",
    signupTitle: "Sign up",
    signupSubtitle:
      "Just pick a username and a password",

    usernameLabel: "Username",
    usernamePlaceholder: "bazyan_user",
    usernameHint:
      "3–30 characters: lowercase letters, numbers and _ only",

    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm password",

    showPassword: "Show password",
    hidePassword: "Hide password",

    loginButton: "Sign in",
    signupButton: "Sign up",
    loadingButton: "Please wait…",

    noAccount: "Don't have an account?",
    goSignup: "Sign up",
    hasAccount: "Already have an account?",
    goLogin: "Sign in",

    errorRequired:
      "Please fill in all fields.",
    errorPasswordShort:
      "Password must be at least 6 characters.",
    errorPasswordMismatch:
      "Passwords do not match.",
    errorUsernameFormat:
      "Invalid username. Use 3–30 lowercase letters, numbers or _.",

    errorUsernameTaken:
      "That username is already taken, please choose another one.",

    errorInvalidCredentials:
      "Incorrect username or password.",

    notConfiguredTitle:
      "Database not connected yet",
    notConfiguredBody:
      "Sign-in needs Supabase credentials in .env.local.",

    signupSuccessTitle: "Account created",
    signupSuccessBody:
      "You can sign in now.",

    backHome: "Back to home",
  },
} satisfies Record<
  LanguageCode,
  Record<string, string>
>;

export type AuthTextBlock =
  (typeof AUTH_TEXT)["ckb"];

export function getAuthText(
  language: string
): AuthTextBlock {
  if (
    language === "ar" ||
    language === "en"
  ) {
    return AUTH_TEXT[language];
  }

  return AUTH_TEXT.ckb;
}
