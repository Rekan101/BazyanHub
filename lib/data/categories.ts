export type ServiceFilter = {
  id: string;
  label: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  icon: string;
  filters: ServiceFilter[];
  imageSrc: string;
  popular?: boolean;
  featured?: boolean;
};

export const categories: ServiceCategory[] = [
  {
    id: "vehicles",
    title: "سەیارە و گواستنەوە",
    icon: "car",
    imageSrc: "/images/vehicles.webp",
    featured: true,
    filters: [
      {
        id: "taxi",
        label: "تاکسی",
      },
      {
        id: "pickup",
        label: "پیکاپ",
      },
      {
        id: "excavator",
        label: "حەفارە",
      },
      {
        id: "shovel",
        label: "شۆڤڵ",
      },
      {
        id: "filter",
        label: "فیتەر",
      },
      {
        id: "painter",
        label: "ڕونگۆر",
      },
      {
        id: "puncture",
        label: "پەنچەرچی",
      },
      {
        id: "car-wash",
        label: "غەسل",
      },
      {
        id: "auto-electrician",
        label: "کارەباچی سەیارە",
      },
      {
        id: "spare-parts",
        label: "پارچەی یەدەگی سەیارە",
      },
    ],
  },
  {
    id: "restaurants",
    title: "خواردنگە",
    icon: "utensils",
    imageSrc: "/images/restaurants.webp",
    popular: true,
    filters: [],
  },
  {
    id: "shopping",
    title: "بازاڕ و فرۆشتن",
    icon: "shopping-cart",
    imageSrc: "/images/shopping.webp",
    featured: true,
    filters: [],
  },
  {
    id: "health",
    title: "تەندروستی",
    icon: "heart-pulse",
    imageSrc: "/images/health.webp",
    popular: true,
    filters: [],
  },
  {
    id: "mobile",
    title: "فرۆشگای مۆبایل",
    icon: "smartphone",
    imageSrc: "/images/mobile.webp",
    popular: true,
    filters: [],
  },
  {
    id: "beauty",
    title: "جوانکاری",
    icon: "scissors",
    imageSrc: "/images/beauty.webp",
    filters: [
      {
        id: "barber",
        label: "سەرتاش",
      },
      {
        id: "salon",
        label: "سالۆن",
      },
    ],
  },
  {
    id: "real-estate",
    title: "نوسینگەی خانوو و موڵک",
    icon: "house",
    imageSrc: "/images/real-estate.webp",
    featured: true,
    filters: [],
  },
  {
    id: "institutes",
    title: "پەیمانگا و کۆرس",
    icon: "graduation-cap",
    imageSrc: "/images/institutes.webp",
    filters: [],
  },
  {
    id: "workers",
    title: "وەستا و کرێکاران",
    icon: "wrench",
    imageSrc: "/images/workers.webp",
    popular: true,
    filters: [],
  },
];