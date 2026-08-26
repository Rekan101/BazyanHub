"use client";

import {
  Facebook,
  Instagram,
  MessageCircle,
  Music2,
  Phone,
} from "lucide-react";
import type { ProviderSocials as ProviderSocialLinks } from "@/lib/types/provider";

interface ProviderSocialsProps {
  socials?: ProviderSocialLinks;
  phone?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

const socialConfig = {
  viber: {
    label: "Viber",
    icon: Phone,
  },
  tiktok: {
    label: "TikTok",
    icon: Music2,
  },
  whatsapp: {
    label: "WhatsApp",
    icon: MessageCircle,
  },
  instagram: {
    label: "Instagram",
    icon: Instagram,
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
  },
} as const;

function normalizeSocialUrl(
  platform: keyof ProviderSocialLinks,
  value: string
): string {
  if (platform === "whatsapp") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    const cleanPhone = value.replace(/[^\d+]/g, "");

    return `https://wa.me/${cleanPhone.replace("+", "")}`;
  }

  if (platform === "viber") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    const cleanPhone = value.replace(/[^\d+]/g, "");

    return `viber://chat?number=${encodeURIComponent(cleanPhone)}`;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }

  return `https://${value}`;
}

function getSizeClasses(
  size: ProviderSocialsProps["size"]
): string {
  switch (size) {
    case "sm":
      return "h-9 w-9";

    case "lg":
      return "h-12 w-12";

    case "md":
    default:
      return "h-10 w-10";
  }
}

export default function ProviderSocials({
  socials,
  phone,
  size = "md",
  showLabels = false,
  className = "",
}: ProviderSocialsProps) {
  const links: Partial<ProviderSocialLinks> = {
    ...(socials ?? {}),
  };

  if (phone && !links.viber) {
    links.viber = phone;
  }

  const availablePlatforms = (
    Object.keys(socialConfig) as Array<keyof ProviderSocialLinks>
  ).filter((platform) => Boolean(links[platform]));

  if (availablePlatforms.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className}`}
      dir="ltr"
      aria-label="Social media links"
    >
      {availablePlatforms.map((platform) => {
        const config = socialConfig[platform];
        const Icon = config.icon;
        const rawValue = links[platform];

        if (!rawValue) {
          return null;
        }

        const href = normalizeSocialUrl(platform, rawValue);

        return (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${config.label}`}
            title={config.label}
            className={[
              "group inline-flex items-center justify-center gap-2",
              "rounded-xl border border-slate-200 bg-white",
              "text-slate-600 shadow-sm",
              "transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-green-200",
              "hover:bg-green-50 hover:text-green-700",
              "focus:outline-none focus:ring-2 focus:ring-green-500/30",
              getSizeClasses(size),
              showLabels ? "px-3 w-auto" : "",
            ].join(" ")}
          >
            <Icon
              className="h-4.5 w-4.5 shrink-0"
              strokeWidth={1.8}
            />

            {showLabels && (
              <span className="text-xs font-medium">
                {config.label}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}