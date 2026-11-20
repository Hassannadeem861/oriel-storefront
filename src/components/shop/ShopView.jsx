"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, SearchX } from "lucide-react";
import ProductGrid, { ProductGridSkeleton } from "@/components/product/ProductGrid";
import FilterPanel from "./FilterPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { applyFilters, parseFilters, priceBounds } from "@/lib/catalog-query";
import { SORT_OPTIONS } from "@/constants/commerce";
import { formatPrice, cn } from "@/lib/utils";

const PAGE_SIZE = 12;

/** Serialises filter state back to a query string (only non-default values). */
function toQuery(f) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.categories.length) p.set("category", f.categories.join(","));
  if (f.brands.length) p.set("brand", f.brands.join(","));
  if (f.min) p.set("min", f.min);
  if (f.max) p.set("max", f.max);
  if (f.sale) p.set("sale", "1");
  if (f.inStock) p.set("stock", "1");
  if (f.sort) p.set("sort", f.sort);
  return p.toString();
}

function countBy(products, pick) {
  const map = new Map();
  for (const p of products) {
    const { value, label } = pick(p);
    map.set(value, { value, label, count: (map.get(value)?.count || 0) + 1 });
  }
  return [...map.values()];
}

/**
 * Client-side catalog browser. Filter state lives in the URL, so results are
 * shareable, bookmarkable and survive back/forward navigation.
 */
export default function ShopView({ products, fixedCategory, emptyHint }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const results = useMemo(
    () => applyFilters(products, fixedCategory ? { ...filters, categories: [fixedCategory] } : filters),
    [products, filters, fixedCategory]
  );
  const bounds = useMemo(() => priceBounds(products), [products]);
  const facets = useMemo(
    () => ({
      categories: countBy(products, (p) => ({ value: p.category.slug, label: p.category.name })),
      brands: countBy(
        fixedCategory ? products.filter((p) => p.category.slug === fixedCategory) : products,
        (p) => ({ value: p.brand.slug, label: p.brand.name })
      ),
    }),
    [products, fixedCategory]
  );

  const update = useCallback(
    (patch) => {
      const next = { ...filters, ...patch };
      const qs = toQuery(next);
      setVisible(PAGE_SIZE);
      startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    },
    [filters, pathname, router]
  );

  const chips = [
    ...(fixedCategory ? [] : filters.categories.map((c) => ({ key: `c-${c}`, label: facets.categories.find((x) => x.value === c)?.label || c, clear: { categories: filters.categories.filter((x) => x !== c) } }))),
    ...filters.brands.map((b) => ({ key: `b-${b}`, label: facets.brands.find((x) => x.value === b)?.label || b, clear: { brands: filters.brands.filter((x) => x !== b) } })),
    ...(filters.min || filters.max ? [{ key: "price", label: `${formatPrice(filters.min || bounds[0])} to ${formatPrice(filters.max || bounds[1])}`, clear: { min: "", max: "" } }] : []),
    ...(filters.sale ? [{ key: "sale", label: "On sale", clear: { sale: false } }] : []),
    ...(filters.inStock ? [{ key: "stock", label: "In stock", clear: { inStock: false } }] : []),
  ];
  const clearAll = () => update({ categories: [], brands: [], min: "", max: "", sale: false, inStock: false });

  const panel = (
    <FilterPanel filters={filters} facets={facets} bounds={bounds} hideCategories={Boolean(fixedCategory)} onChange={update} />
  );

  return (
    <div className="container-page pb-24">
      <div className="sticky top-16 z-20 -mx-4 flex items-center justify-between gap-3 border-y border-border bg-bone/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 md:top-[72px] lg:mx-0 lg:px-0">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <SlidersHorizontal aria-hidden="true" /> Filters
            {chips.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-clay text-[10px] text-white">{chips.length}</span>}
          </Button>
          <p className="text-[13px] text-muted-foreground" aria-live="polite" role="status">
            {results.length} {results.length === 1 ? "product" : "products"}
            {filters.q && <> for “<span className="text-ink">{filters.q}</span>”</>}
          </p>
        </div>
        <label className="flex items-center gap-2 text-[13px]">
          <span className="hidden text-muted-foreground sm:inline">Sort by</span>
          <NativeSelect
            value={filters.sort || (filters.q ? "" : "featured")}
            onChange={(e) => update({ sort: e.target.value === "featured" ? "" : e.target.value })}
            className="w-44 [&_select]:h-10 [&_select]:text-[13px]"
            aria-label="Sort products"
          >
            {filters.q && <option value="">Best match</option>}
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </NativeSelect>
        </label>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-40">{panel}</div>
        </aside>

        <div>
          {chips.length > 0 && (
            <ul className="mb-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {chips.map((c) => (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={() => update(c.clear)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-[12px] font-medium hover:bg-line"
                    aria-label={`Remove filter: ${c.label}`}
                  >
                    {c.label} <X className="size-3" aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clearAll} className="px-2 text-[12px] font-semibold underline underline-offset-4">
                  Clear all
                </button>
              </li>
            </ul>
          )}

          {isPending ? (
            <ProductGridSkeleton count={8} className="xl:grid-cols-3" />
          ) : results.length ? (
            <>
              <ProductGrid products={results.slice(0, visible)} className={cn("xl:grid-cols-3")} />
              {visible < results.length && (
                <div className="mt-14 flex flex-col items-center gap-3">
                  <p className="text-[13px] text-muted-foreground">
                    Showing {visible} of {results.length}
                  </p>
                  <Button variant="outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-dashed border-line px-6 py-20 text-center">
              <SearchX className="size-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-4 font-display text-3xl">Nothing matches just yet</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {emptyHint || "Try removing a filter or widening the price range."}
              </p>
              {chips.length > 0 && <Button className="mt-6" onClick={clearAll}>Clear filters</Button>}
            </div>
          )}
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="bottom" className="bg-bone">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>{results.length} matching products</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto px-6 py-6">{panel}</div>
          <div className="grid grid-cols-2 gap-2 border-t border-border p-4">
            <Button variant="outline" onClick={clearAll}>Clear all</Button>
            <Button onClick={() => setMobileOpen(false)}>Show {results.length} results</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** Server-rendered fallback: the unfiltered grid, so the page is useful before JS. */
export function ShopFallback({ products }) {
  return (
    <div className="container-page pb-24">
      <div className="border-y border-border py-3">
        <p className="text-[13px] text-muted-foreground">{products.length} products</p>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block" />
        {products.length ? <ProductGrid products={products} className="xl:grid-cols-3" /> : <ProductGridSkeleton />}
      </div>
    </div>
  );
}
