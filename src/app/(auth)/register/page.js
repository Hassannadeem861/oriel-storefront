import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Create an account", description: "Create an account to track orders and save your wishlist.", path: "/register", noIndex: true });

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[680px] w-full rounded-3xl" />}>
      <RegisterForm />
    </Suspense>
  );
}
