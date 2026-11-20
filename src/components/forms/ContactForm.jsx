"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import FormField from "./FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { contactSchema } from "@/lib/validation";
import { sendContactAsync } from "@/store/services/supportService";
import { asyncStatus } from "@/utils/asyncStatus";
import { getErrorMessage } from "@/utils/toastError";

const TOPICS = [
  { value: "order", label: "An existing order" },
  { value: "product", label: "Product advice" },
  { value: "returns", label: "Returns or repairs" },
  { value: "wholesale", label: "Wholesale and press" },
  { value: "other", label: "Something else" },
];

export default function ContactForm() {
  const dispatch = useDispatch();
  const sending = useSelector((s) => s.support.contact_status) === asyncStatus.LOADING;
  const [sentTo, setSentTo] = useState(null);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", topic: "order", orderNumber: "", message: "" },
  });
  const topic = watch("topic");
  const messageLength = watch("message")?.length || 0;

  const onSubmit = async (values) => {
    try {
      await dispatch(sendContactAsync(values)).unwrap();
      setSentTo(values.email);
      reset();
    } catch (err) {
      const message = getErrorMessage(err);
      if (message) toast.error(message);
    }
  };

  if (sentTo) {
    return (
      <div className="rounded-3xl bg-moss p-8 text-paper md:p-10" role="status">
        <CheckCircle2 className="size-8 text-moss-tint" aria-hidden="true" />
        <h2 className="display mt-4 text-4xl">Message received</h2>
        <p className="mt-3 text-paper/80">
          Thank you. In a live store our team would reply to {sentTo} within one business day. (Demo: your message was saved in this browser only.)
        </p>
        <Button variant="light" className="mt-6" onClick={() => setSentTo(null)}>Send another message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
      <FormField id="ct-name" label="Your name" error={errors.name?.message}>
        {(p) => <Input {...p} autoComplete="name" {...register("name")} />}
      </FormField>
      <FormField id="ct-email" label="Email" error={errors.email?.message}>
        {(p) => <Input {...p} type="email" autoComplete="email" {...register("email")} />}
      </FormField>
      <FormField id="ct-topic" label="Topic" error={errors.topic?.message}>
        {(p) => (
          <NativeSelect {...p} {...register("topic")}>
            {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </NativeSelect>
        )}
      </FormField>
      {(topic === "order" || topic === "returns") ? (
        <FormField id="ct-order" label="Order number" optional error={errors.orderNumber?.message}>
          {(p) => <Input {...p} placeholder="e.g. OR-24817" {...register("orderNumber")} />}
        </FormField>
      ) : <div className="hidden sm:block" />}
      <FormField id="ct-message" label="Message" error={errors.message?.message} hint={`${messageLength} / 2000`} className="sm:col-span-2">
        {(p) => <Textarea {...p} rows={6} {...register("message")} />}
      </FormField>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={sending}>
          {sending && <Loader2 className="animate-spin" aria-hidden="true" />}
          {sending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
