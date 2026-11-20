"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import FormField from "@/components/forms/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { profileSchema } from "@/lib/validation";
import { updateProfileAsync } from "@/store/services/authService";
import { asyncStatus } from "@/utils/asyncStatus";
import { getErrorMessage } from "@/utils/toastError";

export default function ProfileForm() {
  const dispatch = useDispatch();
  const { user_data, update_status } = useSelector((s) => s.auth);
  const saving = update_status === asyncStatus.LOADING;
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    resolver: zodResolver(profileSchema),
    values: { firstName: user_data?.firstName || "", lastName: user_data?.lastName || "", phone: user_data?.phone || "" },
  });

  const onSubmit = async (values) => {
    try {
      const res = await dispatch(updateProfileAsync(values)).unwrap();
      toast.success(res?.message || "Profile updated");
      reset(values);
    } catch (err) {
      const message = getErrorMessage(err);
      if (message) toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <FormField id="pf-first" label="First name" error={errors.firstName?.message}>
        {(p) => <Input {...p} autoComplete="given-name" {...register("firstName")} />}
      </FormField>
      <FormField id="pf-last" label="Last name" error={errors.lastName?.message}>
        {(p) => <Input {...p} autoComplete="family-name" {...register("lastName")} />}
      </FormField>
      <FormField id="pf-email" label="Email" hint="Contact us to change the email on your account.">
        {(p) => <Input {...p} value={user_data?.email || ""} readOnly disabled />}
      </FormField>
      <FormField id="pf-phone" label="Phone" optional error={errors.phone?.message}>
        {(p) => <Input {...p} type="tel" autoComplete="tel" {...register("phone")} />}
      </FormField>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={saving || !isDirty}>
          {saving && <Loader2 className="animate-spin" aria-hidden="true" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
