// lib/types/provider.ts

export type LanguageCode = "ckb" | "ar" | "en";

export type LocalizedText = {
  ckb: string;
  ar: string;
  en: string;
};

export type ProviderSocials = {
  viber?: string;
  tiktok?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
};

export type ProviderHours = {
  day: string;
  open?: string;
  close?: string;
  closed?: boolean;
};

export type ProviderLocation = {
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
};

export type Provider = {
  id: string;

  name: string;
  slug?: string;

  description?: string;

  category: string;
  subcategory?: string;

  logo?: string;
  coverImage?: string;

  phone?: string;
  secondaryPhone?: string;

  email?: string;
  website?: string;

  rating?: number;
  reviewCount?: number;

  verified?: boolean;
  featured?: boolean;
  active?: boolean;

  priceRange?: "$" | "$$" | "$$$" | "$$$$";

  location?: ProviderLocation;

  hours?: ProviderHours[];

  socials?: ProviderSocials;

  tags?: string[];

  services?: string[];

  createdAt?: string;
  updatedAt?: string;
};

export type ProviderCardProps = {
  provider: Provider;
  onClick?: (provider: Provider) => void;
  className?: string;
};

export type ProviderModalProps = {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
};