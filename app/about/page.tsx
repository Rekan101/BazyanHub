import type { Metadata } from "next";

import { AboutSection } from "@/components/about-section";
import PlacesGrid from "@/components/PlacesGrid";
import { places } from "@/lib/data/places";

export const metadata: Metadata = {
  title: "دەربارەی بازیان | BazianHub",
  description:
    "دەربارەی ناوچەی بازیان و شوێنە گەشتیاری و مێژووییەکانی.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* ABOUT BAZIAN */}
      <AboutSection />

      {/* HISTORICAL / TOURIST PLACES */}
      <PlacesGrid places={places} />
    </div>
  );
}
