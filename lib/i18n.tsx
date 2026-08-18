"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "ckb" | "ar" | "en";

export const LANGUAGES = [
  { code: "ckb", label: "کوردی", dir: "rtl" as const },
  { code: "ar", label: "العربية", dir: "rtl" as const },
  { code: "en", label: "English", dir: "ltr" as const },
] as const;

export const TRANSLATIONS = {
  ckb: {
    brand: "بازیان هەب",
    brandTagline: "دەروازەی گەڕان و ژیان لە بازیان",

    navHome: "سەرەتا",
    navServices: "خزمەتگوزارییەکان",
    navAbout: "دەربارەی بازیان",
    navContact: "پەیوەندی",

    language: "زمان",
    darkModeLight: "چوونە دۆخی ڕووناک",
    darkModeDark: "چوونە دۆخی تاریک",
    openMenu: "کردنەوەی مینیو",
    closeMenu: "داخستنی مینیو",

    heroTitle: "ژیانی ڕۆژانەت ئاسانتر بکە",
    heroDescription:
               "هەرچیت پێویستە لە بازیان لێرە هەیە؛ ڕێنمایی گشتی، ژمارەی بەپەلە و خزمەتگوزارییە ڕۆژانەیییەکان؛ (مارکێت، چێشتخانە، تاکسی، گەیاندن و وەستای تایبەت و زیاتر هتد...) لە یەک پلاتفۆرمدا.",    searchPlaceholder: " گەڕان لە خزمەتگوزاری و بازرگانی...",
    searchAriaLabel: "گەڕان لە خزمەتگوزاری و بازرگانییەکان",
    searchButton: "گەڕان",
    map: "نەخشە",
    favorites: "دڵخوازەکان",
    servicesList: "لیستی خزمەتگوزارییەکان",

    servicesTitle: "خزمەتگوزاری و بازرگانییەکان",
    servicesDescription:
      "هەموو خزمەتگوزارییەکانی بازیان لە یەک شوێندا بدۆزەرەوە، لە خواردنگە تا وەستای شارەزا.",
    servicesFilter: "فیلتەری خزمەتگوزارییەکان",
    allServices: "هەموو",
    viewAllServices: "بینینی هەموو خزمەتگوزارییەکان",
    providers: "دابینکەر",

    aboutTitle: "دەربارەی بازیان",
    aboutDescription:
      "ناوچەی بازیان لە هەرێمی کوردستان دانیشتووە و بە سروشتی سەرسوڕهێنەر، چیاکان، ڕووبار و شوێنە مێژووییەکانییەوە ناسراوە. لە ڕێگەی BazianHub ـەوە بە ئاسانی دەتوانیت خزمەتگوزاری، بازرگانی و شوێنە گەشتیارییەکانی ناوچەکە بدۆزیتەوە و ڕاستەوخۆ پەیوەندییان پێوە بکەیت.",
    aboutCoverageTitle: "ناوچەی گەیشتنی خزمەتگوزاری و بازرگانییەکان",
    aboutCoverageDescription:
      "کۆکردنەوەی هەموو خزمەتگوزار و بازرگانییەکانی بازیان لە یەک پلاتفۆرمدا.",
    aboutSpeedTitle: "خزمەتگوزاری خێرا",
    aboutSpeedDescription:
      "گەیشتن بە خزمەتگوزارییەکان بە چەند کلیکێک، بەبێ دواکەوتن.",
    aboutTrustTitle: "متمانەپێکراو",
    aboutTrustDescription:
      "هەڵسەنگاندن و ڕایەکانی ڕاستەقینەی بەکارهێنەران بۆ هەر خزمەتگوزارێک.",

    faqTitle: "پرسیارە باوەکان",

    contactTitle: "پەیوەندیمان پێوە بکە",
    workingHoursTitle: "کاتەکانی کارکردن",
    workingHours: "هەموو ڕۆژێک: 8:00 پێش نیوەڕۆ تا 12:00 شەو",
    addressTitle: "ناونیشان",
    address: "بازیان، سلێمانی، هەرێمی کوردستان، عێراق",

    quickLinksTitle: "لینکە خێراکان",
    legalTitle: "یاسا و مەرجەکان",
    terms: "یاسا و مەرجەکان",
    privacy: "سیاسەتی تایبەتمەندی",

    footerDescription:
      "پلاتفۆرمی سەرەکی دیجیتاڵی بازیان بۆ گەیشتن بە خزمەتگوزاری، بازرگانی و گەشتیاری.",
    footerMap: "نەخشەی گەڕانی بازیان",
    footerLanguage: "زمان",
    copyright: "© 2026 بازیان هۆب. هەموو مافەکان پارێزراون.",

    placeDetails: "بینینی وردەکاری",
    addFavorite: "زیادکردن بۆ دڵخوازەکان",
    removeFavorite: "لابردن لە دڵخوازەکان",
    location: "شوێن",

    restaurant: "خواردنگە",
    pharmacy: "دەرمانخانە",
    market: "مارکێت",
    taxi: "تاکسی",
    electrician: "کارەبایی",
    painter: "بۆیەکار",
    cleaner: "پاککەرەوە",
    delivery: "گەیاندن",
    handyman: "وستا",
    tourism: "گەشتیاری",
  },

  ar: {
    brand: "بازيان هَب",
    brandTagline: "بوابتك لاستكشاف الحياة في بازيان",

    navHome: "الرئيسية",
    navServices: "الخدمات",
    navAbout: "عن بازيان",
    navContact: "اتصل بنا",

    language: "اللغة",
    darkModeLight: "التبديل إلى الوضع الفاتح",
    darkModeDark: "التبديل إلى الوضع الداكن",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",

    heroTitle: "اجعل حياتك اليومية أسهل",
    heroDescription:
      "من خدمات النقل وسيارات الأجرة والمطاعم والصيدليات إلى الخدمات الحكومية والمعلومات المحلية، جميع خدمات بازيان في مكان واحد.",
    searchPlaceholder: "ابحث عن الخدمات والأعمال التجارية...",
    searchAriaLabel: "البحث عن الخدمات والأعمال التجارية",
    searchButton: "بحث",
    map: "الخريطة",
    favorites: "المفضلة",
    servicesList: "قائمة الخدمات",

    servicesTitle: "الخدمات والأعمال التجارية",
    servicesDescription:
      "اكتشف جميع خدمات بازيان في مكان واحد، من المطاعم إلى الحرفيين المتخصصين.",
    servicesFilter: "تصفية الخدمات",
    allServices: "الكل",
    viewAllServices: "عرض جميع الخدمات",
    providers: "مزود",

    aboutTitle: "عن بازيان",
    aboutDescription:
      "تقع منطقة بازيان في إقليم كردستان وتشتهر بطبيعتها الخلابة وجبالها وأنهارها ومواقعها التاريخية. من خلال BazianHub يمكنك بسهولة اكتشاف الخدمات والأعمال والأماكن السياحية في المنطقة والتواصل معها مباشرة.",
    aboutCoverageTitle: "تغطية واسعة للخدمات والأعمال",
    aboutCoverageDescription:
      "جمع جميع مقدمي الخدمات والأعمال التجارية في بازيان ضمن منصة واحدة.",
    aboutSpeedTitle: "خدمات سريعة",
    aboutSpeedDescription:
      "الوصول إلى الخدمات خلال بضع نقرات وبدون تأخير.",
    aboutTrustTitle: "موثوق",
    aboutTrustDescription:
      "تقييمات وآراء حقيقية من المستخدمين لكل مزود خدمة.",

    faqTitle: "الأسئلة الشائعة",

    contactTitle: "تواصل معنا",
    workingHoursTitle: "ساعات العمل",
    workingHours: "كل يوم: من 8:00 صباحًا حتى 12:00 ليلًا",
    addressTitle: "العنوان",
    address: "بازيان، السليمانية، إقليم كردستان، العراق",

    quickLinksTitle: "روابط سريعة",
    legalTitle: "الشروط والأحكام",
    terms: "الشروط والأحكام",
    privacy: "سياسة الخصوصية",

    footerDescription:
      "المنصة الرقمية الرئيسية في بازيان للوصول إلى الخدمات والأعمال والسياحة.",
    footerMap: "خريطة استكشاف بازيان",
    footerLanguage: "اللغة",
    copyright: "© 2026 بازيان هَب. جميع الحقوق محفوظة.",

    placeDetails: "عرض التفاصيل",
    addFavorite: "إضافة إلى المفضلة",
    removeFavorite: "إزالة من المفضلة",
    location: "الموقع",

    restaurant: "مطعم",
    pharmacy: "صيدلية",
    market: "سوق",
    taxi: "تاكسي",
    electrician: "كهربائي",
    painter: "دهان",
    cleaner: "عامل تنظيف",
    delivery: "توصيل",
    handyman: "حرفي",
    tourism: "سياحة",
  },

  en: {
    brand: "Bazian Hub",
    brandTagline: "Your gateway to discovering life in Bazian",

    navHome: "Home",
    navServices: "Services",
    navAbout: "About Bazian",
    navContact: "Contact",

    language: "Language",
    darkModeLight: "Switch to light mode",
    darkModeDark: "Switch to dark mode",
    openMenu: "Open menu",
    closeMenu: "Close menu",

    heroTitle: "Make Your Everyday Life Easier",
    heroDescription:
      "From transportation, taxis, restaurants, and pharmacies to government services and local information, all Bazian services in one place.",
    searchPlaceholder: "Search services and businesses...",
    searchAriaLabel: "Search services and businesses",
    searchButton: "Search",
    map: "Map",
    favorites: "Favorites",
    servicesList: "Services List",

    servicesTitle: "Services & Businesses",
    servicesDescription:
      "Discover all Bazian services in one place, from restaurants to skilled professionals.",
    servicesFilter: "Service filters",
    allServices: "All",
    viewAllServices: "View all services",
    providers: "providers",

    aboutTitle: "About Bazian",
    aboutDescription:
      "Bazian is located in the Kurdistan Region and is known for its beautiful nature, mountains, rivers, and historical sites. Through BazianHub, you can easily discover local services, businesses, and tourist attractions and contact them directly.",
    aboutCoverageTitle: "Wide service & business coverage",
    aboutCoverageDescription:
      "Bringing Bazian's service providers and businesses together on one platform.",
    aboutSpeedTitle: "Fast services",
    aboutSpeedDescription:
      "Access services in just a few clicks without unnecessary delays.",
    aboutTrustTitle: "Trusted",
    aboutTrustDescription:
      "Real ratings and reviews from users for every service provider.",

    faqTitle: "Frequently Asked Questions",

    contactTitle: "Contact Us",
    workingHoursTitle: "Working Hours",
    workingHours: "Every day: 8:00 AM to 12:00 AM",
    addressTitle: "Address",
    address: "Bazian, Sulaymaniyah, Kurdistan Region, Iraq",

    quickLinksTitle: "Quick Links",
    legalTitle: "Legal",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",

    footerDescription:
      "Bazian's main digital platform for discovering services, businesses, and tourism.",
    footerMap: "Bazian Discovery Map",
    footerLanguage: "Language",
    copyright: "© 2026 Bazian Hub. All rights reserved.",

    placeDetails: "View details",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    location: "Location",

    restaurant: "Restaurant",
    pharmacy: "Pharmacy",
    market: "Market",
    taxi: "Taxi",
    electrician: "Electrician",
    painter: "Painter",
    cleaner: "Cleaner",
    delivery: "Delivery",
    handyman: "Handyman",
    tourism: "Tourism",
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.ckb;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  direction: "rtl" | "ltr";
}

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value === "ckb" || value === "ar" || value === "en";
}

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("ckb");

  useEffect(() => {
    const saved = window.localStorage.getItem(
      "bazian-language"
    );

    if (isLanguage(saved)) {
      setLanguageState(saved);
      return;
    }

    const browserLanguage =
      navigator.language.toLowerCase();

    if (browserLanguage.startsWith("ar")) {
      setLanguageState("ar");
    } else if (
      browserLanguage.startsWith("en")
    ) {
      setLanguageState("en");
    }
  }, []);

  useEffect(() => {
    const currentLanguage = LANGUAGES.find(
      (item) => item.code === language
    );

    const direction =
      currentLanguage?.dir ?? "rtl";

    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dir = direction;

    window.localStorage.setItem(
      "bazian-language",
      language
    );
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction: language === "en" ? "ltr" : "rtl",
      setLanguage: setLanguageState,
      t: (key: TranslationKey) =>
        TRANSLATIONS[language][key],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
