"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PackageX } from "lucide-react";
import OrderSummary from "./OrderSummary";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderAsync } from "@/store/services/orderService";
import { clearSelectedOrder } from "@/store/slices/orderSlice";
import { useHydrated } from "@/hooks/useHydrated";
import { asyncStatus } from "@/utils/asyncStatus";
import { ROUTES } from "@/config/navigation";

export function OrderSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-12" role="status" aria-label="Loading order">
      <div className="space-y-4 lg:col-span-7">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      <Skeleton className="h-80 rounded-3xl lg:col-span-5" />
    </div>
  );
}

/** Fetches one order through the order service and renders it. */
export default function OrderLoader({ id, header }) {
  const dispatch = useDispatch();
  const hydrated = useHydrated();
  const { selectedOrder, detail_status, detail_error } = useSelector((s) => s.order);

  useEffect(() => {
    // Wait for the session to be restored so the auth header is attached.
    if (!hydrated || !id) return;
    dispatch(getOrderAsync(id));
    return () => dispatch(clearSelectedOrder());
  }, [dispatch, hydrated, id]);

  if (!id || detail_status === asyncStatus.ERROR) {
    return (
      <EmptyState
        icon={PackageX}
        title="Order not found"
        description={detail_error || "Check the order number, or sign in to the account that placed it."}
        action={{ label: "View your orders", href: ROUTES.orders }}
      />
    );
  }
  if (!selectedOrder || selectedOrder._id !== id) return <OrderSkeleton />;

  return (
    <>
      {header?.(selectedOrder)}
      <OrderSummary order={selectedOrder} />
    </>
  );
}
