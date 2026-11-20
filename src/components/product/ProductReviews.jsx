import Rating from "./Rating";
import DemoNotice from "@/components/common/DemoNotice";
import { formatDate } from "@/lib/utils";

/** Sample reviews, always labelled as demo content. */
export default function ProductReviews({ reviews, rating }) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section id="reviews" className="container-page scroll-mt-24 border-t border-border py-16 md:py-20" aria-labelledby="reviews-title">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-3">What people say</p>
          <h2 id="reviews-title" className="display text-4xl md:text-5xl">Reviews</h2>
          {reviews.length ? (
            <>
              <div className="mt-6 flex items-end gap-3">
                <span className="font-display text-6xl leading-none">{rating.toFixed(1)}</span>
                <div className="pb-1">
                  <Rating value={rating} count={reviews.length} showCount={false} size="md" />
                  <p className="mt-1 text-[13px] text-muted-foreground">{reviews.length} sample reviews</p>
                </div>
              </div>
              <ul className="mt-6 grid gap-2" aria-label="Rating distribution">
                {distribution.map((d) => (
                  <li key={d.star} className="flex items-center gap-3 text-[12px]">
                    <span className="w-3 font-mono">{d.star}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                      <span className="block h-full bg-ink" style={{ width: `${(d.count / reviews.length) * 100}%` }} />
                    </span>
                    <span className="w-4 text-right font-mono text-muted-foreground">{d.count}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No reviews yet for this piece.</p>
          )}
          <DemoNotice className="mt-6">
            These are sample reviews written to demonstrate the layout. They are not from real customers.
          </DemoNotice>
        </div>
        {reviews.length > 0 && (
          <ul className="grid gap-4 lg:col-span-7 lg:col-start-6">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl bg-paper p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Rating value={r.rating} count={1} showCount={false} />
                  <time dateTime={r.date} className="text-[12px] text-muted-foreground">{formatDate(r.date)}</time>
                </div>
                <h3 className="mt-3 font-semibold">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-ink-soft">{r.body}</p>
                <p className="mt-4 font-mono text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
                  {r.author} · {r.country}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
