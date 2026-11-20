"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Search, ArrowRight, CornerDownLeft, Loader2 } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { setSearchOpen } from "@/store/slices/uiSlice";
import { searchProducts } from "@/lib/catalog-query";
import { ROUTES } from "@/config/navigation";
import { formatPrice, cn } from "@/lib/utils";

const SUGGESTIONS = ["Headphones", "Automatic watch", "Leather", "Ceramic", "Sofa", "Keyboard"];

let indexCache = null;
async function loadIndex() {
  if (!indexCache) {
    indexCache = fetch("/api/search-index")
      .then((r) => {
        if (!r.ok) throw new Error("Search is unavailable right now");
        return r.json();
      })
      .catch((e) => {
        indexCache = null;
        throw e;
      });
  }
  return indexCache;
}

export default function SearchDialog() {
  const dispatch = useDispatch();
  const router = useRouter();
  const open = useSelector((s) => s.ui.searchOpen);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);
  const deferred = useDeferredValue(query);

  useEffect(() => {
    if (!open || index) return;
    loadIndex().then(setIndex).catch((e) => setError(e.message));
  }, [open, index]);

  const results = useMemo(
    () => (index && deferred.trim() ? searchProducts(index, deferred).slice(0, 6) : []),
    [index, deferred]
  );

  const close = () => dispatch(setSearchOpen(false));
  const submit = (q = query) => {
    if (!q.trim()) return;
    close();
    router.push(`${ROUTES.search}?q=${encodeURIComponent(q.trim())}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) { close(); router.push(ROUTES.product(results[active].slug)); }
      else submit();
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => dispatch(setSearchOpen(o))}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-night/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          data-lenis-prevent
          className="fixed inset-x-0 top-0 z-50 max-h-[100dvh] overflow-y-auto bg-bone shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top md:inset-x-auto md:top-[10vh] md:left-1/2 md:w-[min(720px,calc(100%-2rem))] md:-translate-x-1/2 md:rounded-3xl"
        >
          <DialogPrimitive.Title className="sr-only">Search the store</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Type to see matching products. Use arrow keys to move through results.
          </DialogPrimitive.Description>
          <div className="flex items-center gap-3 border-b border-border px-5">
            <Search className="size-5 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActive(0); }}
              onKeyDown={onKeyDown}
              placeholder="Search headphones, watches, ceramics…"
              aria-label="Search products"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls="search-results"
              aria-activedescendant={results[active] ? `sr-${results[active].id}` : undefined}
              className="h-16 flex-1 bg-transparent text-lg placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <DialogPrimitive.Close className="rounded-full px-3 py-1.5 text-[13px] font-semibold hover:bg-sand">Close</DialogPrimitive.Close>
          </div>

          <div className="p-5">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!query.trim() && (
              <div>
                <p className="eyebrow mb-3">Popular searches</p>
                <ul className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => setQuery(s)} className="rounded-full border border-ink/15 px-4 py-2 text-[13px] hover:border-ink">
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {query.trim() && !index && !error && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading…</p>
            )}
            {query.trim() && index && (
              <>
                <ul id="search-results" role="listbox" aria-label="Matching products" className="grid gap-1">
                  {results.map((p, i) => (
                    <li key={p.id} id={`sr-${p.id}`} role="option" aria-selected={i === active}>
                      <Link
                        href={ROUTES.product(p.slug)}
                        onClick={close}
                        onPointerEnter={() => setActive(i)}
                        className={cn("flex items-center gap-4 rounded-2xl p-2 transition-colors", i === active && "bg-sand")}
                      >
                        <span className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-sand">
                          <Image src={p.image.src} alt="" fill sizes="52px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{p.name}</span>
                          <span className="block text-[13px] text-muted-foreground">{p.category.name} · {p.brandName}</span>
                        </span>
                        <span className="text-sm tabular-nums">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {results.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No products match “{query}”. Try a broader term like “bag” or “lamp”.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => submit()}
                  className={cn(
                    "mt-3 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-sand",
                    active === results.length && results.length > 0 && "bg-sand"
                  )}
                >
                  <span className="flex items-center gap-2">See all results for “{query}” <ArrowRight className="size-4" /></span>
                  <CornerDownLeft className="size-4 text-muted-foreground" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
