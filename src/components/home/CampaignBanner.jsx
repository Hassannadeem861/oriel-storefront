import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { featuredCampaign } from "@/data/seed/promotions";

export default function CampaignBanner() {
  const c = featuredCampaign;
  return (
    <section className="container-page py-6" aria-labelledby="campaign-title">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-moss text-paper">
        <Image src={c.image} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/80 via-night/40 to-transparent" />
        <div className="max-w-xl px-6 py-16 sm:px-12 md:py-24">
          <p className="eyebrow !text-paper/70" data-reveal>{c.eyebrow}</p>
          <h2 id="campaign-title" className="display mt-4 text-5xl md:text-6xl" data-reveal>{c.title}</h2>
          <p className="mt-5 text-[15px] leading-7 text-paper/80" data-reveal>{c.body}</p>
          <Button asChild variant="light" size="lg" className="mt-8" data-reveal>
            <Link href={c.href}>
              {c.cta} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
