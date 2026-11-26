"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { resetPassword } from "@/api/auth.js";
import { strongPassword } from "@/lib/validation";
const schema = z
    .object({
    password: strongPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
})
    .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export default function ResetPasswordPage() {
    const params = useParams();
    const token = params.token;
    const [done, setDone] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { password: "", confirmPassword: "" },
    });
    const onSubmit = async (values) => {
        const response = await resetPassword(token, { password: values.password, confirmPassword: values.confirmPassword });
        if (!response.success) {
            toast.error(response.message ?? "We couldn't reset your password. The link may have expired.");
            return;
        }
        toast.success(response.message ?? "Password reset successfully");
        setDone(true);
    };
    if (done) {
        return (<div className="animate-fade-up text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8"/>
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">Password updated</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-500">
          Your password has been changed. You can now sign in with your new credentials.
        </p>
        <ButtonLink href="/sign-in" size="lg" className="mt-8 w-full">
          Continue to sign in
        </ButtonLink>
      </div>);
    }
    return (<div className="animate-fade-up">
      <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 transition-colors hover:text-brand-700">
        <ArrowLeft className="size-3.5"/> Back to sign in
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-ink-900">Set a new password</h1>
      <p className="mt-2 text-sm leading-6 text-ink-500">Choose a strong password you haven&apos;t used before.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <Field label="New password" error={errors.password?.message} required>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input {...register("password")} type="password" autoComplete="new-password" placeholder="Create a strong password" className="pl-10"/>
          </div>
        </Field>
        <Field label="Confirm new password" error={errors.confirmPassword?.message} required>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input {...register("confirmPassword")} type="password" autoComplete="new-password" placeholder="Re-enter your new password" className="pl-10"/>
          </div>
        </Field>
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Reset password
        </Button>
      </form>
    </div>);
}
