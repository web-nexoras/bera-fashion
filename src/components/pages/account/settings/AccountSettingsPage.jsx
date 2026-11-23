"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BellRing, KeyRound, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/section-heading";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { changePassword } from "@/api/account.js";
import { cn } from "@/lib/utils";
const schema = z
    .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
})
    .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
const preferences = [
    {
        key: "orderUpdates",
        title: "Order updates",
        description: "Get notified when your order is confirmed, shipped or delivered.",
        icon: BellRing,
    },
    {
        key: "securityAlerts",
        title: "Security alerts",
        description: "Important notices about sign-ins and changes to your account.",
        icon: ShieldCheck,
    },
    {
        key: "promotions",
        title: "Offers & promotions",
        description: "Hear about seasonal sales, new arrivals and member-only offers.",
        icon: Smartphone,
    },
    {
        key: "newsletter",
        title: "Style newsletter",
        description: "A monthly edit of styling ideas and curated favourites.",
        icon: Mail,
    },
];
export default function SettingsPage() {
    const { user } = useAuth();
    const [values, setValues] = useState({
        orderUpdates: true,
        securityAlerts: true,
        promotions: false,
        newsletter: true,
    });
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });
    const onSubmit = async (data) => {
        const response = await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
        if (!response.success) {
            toast.error(response.message ?? "We couldn't update your password.");
            return;
        }
        reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
        toast.success(response.message ?? "Password changed successfully");
    };
    return (<div className="animate-fade-up">
      <PageHeading title="Account settings" description="Choose what you hear about and keep your account secure."/>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Notifications" description="Decide which updates land in your inbox." action={<Badge tone="brand">Preferences</Badge>}/>
          <CardBody className="space-y-1">
            {preferences.map(({ key, title, description, icon: Icon }) => (<div key={key} className="flex items-start justify-between gap-4 border-b border-ink-100 py-4 first:pt-0 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon className="size-4"/>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink-900">{title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-ink-500">{description}</p>
                  </div>
                </div>
                <Toggle checked={values[key]} onChange={(checked) => setValues((current) => ({ ...current, [key]: checked }))} label={title}/>
              </div>))}
            <div className="pt-4">
              <Button size="sm" onClick={() => toast.success("Your preferences have been saved for this session")}>
                Save preferences
              </Button>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Change password" description="Use a strong, unique password for your account."/>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4" noValidate>
                <Field label="Current password" error={errors.currentPassword?.message} required>
                  <Input {...register("currentPassword")} type="password" autoComplete="current-password" placeholder="Enter current password"/>
                </Field>
                <Field label="New password" error={errors.newPassword?.message} required>
                  <Input {...register("newPassword")} type="password" autoComplete="new-password" placeholder="At least 8 characters"/>
                </Field>
                <Field label="Confirm new password" error={errors.confirmPassword?.message} required>
                  <Input {...register("confirmPassword")} type="password" autoComplete="new-password" placeholder="Repeat new password"/>
                </Field>
                <Button type="submit" loading={isSubmitting}>
                  <KeyRound className="size-4"/> Update password
                </Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Account security" description="A quick look at your account status."/>
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-ink-600">Email verification</span>
                <Badge tone={user?.isEmailVerified ? "success" : "warning"} dot>
                  {user?.isEmailVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-ink-600">Account status</span>
                <Badge tone={user?.isBlocked ? "danger" : "success"} dot>
                  {user?.isBlocked ? "Restricted" : "Active"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-ink-600">Role</span>
                <span className="font-semibold capitalize text-ink-800">{user?.role ?? "customer"}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>);
}
function Toggle({ checked, onChange, label, }) {
    return (<button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", checked ? "bg-brand-700" : "bg-ink-200")}>
      <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform", checked ? "translate-x-5.5" : "translate-x-0.5")}/>
    </button>);
}
