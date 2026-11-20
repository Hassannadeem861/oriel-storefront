import { getCategories, getProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/config/site";
import { ROUTES } from "@/config/navigation";

export default async function sitemap() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticPages = [
    { path: ROUTES.home, priority: 1, changeFrequency: "weekly" },
    { path: ROUTES.shop, priority: 0.9, changeFrequency: "daily" },
    { path: ROUTES.categories, priority: 0.8, changeFrequency: "weekly" },
    { path: ROUTES.about, priority: 0.5, changeFrequency: "monthly" },
    { path: ROUTES.contact, priority: 0.4, changeFrequency: "yearly" },
    { path: ROUTES.faq, priority: 0.5, changeFrequency: "monthly" },
    { path: ROUTES.shipping, priority: 0.3, changeFrequency: "yearly" },
    { path: ROUTES.returns, priority: 0.3, changeFrequency: "yearly" },
    { path: ROUTES.privacy, priority: 0.2, changeFrequency: "yearly" },
    { path: ROUTES.terms, priority: 0.2, changeFrequency: "yearly" },
  ].map(({ path, ...rest }) => ({ url: absoluteUrl(path), ...rest }));

  const categoryPages = categories.map((c) => ({
    url: absoluteUrl(ROUTES.category(c.slug)),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages = products.map((p) => ({
    url: absoluteUrl(ROUTES.product(p.slug)),
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
    images: [absoluteUrl(p.images[0].src)],
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
