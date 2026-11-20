"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, Package, UserRound, MapPin, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import ProfileForm from "./ProfileForm";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getOrdersAsync } from "@/store/services/orderService";
import { logout } from "@/store/slices/authSlice";
import { resetOrders } from "@/store/slices/orderSlice";
import { asyncStatus } from "@/utils/asyncStatus";
import { resetDb } from "@/mock/db";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/config/navigation";
import { COUNTRIES } from "@/constants/commerce";
import { formatDate, formatPrice } from "@/lib/utils";

function Card({ title, icon: Icon, children, action }) {
  return (
    <section className="rounded-3xl bg-paper p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2.5 text-[15px] font-semibold">
          <Icon className="size-4 text-clay" aria-hidden="true" /> {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function AccountOverview() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user_data);
  const wishlistCount = useSelector((s) => s.wishlist.items.length);
  const { orders, pagination, get_status } = useSelector((s) => s.order);
  const address = user?.addresses?.find((a) => a.isDefault);

  useEffect(() => {
    dispatch(getOrdersAsync({ page: 1, limit: 50 }));
  }, [dispatch]);

  const resetDemo = () => {
    resetDb();
    dispatch(logout());
    dispatch(resetOrders());
    toast.success("Demo data has been reset");
    window.location.assign(ROUTES.login);
  };

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="display text-5xl md:text-6xl">Hello, {user?.firstName}.</h1>
        <p className="mt-3 text-muted-foreground">Member since {user?.createdAt ? formatDate(user.createdAt) : "today"}.</p>
      </div>

      <dl className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {[
          { label: "Orders", value: get_status === asyncStatus.SUCCEEDED ? pagination.total : "–", href: ROUTES.orders },
          { label: "Saved pieces", value: wishlistCount, href: ROUTES.wishlist },
          { label: "Lifetime spend", value: get_status === asyncStatus.SUCCEEDED ? formatPrice(orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.totals.total, 0)) : "–", href: ROUTES.orders },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="rounded-2xl border border-border p-5 transition-colors hover:border-ink">
            <dt className="eyebrow">{s.label}</dt>
            <dd className="mt-2 font-display text-4xl">{s.value}</dd>
          </Link>
        ))}
      </dl>

      <Card title="Recent orders" icon={Package} action={<Link href={ROUTES.orders} className="inline-flex items-center gap-1 text-[13px] font-semibold hover:text-clay">All orders <ArrowRight className="size-3.5" /></Link>}>
        {get_status !== asyncStatus.SUCCEEDED ? (
          <div className="space-y-3">{[0, 1].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : orders.length ? (
          <ul className="divide-y divide-border">
            {orders.slice(0, 3).map((o) => (
              <li key={o._id}>
                <Link href={ROUTES.order(o._id)} className="flex flex-wrap items-center justify-between gap-3 py-3.5 hover:text-clay">
                  <span className="font-mono text-[13px]">{o._id}</span>
                  <span className="text-[13px] text-muted-foreground">{formatDate(o.createdAt)}</span>
                  <OrderStatusBadge status={o.status} />
                  <span className="tabular-nums">{formatPrice(o.totals.total)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No orders yet. <Link href={ROUTES.shop} className="underline">Start shopping</Link>.</p>
        )}
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Profile" icon={UserRound}>
          <ProfileForm />
        </Card>
        <Card title="Default address" icon={MapPin}>
          {address ? (
            <address className="text-[15px] leading-7 not-italic">
              {address.firstName} {address.lastName}<br />
              {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
              {address.city}, {address.region} {address.postalCode}<br />
              {COUNTRIES.find((c) => c.code === address.country)?.name}
            </address>
          ) : (
            <p className="text-sm text-muted-foreground">No saved address yet. The address from your next order can be used here.</p>
          )}
        </Card>
      </div>

      {siteConfig.demoMode && (
        <Card title="Demo data" icon={RotateCcw}>
          <p className="mb-4 text-sm text-muted-foreground">
            Accounts and orders in this demo are stored in your browser. Resetting restores the seeded demo data and signs you out.
          </p>
          <Button variant="outline" size="sm" onClick={resetDemo}>Reset demo data</Button>
        </Card>
      )}
    </div>
  );
}
