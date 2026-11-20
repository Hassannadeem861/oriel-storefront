import { formatPrice, cn } from "@/lib/utils";

export default function Price({ price, compareAtPrice, className, size = "md" }) {
  const sizes = { sm: "text-[14px]", md: "text-[15px]", lg: "text-2xl" };
  return (
    <p className={cn("flex items-baseline gap-2 font-medium tabular-nums", sizes[size], className)}>
      <span className={cn(compareAtPrice && "text-clay")}>
        {compareAtPrice && <span className="sr-only">Sale price </span>}
        {formatPrice(price)}
      </span>
      {compareAtPrice && (
        <s className="text-[0.85em] font-normal text-muted-foreground">
          <span className="sr-only">Original price </span>
          {formatPrice(compareAtPrice)}
        </s>
      )}
    </p>
  );
}
