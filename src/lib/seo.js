import { brand, commerce } from "@/config/brand";
import { siteConfig, absoluteUrl } from "@/config/site";

/** Per-page metadata with canonical URL, Open Graph and Twitter cards. */
export function buildMetadata({ title, description, path = "/", image, noIndex = false, type = "website" } = {}) {
  const desc = description || siteConfig.description;
  const ogImage = image || siteConfig.ogImage;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: brand.name,
      title: title ? `${title} | ${brand.name}` : siteConfig.title,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 750, alt: title || brand.name }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${brand.name}` : siteConfig.title,
      description: desc,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    legalName: brand.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    email: brand.email,
    telephone: brand.phone,
    foundingDate: String(brand.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: brand.address.street,
      addressLocality: brand.address.city,
      postalCode: brand.address.postalCode,
      addressCountry: brand.address.countryCode,
    },
    sameAs: Object.values(brand.social),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

/**
 * Product structured data. Reviews in this demo are sample content, so we
 * deliberately omit aggregateRating/review to avoid misleading rich results.
 * Add them back once reviews come from verified customers.
 */
export function productLd(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    sku: product.id,
    image: product.images.map((i) => absoluteUrl(i.src)),
    brand: { "@type": "Brand", name: product.brand.name },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: commerce.currency,
      price: product.price.toFixed(2),
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: brand.name },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: commerce.returnWindowDays,
      },
    },
  };
}

export function faqLd(groups) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    ),
  };
}

export function itemListLd(products, path) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: absoluteUrl(path),
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/products/${p.slug}`),
      name: p.name,
    })),
  };
}
