import Hero from "@/components/Hero";
import { ServicesSection } from "@/components/services-section";
import { getStorySlides } from "@/lib/data/stories.server";

/*
 * Incremental Static Regeneration: the page is served from a prerendered
 * copy and rebuilt at most once every 5 minutes.
 *
 * This works only because getStorySlides() reads through the COOKIE-FREE
 * public Supabase client. Any cookies() call in this tree would force
 * per-request rendering and lose the `○` static marker in `next build`.
 */
export const revalidate = 300;

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
