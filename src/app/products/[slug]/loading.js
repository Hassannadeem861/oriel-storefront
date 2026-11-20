import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container-page pt-8 pb-16" role="status" aria-label="Loading product">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Skeleton className="aspect-[4/5] rounded-3xl lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-14 w-4/5" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-13 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
