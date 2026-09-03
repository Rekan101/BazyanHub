"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/data/faqs";
import { useLanguage } from "@/lib/i18n";

export function FaqSection() {
  const { t } = useLanguage();

  const midpoint = Math.ceil(
    FAQ_ITEMS.length / 2
  );

  const firstColumn = FAQ_ITEMS.slice(
    0,
    midpoint
  );

  const secondColumn = FAQ_ITEMS.slice(midpoint);

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10"
    >
      <h2
        id="faq-heading"
        className="text-2xl font-bold text-text sm:text-3xl"
      >
        {t("faqTitle")}
      </h2>

      <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-x-6">
        <Accordion
          type="single"
          collapsible
          className="flex flex-col gap-4"
        >
          {firstColumn.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
            >
              <AccordionTrigger>
                {item.question}
              </AccordionTrigger>

              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="flex flex-col gap-4"
        >
          {secondColumn.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
            >
              <AccordionTrigger>
                {item.question}
              </AccordionTrigger>

              <AccordionContent>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}