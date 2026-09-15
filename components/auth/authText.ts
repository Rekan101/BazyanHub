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
      "بچۆ ژوورەوە بۆ گەیشتن بە هەژمارەکەت",
    signupTitle: "دروستکردنی هەژمار",
    signupSubtitle:
      "خۆت تۆمار بکە و دەست بکە بە بەکارهێنانی بازیان هەب",

    methodEmail: "ئیمەیل",
    methodUsername: "ناوی بەکارهێنەر",
    methodPhone: "مۆبایل",

    emailLabel: "ئیمەیل",
    emailPlaceholder: "you@example.com",

    usernameLabel: "ناوی بەکارهێنەر",
    usernamePlaceholder: "bazyan_user",
    usernameHint:
      "٣ تا ٣٠ پیت، تەنها پیتی بچووکی ئینگلیزی، ژمارە و _",

    phoneLabel: "ژمارەی مۆبایل",
    phonePlaceholder: "+9647500000000",
    phoneHint:
      "بە شێوازی نێودەوڵەتی بنووسە، بۆ نموونە ‎+964750…",

    fullNameLabel: "ناوی تەواو",
    fullNamePlaceholder: "ناوەکەت بنووسە",

    passwordLabel: "وشەی نهێنی",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "دووبارەکردنەوەی وشەی نهێنی",

    showPassword: "پیشاندانی وشەی نهێنی",
    hidePassword: "شاردنەوەی وشەی نهێنی",

    loginButton: "چوونەژوورەوە",
    signupButton: "دروستکردنی هەژمار",
    loadingButton: "چاوەڕێ بکە…",

    orDivider: "یان",
    facebookButton: "بەردەوامبوون بە فەیسبووک",

    noAccount: "هەژمارت نییە؟",
    goSignup: "هەژمار دروست بکە",
    hasAccount: "پێشتر هەژمارت هەیە؟",
    goLogin: "بچۆ ژوورەوە",

    forgotPassword: "وشەی نهێنیت لەبیرچووە؟",

    otpTitle: "پشتڕاستکردنەوەی ژمارە",
    otpSubtitle:
      "کۆدێکی ٦ ژمارەیی بۆ مۆبایلەکەت نێردرا",
    otpLabel: "کۆدی پشتڕاستکردنەوە",
    otpPlaceholder: "١٢٣٤٥٦",
    otpButton: "پشتڕاستکردنەوە",
    otpBack: "گەڕانەوە",

    errorRequired:
      "تکایە هەموو خانەکان پڕ بکەرەوە.",
    errorPasswordShort:
      "وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت.",
    errorPasswordMismatch:
      "وشە نهێنییەکان وەک یەک نین.",
    errorUsernameFormat:
      "ناوی بەکارهێنەر دروست نییە. ٣ تا ٣٠ پیتی بچووک، ژمارە و _ بەکاربهێنە.",
    errorPhoneFormat:
      "ژمارەی مۆبایل دروست نییە. بە شێوازی ‎+964… بنووسە.",

    notConfiguredTitle:
      "هێشتا پەیوەندی بە داتابەیسەوە نەکراوە",
    notConfiguredBody:
      "بۆ کارکردنی چوونەژوورەوە، پێویستە زانیاری Supabase لە ‎.env.local دابنرێت.",

    phoneNotReadyNote:
      "چوونەژوورەوە بە مۆبایل پێویستی بە ڕێکخستنی خزمەتگوزاری SMS هەیە لە Supabase. ڕووکارەکە ئامادەیە.",

    signupSuccessTitle: "هەژمارەکەت دروستکرا",
    signupSuccessBody:
      "ئێستا دەتوانیت بچیتە ژوورەوە.",

    backHome: "گەڕانەوە بۆ سەرەتا",
  },

  ar: {
    loginTitle: "مرحبًا بعودتك",
    loginSubtitle:
      "سجّل الدخول للوصول إلى حسابك",
    signupTitle: "إنشاء حساب",
    signupSubtitle:
      "سجّل وابدأ باستخدام بازيان هَب",

    methodEmail: "البريد",
    methodUsername: "اسم المستخدم",
    methodPhone: "الهاتف",

    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",

    usernameLabel: "اسم المستخدم",
    usernamePlaceholder: "bazyan_user",
    usernameHint:
      "٣ إلى ٣٠ حرفًا، أحرف إنجليزية صغيرة وأرقام و _ فقط",

    phoneLabel: "رقم الهاتف",
    phonePlaceholder: "+9647500000000",
    phoneHint:
      "اكتبه بالصيغة الدولية، مثال ‎+964750…",

    fullNameLabel: "الاسم الكامل",
    fullNamePlaceholder: "اكتب اسمك",

    passwordLabel: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "تأكيد كلمة المرور",

    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",

    loginButton: "تسجيل الدخول",
    signupButton: "إنشاء حساب",
    loadingButton: "يرجى الانتظار…",

    orDivider: "أو",
    facebookButton: "المتابعة عبر فيسبوك",

    noAccount: "ليس لديك حساب؟",
    goSignup: "أنشئ حسابًا",
    hasAccount: "لديك حساب بالفعل؟",
    goLogin: "تسجيل الدخول",

    forgotPassword: "نسيت كلمة المرور؟",

    otpTitle: "تأكيد الرقم",
    otpSubtitle:
      "أُرسل رمز من ٦ أرقام إلى هاتفك",
    otpLabel: "رمز التأكيد",
    otpPlaceholder: "١٢٣٤٥٦",
    otpButton: "تأكيد",
    otpBack: "رجوع",

    errorRequired:
      "يرجى تعبئة جميع الحقول.",
    errorPasswordShort:
      "يجب أن تتكون كلمة المرور من ٦ أحرف على الأقل.",
    errorPasswordMismatch:
      "كلمتا المرور غير متطابقتين.",
    errorUsernameFormat:
      "اسم المستخدم غير صالح. استخدم ٣ إلى ٣٠ حرفًا صغيرًا وأرقامًا و _.",
    errorPhoneFormat:
      "رقم الهاتف غير صالح. اكتبه بصيغة ‎+964…",

    notConfiguredTitle:
      "لم يتم ربط قاعدة البيانات بعد",
    notConfiguredBody:
      "لتفعيل تسجيل الدخول، يجب إضافة بيانات Supabase في ‎.env.local.",

    phoneNotReadyNote:
      "تسجيل الدخول بالهاتف يتطلب إعداد خدمة SMS في Supabase. الواجهة جاهزة.",

    signupSuccessTitle: "تم إنشاء حسابك",
    signupSuccessBody:
      "يمكنك تسجيل الدخول الآن.",

    backHome: "العودة إلى الرئيسية",
  },

  en: {
    loginTitle: "Welcome back",
    loginSubtitle:
      "Sign in to access your account",
    signupTitle: "Create account",
    signupSubtitle:
      "Sign up and start using BazyanHub",

    methodEmail: "Email",
    methodUsername: "Username",
    methodPhone: "Phone",

    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",

    usernameLabel: "Username",
    usernamePlaceholder: "bazyan_user",
    usernameHint:
      "3–30 characters: lowercase letters, numbers and _ only",

    phoneLabel: "Phone number",
    phonePlaceholder: "+9647500000000",
    phoneHint:
      "Use international format, e.g. +964750…",

    fullNameLabel: "Full name",
    fullNamePlaceholder: "Your name",

    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm password",

    showPassword: "Show password",
    hidePassword: "Hide password",

    loginButton: "Sign in",
    signupButton: "Create account",
    loadingButton: "Please wait…",

    orDivider: "or",
    facebookButton: "Continue with Facebook",

    noAccount: "Don't have an account?",
    goSignup: "Sign up",
    hasAccount: "Already have an account?",
    goLogin: "Sign in",

    forgotPassword: "Forgot your password?",

    otpTitle: "Verify your number",
    otpSubtitle:
      "We sent a 6-digit code to your phone",
    otpLabel: "Verification code",
    otpPlaceholder: "123456",
    otpButton: "Verify",
    otpBack: "Back",

    errorRequired:
      "Please fill in all fields.",
    errorPasswordShort:
      "Password must be at least 6 characters.",
    errorPasswordMismatch:
      "Passwords do not match.",
    errorUsernameFormat:
      "Invalid username. Use 3–30 lowercase letters, numbers or _.",
    errorPhoneFormat:
      "Invalid phone number. Use the +964… format.",

    notConfiguredTitle:
      "Database not connected yet",
    notConfiguredBody:
      "Sign-in needs Supabase credentials in .env.local.",

    phoneNotReadyNote:
      "Phone sign-in needs an SMS provider configured in Supabase. The UI is ready.",

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
