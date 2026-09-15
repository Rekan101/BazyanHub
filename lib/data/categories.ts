export type LanguageCode = "ckb" | "ar" | "en";

export type LocalizedText = {
  ckb: string;
  ar: string;
  en: string;
};

export type ServiceFilter = {
  id: string;
  label: string;
  translations: LocalizedText;
};

export type ServiceCategory = {
  id: string;

  // Kurdish fallback for compatibility
  title: string;

  // Localized category title
  translations: LocalizedText;

  /*
   * Longer blurb shown in the category page header. Optional: most
   * categories share a generic line, supplied as a fallback at render time.
   */
  descriptions?: LocalizedText;

  icon: string;
  filters: ServiceFilter[];
  imageSrc: string;
  popular?: boolean;
  featured?: boolean;
};

/*
 * Generic blurb for categories with nothing more specific to say. Lives here
 * rather than in the page so that the database and the mock data present the
 * same shape.
 */
export const DEFAULT_CATEGORY_DESCRIPTION: LocalizedText = {
  ckb: "خزمەتگوزاری و کاروبارەکانی ئەم بەشە بدۆزەرەوە.",
  ar: "اكتشف الخدمات والأعمال التجارية في هذا القسم.",
  en: "Discover services and businesses in this category.",
};

export const categories: ServiceCategory[] = [
  {
    id: "vehicles",
    title: "سەیارە و گواستنەوە",
    translations: {
      ckb: "سەیارە و گواستنەوە",
      ar: "السيارات والنقل",
      en: "Vehicles & Transportation",
    },
    icon: "car",
    imageSrc: "/images/vehicles.webp",
    featured: true,
    filters: [
      {
        id: "taxi",
        label: "تاکسی",
        translations: {
          ckb: "تاکسی",
          ar: "تاكسي",
          en: "Taxi",
        },
      },
      {
        id: "pickup",
        label: "پیکاپ",
        translations: {
          ckb: "پیکاپ",
          ar: "بيك أب",
          en: "Pickup",
        },
      },
      {
        id: "excavator",
        label: "حەفارە",
        translations: {
          ckb: "حەفارە",
          ar: "حفارة",
          en: "Excavator",
        },
      },
      {
        id: "shovel",
        label: "شۆڤڵ",
        translations: {
          ckb: "شۆڤڵ",
          ar: "شيول",
          en: "Shovel",
        },
      },
      {
        id: "filter",
        label: "فیتەر",
        translations: {
          ckb: "فیتەر",
          ar: "فلتر",
          en: "Filter",
        },
      },
      {
        id: "painter",
        label: "ڕونگۆر",
        translations: {
          ckb: "ڕونگۆر",
          ar: "دهان سيارات",
          en: "Car Painter",
        },
      },
      {
        id: "puncture",
        label: "پەنچەرچی",
        translations: {
          ckb: "پەنچەرچی",
          ar: "بنشرجي",
          en: "Tire Repair",
        },
      },
      {
        id: "car-wash",
        label: "غەسل",
        translations: {
          ckb: "غەسل",
          ar: "غسيل سيارات",
          en: "Car Wash",
        },
      },
      {
        id: "auto-electrician",
        label: "کارەباچی سەیارە",
        translations: {
          ckb: "کارەباچی سەیارە",
          ar: "كهربائي سيارات",
          en: "Auto Electrician",
        },
      },
      {
        id: "spare-parts",
        label: "پارچەی یەدەگی سەیارە",
        translations: {
          ckb: "پارچەی یەدەگی سەیارە",
          ar: "قطع غيار السيارات",
          en: "Spare Parts",
        },
      },
    ],
  },

  {
    id: "restaurants",
    title: "خواردنگە",
    translations: {
      ckb: "خواردنگە",
      ar: "المطاعم",
      en: "Restaurants",
    },
    descriptions: {
      ckb: "چێشتخانە، کافێ و شوێنەکانی خواردن لە بازیان بدۆزەرەوە.",
      ar: "اكتشف المطاعم والمقاهي وأماكن الطعام في بازیان.",
      en: "Discover restaurants, cafes and food places in Bazian.",
    },
    icon: "utensils",
    imageSrc: "/images/restaurants.webp",
    popular: true,
    filters: [],
  },

  {
    id: "shopping",
    title: "بازاڕ و فرۆشتن",
    translations: {
      ckb: "بازاڕ و فرۆشتن",
      ar: "الأسواق والتجزئة",
      en: "Shopping & Retail",
    },
    icon: "shopping-cart",
    imageSrc: "/images/shopping.webp",
    featured: true,
    filters: [],
  },

  {
    id: "health",
    title: "تەندروستی",
    translations: {
      ckb: "تەندروستی",
      ar: "الصحة والرعاية الصحية",
      en: "Healthcare",
    },
    icon: "heart-pulse",
    imageSrc: "/images/health.webp",
    popular: true,
    filters: [],
  },

  {
    id: "mobile",
    title: "فرۆشگای مۆبایل",
    translations: {
      ckb: "فرۆشگای مۆبایل",
      ar: "متاجر الهواتف المحمولة",
      en: "Mobile Stores",
    },
    icon: "smartphone",
    imageSrc: "/images/mobile.webp",
    popular: true,
    filters: [],
  },

  {
    id: "beauty",
    title: "جوانکاری",
    translations: {
      ckb: "جوانکاری",
      ar: "التجميل وصالونات",
      en: "Beauty & Salons",
    },
    icon: "scissors",
    imageSrc: "/images/beauty.webp",
    filters: [
      {
        id: "barber",
        label: "سەرتاش",
        translations: {
          ckb: "سەرتاش",
          ar: "حلاق",
          en: "Barber",
        },
      },
      {
        id: "salon",
        label: "سالۆن",
        translations: {
          ckb: "سالۆن",
          ar: "صالون",
          en: "Salon",
        },
      },
    ],
  },

  {
    id: "real-estate",
    title: "نوسینگەی خانوو و موڵک",
    translations: {
      ckb: "نوسینگەی خانوو و موڵک",
      ar: "مكاتب العقارات",
      en: "Real Estate",
    },
    icon: "house",
    imageSrc: "/images/real-estate.webp",
    featured: true,
    filters: [],
  },

  {
    id: "institutes",
    title: "پەیمانگا و کۆرس",
    translations: {
      ckb: "پەیمانگا و کۆرس",
      ar: "المعاهد والدورات",
      en: "Institutes & Courses",
    },
    icon: "graduation-cap",
    imageSrc: "/images/institutes.webp",
    filters: [],
  },

  {
    id: "workers",
    title: "وەستا و کرێکاران",
    translations: {
      ckb: "وەستا و کرێکاران",
      ar: "الحرفيون والعمال",
      en: "Skilled Workers",
    },
    icon: "wrench",
    imageSrc: "/images/workers.webp",
    popular: true,
    filters: [],
  },

  // ─────────────────────────────────────────────
  // Jobs / Employment
  // ─────────────────────────────────────────────
  {
    id: "jobs",
    title: "هەلی کار",
    translations: {
      ckb: "هەلی کار",
      ar: "فرص العمل",
      en: "Job Opportunities",
    },
    descriptions: {
      ckb: "هەلی کار و دامەزراندنەکانی ئەم بەشە بدۆزەرەوە.",
      ar: "اكتشف فرص العمل والتوظيف في هذا القسم.",
      en: "Discover jobs and employment opportunities.",
    },
    icon: "briefcase",
    imageSrc: "/images/jobs.webp",
    featured: true,
    filters: [],
  },
];

/*
|--------------------------------------------------------------------------
| NOTE — keep this module client-safe.
|--------------------------------------------------------------------------
|
| This file is imported by client components (the home services grid, the
| favorites page). It must therefore contain data and types only: nothing
| here may reach lib/supabase/server.ts, which uses next/headers and cannot
| be bundled for the browser.
|
| The Supabase-backed lookups live in lib/data/categories.server.ts. A
| dynamic `await import()` is NOT sufficient to keep them out of the client
| bundle - the bundler still traces the edge.
|
*/
