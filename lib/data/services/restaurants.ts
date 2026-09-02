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

  {
    id: "restaurant-food-house",

    name: "Food House",

    category: "چێشتخانە",

    subcategory: "چێشتخانە",

    description:
      "چێشتخانەیەکی خۆش و گونجاو بۆ خێزان و هاوڕێیان لە بازیان.",

    logo: "/images/providers/restaurants/food-houseL.jpg",

    coverImage: "/images/providers/restaurants/food-house.jpg",

    phone: "+9647500000001",

    rating: 4.6,

    reviewCount: 86,

    verified: true,

    featured: false,

    active: true,

    location: {
      address: "بازیان",
      city: "بازیان",
      googleMapsUrl: "https://www.google.com/maps",
    },

    socials: {
      whatsapp: "+9647500000001",
      instagram: "https://instagram.com/",
      facebook: "https://facebook.com/",
    },

    services: [
      "خواردنی خێرا",
      "خواردنی خێزانی",
      "خواردنەوە",
    ],

    tags: [
      "چێشتخانە",
      "خواردن",
      "بازیان",
    ],

    hours: [
      {
        day: "یەکشەممە",
        open: "09:00",
        close: "22:00",
      },
      {
        day: "دووشەممە",
        open: "09:00",
        close: "22:00",
      },
      {
        day: "سێشەممە",
        open: "09:00",
        close: "22:00",
      },
      {
        day: "چوارشەممە",
        open: "09:00",
        close: "22:00",
      },
      {
        day: "پێنجشەممە",
        open: "09:00",
        close: "22:00",
      },
      {
        day: "هەینی",
        open: "14:00",
        close: "22:30",
      },
      {
        day: "شەممە",
        open: "09:00",
        close: "22:00",
      },
    ],
  },

  {
    id: "restaurant-aland",

    name: "Restaurant Aland",

    category: "چێشتخانە",

    subcategory: "چێشتخانە",

    description:
      "چێشتخانەیەکی ناوخۆیی بۆ خواردنی کوردی و خواردنی جۆراوجۆر.",

    logo: "/images/providers/restaurants/restaurant-aland.jpg",

    coverImage: "/images/providers/restaurants/restaurant-aland.jpg",

    phone: "+9647500000002",

    rating: 4.5,

    reviewCount: 61,

    verified: false,

    featured: false,

    active: true,

    location: {
      address: "بازیان",
      city: "بازیان",
      googleMapsUrl: "https://www.google.com/maps",
    },

    socials: {
      whatsapp: "+9647500000002",
      facebook: "https://facebook.com/",
    },

    services: [
      "خواردنی کوردی",
      "خواردنی خێزانی",
      "چێشت",
    ],

    tags: [
      "کوردی",
      "چێشتخانە",
      "بازیان",
    ],

    hours: [
      {
        day: "یەکشەممە",
        open: "10:00",
        close: "22:00",
      },
      {
        day: "دووشەممە",
        open: "10:00",
        close: "22:00",
      },
      {
        day: "سێشەممە",
        open: "10:00",
        close: "22:00",
      },
      {
        day: "چوارشەممە",
        open: "10:00",
        close: "22:00",
      },
      {
        day: "پێنجشەممە",
        open: "10:00",
        close: "22:00",
      },
      {
        day: "هەینی",
        open: "14:00",
        close: "22:30",
      },
      {
        day: "شەممە",
        open: "10:00",
        close: "22:00",
      },
    ],
  },
];