"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { CheckCircle2 } from "lucide-react";
import OrderLoader from "@/components/orders/OrderLoader";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/navigation";

export default function CheckoutSuccess() {
  const id = useSearchParams().get("order");
  const signedIn = useSelector((s) => s.auth.user_auth);

  return (
    <OrderLoader
      id={id}
      header={(order) => (
        <div className="mb-12 rounded-3xl bg-moss px-6 py-10 text-paper md:px-10">
          <CheckCircle2 className="size-8 text-moss-tint" aria-hidden="true" />
          <h1 className="display mt-4 text-5xl md:text-6xl">Thank you, {order.shippingAddress?.firstName}.</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-paper/80">
            Your demo order <strong className="font-mono">{order._id}</strong> has been recorded. In a live store a confirmation would be emailed to {order.email}.
            This was a simulation: no payment was taken.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="light"><Link href={ROUTES.shop}>Continue shopping</Link></Button>
            {signedIn && (
              <Button asChild variant="outline" className="border-paper/30 text-paper hover:bg-paper hover:text-ink">
                <Link href={ROUTES.order(order._id)}>View in your account</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    />
  );
}
