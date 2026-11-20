import Link from "next/link";
import Image from "next/image";
import Price from "./Price";
import Rating from "./Rating";
import WishlistButton from "./WishlistButton";
import CardActions from "./CardActions";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/config/navigation";
import { cn } from "@/lib/utils";

/** Product card: image swap on hover, badges, wishlist, quick view and quick add. */
export default function ProductCard({ product, priority = false, className, sizes }) {
  const colourOption = product.options?.find((o) => o.name === "Colour" || o.name === "Glaze");
  const imgSizes = sizes || "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw";

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link
        href={ROUTES.product(product.slug)}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-sand"
        aria-label={product.name}
      >
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes={imgSizes}
          priority={priority}
          className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        {product.hoverImage && (
          <Image
            src={product.hoverImage.src}
            alt=""
            fill
            sizes={imgSizes}
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {!product.inStock && <Badge variant="default">Sold out</Badge>}
          {product.inStock && product.onSale && <Badge variant="accent">−{product.discountPercent}%</Badge>}
          {product.inStock && product.isNew && <Badge variant="light">New</Badge>}
          {product.lowStock && <Badge variant="light">Only a few left</Badge>}
        </div>
      </Link>
      <WishlistButton product={product} className="absolute top-3 right-3" />
      <CardActions product={product} />

      <div className="mt-4 flex flex-1 flex-col gap-1">
        <p className="font-mono text-[10.5px] tracking-[0.14em] text-muted-foreground uppercase">{product.brand.name}</p>
        <h3 className="text-[15px] leading-snug font-semibold">
          <Link href={ROUTES.product(product.slug)} className="link-underline">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          {colourOption && (
            <ul className="flex gap-1" aria-label={`${colourOption.values.length} ${colourOption.name.toLowerCase()} options`}>
              {colourOption.values.slice(0, 4).map((v) => (
                <li
                  key={v.value}
                  title={v.label}
                  className="size-3 rounded-full ring-1 ring-ink/15"
                  style={{ backgroundColor: v.swatch }}
                />
              ))}
            </ul>
          )}
        </div>
        <Rating value={product.rating} count={product.reviewCount} className="mt-1" />
      </div>
    </article>
  );
}
