import Link from "next/link";
import { footerNav, legalNav } from "@/config/navigation";
import { brand } from "@/config/brand";
import { siteConfig } from "@/config/site";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { LogoMark } from "@/components/common/Logo";

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-night text-paper">
      <div className="container-page grid gap-14 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow !text-paper/60">The studio letter</p>
          <h2 className="display mt-4 max-w-md text-4xl md:text-5xl">
            New pieces, workshop visits and <em className="text-clay-tint">nothing else.</em>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-paper/65">
            One email a month. Unsubscribe in a click. We never share your address.
          </p>
          <NewsletterForm className="mt-8 max-w-md" />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="eyebrow !text-paper/60">{group.title}</h3>
              <ul className="mt-5 grid gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-underline text-[14px] text-paper/85 hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="container-page overflow-hidden" aria-hidden="true">
        <p className="display translate-y-[18%] text-center text-[26vw] leading-none text-paper/[0.06] select-none">
          {brand.name}
        </p>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-page flex flex-col gap-4 py-6 text-[12px] text-paper/60 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark className="h-5 w-4" />
            <span>
              © {brand.founded}–2026 {brand.legalName}. {brand.address.city}.
            </span>
          </div>
          {siteConfig.demoMode && (
            <span className="font-mono uppercase tracking-[0.12em]">Demo storefront · no real transactions</span>
          )}
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-paper">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
