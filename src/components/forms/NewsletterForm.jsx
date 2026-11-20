"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { newsletterSchema } from "@/lib/validation";
import { subscribeNewsletterAsync } from "@/store/services/supportService";
import { asyncStatus } from "@/utils/asyncStatus";
import { getErrorMessage } from "@/utils/toastError";
import { cn } from "@/lib/utils";

export default function NewsletterForm({ className }) {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.support.newsletter_status);
  const loading = status === asyncStatus.LOADING;
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values) => {
    try {
      const res = await dispatch(subscribeNewsletterAsync(values)).unwrap();
      toast.success(res?.message || "Subscribed");
      reset();
    } catch (err) {
      const message = getErrorMessage(err);
      if (message) toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={className}>
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <div
        className={cn(
          "flex items-center rounded-full border border-paper/20 bg-paper/5 p-1.5 transition-colors focus-within:border-paper/60",
          errors.email && "border-red-300"
        )}
      >
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "newsletter-error" : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent px-4 text-[15px] text-paper placeholder:text-paper/40 focus:outline-none"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink transition-colors hover:bg-clay hover:text-white disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
          Subscribe
        </button>
      </div>
      {errors.email && (
        <p id="newsletter-error" role="alert" className="mt-2 pl-4 text-[12px] text-red-200">{errors.email.message}</p>
      )}
    </form>
  );
}
