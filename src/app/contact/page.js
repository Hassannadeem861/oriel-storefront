import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ContactForm from "@/components/forms/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { brand } from "@/config/brand";
import { ROUTES } from "@/config/navigation";

export const metadata = buildMetadata({
  title: "Contact us",
  description: `Questions about an order, a product or a repair? Contact the ${brand.name} team. We reply within one business day.`,
  path: "/contact",
});

const details = [
  { icon: Mail, label: "Email", value: brand.supportEmail, href: `mailto:${brand.supportEmail}` },
  { icon: Phone, label: "Phone", value: brand.phone, href: `tel:${brand.phone.replace(/\s/g, "")}` },
  { icon: Clock, label: "Hours", value: brand.hours },
  { icon: MapPin, label: "Studio", value: `${brand.address.street}, ${brand.address.city} ${brand.address.postalCode}, ${brand.address.country}` },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Contact" }]} eyebrow="Customer care" title="Talk to a person" description="Our small team answers every message personally, usually within one business day." />
      <div className="container-page grid gap-12 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <ul className="grid gap-6">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper"><Icon className="size-4 text-clay" aria-hidden="true" /></span>
                <div>
                  <p className="eyebrow">{label}</p>
                  {href ? <a href={href} className="mt-1 block text-[15px] font-medium hover:text-clay">{value}</a> : <p className="mt-1 text-[15px]">{value}</p>}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-3xl bg-paper p-6">
            <p className="font-semibold">Looking for a quick answer?</p>
            <p className="mt-1 text-[14px] text-muted-foreground">Shipping times, returns and warranty are covered in our help centre.</p>
            <Link href={ROUTES.faq} className="mt-3 inline-block text-[14px] font-semibold underline underline-offset-4">Visit the FAQ</Link>
          </div>
        </aside>
      </div>
    </>
  );
}
