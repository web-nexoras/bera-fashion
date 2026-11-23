"use client";
import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { forgotPassword } from "@/api/auth.js";
const schema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
export default function ForgotPasswordPage() {
    const [sentTo, setSentTo] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: "" },
    });
    const onSubmit = async (values) => {
        const response = await forgotPassword({ email: values.email.trim() });
        if (!response.success) {
            toast.error(response.message ?? "We couldn't send the reset link. Please try again.");
            return;
        }
        setSentTo(values.email.trim());
        toast.success(response.message ?? "Password reset email sent");
    };
    if (sentTo) {
        return (<div className="animate-fade-up text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8"/>
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">Check your inbox</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-500">
          We&apos;ve sent a password reset link to <span className="font-semibold text-ink-800">{sentTo}</span>.
          The link is valid for a limited time.
        </p>
        <div className="mt-8 space-y-3">
          <ButtonLink href="/sign-in" size="lg" className="w-full">
            Back to sign in
          </ButtonLink>
          <button type="button" onClick={() => setSentTo(null)} className="text-xs font-semibold text-brand-700 hover:underline">
            Use a different email
          </button>
        </div>
      </div>);
    }
    return (<div className="animate-fade-up">
      <Link href="/sign-in" className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 transition-colors hover:text-brand-700">
        <ArrowLeft className="size-3.5"/> Back to sign in
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-ink-900">Forgot your password?</h1>
      <p className="mt-2 text-sm leading-6 text-ink-500">
        No worries. Enter your email and we&apos;ll send you a secure link to set a new one.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <Field label="Email address" error={errors.email?.message} required>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className="pl-10"/>
          </div>
        </Field>
        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-500">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-bold text-brand-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>);
}
