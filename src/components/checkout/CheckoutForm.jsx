"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Lock, Loader2, ShoppingBag, CreditCard, Wallet } from "lucide-react";
import FormField from "@/components/forms/FormField";
import DemoNotice from "@/components/common/DemoNotice";
import EmptyState from "@/components/common/EmptyState";
import OrderTotals from "@/components/cart/OrderTotals";
import PromoCodeForm from "@/components/cart/PromoCodeForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NativeSelect } from "@/components/ui/native-select";
import { useCart } from "@/hooks/useCart";
import { useHydrated } from "@/hooks/useHydrated";
import { checkoutSchema } from "@/lib/validation";
import { createOrderAsync } from "@/store/services/orderService";
import { asyncStatus } from "@/utils/asyncStatus";
import { getErrorMessage } from "@/utils/toastError";
import { COUNTRIES, SHIPPING_METHODS } from "@/constants/commerce";
import { ROUTES } from "@/config/navigation";
import { formatPrice, cn } from "@/lib/utils";

function Section({ step, title, children, aside }) {
  return (
    <section className="border-b border-border py-8 first:pt-0" aria-labelledby={`step-${step}`}>
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 id={`step-${step}`} className="flex items-baseline gap-3 font-display text-3xl">
          <span className="font-mono text-[12px] text-clay">0{step}</span>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
};

export default function CheckoutForm() {
  const hydrated = useHydrated();
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, totals, promo, shippingMethod, setShipping, clear } = useCart();
  const { user_auth, user_data } = useSelector((s) => s.auth);
  const creating = useSelector((s) => s.order.create_status) === asyncStatus.LOADING;
  const [placed, setPlaced] = useState(false);

  const address = user_data?.addresses?.find((a) => a.isDefault);
  const {
    register, handleSubmit, watch, setValue, reset, formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "", firstName: "", lastName: "", line1: "", line2: "", city: "", region: "", postalCode: "",
      country: "US", phone: "", shippingMethod: shippingMethod || "standard", paymentMethod: "card",
      cardName: "", cardNumber: "", cardExpiry: "", cardCvc: "",
    },
  });

  // Prefill from the signed-in account once persisted state is restored.
  useEffect(() => {
    if (!hydrated || !user_auth || !user_data) return;
    reset((v) => ({
      ...v,
      email: user_data.email,
      firstName: address?.firstName || user_data.firstName,
      lastName: address?.lastName || user_data.lastName,
      line1: address?.line1 || "",
      line2: address?.line2 || "",
      city: address?.city || "",
      region: address?.region || "",
      postalCode: address?.postalCode || "",
      country: address?.country || v.country,
      phone: user_data.phone || "",
    }));
  }, [hydrated, user_auth, user_data, address, reset]);

  const method = watch("shippingMethod");
  const payment = watch("paymentMethod");
  useEffect(() => {
    if (method && method !== shippingMethod) setShipping(method);
  }, [method, shippingMethod, setShipping]);

  const onSubmit = async (v) => {
    try {
      const res = await dispatch(
        createOrderAsync({
          email: v.email,
          items,
          shippingMethod: v.shippingMethod,
          promoCode: promo?.code || null,
          paymentMethod: v.paymentMethod,
          cardLast4: v.paymentMethod === "card" ? v.cardNumber.replace(/\D/g, "").slice(-4) : null,
          shippingAddress: {
            firstName: v.firstName, lastName: v.lastName, line1: v.line1, line2: v.line2,
            city: v.city, region: v.region, postalCode: v.postalCode, country: v.country, phone: v.phone,
          },
        })
      ).unwrap();
      setPlaced(true);
      clear();
      toast.success("Order placed (simulated)", { description: `Order ${res.data._id}. No payment was taken.` });
      router.push(ROUTES.checkoutSuccess(res.data._id));
    } catch (err) {
      const message = getErrorMessage(err);
      if (message) toast.error(message);
    }
  };

  const onInvalid = () => toast.error("Please check the highlighted fields.");

  if (!hydrated || placed) {
    return (
      <div className="grid gap-10 lg:grid-cols-12" role="status" aria-label={placed ? "Opening your order confirmation" : "Loading checkout"}>
        <div className="space-y-4 lg:col-span-7">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
        <Skeleton className="h-96 rounded-3xl lg:col-span-5" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your bag is empty"
        description="Add something to your bag to check out."
        action={{ label: "Browse the shop", href: ROUTES.shop }}
      />
    );
  }

  const field = (name) => ({ id: `co-${name}`, error: errors[name]?.message });

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="grid items-start gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <Section
          step={1}
          title="Contact"
          aside={!user_auth && (
            <Link href={`${ROUTES.login}?next=${ROUTES.checkout}`} className="text-[13px] font-semibold underline underline-offset-4">
              Sign in for faster checkout
            </Link>
          )}
        >
          <FormField {...field("email")} label="Email" hint="We will send your order confirmation here.">
            {(p) => <Input {...p} type="email" autoComplete="email" {...register("email")} />}
          </FormField>
        </Section>

        <Section step={2} title="Delivery address">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField {...field("firstName")} label="First name">{(p) => <Input {...p} autoComplete="given-name" {...register("firstName")} />}</FormField>
            <FormField {...field("lastName")} label="Last name">{(p) => <Input {...p} autoComplete="family-name" {...register("lastName")} />}</FormField>
            <FormField {...field("line1")} label="Address" className="sm:col-span-2">{(p) => <Input {...p} autoComplete="address-line1" {...register("line1")} />}</FormField>
            <FormField {...field("line2")} label="Apartment, suite" optional className="sm:col-span-2">{(p) => <Input {...p} autoComplete="address-line2" {...register("line2")} />}</FormField>
            <FormField {...field("city")} label="City">{(p) => <Input {...p} autoComplete="address-level2" {...register("city")} />}</FormField>
            <FormField {...field("region")} label="State / region" optional>{(p) => <Input {...p} autoComplete="address-level1" {...register("region")} />}</FormField>
            <FormField {...field("postalCode")} label="Postal code">{(p) => <Input {...p} autoComplete="postal-code" {...register("postalCode")} />}</FormField>
            <FormField {...field("country")} label="Country">
              {(p) => (
                <NativeSelect {...p} autoComplete="country" {...register("country")}>
                  {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
                </NativeSelect>
              )}
            </FormField>
            <FormField {...field("phone")} label="Phone" hint="Only used by the courier for delivery updates." className="sm:col-span-2">
              {(p) => <Input {...p} type="tel" autoComplete="tel" {...register("phone")} />}
            </FormField>
          </div>
        </Section>

        <Section step={3} title="Delivery method">
          <div role="radiogroup" aria-label="Delivery method" className="grid gap-3">
            {SHIPPING_METHODS.map((m) => {
              const free = m.id === "standard" && (totals.remainingForFreeShipping === 0 || promo?.type === "shipping");
              return (
                <label
                  key={m.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40",
                    method === m.id ? "border-ink bg-paper" : "border-border hover:border-ink/40"
                  )}
                >
                  <input type="radio" value={m.id} {...register("shippingMethod")} className="size-4 accent-[var(--ink)]" />
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold">{m.label}</span>
                    <span className="text-[13px] text-muted-foreground">{m.description}</span>
                  </span>
                  <span className="text-[15px] font-medium">{free ? "Free" : formatPrice(m.price)}</span>
                </label>
              );
            })}
          </div>
        </Section>

        <Section step={4} title="Payment">
          <DemoNotice className="mb-6">
            This is a demo checkout. No payment is processed and no card details are stored or sent anywhere. Please do not enter a real card. Use the test number 4242 4242 4242 4242.
          </DemoNotice>
          <div role="radiogroup" aria-label="Payment method" className="mb-6 grid grid-cols-2 gap-3">
            {[{ id: "card", label: "Card", icon: CreditCard }, { id: "paypal", label: "PayPal (simulated)", icon: Wallet }].map(({ id, label, icon: Icon }) => (
              <label
                key={id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-[14px] font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40",
                  payment === id ? "border-ink bg-paper" : "border-border hover:border-ink/40"
                )}
              >
                <input type="radio" value={id} {...register("paymentMethod")} className="sr-only" />
                <Icon className="size-4" aria-hidden="true" /> {label}
              </label>
            ))}
          </div>
          {payment === "card" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField {...field("cardName")} label="Name on card" className="sm:col-span-2">
                {(p) => <Input {...p} autoComplete="off" {...register("cardName")} />}
              </FormField>
              <FormField {...field("cardNumber")} label="Card number (test)" className="sm:col-span-2">
                {(p) => (
                  <Input
                    {...p}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="4242 4242 4242 4242"
                    {...register("cardNumber", { onChange: (e) => setValue("cardNumber", formatCard(e.target.value)) })}
                  />
                )}
              </FormField>
              <FormField {...field("cardExpiry")} label="Expiry">
                {(p) => (
                  <Input
                    {...p}
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="MM / YY"
                    {...register("cardExpiry", { onChange: (e) => setValue("cardExpiry", formatExpiry(e.target.value)) })}
                  />
                )}
              </FormField>
              <FormField {...field("cardCvc")} label="Security code">
                {(p) => <Input {...p} inputMode="numeric" autoComplete="off" maxLength={4} placeholder="123" {...register("cardCvc")} />}
              </FormField>
            </div>
          ) : (
            <p className="rounded-2xl bg-paper p-5 text-[14px] text-muted-foreground">
              In a live store you would be redirected to PayPal here. In this demo the order is simply recorded as simulated.
            </p>
          )}
        </Section>
      </div>

      <aside className="rounded-3xl bg-paper p-6 md:p-8 lg:sticky lg:top-28 lg:col-span-5" aria-labelledby="co-summary">
        <h2 id="co-summary" className="font-display text-3xl">Summary</h2>
        <ul className="mt-6 grid max-h-72 gap-4 overflow-y-auto pr-1" data-lenis-prevent>
          {items.map((i) => (
            <li key={i.key} className="flex items-center gap-4">
              <span className="relative h-18 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                {i.image && <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />}
                <span className="absolute top-1 right-1 grid size-5 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">{i.quantity}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold">{i.name}</span>
                {i.variant && <span className="text-[12px] text-muted-foreground">{i.variant}</span>}
              </span>
              <span className="text-[14px] tabular-nums">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-border pt-6"><PromoCodeForm /></div>
        <OrderTotals totals={totals} promoCode={promo?.code} className="mt-6" />
        <Button type="submit" variant="accent" size="lg" className="mt-6 w-full" disabled={creating}>
          {creating ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Lock aria-hidden="true" />}
          {creating ? "Placing order…" : `Place demo order · ${formatPrice(totals.total)}`}
        </Button>
        <p className="mt-3 text-center text-[12px] text-muted-foreground">
          By placing an order you agree to our <Link href={ROUTES.terms} className="underline">terms</Link>. Simulated: nothing will be charged or shipped.
        </p>
      </aside>
    </form>
  );
}
