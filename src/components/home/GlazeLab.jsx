"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Lazy3D from "@/components/three/Lazy3D";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { ROUTES } from "@/config/navigation";
import { formatPrice, cn } from "@/lib/utils";

const NOTES = {
  bone: "A soft, warm white that reads differently at every hour. Shows the speckle of the clay most clearly.",
  clay: "Iron-rich terracotta that deepens toward the shoulder where the glaze pools.",
  moss: "A quiet green-grey drawn from wet stone. Pairs well with dried grasses.",
  ink: "Deep blue-black with a gentle sheen. The most graphic of the four.",
};

/**
 * 3D configurator for a real catalog product: the chosen glaze drives both
 * the WebGL material and the variant added to the bag.
 */
export default function GlazeLab({ product }) {
  const glazeOption = product.options.find((o) => o.name === "Glaze");
  const [glaze, setGlaze] = useState(glazeOption.values[0].value);
  const { add } = useCart();
  const current = glazeOption.values.find((v) => v.value === glaze);

  return (
    <section id="glaze-lab" className="scroll-mt-20 bg-night py-20 text-paper md:py-28" aria-labelledby="glaze-title">
      <div className="container-page grid items-center gap-10 lg:grid-cols-12">
        <Lazy3D
          className="aspect-square overflow-hidden rounded-[2rem] bg-[#1d1b17] lg:col-span-7"
          fallbackSrc={product.image.src}
          fallbackAlt={product.image.alt}
          sizes="(min-width: 1024px) 56vw, 100vw"
          glaze={glaze}
          archColor="#2b2822"
        />
        <div className="lg:col-span-5 lg:pl-6">
          <p className="eyebrow !text-paper/55">The Glaze Lab · 3D</p>
          <h2 id="glaze-title" className="display mt-4 text-5xl md:text-6xl">
            Choose your glaze <em className="text-clay-tint">before</em> it is fired.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-7 text-paper/70">
            {product.name} is thrown by hand in Kyoto in four satin glazes. Turn it, compare finishes, then order the one that suits your room.
          </p>

          <fieldset className="mt-10">
            <legend className="mb-4 text-[13px]">
              Glaze: <span className="font-semibold">{current.label}</span>
            </legend>
            <div role="radiogroup" aria-label="Glaze" className="flex gap-3">
              {glazeOption.values.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  role="radio"
                  aria-checked={glaze === v.value}
                  aria-label={v.label}
                  onClick={() => setGlaze(v.value)}
                  className={cn(
                    "grid size-14 place-items-center rounded-full ring-1 ring-paper/20 ring-offset-4 ring-offset-night transition-all",
                    glaze === v.value && "ring-2 ring-paper"
                  )}
                >
                  <span className="size-11 rounded-full" style={{ backgroundColor: v.swatch }} />
                </button>
              ))}
            </div>
            <p className="mt-5 min-h-12 max-w-sm text-[14px] leading-6 text-paper/65" aria-live="polite">{NOTES[glaze]}</p>
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-paper/10 pt-8">
            <span className="font-display text-4xl">{formatPrice(product.price)}</span>
            <Button variant="light" size="lg" onClick={() => add(product, { selections: { Glaze: glaze } })}>
              Add {current.label} vessel to bag
            </Button>
          </div>
          <Link
            href={`${ROUTES.product(product.slug)}?glaze=${glaze}`}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-paper/80 hover:text-paper"
          >
            Dimensions, care and reviews <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
