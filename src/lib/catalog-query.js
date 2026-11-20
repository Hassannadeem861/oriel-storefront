/**
 * Pure, isomorphic catalog helpers (no data imports) shared by Server
 * Components and client-side filtering, so the logic lives in one place.
 */

/** Minimal projection used by product cards and lists. */
export function toCard(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    compareAtPrice: p.compareAtPrice || null,
    discountPercent: p.discountPercent,
    onSale: p.onSale,
    summary: p.summary,
    image: p.images[0],
    hoverImage: p.images[1] || null,
    category: p.category,
    brand: p.brand,
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    lowStock: p.lowStock,
    isNew: Boolean(p.isNew),
    featuredRank: p.featuredRank,
    createdAt: p.createdAt,
    options: p.options,
    tags: p.tags || [],
  };
}

const normalise = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Scores a product against a free-text query; 0 means no match. */
export function scoreMatch(product, query) {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return 1;
  const name = normalise(product.name);
  const haystack = normalise(
    [product.name, product.summary, product.category?.name, product.brand?.name, ...(product.tags || [])].join(" ")
  );
  let score = 0;
  for (const term of terms) {
    if (!haystack.includes(term)) return 0;
    score += name.includes(term) ? 3 : 1;
    if (name.startsWith(term)) score += 2;
  }
  return score;
}

export function searchProducts(products, query) {
  return products
    .map((p) => ({ p, s: scoreMatch(p, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
}

const SORTERS = {
  featured: (a, b) => a.featuredRank - b.featuredRank,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => (b.rating || 0) - (a.rating || 0) || b.reviewCount - a.reviewCount,
};

/**
 * Filters and sorts products.
 * @param {object} f { q, categories[], brands[], min, max, sale, inStock, sort }
 */
export function applyFilters(products, f = {}) {
  let list = f.q ? searchProducts(products, f.q) : [...products];
  const cats = f.categories || [];
  const brands = f.brands || [];
  if (cats.length) list = list.filter((p) => cats.includes(p.category.slug));
  if (brands.length) list = list.filter((p) => brands.includes(p.brand.slug));
  if (f.min != null && f.min !== "") list = list.filter((p) => p.price >= Number(f.min));
  if (f.max != null && f.max !== "") list = list.filter((p) => p.price <= Number(f.max));
  if (f.sale) list = list.filter((p) => p.onSale);
  if (f.inStock) list = list.filter((p) => p.inStock);
  // With a search query and no explicit sort, keep relevance order.
  const sorter = SORTERS[f.sort || (f.q ? "" : "featured")];
  if (sorter) list.sort(sorter);
  return list;
}

/** Reads filter state from URLSearchParams. */
export function parseFilters(searchParams) {
  const get = (k) => searchParams.get(k);
  const list = (k) => (get(k) ? get(k).split(",").filter(Boolean) : []);
  return {
    q: get("q") || "",
    categories: list("category"),
    brands: list("brand"),
    min: get("min") || "",
    max: get("max") || "",
    sale: get("sale") === "1",
    inStock: get("stock") === "1",
    sort: get("sort") || "",
  };
}

export function priceBounds(products) {
  if (!products.length) return [0, 0];
  const prices = products.map((p) => p.price);
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}
