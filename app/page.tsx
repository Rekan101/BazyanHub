import Hero from "@/components/Hero";
import { ServicesSection } from "@/components/services-section";

export default function Home() {
  return (
    <div className="flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="space-y-16 sm:space-y-24">
        {/* HERO + STORIES */}
        <section id="hero" className="scroll-mt-24">
          <Hero />
        </section>

        {/* SERVICES */}
        <section id="services" className="scroll-mt-24">
          <ServicesSection />
        </section>
      </div>
    </div>
  );
}
