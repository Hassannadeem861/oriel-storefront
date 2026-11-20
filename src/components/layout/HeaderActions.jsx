"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Heart, Search, ShoppingBag, User, LogOut, Package, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { setCartOpen, setSearchOpen } from "@/store/slices/uiSlice";
import { logout } from "@/store/slices/authSlice";
import { resetOrders } from "@/store/slices/orderSlice";
import { useHydrated } from "@/hooks/useHydrated";
import { ROUTES } from "@/config/navigation";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const iconBtn =
  "relative grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-sand focus-visible:bg-sand";

function CountBadge({ count, label }) {
  const hydrated = useHydrated();
  if (!hydrated || !count) return null;
  return (
    <span
      className="absolute -top-0.5 -right-0.5 grid min-w-[18px] place-items-center rounded-full bg-clay px-1 font-mono text-[10px] leading-[18px] font-medium text-white"
      aria-label={label}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function SearchButton({ className }) {
  const dispatch = useDispatch();

  // Cmd/Ctrl+K opens search from anywhere.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dispatch(setSearchOpen(true));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  return (
    <button type="button" className={cn(iconBtn, className)} onClick={() => dispatch(setSearchOpen(true))} aria-label="Search products">
      <Search className="size-[19px]" />
    </button>
  );
}

export function CartButton() {
  const dispatch = useDispatch();
  const count = useSelector((s) => s.cart.items.reduce((n, i) => n + i.quantity, 0));
  return (
    <button
      type="button"
      className={iconBtn}
      onClick={() => dispatch(setCartOpen(true))}
      aria-label={`Open bag${count ? `, ${count} items` : ""}`}
    >
      <ShoppingBag className="size-[19px]" />
      <CountBadge count={count} label={`${count} items in bag`} />
    </button>
  );
}

export function WishlistLink({ className }) {
  const count = useSelector((s) => s.wishlist.items.length);
  return (
    <Link href={ROUTES.wishlist} className={cn(iconBtn, className)} aria-label={`Wishlist${count ? `, ${count} saved` : ""}`}>
      <Heart className="size-[19px]" />
      <CountBadge count={count} label={`${count} saved items`} />
    </Link>
  );
}

export function AccountMenu({ className }) {
  const hydrated = useHydrated();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user_auth, user_data } = useSelector((s) => s.auth);

  if (!hydrated || !user_auth) {
    return (
      <Link href={ROUTES.login} className={cn(iconBtn, className)} aria-label="Sign in">
        <User className="size-[19px]" />
      </Link>
    );
  }

  const signOut = () => {
    dispatch(logout());
    dispatch(resetOrders());
    toast("You have been signed out");
    router.push(ROUTES.home);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(iconBtn, className)} aria-label="Account menu">
        <span className="grid size-8 place-items-center rounded-full bg-ink font-mono text-[11px] text-paper">
          {(user_data?.firstName?.[0] || "") + (user_data?.lastName?.[0] || "")}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Signed in as
          <span className="block truncate font-semibold text-ink">{user_data?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => router.push(ROUTES.account)}><LayoutGrid /> Account overview</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push(ROUTES.orders)}><Package /> Orders</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => router.push(ROUTES.wishlist)}><Heart /> Wishlist</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut}><LogOut /> Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
