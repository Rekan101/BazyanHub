"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/data/faqs";

export function FaqSection() {
  const midpoint = Math.ceil(FAQ_ITEMS.length / 2);
  const firstColumn = FAQ_ITEMS.slice(0, midpoint);
  const secondColumn = FAQ_ITEMS.slice(midpoint);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 lg:px-8"
    >
      <h2 id="faq-heading" className="text-2xl font-bold text-text sm:text-3xl">
        پرسیارە باوەکان
      </h2>

      <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-x-6">
        <Accordion type="single" collapsible className="flex flex-col gap-4">
          {firstColumn.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Accordion type="single" collapsible className="flex flex-col gap-4">
          {secondColumn.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
