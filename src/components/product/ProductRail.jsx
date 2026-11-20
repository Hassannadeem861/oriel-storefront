import ProductCard from "./ProductCard";

/** Horizontally scrolling product row with a section heading. */
export default function ProductRail({ title, eyebrow, products, action }) {
  if (!products?.length) return null;
  return (
    <section className="py-16 md:py-20" aria-labelledby={`rail-${title}`}>
      <div className="container-page">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            <h2 id={`rail-${title}`} className="display text-4xl md:text-5xl">{title}</h2>
          </div>
          {action}
        </div>
      </div>
      <div className="container-page">
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {products.slice(0, 8).map((p) => (
            <li key={p.id} className="w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-auto">
              <ProductCard product={p} sizes="(min-width: 1024px) 22vw, 60vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
