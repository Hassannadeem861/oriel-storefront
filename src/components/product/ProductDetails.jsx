import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { commerce } from "@/config/brand";
import { formatPrice } from "@/lib/utils";

/** Long-form product information in an accessible accordion. */
export default function ProductDetails({ product, brand }) {
  return (
    <Accordion type="multiple" defaultValue={["description"]} className="mt-10 border-t border-border">
      <AccordionItem value="description">
        <AccordionTrigger>Description</AccordionTrigger>
        <AccordionContent>
          {product.description.map((para) => (
            <p key={para.slice(0, 24)} className="mb-3 last:mb-0">{para}</p>
          ))}
          {product.highlights?.length > 0 && (
            <ul className="mt-4 grid gap-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-clay" aria-hidden="true" />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="specs">
        <AccordionTrigger>Specifications</AccordionTrigger>
        <AccordionContent>
          <dl className="divide-y divide-border">
            {product.specs.map((s) => (
              <div key={s.label} className="grid grid-cols-[40%_1fr] gap-4 py-2.5 text-[14px]">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping & returns</AccordionTrigger>
        <AccordionContent>
          <p>
            Standard tracked shipping is free on orders over {formatPrice(commerce.freeShippingThreshold)} and takes 5 to 8 business days.
            Express delivery takes 2 to 3 business days. {product.category.slug === "furniture" && "Furniture is delivered by a two-person team on a booked date."}
          </p>
          <p className="mt-3">
            Return unused items within {commerce.returnWindowDays} days of delivery. Exchanges are free. Every piece carries a {commerce.warrantyYears}-year warranty.
          </p>
        </AccordionContent>
      </AccordionItem>
      {brand && (
        <AccordionItem value="maker">
          <AccordionTrigger>About the maker</AccordionTrigger>
          <AccordionContent>
            <p className="font-semibold">{brand.name}</p>
            <p className="text-[13px] text-muted-foreground">{brand.origin}</p>
            <p className="mt-2">{brand.story}</p>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
