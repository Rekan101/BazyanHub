import Hero from "@/components/Hero";
import { ServicesSection } from "@/components/services-section";
import { getStorySlides } from "@/lib/data/stories.server";

/*
 * Server component. The story slides are fetched here and handed down
 * through Hero to the carousel, so the client never touches Supabase
 * directly. Falls back to the mock slides when the database is
 * unconfigured or has no live stories.
 */
export default async function Home() {
  const slides = await getStorySlides();

  return (
    <div className="flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div>
        {/* HERO + STORIES */}
        <section id="hero" className="scroll-mt-24">
          <Hero slides={slides} />
        </section>

        {/* SERVICES */}
        <section id="services" className="scroll-mt-24">
          <ServicesSection />
        </section>
      </div>
    </div>
  );
}
