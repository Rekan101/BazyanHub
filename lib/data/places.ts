import type { Place } from "@/lib/types";

export type PlaceTranslations = {
  ku: string;
  ckb: string;
  ar: string;
  en: string;
};

export type PlaceWithTranslations = Place & {
  translations: PlaceTranslations;
};

export const places: PlaceWithTranslations[] = [
  {
    id: "darwish-restaurant",
    slug: "chishtxanay-derwish",
    title: "چێشتخانەی دەرویش",
    category: "خواردنگە",
    location: "شەقامی سەرەکی، بازیان",
    rating: 4.8,
    reviewCount: 214,
    description:
      "چێشتخانەیەکی نوێ و بەرین لە دڵی بازیان، ناسراو بە کەبابی تایبەتی و خزمەتگوزارییەکی گەرم.",
    image: "/images/darwish-restaurant.jpg",
    href: "/businesses/chishtxanay-derwish",

    translations: {
      ku: "چێشتخانەی دەرویش",
      ckb: "چێشتخانەی دەرویش",
      ar: "مطعم درويش",
      en: "Darwish Restaurant",
    },
  },

  {
    id: "dilezha-village",
    slug: "gundi-dilezha",
    title: "گوندی دێلێژە",
    category: "سروشتی",
    location: "دەوروبەری بازیان",
    rating: 4.9,
    reviewCount: 356,
    description:
      "شوێنێکی سروشتی سەوز و ئارام بۆ گەشت و وێنەگرتن.",
    image: "/images/dilezha-village.jpg",
    href: "/attractions/gundi-dilezha",

    translations: {
      ku: "گوندی دێلێژە",
      ckb: "گوندی دێلێژە",
      ar: "قرية ديلێژە",
      en: "Dilezha Village",
    },
  },

  {
    id: "chapa-chanara",
    slug: "chapa-chanara",
    title: "شوێنی گەشتیاری چەپە چنارە",
    category: "گەشتیاری",
    location: "دۆڵی سروشتی، بازیان",
    rating: 4.7,
    reviewCount: 189,
    description:
      "شوێنێکی سروشتی جوان و گونجاو بۆ پشوودان و گەشتی خێزانی.",
    image: "/images/chapa-chanara.webp",
    href: "/attractions/chapa-chanara",

    translations: {
      ku: "شوێنی گەشتیاری چەپە چنارە",
      ckb: "شوێنی گەشتیاری چەپە چنارە",
      ar: "موقع چەپە چنارە السياحي",
      en: "Chepa Chinara Tourist Spot",
    },
  },

  {
    id: "bazian-pass",
    slug: "darbandi-bazyan",
    title: "دەربەندی بازیان",
    category: "مێژوویی",
    location: "دەروازەی سەرەکی، بازیان",
    rating: 5.0,
    reviewCount: 512,
    description:
      "یەکێک لە ناسراوترین شوێنە مێژووییەکانی ناوچەی بازیان.",
    image: "/images/bazian-pass.webp",
    href: "/attractions/darbandi-bazyan",

    translations: {
      ku: "دەربەندی بازیان",
      ckb: "دەربەندی بازیان",
      ar: "ممر بازیان",
      en: "Bazian Pass",
    },
  },
];