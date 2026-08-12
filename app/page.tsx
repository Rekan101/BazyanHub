import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { ServicesSection } from "@/components/services-section";
import { AboutSection } from "@/components/about-section";
import PlacesGrid from "@/components/PlacesGrid";
import { places } from "@/lib/data/places";
import { FaqSection } from "@/components/ui/faq-section";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 space-y-16 sm:space-y-24">
        {/* HERO */}
        <section id="hero" className="scroll-mt-24">
          <Hero />
        </section>

        {/* SERVICES */}
        <section id="services" className="scroll-mt-24">
          <ServicesSection />
        </section>

        {/* ABOUT + TOURISM / HISTORICAL PLACES */}
        <section id="about" className="scroll-mt-24">
          <AboutSection />
          <PlacesGrid places={places} />
        </section>

        {/* FAQ + CONTACT + FOOTER */}
        <section id="contact" className="scroll-mt-24">
          <FaqSection />
          <Footer />
        </section>
      </main>
    </div>
  );
}