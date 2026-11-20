"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useHydrated } from "./useHydrated";
import { ROUTES } from "@/config/navigation";

/** Redirects to login once we know there is no session. Returns { ready, user }. */
export function useRequireAuth() {
  const hydrated = useHydrated();
  const { user_auth, user_data } = useSelector((s) => s.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (hydrated && !user_auth) {
      router.replace(`${ROUTES.login}?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, user_auth, router, pathname]);

  return { ready: hydrated && user_auth, user: user_data };
}
