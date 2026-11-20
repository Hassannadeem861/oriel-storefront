import { Globe2, Wrench, Leaf, PackageCheck } from "lucide-react";

const items = [
  { icon: Globe2, title: "Ships to 40+ countries", body: "Tracked delivery with duties shown before you pay, wherever you are." },
  { icon: Wrench, title: "Repair before replace", body: "Spare parts and a repair service for the pieces that see the most use." },
  { icon: Leaf, title: "Plastic-free packing", body: "Recycled card, paper tape and moulded pulp. Nothing that lasts longer than the product." },
  { icon: PackageCheck, title: "30-day returns", body: "Free exchanges and simple refunds if something is not right for you." },
];

export default function Principles() {
  return (
    <section className="border-y border-line bg-paper" aria-label="Our service promises">
      <ul className="container-page grid grid-cols-2 gap-x-5 gap-y-8 py-12 md:py-14 lg:grid-cols-4 lg:gap-10">
        {items.map(({ icon: Icon, title, body }) => (
          <li key={title} data-reveal>
            <Icon className="size-6 text-clay" aria-hidden="true" strokeWidth={1.5} />
            <h3 className="mt-3 text-[14px] font-semibold md:mt-4 md:text-base">{title}</h3>
            <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground md:text-[14px] md:leading-6">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
