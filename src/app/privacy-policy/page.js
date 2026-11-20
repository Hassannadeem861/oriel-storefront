import PolicyPage from "@/components/common/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { brand } from "@/config/brand";

export const metadata = buildMetadata({
  title: "Privacy policy",
  description: `How ${brand.name} collects, uses and protects your personal information.`,
  path: "/privacy-policy",
});

const sections = [
  {
    id: "who",
    title: "Who we are",
    body: <p>{brand.legalName} (“{brand.name}”, “we”) operates this website from {brand.address.city}, {brand.address.country}. We are the controller of the personal data described in this policy. You can reach us at {brand.email}.</p>,
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <ul>
        <li><strong>Account and order details</strong>: name, email, delivery address, phone number and order history.</li>
        <li><strong>Payment details</strong>: handled by our payment provider. We never store full card numbers.</li>
        <li><strong>Usage data</strong>: pages visited and device information, collected only with your consent where required.</li>
        <li><strong>Messages</strong>: anything you send us through the contact form or by email.</li>
      </ul>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    body: <p>We use your information to process and deliver orders, provide customer care, prevent fraud, and, if you opt in, send our monthly newsletter. We do not sell your personal data.</p>,
  },
  {
    id: "storage",
    title: "This demo and your browser",
    body: <p>In this demo storefront, your bag, wishlist, account and demo orders are stored only in your browser&apos;s local storage. Nothing is sent to a server. Clearing your browser data, or using “Reset demo data” in your account, removes it.</p>,
  },
  {
    id: "rights",
    title: "Your rights",
    body: <p>Depending on where you live, you may have the right to access, correct, delete or export your data, and to object to certain processing. Contact us and we will respond within one month.</p>,
  },
  {
    id: "retention",
    title: "Retention",
    body: <p>We keep order records for as long as required for tax and accounting purposes (typically six years) and delete other data when it is no longer needed.</p>,
  },
];

export default function PrivacyPage() {
  return <PolicyPage title="Privacy policy" crumb="Privacy" description="Plain-language detail on the data we hold and why." updated="1 November 2026" sections={sections} />;
}
