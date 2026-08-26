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

type SocialPlatform = keyof typeof socialConfig;

function normalizeSocialUrl(
  platform: SocialPlatform,
  value: string
): string {
  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }

  if (platform === "whatsapp") {
    const cleanPhone = value.replace(/[^\d+]/g, "");

    return `https://wa.me/${cleanPhone.replace("+", "")}`;
  }

  if (platform === "viber") {
    const cleanPhone = value.replace(/[^\d+]/g, "");

    return `viber://chat?number=${encodeURIComponent(cleanPhone)}`;
  }

  return `https://${value}`;
}

function getIconSize(
  platform: SocialPlatform,
  size: ProviderSocialsProps["size"]
): string {
  if (platform === "whatsapp") {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      case "md":
      default:
        return "h-10 w-10";
    }
  }

  switch (size) {
    case "sm":
      return "h-4 w-4";
    case "lg":
      return "h-6 w-6";
    case "md":
    default:
      return "h-5 w-5";
  }
}

function getButtonSize(
  platform: SocialPlatform,
  size: ProviderSocialsProps["size"]
): string {
  if (platform === "whatsapp") {
    switch (size) {
      case "sm":
        return "h-16 w-16";
      case "lg":
        return "h-24 w-24";
      case "md":
      default:
        return "h-20 w-20";
    }
  }

  switch (size) {
    case "sm":
      return "h-10 w-10";
    case "lg":
      return "h-12 w-12";
    case "md":
    default:
      return "h-11 w-11";
  }
}

export default function ProviderSocials({
  socials,
  phone,
  size = "md",
  showLabels = true,
  className = "",
}: ProviderSocialsProps) {
  const links: Partial<ProviderSocialLinks> = {
    ...(socials ?? {}),
  };

  /*
   * Keep the existing behavior:
   * If Viber is not explicitly provided, use the provider phone.
   */
  if (phone && !links.viber) {
    links.viber = phone;
  }

  const platforms: SocialPlatform[] = [
    "viber",
    "tiktok",
    "whatsapp",
    "instagram",
    "facebook",
  ];

  return (
    <div
      className={`w-full ${className}`}
      dir="ltr"
      aria-label="Social media links"
    >
      <div className="grid w-full grid-cols-5 items-center gap-1 sm:gap-2">
        {platforms.map((platform) => {
          const config = socialConfig[platform];
          const Icon = config.icon;
          const rawValue = links[platform];
          const isWhatsApp = platform === "whatsapp";

          /*
           * Keep the five-column structure even when a provider
           * has not added a particular social platform yet.
           */
          if (!rawValue) {
            return (
              <div
                key={platform}
                className="flex min-w-0 flex-col items-center justify-center gap-1.5"
                aria-hidden="true"
              >
                <span
                  className={[
                    "flex items-center justify-center rounded-full",
                    "border border-slate-200 bg-slate-50",
                    "text-slate-300",
                    "dark:border-slate-800 dark:bg-slate-900",
                    isWhatsApp
                      ? getButtonSize(platform, size)
                      : getButtonSize(platform, size),
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      getIconSize(platform, size),
                      isWhatsApp ? "opacity-50" : "opacity-40",
                    ].join(" ")}
                    strokeWidth={1.8}
                  />
                </span>

                {showLabels && (
                  <span className="max-w-full truncate text-[9px] font-medium text-slate-300 sm:text-[10px]">
                    {config.label}
                  </span>
                )}
              </div>
            );
          }

          const href = normalizeSocialUrl(platform, rawValue);

          return (
            <div
              key={platform}
              className="flex min-w-0 flex-col items-center justify-center gap-1.5"
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${config.label}`}
                title={config.label}
                className={[
                  "group flex shrink-0 items-center justify-center rounded-full",
                  "border transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-green-500/30",
                  isWhatsApp
                    ? [
                        "border-green-200 bg-green-50 text-green-600",
                        "shadow-md shadow-green-100",
                        "hover:-translate-y-1 hover:border-green-300",
                        "hover:bg-green-100 hover:text-green-700",
                        "dark:border-green-900/50 dark:bg-green-950/30",
                      ].join(" ")
                    : [
                        "border-slate-200 bg-white text-slate-600 shadow-sm",
                        "hover:-translate-y-0.5 hover:border-green-200",
                        "hover:bg-green-50 hover:text-green-700",
                        "dark:border-slate-800 dark:bg-slate-900",
                      ].join(" "),
                  getButtonSize(platform, size),
                ].join(" ")}
              >
                <Icon
                  className={[
                    getIconSize(platform, size),
                    "shrink-0 transition-transform duration-200",
                    isWhatsApp
                      ? "group-hover:scale-105"
                      : "group-hover:scale-110",
                  ].join(" ")}
                  strokeWidth={isWhatsApp ? 1.9 : 1.8}
                />
              </a>

              {showLabels && (
                <span
                  className={[
                    "max-w-full truncate text-center font-medium",
                    isWhatsApp
                      ? "text-[10px] font-bold text-green-700 sm:text-[11px]"
                      : "text-[9px] text-slate-500 sm:text-[10px]",
                  ].join(" ")}
                >
                  {config.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}