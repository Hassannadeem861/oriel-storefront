"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { logout } from "@/store/slices/authSlice";
import { resetOrders } from "@/store/slices/orderSlice";
import { accountNav, ROUTES } from "@/config/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Guards the account area and renders its navigation. */
export default function AccountShell({ children }) {
  const { ready, user } = useRequireAuth();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const signOut = () => {
    dispatch(logout());
    dispatch(resetOrders());
    toast("You have been signed out");
    router.push(ROUTES.home);
  };

  return (
    <div className="container-page grid gap-10 pt-8 pb-24 lg:grid-cols-[220px_1fr] lg:gap-16 lg:pt-12">
      <aside>
        <p className="eyebrow">Your account</p>
        <div className="mt-2 font-display text-3xl">
          {ready ? `${user?.firstName} ${user?.lastName}` : <Skeleton className="h-8 w-40" />}
        </div>
        <nav aria-label="Account" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
          {accountNav.map((item) => {
            const active = item.href === ROUTES.account ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors lg:rounded-xl",
                  active ? "bg-ink text-paper" : "hover:bg-sand"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <button type="button" onClick={signOut} className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium text-muted-foreground hover:bg-sand hover:text-ink lg:rounded-xl">
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </button>
        </nav>
      </aside>
      <div className="min-w-0">
        {ready ? children : (
          <div className="space-y-4" role="status" aria-label="Loading your account">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-40 w-full rounded-3xl" />
            <Skeleton className="h-40 w-full rounded-3xl" />
          </div>
        )}
      </div>
    </div>
  );
}
