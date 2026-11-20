import Link from "next/link";
import PolicyPage from "@/components/common/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { commerce } from "@/config/brand";
import { SHIPPING_METHODS } from "@/constants/commerce";
import { formatPrice } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Shipping policy",
  description: `Delivery times, costs and international shipping details. Free tracked shipping on orders over ${formatPrice(commerce.freeShippingThreshold)}.`,
  path: "/shipping-policy",
});

const sections = [
  {
    id: "rates",
    title: "Rates and delivery times",
    body: (
      <>
        <p>All orders are dispatched from our studio within two business days and shipped with a tracking number.</p>
        <ul>
          {SHIPPING_METHODS.map((m) => (
            <li key={m.id}><strong>{m.label}</strong>: {m.description}, {formatPrice(m.price)}.</li>
          ))}
        </ul>
        <p>Standard shipping is free on orders over {formatPrice(commerce.freeShippingThreshold)} after discounts.</p>
      </>
    ),
  },
  {
    id: "international",
    title: "International orders",
    body: (
      <>
        <p>We ship to more than 40 countries. For most destinations, import duties and taxes are calculated and shown at checkout, so there is nothing more to pay on delivery.</p>
        <p>In a small number of regions duties are collected by the carrier on delivery. Where this applies, we tell you before you pay.</p>
      </>
    ),
  },
  {
    id: "furniture",
    title: "Furniture delivery",
    body: (
      <p>Sofas and larger furniture are delivered by a two-person team on a booked date. The team will carry the piece to your room of choice and remove packaging. Lead times are shown on each product page.</p>
    ),
  },
  {
    id: "tracking",
    title: "Tracking and delays",
    body: (
      <p>
        You will receive a tracking link as soon as your order ships. You can also follow progress from <Link href="/account/orders">your orders</Link>. If a parcel has not moved for five business days, <Link href="/contact">contact us</Link> and we will open an investigation with the carrier.
      </p>
    ),
  },
  {
    id: "damaged",
    title: "Damaged or missing items",
    body: <p>If something arrives damaged, please photograph the item and packaging and contact us within 7 days. We will send a replacement or issue a full refund, including shipping.</p>,
  },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping policy"
      crumb="Shipping"
      description="How, when and where we deliver, and what it costs."
      updated="1 November 2026"
      sections={sections}
    />
  );
}
