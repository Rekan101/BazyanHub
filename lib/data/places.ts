import type { Place } from "@/lib/types";

export const places: Place[] = [
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
  },

  {
    id: "chapa-chanara",
    slug: "chapa-chanara",
    title: "شاخی بەستراوی بازیان",
    category: "گەشتیاری",
    location: "دۆڵی سروشتی، بازیان",
    rating: 4.7,
    reviewCount: 189,
    description:
      "شوێنێکی سروشتی جوان و گونجاو بۆ پشوودان و گەشتی خێزانی.",
    image: "/images/chapa-chanara.jpg",
    href: "/attractions/chapa-chanara",
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
    image: "/images/bazian-pass.jpg",
    href: "/attractions/darbandi-bazyan",
  },
];