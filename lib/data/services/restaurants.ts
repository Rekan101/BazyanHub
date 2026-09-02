// lib/data/services/restaurants.ts

import type { Provider } from "@/lib/types/provider";

export const restaurants: Provider[] = [
  {
    id: "restaurant-bazian-cafe",

    name: "Bazian Cafe",

    category: "چێشتخانە",

    subcategory: "کافێ",

    description:
      "کافێیەکی مۆدێرن لە بازیان بە ژوورێکی ئارام و خزمەتگوزاریی خێرا.",

    logo: "/images/providers/restaurants/bazian-cafe.jpg",

    coverImage: "/images/providers/restaurants/bazian-cafe.jpg",

    phone: "+9647500000000",

    rating: 4.8,

    reviewCount: 124,

    verified: true,

    featured: true,

    active: true,

    location: {
      address: "ناوەندی بازیان",
      city: "بازیان",
      googleMapsUrl: "https://www.google.com/maps",
    },

    socials: {
      whatsapp: "+9647500000000",
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
      tiktok: "https://tiktok.com/",
      viber: "+9647500000000",
    },

    services: [
      "قاوە",
      "چای",
      "خواردنەوە",
      "Fast Food",
    ],

    tags: [
      "کافێ",
      "قاوە",
      "بازیان",
      "خێرا",
    ],

    hours: [
      {
        day: "یەکشەممە",
        open: "08:00",
        close: "23:00",
      },
      {
        day: "دووشەممە",
        open: "08:00",
        close: "23:00",
      },
      {
        day: "سێشەممە",
        open: "08:00",
        close: "23:00",
      },
      {
        day: "چوارشەممە",
        open: "08:00",
        close: "23:00",
      },
      {
        day: "پێنجشەممە",
        open: "08:00",
        close: "23:00",
      },
      {
        day: "هەینی",
        open: "14:00",
        close: "23:30",
      },
      {
        day: "شەممە",
        open: "08:00",
        close: "23:00",
      },
    ],
  },
];