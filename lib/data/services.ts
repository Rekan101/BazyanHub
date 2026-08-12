import {
  Utensils,
  ShoppingCart,
  Pill,
  Car,
  Bike,
  Hammer,
  Zap,
  Paintbrush,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type ServiceFilterKey =
  | "all"
  | "restaurants"
  | "markets"
  | "pharmacies"
  | "taxi"
  | "delivery"
  | "handymen"
  | "electricians"
  | "painters"
  | "cleaning";

export type ServiceTranslationKey =
  | "restaurant"
  | "market"
  | "pharmacy"
  | "taxi"
  | "delivery"
  | "handyman"
  | "electrician"
  | "painter"
  | "cleaner";

export interface ServiceCategory {
  id: string;
  filterKey: ServiceFilterKey;

  titleKey: ServiceTranslationKey;

  providerCount: number;
  href: string;
  icon: LucideIcon;
  badgeClassName: string;

  imageSrc: string;
  imageAltKey: ServiceTranslationKey;
}

export interface ServiceFilter {
  key: ServiceFilterKey;
  labelKey:
    | "allServices"
    | ServiceTranslationKey;
}

export const SERVICE_FILTERS: ServiceFilter[] = [
  {
    key: "all",
    labelKey: "allServices",
  },
  {
    key: "restaurants",
    labelKey: "restaurant",
  },
  {
    key: "markets",
    labelKey: "market",
  },
  {
    key: "pharmacies",
    labelKey: "pharmacy",
  },
  {
    key: "taxi",
    labelKey: "taxi",
  },
  {
    key: "delivery",
    labelKey: "delivery",
  },
  {
    key: "handymen",
    labelKey: "handyman",
  },
  {
    key: "electricians",
    labelKey: "electrician",
  },
  {
    key: "painters",
    labelKey: "painter",
  },
  {
    key: "cleaning",
    labelKey: "cleaner",
  },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "restaurants",
    filterKey: "restaurants",
    titleKey: "restaurant",
    providerCount: 59,
    href: "/restaurants",
    icon: Utensils,
    badgeClassName:
      "bg-orange-50 text-orange-600",
    imageSrc:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "restaurant",
  },

  {
    id: "markets",
    filterKey: "markets",
    titleKey: "market",
    providerCount: 67,
    href: "/markets",
    icon: ShoppingCart,
    badgeClassName:
      "bg-emerald-50 text-primary",
    imageSrc:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "market",
  },

  {
    id: "pharmacies",
    filterKey: "pharmacies",
    titleKey: "pharmacy",
    providerCount: 45,
    href: "/pharmacies",
    icon: Pill,
    badgeClassName:
      "bg-sky-50 text-sky-600",
    imageSrc:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "pharmacy",
  },

  {
    id: "taxi",
    filterKey: "taxi",
    titleKey: "taxi",
    providerCount: 32,
    href: "/taxi",
    icon: Car,
    badgeClassName:
      "bg-amber-50 text-amber-600",
    imageSrc:
      "https://images.unsplash.com/photo-1620891549027-942fdc95d3f5?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "taxi",
  },

  {
    id: "delivery",
    filterKey: "delivery",
    titleKey: "delivery",
    providerCount: 41,
    href: "/delivery",
    icon: Bike,
    badgeClassName:
      "bg-violet-50 text-violet-600",
    imageSrc:
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "delivery",
  },

  {
    id: "handymen",
    filterKey: "handymen",
    titleKey: "handyman",
    providerCount: 58,
    href: "/handymen",
    icon: Hammer,
    badgeClassName:
      "bg-indigo-50 text-indigo-600",
    imageSrc:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "handyman",
  },

  {
    id: "electricians",
    filterKey: "electricians",
    titleKey: "electrician",
    providerCount: 31,
    href: "/electricians",
    icon: Zap,
    badgeClassName:
      "bg-blue-50 text-blue-600",
    imageSrc:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "electrician",
  },

  {
    id: "painters",
    filterKey: "painters",
    titleKey: "painter",
    providerCount: 27,
    href: "/painters",
    icon: Paintbrush,
    badgeClassName:
      "bg-rose-50 text-rose-600",
    imageSrc:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "painter",
  },

  {
    id: "cleaning",
    filterKey: "cleaning",
    titleKey: "cleaner",
    providerCount: 21,
    href: "/cleaning",
    icon: Sparkles,
    badgeClassName:
      "bg-teal-50 text-teal-600",
    imageSrc:
      "https://images.unsplash.com/photo-1581578021450-30edcbe37ea5?auto=format&fit=crop&w=400&q=80",
    imageAltKey: "cleaner",
  },
];