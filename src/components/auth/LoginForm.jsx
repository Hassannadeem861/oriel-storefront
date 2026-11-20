"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import FormField from "@/components/forms/FormField";
import PasswordInput from "./PasswordInput";
import DemoNotice from "@/components/common/DemoNotice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validation";
import { loginAsync } from "@/store/services/authService";
import { asyncStatus } from "@/utils/asyncStatus";
import { getErrorMessage } from "@/utils/toastError";
import { useHydrated } from "@/hooks/useHydrated";
import { DEMO_CREDENTIALS } from "@/data/seed/users";
import { ROUTES } from "@/config/navigation";

/** Only allow same-site relative redirects. */
const safeNext = (n) => (n && n.startsWith("/") && !n.startsWith("//") ? n : ROUTES.account);

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const { user_auth, login_status } = useSelector((s) => s.auth);
  const loading = login_status === asyncStatus.LOADING;
  const next = safeNext(params.get("next"));

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (params.get("expired")) toast.error("Your session expired. Please sign in again.");
  }, [params]);

  useEffect(() => {
    if (hydrated && user_auth) router.replace(next);
  }, [hydrated, user_auth, next, router]);

  const onSubmit = async (values) => {
    try {
      const res = await dispatch(loginAsync(values)).unwrap();
      toast.success(`Welcome back, ${res.data.user.firstName}`);
      router.replace(next);
    } catch (err) {
      const message = getErrorMessage(err);
      if (message) toast.error(message);
    }
  };

  const fillDemo = () => {
    setValue("email", DEMO_CREDENTIALS.email, { shouldValidate: true });
    setValue("password", DEMO_CREDENTIALS.password, { shouldValidate: true });
  };

  return (
    <>
      <p className="eyebrow">Welcome back</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">Sign in</h1>
      <p className="mt-3 text-[15px] text-muted-foreground">
        New here? <Link href={`${ROUTES.register}${params.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink underline underline-offset-4">Create an account</Link>
      </p>

      <DemoNotice className="mt-8">
        <span className="block">Demo account: <strong className="font-mono">{DEMO_CREDENTIALS.email}</strong> / <strong className="font-mono">{DEMO_CREDENTIALS.password}</strong></span>
        <button type="button" onClick={fillDemo} className="mt-1 inline-flex items-center gap-1 font-semibold underline underline-offset-4">
          <Sparkles className="size-3.5" aria-hidden="true" /> Fill in demo details
        </button>
      </DemoNotice>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-5">
        <FormField id="login-email" label="Email" error={errors.email?.message}>
          {(p) => <Input {...p} type="email" autoComplete="email" {...register("email")} />}
        </FormField>
        <FormField id="login-password" label="Password" error={errors.password?.message}>
          {(p) => <PasswordInput {...p} autoComplete="current-password" {...register("password")} />}
        </FormField>
        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </>
  );
}
