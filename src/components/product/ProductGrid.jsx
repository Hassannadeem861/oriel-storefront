import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const gridClass = "grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4";

export default function ProductGrid({ products, className, priorityCount = 4 }) {
  return (
    <ul className={cn(gridClass, className)}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/5] rounded-2xl" />
      <Skeleton className="mt-4 h-2.5 w-20" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-2 h-4 w-16" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }) {
  return (
    <div className={cn(gridClass, className)} role="status" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
