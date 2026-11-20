import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "./JsonLd";
import { breadcrumbLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

/** Visible breadcrumb trail plus BreadcrumbList structured data. */
export default function Breadcrumbs({ items, className }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("text-[13px] text-muted-foreground", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {trail.map((item, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {last || !item.href ? (
                  <span aria-current={last ? "page" : undefined} className={cn(last && "text-ink")}>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="transition-colors hover:text-ink">
                    {item.label}
                  </Link>
                )}
                {!last && <ChevronRight className="size-3.5" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(trail)} />
    </>
  );
}
