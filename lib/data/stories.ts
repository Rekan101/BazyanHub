// lib/data/stories.ts

/*
|--------------------------------------------------------------------------
| Story types + mock slides
|--------------------------------------------------------------------------
|
| KEEP THIS MODULE CLIENT-SAFE. It is imported by components/Stories.tsx,
| which is a client component. Nothing here may reach lib/supabase/server.ts
| or lib/supabase/queries.ts - both are `server-only` and cannot be bundled
| for the browser.
|
| The Supabase-backed lookup lives in lib/data/stories.server.ts.
|
| These types mirror the story_slides / stories tables in
| supabase-schema.sql. Expiration and scheduling are the database's job
| (stories.duration + the set_story_expiry trigger), so deliberately no
| createdAt/duration fields appear here - the query filters expired rows out
| before they ever reach the client.
|
*/

export type Story = {
  id: string;
  image: string;
  providerName: string;
  shortInfo: string;
  providerId: string;
  categoryId: string;
};

export type Slide = {
  id: string;
  title: string;
  stories: Story[];
};

/*
 * Fallback content, served whenever the database is unconfigured,
 * unreachable, or has no live slides. 6 slides x 3 stories.
 */
export const SLIDES: Slide[] = [
  {
    id: "slide-1",
    title: "ژیانی ڕۆژانەت ئاسانتر بکە",
    stories: [
      {
        id: "story-1-1",
        image: "/images/stories/story-1.webp",
        providerName: "Bazian Cafe",
        shortInfo: "کافێیەکی مۆدێرن لە ناوەندی بازیان",
        providerId: "restaurant-bazian-cafe",
        categoryId: "restaurants",
      },
      {
        id: "story-1-2",
        image: "/images/stories/story-2.webp",
        providerName: "تاکسی بازیان",
        shortInfo: "گواستنەوەی خێرا بۆ هەموو ناوچەکان",
        providerId: "vehicle-bazian-taxi",
        categoryId: "vehicles",
      },
      {
        id: "story-1-3",
        image: "/images/stories/story-3.webp",
        providerName: "مارکێتی گەورە",
        shortInfo: "هەموو پێداویستییەکانی ماڵەوە",
        providerId: "shopping-bazian-market",
        categoryId: "shopping",
      },
    ],
  },

  {
    id: "slide-2",
    title: "باشترین خزمەتگوزارییەکان لێرەن",
    stories: [
      {
        id: "story-2-1",
        image: "/images/stories/story-4.webp",
        providerName: "دەرمانخانەی بازیان",
        shortInfo: "دەرمان و ڕاوێژی تەندروستی",
        providerId: "health-bazian-pharmacy",
        categoryId: "health",
      },
      {
        id: "story-2-2",
        image: "/images/stories/story-5.webp",
        providerName: "فرۆشگای مۆبایل",
        shortInfo: "مۆبایل و ئامێری تەکنەلۆجیا",
        providerId: "mobile-bazian-store",
        categoryId: "mobile",
      },
      {
        id: "story-2-3",
        image: "/images/stories/story-6.webp",
        providerName: "سالۆنی جوانکاری",
        shortInfo: "خزمەتگوزاری جوانکاری پیشەیی",
        providerId: "beauty-bazian-salon",
        categoryId: "beauty",
      },
    ],
  },

  {
    id: "slide-3",
    title: "هەر ئێستا پەیوەندی بکە",
    stories: [
      {
        id: "story-3-1",
        image: "/images/stories/story-1.webp",
        providerName: "وەستای کارەبا",
        shortInfo: "چاککردنەوەی کارەبا بە خێرایی",
        providerId: "worker-bazian-electrician",
        categoryId: "workers",
      },
      {
        id: "story-3-2",
        image: "/images/stories/story-2.webp",
        providerName: "نوسینگەی خانووبەرە",
        shortInfo: "کڕین و فرۆشتنی موڵک",
        providerId: "estate-bazian-office",
        categoryId: "real-estate",
      },
      {
        id: "story-3-3",
        image: "/images/stories/story-3.webp",
        providerName: "پەیمانگای فێرکاری",
        shortInfo: "کۆرسی زمان و کۆمپیوتەر",
        providerId: "institute-bazian-center",
        categoryId: "institutes",
      },
    ],
  },

  {
    id: "slide-4",
    title: "کات و پارەت بپارێزە",
    stories: [
      {
        id: "story-4-1",
        image: "/images/stories/story-4.webp",
        providerName: "گەیاندنی خێرا",
        shortInfo: "گەیاندن بۆ هەموو بازیان",
        providerId: "vehicle-bazian-delivery",
        categoryId: "vehicles",
      },
      {
        id: "story-4-2",
        image: "/images/stories/story-5.webp",
        providerName: "Bazian Cafe",
        shortInfo: "ئۆفەری تایبەت بۆ ماوەیەکی کەم",
        providerId: "restaurant-bazian-cafe",
        categoryId: "restaurants",
      },
      {
        id: "story-4-3",
        image: "/images/stories/story-6.webp",
        providerName: "فرۆشگای کەلوپەل",
        shortInfo: "نرخی گونجاو و جۆری باش",
        providerId: "shopping-bazian-goods",
        categoryId: "shopping",
      },
    ],
  },

  {
    id: "slide-5",
    title: "وەستای شارەزا بدۆزەرەوە",
    stories: [
      {
        id: "story-5-1",
        image: "/images/stories/story-1.webp",
        providerName: "وەستای بۆیە",
        shortInfo: "بۆیەکردنی ماڵ و نوسینگە",
        providerId: "worker-bazian-painter",
        categoryId: "workers",
      },
      {
        id: "story-5-2",
        image: "/images/stories/story-2.webp",
        providerName: "کارەباچی سەیارە",
        shortInfo: "چاککردنەوەی کارەبای ئۆتۆمبێل",
        providerId: "vehicle-bazian-auto-electric",
        categoryId: "vehicles",
      },
      {
        id: "story-5-3",
        image: "/images/stories/story-3.webp",
        providerName: "وەستای ئاودانان",
        shortInfo: "چاککردنەوەی بۆری و ئاو",
        providerId: "worker-bazian-plumber",
        categoryId: "workers",
      },
    ],
  },

  {
    id: "slide-6",
    title: "هەموو پێداویستییەکان لە یەک جێگادا",
    stories: [
      {
        id: "story-6-1",
        image: "/images/stories/story-4.webp",
        providerName: "هەلی کاری نوێ",
        shortInfo: "دامەزراندن لە بازیان",
        providerId: "job-bazian-openings",
        categoryId: "jobs",
      },
      {
        id: "story-6-2",
        image: "/images/stories/story-5.webp",
        providerName: "سەرتاشخانە",
        shortInfo: "سەرتاشی پیاوان بە شێوازی نوێ",
        providerId: "beauty-bazian-barber",
        categoryId: "beauty",
      },
      {
        id: "story-6-3",
        image: "/images/stories/story-6.webp",
        providerName: "چێشتخانەی خێزانی",
        shortInfo: "خواردنی ڕۆژانەی خۆجێیی",
        providerId: "restaurant-bazian-family",
        categoryId: "restaurants",
      },
    ],
  },
];
