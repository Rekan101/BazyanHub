"use client";

import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiViber,
  SiWhatsapp,
} from "react-icons/si";
import type { IconType } from "react-icons";
import type {
  ProviderSocials as ProviderSocialLinks,
} from "@/lib/types/provider";

interface ProviderSocialsProps {
  socials?: ProviderSocialLinks;
  phone?: string;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

type SocialPlatform =
  | "viber"
  | "tiktok"
  | "whatsapp"
  | "instagram"
  | "facebook";

interface SocialConfig {
  label: string;
  icon: IconType;
  color: string;
  hoverBg: string;
  hoverBorder: string;
}

const socialConfig: Record<
  SocialPlatform,
  SocialConfig
> = {
  viber: {
    label: "Viber",
    icon: SiViber,
    color: "text-[#7360F2]",
    hoverBg: "hover:bg-[#7360F2]/10",
    hoverBorder: "hover:border-[#7360F2]/30",
  },

  tiktok: {
    label: "TikTok",
    icon: SiTiktok,
    color: "text-black dark:text-white",
    hoverBg: "hover:bg-slate-100 dark:hover:bg-slate-800",
    hoverBorder:
      "hover:border-slate-300 dark:hover:border-slate-700",
  },

  whatsapp: {
    label: "WhatsApp",
    icon: SiWhatsapp,
    color: "text-[#25D366]",
    hoverBg: "hover:bg-[#25D366]/10",
    hoverBorder: "hover:border-[#25D366]/30",
  },

  instagram: {
    label: "Instagram",
    icon: SiInstagram,
    color: "text-[#E4405F]",
    hoverBg: "hover:bg-[#E4405F]/10",
    hoverBorder: "hover:border-[#E4405F]/30",
  },

  facebook: {
    label: "Facebook",
    icon: SiFacebook,
    color: "text-[#1877F2]",
    hoverBg: "hover:bg-[#1877F2]/10",
    hoverBorder: "hover:border-[#1877F2]/30",
  },
};

function normalizeSocialUrl(
  platform: SocialPlatform,
  value: string
): string {
  const trimmedValue = value.trim();

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("mailto:") ||
    trimmedValue.startsWith("tel:") ||
    trimmedValue.startsWith("viber://")
  ) {
    return trimmedValue;
  }

  if (platform === "whatsapp") {
    const cleanPhone = trimmedValue.replace(
      /[^\d+]/g,
      ""
    );

    return `https://wa.me/${cleanPhone.replace(
      "+",
      ""
    )}`;
  }

  if (platform === "viber") {
    const cleanPhone = trimmedValue.replace(
      /[^\d+]/g,
      ""
    );

    return `viber://chat?number=${encodeURIComponent(
      cleanPhone
    )}`;
  }

  return `https://${trimmedValue}`;
}

function getContainerSize(
  size: ProviderSocialsProps["size"],
  platform: SocialPlatform
): string {
  if (platform === "whatsapp") {
    switch (size) {
      case "sm":
        return "h-14 w-14";

      case "lg":
        return "h-20 w-20";

      case "md":
      default:
        return "h-16 w-16";
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

function getIconSize(
  size: ProviderSocialsProps["size"],
  platform: SocialPlatform
): string {
  if (platform === "whatsapp") {
    switch (size) {
      case "sm":
        return "text-[30px]";

      case "lg":
        return "text-[42px]";

      case "md":
      default:
        return "text-[36px]";
    }
  }

  switch (size) {
    case "sm":
      return "text-[22px]";

    case "lg":
      return "text-[27px]";

    case "md":
    default:
      return "text-[24px]";
  }
}

export default function ProviderSocials({
  socials,
  phone,
  size = "sm",
  showLabels = false,
  className = "",
}: ProviderSocialsProps) {
  const links: Partial<ProviderSocialLinks> = {
    ...(socials ?? {}),
  };

  /*
   * Keep the existing behavior:
   * phone can be used as Viber when explicit Viber
   * data is not available.
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
      <div className="grid w-full grid-cols-5 items-center gap-2">
        {platforms.map((platform) => {
          const config = socialConfig[platform];
          const Icon = config.icon;

          const rawValue =
            links[platform];

          const isWhatsApp =
            platform === "whatsapp";

          /*
           * Empty platform:
           * Keep the 5-column layout but make it visually
           * inactive instead of removing its column.
           */
          if (!rawValue) {
            return (
              <div
                key={platform}
                className="flex min-w-0 flex-col items-center justify-center"
                aria-hidden="true"
              >
                <span
                  className={[
                    "flex items-center justify-center rounded-full",
                    "bg-slate-50",
                    "text-slate-200",
                    "dark:bg-slate-900",
                    "dark:text-slate-700",
                    getContainerSize(
                      size,
                      platform
                    ),
                  ].join(" ")}
                >
                  <Icon
                    className={getIconSize(
                      size,
                      platform
                    )}
                  />
                </span>

                {showLabels && (
                  <span className="mt-1 max-w-full truncate text-[9px] font-medium text-slate-300 sm:text-[10px]">
                    {config.label}
                  </span>
                )}
              </div>
            );
          }

          const href = normalizeSocialUrl(
            platform,
            rawValue
          );

          return (
            <div
              key={platform}
              className="flex min-w-0 flex-col items-center justify-center"
            >
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${config.label}`}
                title={config.label}
                onClick={(event) => {
                  /*
                   * Prevent the click from reaching any
                   * parent interactive element.
                   */
                  event.stopPropagation();
                }}
                className={[
                  "group flex items-center justify-center rounded-full",
                  "border border-transparent",
                  "bg-white dark:bg-slate-900",
                  "transition-all duration-200",
                  "focus:outline-none",
                  "focus:ring-2 focus:ring-green-500/30",
                  config.hoverBg,
                  config.hoverBorder,
                  isWhatsApp
                    ? [
                        "shadow-md shadow-green-200/40",
                        "hover:scale-110",
                      ].join(" ")
                    : "hover:-translate-y-0.5 hover:scale-105",
                  getContainerSize(
                    size,
                    platform
                  ),
                ].join(" ")}
              >
                <Icon
                  className={[
                    getIconSize(
                      size,
                      platform
                    ),
                    config.color,
                    "shrink-0",
                    "transition-transform duration-200",
                    isWhatsApp
                      ? "group-hover:scale-105"
                      : "group-hover:scale-110",
                  ].join(" ")}
                  aria-hidden="true"
                />
              </a>

              {showLabels && (
                <span
                  className={[
                    "mt-1 max-w-full truncate text-center",
                    isWhatsApp
                      ? "text-[10px] font-bold text-[#25D366] sm:text-[11px]"
                      : "text-[9px] font-medium text-slate-500 sm:text-[10px]",
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