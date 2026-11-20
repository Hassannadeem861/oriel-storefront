import Breadcrumbs from "./Breadcrumbs";
import { cn } from "@/lib/utils";

/** Consistent page intro: breadcrumb, eyebrow, display title, lede. */
export default function PageHeader({ eyebrow, title, description, breadcrumbs, children, className }) {
  return (
    <header className={cn("container-page pt-8 pb-10 md:pt-12 md:pb-14", className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-8" />}
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="display max-w-4xl text-5xl sm:text-6xl md:text-7xl">{title}</h1>
      {description && <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>}
      {children}
    </header>
  );
}
