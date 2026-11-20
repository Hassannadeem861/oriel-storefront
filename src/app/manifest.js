import { brand } from "@/config/brand";

export default function manifest() {
  return {
    name: `${brand.name}: ${brand.tagline}`,
    short_name: brand.name,
    description: brand.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#f3efe7",
    theme_color: "#16140f",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
