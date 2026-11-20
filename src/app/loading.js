import { ProductGridSkeleton } from "@/components/product/ProductGrid";
import { Skeleton } from "@/components/ui/skeleton";

/** Generic page skeleton shown during navigation to uncached routes. */
export default function Loading() {
  return (
    <div className="container-page pt-12 pb-24" role="status" aria-label="Loading page">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-6 h-16 w-2/3 max-w-xl" />
      <Skeleton className="mt-4 h-4 w-1/2 max-w-md" />
      <ProductGridSkeleton count={8} className="mt-14" />
    </div>
  );
}
