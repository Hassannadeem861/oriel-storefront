"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import FormField from "@/components/forms/FormField";
import PasswordInput from "./PasswordInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validation";
import { registerAsync } from "@/store/services/authService";
import { asyncStatus } from "@/utils/asyncStatus";
import { getErrorMessage } from "@/utils/toastError";
import { useHydrated } from "@/hooks/useHydrated";
import { ROUTES } from "@/config/navigation";

const safeNext = (n) => (n && n.startsWith("/") && !n.startsWith("//") ? n : ROUTES.account);

export default function RegisterForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const { user_auth, register_status } = useSelector((s) => s.auth);
  const loading = register_status === asyncStatus.LOADING;
  const next = safeNext(params.get("next"));

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "", acceptTerms: false, marketing: false },
  });

  useEffect(() => {
    if (hydrated && user_auth) router.replace(next);
  }, [hydrated, user_auth, next, router]);

  const onSubmit = async ({ confirmPassword, acceptTerms, ...values }) => {
    try {
      const res = await dispatch(registerAsync(values)).unwrap();
      toast.success(`Welcome to the studio, ${res.data.user.firstName}`);
      router.replace(next);
    } catch (err) {
      const message = getErrorMessage(err);
      if (message) toast.error(message);
    }
  };

  return (
    <>
      <p className="eyebrow">Join the studio</p>
      <h1 className="display mt-3 text-5xl md:text-6xl">Create an account</h1>
      <p className="mt-3 text-[15px] text-muted-foreground">
        Already have one? <Link href={ROUTES.login} className="font-semibold text-ink underline underline-offset-4">Sign in</Link>
      </p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="reg-first" label="First name" error={errors.firstName?.message}>
            {(p) => <Input {...p} autoComplete="given-name" {...register("firstName")} />}
          </FormField>
          <FormField id="reg-last" label="Last name" error={errors.lastName?.message}>
            {(p) => <Input {...p} autoComplete="family-name" {...register("lastName")} />}
          </FormField>
        </div>
        <FormField id="reg-email" label="Email" error={errors.email?.message}>
          {(p) => <Input {...p} type="email" autoComplete="email" {...register("email")} />}
        </FormField>
        <FormField id="reg-password" label="Password" error={errors.password?.message} hint="At least 8 characters, with a letter and a number.">
          {(p) => <PasswordInput {...p} autoComplete="new-password" {...register("password")} />}
        </FormField>
        <FormField id="reg-confirm" label="Confirm password" error={errors.confirmPassword?.message}>
          {(p) => <PasswordInput {...p} autoComplete="new-password" {...register("confirmPassword")} />}
        </FormField>

        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <div className="grid gap-1.5">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="reg-terms"
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                  aria-invalid={errors.acceptTerms ? true : undefined}
                  aria-describedby={errors.acceptTerms ? "reg-terms-error" : undefined}
                  className="mt-0.5"
                />
                <Label htmlFor="reg-terms" className="font-normal leading-5">
                  I agree to the <Link href={ROUTES.terms} className="underline">terms</Link> and <Link href={ROUTES.privacy} className="underline">privacy policy</Link>.
                </Label>
              </div>
              {errors.acceptTerms && <p id="reg-terms-error" role="alert" className="text-[12px] font-medium text-destructive">{errors.acceptTerms.message}</p>}
            </div>
          )}
        />
        <Controller
          control={control}
          name="marketing"
          render={({ field }) => (
            <div className="flex items-start gap-3">
              <Checkbox id="reg-marketing" checked={field.value} onCheckedChange={(c) => field.onChange(c === true)} className="mt-0.5" />
              <Label htmlFor="reg-marketing" className="font-normal leading-5">Send me the monthly studio letter (optional).</Label>
            </div>
          )}
        />

        <Button type="submit" size="lg" disabled={loading} className="mt-2">
          {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-[12px] text-muted-foreground">Demo store: your account is stored only in this browser.</p>
      </form>
    </>
  );
}
