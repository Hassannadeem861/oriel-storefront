import { Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import JsonLd from "@/components/common/JsonLd";
import { getCategories } from "@/lib/catalog";
import { organizationLd, websiteLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { brand } from "@/config/brand";

const display = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const sans = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s | ${brand.name}` },
  description: siteConfig.description,
  applicationName: brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 750, alt: brand.tagline }],
  },
  twitter: { card: "summary_large_image", site: siteConfig.twitterHandle, title: siteConfig.title, description: siteConfig.description, images: [siteConfig.ogImage] },
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: "#f3efe7",
  colorScheme: "light",
};

export default async function RootLayout({ children }) {
  const categories = (await getCategories()).map(({ slug, name, image, tagline, description, productCount }) => ({
    slug, name, image, tagline, description, productCount,
  }));

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <NextTopLoader color="#a84a2a" height={2} showSpinner={false} shadow={false} />
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>
          <AnnouncementBar />
          <SiteHeader categories={categories} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </Providers>
        <JsonLd data={organizationLd()} />
        <JsonLd data={websiteLd()} />
      </body>
    </html>
  );
}
