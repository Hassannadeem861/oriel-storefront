"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getOrdersAsync } from "@/store/services/orderService";
import { asyncStatus } from "@/utils/asyncStatus";
import { ROUTES } from "@/config/navigation";
import { formatDate, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 5;

export default function OrderHistory() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { orders, pagination, get_status, get_error } = useSelector((s) => s.order);
  const loading = get_status === asyncStatus.LOADING || get_status === asyncStatus.IDLE;

  useEffect(() => {
    dispatch(getOrdersAsync({ page, limit: PAGE_SIZE }));
  }, [dispatch, page]);

  return (
    <div>
      <h1 className="display text-5xl md:text-6xl">Orders</h1>
      <p className="mt-3 text-muted-foreground">Track deliveries and review past purchases.</p>

      <div className="mt-10">
        {get_status === asyncStatus.ERROR ? (
          <p role="alert" className="text-destructive">{get_error}</p>
        ) : loading ? (
          <div className="space-y-4" role="status" aria-label="Loading orders">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState icon={Package} title="No orders yet" description="When you place an order it will appear here." action={{ label: "Start shopping", href: ROUTES.shop }} />
        ) : (
          <ul className="grid gap-4">
            {orders.map((o) => (
              <li key={o._id}>
                <Link href={ROUTES.order(o._id)} className="group block rounded-3xl border border-border bg-paper p-5 transition-colors hover:border-ink md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[13px]">{o._id}</p>
                      <p className="text-[13px] text-muted-foreground">Placed {formatDate(o.createdAt)}</p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <ul className="flex -space-x-3" aria-label={`${o.items.length} items`}>
                      {o.items.slice(0, 4).map((i) => (
                        <li key={`${i.productId}-${i.variant}`} className="relative size-14 overflow-hidden rounded-xl border-2 border-paper bg-sand">
                          {i.image && <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />}
                        </li>
                      ))}
                    </ul>
                    <p className="font-display text-3xl tabular-nums">{formatPrice(o.totals.total)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {pagination.totalPages > 1 && (
          <nav aria-label="Order pages" className="mt-8 flex items-center justify-center gap-3">
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page"><ChevronLeft /></Button>
            <span className="text-[13px]">Page {pagination.page} of {pagination.totalPages}</span>
            <Button variant="outline" size="icon" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next page"><ChevronRight /></Button>
          </nav>
        )}
      </div>
    </div>
  );
}
