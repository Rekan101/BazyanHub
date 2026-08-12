export interface Place {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  description: string;
  image: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface QuickAction {
  label: string;
  href: string;
  icon: "map" | "favorites" | "list" | "outage";
}
