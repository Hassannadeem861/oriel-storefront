import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Sign in", description: "Sign in to track orders and manage your wishlist.", path: "/login", noIndex: true });

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[520px] w-full rounded-3xl" />}>
      <LoginForm />
    </Suspense>
  );
}
