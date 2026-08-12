"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Gauge,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface AboutFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as const;

export function AboutSection() {
  const { t } = useLanguage();

  const features: AboutFeature[] = [
    {
      id: "coverage",
      title: t("aboutCoverageTitle"),
      description: t("aboutCoverageDescription"),
      icon: Rocket,
    },
    {
      id: "speed",
      title: t("aboutSpeedTitle"),
      description: t("aboutSpeedDescription"),
      icon: Gauge,
    },
    {
      id: "trust",
      title: t("aboutTrustTitle"),
      description: t("aboutTrustDescription"),
      icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="about"
      className="px-4 py-16 sm:px-6 lg:px-8"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeInUp}
        className="mx-auto flex max-w-7xl flex-col gap-6"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            {t("aboutTitle")}
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-text/70 sm:text-base">
            {t("aboutDescription")}
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <li
                key={feature.id}
                className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 transition-shadow duration-300 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>

                <span className="text-sm font-semibold text-text dark:text-white">
                  {feature.title}
                </span>

                <span className="text-xs leading-relaxed text-text/60 dark:text-slate-400">
                  {feature.description}
                </span>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </section>
  );
}