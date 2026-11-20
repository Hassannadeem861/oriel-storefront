import { brand } from "./brand";

/** Live production URL. Override with NEXT_PUBLIC_SITE_URL (e.g. a custom domain). */
export const PRODUCTION_URL = "https://oriel-storefront.vercel.app";

// Production builds default to the live URL so canonical links, sitemap and
// Open Graph never point at localhost; local development uses localhost.
const fallbackUrl = process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000";

export const siteConfig = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || fallbackUrl).replace(/\/$/, ""),
  name: brand.name,
  title: `${brand.name} | ${brand.tagline}`,
  description: brand.description,
  ogImage: "/images/editorial/lounge-interior.webp",
  twitterHandle: "@oriel",
  /** When true the storefront runs on seeded demo data and a simulated API. */
  demoMode: !process.env.NEXT_PUBLIC_API_URL,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
};

export const absoluteUrl = (path = "/") =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
