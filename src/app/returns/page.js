import Link from "next/link";
import PolicyPage from "@/components/common/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { commerce } from "@/config/brand";

export const metadata = buildMetadata({
  title: "Returns & refunds",
  description: `Return unused items within ${commerce.returnWindowDays} days. Free exchanges, simple refunds and a ${commerce.warrantyYears}-year warranty.`,
  path: "/returns",
});

const sections = [
  {
    id: "window",
    title: "Return window",
    body: (
      <p>
        You can return unused items in their original condition and packaging within {commerce.returnWindowDays} days of delivery. Clothing should be unworn with tags attached. Raw denim that has been hemmed can only be returned if faulty.
      </p>
    ),
  },
  {
    id: "how",
    title: "How to start a return",
    body: (
      <ol>
        <li><Link href="/contact">Contact us</Link> with your order number. You can find it in <Link href="/account/orders">your orders</Link> or your confirmation email.</li>
        <li>Tell us which items you are returning and whether you would like an exchange or a refund.</li>
        <li>We will email a prepaid return label. Pack the items securely and drop the parcel at the carrier.</li>
      </ol>
    ),
  },
  {
    id: "costs",
    title: "Costs",
    body: <p>Exchanges are free. For refunds, an $8 return-label fee is deducted, unless the item is faulty or we sent the wrong item, in which case returns are always free.</p>,
  },
  {
    id: "refunds",
    title: "Refunds",
    body: <p>Once your return arrives and is checked, we refund the original payment method within 5 business days. Your bank may take a few more days to show the credit. Original shipping costs are refunded only for faulty or incorrect items.</p>,
  },
  {
    id: "exclusions",
    title: "Items that cannot be returned",
    body: <ul><li>Personalised or made-to-order furniture.</li><li>Candles that have been burned.</li><li>Gift cards.</li></ul>,
  },
  {
    id: "warranty",
    title: "Warranty and repairs",
    body: <p>Everything we sell carries a {commerce.warrantyYears}-year warranty against manufacturing defects. After that, our repair service can often bring a piece back into use for the cost of parts.</p>,
  },
];

export default function ReturnsPage() {
  return (
    <PolicyPage
      title="Returns & refunds"
      crumb="Returns"
      description="If something is not right, we will make it easy to send it back."
      updated="1 November 2026"
      sections={sections}
    />
  );
}
