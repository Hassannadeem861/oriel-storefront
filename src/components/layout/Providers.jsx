"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import StoreProvider from "@/store/StoreProvider";
import SmoothScroll from "./SmoothScroll";
import { Toaster } from "@/components/ui/sonner";

// Overlays are only downloaded the first time they are opened.
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"));
const SearchDialog = dynamic(() => import("@/components/search/SearchDialog"));
const QuickView = dynamic(() => import("@/components/product/QuickView"));

/** True from the first time `flag` is true, so overlays can animate closed. */
function useLatched(flag) {
  const [seen, setSeen] = useState(flag);
  if (flag && !seen) setSeen(true);
  return seen || flag;
}

function Overlays() {
  const { cartOpen, searchOpen, quickView } = useSelector((s) => s.ui);
  const cart = useLatched(cartOpen);
  const search = useLatched(searchOpen);
  const quick = useLatched(Boolean(quickView));
  return (
    <>
      {cart && <CartDrawer />}
      {search && <SearchDialog />}
      {quick && <QuickView />}
    </>
  );
}

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <SmoothScroll />
      {children}
      <Overlays />
      <Toaster />
    </StoreProvider>
  );
}
