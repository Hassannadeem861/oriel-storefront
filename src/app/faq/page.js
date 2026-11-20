import Link from "next/link";
import PageHeader from "@/components/common/PageHeader";
import JsonLd from "@/components/common/JsonLd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqGroups } from "@/data/seed/faqs";
import { buildMetadata, faqLd } from "@/lib/seo";
import { brand } from "@/config/brand";
import { ROUTES } from "@/config/navigation";

export const metadata = buildMetadata({
  title: "Help & FAQ",
  description: "Answers about orders, international shipping, returns, warranty, repairs and sizing.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "FAQ" }]} eyebrow="Help centre" title="Questions, answered" description="Quick answers to what people ask us most. Cannot find yours? Our team replies within one business day." />
      <div className="container-page grid gap-12 pb-24 lg:grid-cols-12">
        <nav aria-label="FAQ topics" className="lg:col-span-3">
          <ul className="flex flex-wrap gap-2 lg:sticky lg:top-28 lg:flex-col">
            {faqGroups.map((g) => (
              <li key={g.title}>
                <a href={`#faq-${g.title.toLowerCase().replace(/\W+/g, "-")}`} className="block rounded-full border border-ink/15 px-4 py-2 text-[14px] hover:border-ink lg:rounded-xl lg:border-0 lg:px-0 lg:py-1 lg:text-muted-foreground lg:hover:text-ink">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-8 lg:col-start-5">
          {faqGroups.map((g) => (
            <section key={g.title} id={`faq-${g.title.toLowerCase().replace(/\W+/g, "-")}`} className="mb-14 scroll-mt-28">
              <h2 className="display mb-2 text-4xl">{g.title}</h2>
              <Accordion type="single" collapsible>
                {g.items.map((item) => (
                  <AccordionItem key={item.q} value={item.q}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
          <div className="rounded-3xl bg-ink p-8 text-paper md:p-10">
            <h2 className="display text-4xl">Still need a hand?</h2>
            <p className="mt-3 max-w-md text-paper/70">Write to {brand.supportEmail} or send us a message. {brand.hours}.</p>
            <Button asChild variant="light" className="mt-6"><Link href={ROUTES.contact}>Contact us</Link></Button>
          </div>
        </div>
      </div>
      <JsonLd data={faqLd(faqGroups)} />
    </>
  );
}
