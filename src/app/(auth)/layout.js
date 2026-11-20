import Image from "next/image";
import { brand } from "@/config/brand";

export default function AuthLayout({ children }) {
  return (
    <div className="container-page grid gap-10 py-8 pb-20 lg:grid-cols-2 lg:gap-16 lg:py-12">
      <div className="relative hidden overflow-hidden rounded-[2rem] bg-sand lg:block">
        <Image src="/images/editorial/calm-living.webp" alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
        <blockquote className="absolute inset-x-10 bottom-10 text-paper">
          <p className="display text-4xl">“Buy less, choose well, make it last.”</p>
          <footer className="mt-3 font-mono text-[11px] tracking-[0.14em] uppercase text-paper/70">The {brand.name} standard</footer>
        </blockquote>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
