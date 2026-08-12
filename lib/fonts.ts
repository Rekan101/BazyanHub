import { Vazirmatn } from "next/font/google";

export const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
  preload: true,
  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
});