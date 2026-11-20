import "server-only";
import { seedCatalog } from "@/data/seeders/catalog";
import { toCard, applyFilters } from "./catalog-query";

/**
 * Server-side catalog repository.
 * Today it reads from seeded demo data; to connect a backend, replace the
 * bodies of these functions with API/database calls. Signatures stay the same.
 */
const db = seedCatalog();

export async function getProducts() {
  return db.products;
}

export async function getProductCards() {
  return db.products.map(toCard);
}

export async function getProductBySlug(slug) {
  return db.products.find((p) => p.slug === slug) || null;
}

export async function getCategories() {
  return db.categories;
}

export async function getCategoryBySlug(slug) {
  return db.categories.find((c) => c.slug === slug) || null;
}

export async function getBrands() {
  return db.brands;
}

export async function getProductsByCategory(slug) {
  return db.products.filter((p) => p.category.slug === slug).map(toCard);
}

export async function getFeaturedProducts(limit = 8) {
  return applyFilters(db.products, { sort: "featured" }).slice(0, limit).map(toCard);
}

export async function getNewArrivals(limit = 8) {
  return applyFilters(db.products, { sort: "newest" }).slice(0, limit).map(toCard);
}

export async function getSaleProducts() {
  return db.products.filter((p) => p.onSale).map(toCard);
}

export async function getRelatedProducts(product, limit = 4) {
  const sameCategory = db.products.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  );
  const sharedTags = db.products.filter(
    (p) =>
      p.categoryId !== product.categoryId &&
      p.tags.some((t) => product.tags.includes(t))
  );
  return [...sameCategory, ...sharedTags].slice(0, limit).map(toCard);
}

export async function getReviewsForProduct(productId) {
  return db.reviews
    .filter((r) => r.productId === productId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Lightweight index served to the client-side search dialog. */
export async function getSearchIndex() {
  return db.products.map((p) => ({
    ...toCard(p),
    tags: p.tags,
    brandName: p.brand.name,
  }));
}
