import { products as productSeed } from "../seed/products";
import { categories } from "../seed/categories";
import { brands } from "../seed/brands";
import { reviews } from "../seed/reviews";

const IMAGE_ROOT = "/images/products";

const round1 = (n) => Math.round(n * 10) / 10;

function buildImages(product) {
  const images = [];
  product.media.forEach((key, index) => {
    images.push({ src: `${IMAGE_ROOT}/${key}-1.webp`, alt: index === 0 ? product.alt : `${product.name}, alternate view` });
  });
  // Detail crop of the primary photo.
  images.push({ src: `${IMAGE_ROOT}/${product.media[0]}-2.webp`, alt: `${product.name}, close-up detail` });
  return images;
}

function ratingFor(productId) {
  const list = reviews.filter((r) => r.productId === productId);
  if (!list.length) return { rating: null, reviewCount: 0 };
  const avg = list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  return { rating: round1(avg), reviewCount: list.length };
}

/**
 * Seeds the catalog: joins products with brand, category, images and
 * ratings derived from the (sample) reviews. Runs once per server process.
 */
export function seedCatalog() {
  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const brandById = Object.fromEntries(brands.map((b) => [b.id, b]));

  const catalog = productSeed.map((p, index) => {
    const category = categoryById[p.categoryId];
    const brand = brandById[p.brandId];
    const discountPercent = p.compareAtPrice
      ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
      : 0;
    return {
      ...p,
      featuredRank: p.isFeatured ? index : 1000 + index,
      images: buildImages(p),
      category: { id: category.id, slug: category.slug, name: category.name },
      brand: { id: brand.id, slug: brand.slug, name: brand.name },
      onSale: discountPercent > 0,
      discountPercent,
      inStock: p.stock > 0,
      lowStock: p.stock > 0 && p.stock <= 5,
      ...ratingFor(p.id),
    };
  });

  const categoriesWithCounts = categories.map((c) => ({
    ...c,
    productCount: catalog.filter((p) => p.categoryId === c.id).length,
  }));

  return { products: catalog, categories: categoriesWithCounts, brands, reviews };
}
