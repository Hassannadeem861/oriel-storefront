import PolicyPage from "@/components/common/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { brand } from "@/config/brand";

export const metadata = buildMetadata({
  title: "Terms & conditions",
  description: `The terms that apply when you use the ${brand.name} website and buy from us.`,
  path: "/terms",
});

const sections = [
  {
    id: "about",
    title: "About these terms",
    body: <p>These terms apply to your use of this website and to any order you place with {brand.legalName}. By placing an order you agree to them. Please read them alongside our privacy, shipping and returns policies.</p>,
  },
  {
    id: "demo",
    title: "Demo storefront",
    body: <p>This website is currently a demonstration. Products, prices, reviews and orders are sample data. No contract of sale is formed, no payment is taken and no goods are shipped.</p>,
  },
  {
    id: "orders",
    title: "Orders and pricing",
    body: <p>All prices are shown in US dollars. An order is an offer to buy; a contract is formed when we email dispatch confirmation. If a price is shown incorrectly we will contact you before shipping and you may cancel at no cost.</p>,
  },
  {
    id: "products",
    title: "Products",
    body: <p>Many of our pieces are handmade, so small variations in colour, glaze and finish are expected and are not defects. Product photography is as accurate as possible, but screens vary.</p>,
  },
  {
    id: "liability",
    title: "Liability",
    body: <p>Nothing in these terms limits your statutory rights as a consumer. Our liability for any order is limited to the price paid, except where the law does not allow such a limit.</p>,
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of England and Wales. If you live elsewhere, you also benefit from the mandatory consumer protections of your country of residence.</p>,
  },
];

export default function TermsPage() {
  return <PolicyPage title="Terms & conditions" crumb="Terms" description="The agreement between you and us, in plain language." updated="1 November 2026" sections={sections} />;
}
