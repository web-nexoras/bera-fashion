"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Eye, EyeOff, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { registerSchema } from "@/lib/validation";
const passwordRules = [
    "At least 6 characters",
    "Mix letters and numbers",
];
function safeNext(value) {
    if (!value || !value.startsWith("/") || value.startsWith("//"))
        return null;
    return value;
}
export default function RegisterPage() {
    return (<Suspense fallback={<div className="space-y-4"><div className="h-8 w-48 animate-pulse rounded bg-ink-100"/><div className="h-4 w-64 animate-pulse rounded bg-ink-100"/><div className="h-12 animate-pulse rounded-xl bg-ink-100"/><div className="h-12 animate-pulse rounded-xl bg-ink-100"/></div>}>
      <RegisterForm />
    </Suspense>);
}
function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = safeNext(searchParams.get("next"));
    const requiresCheckout = next === "/checkout";
    const { register: registerUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
        mode: "onBlur",
    });
    const password = useWatch({ control, name: "password" });
    const passwordMet = (ruleIndex) => {
        if (!password)
            return false;
        if (ruleIndex === 0)
            return password.length >= 6;
        return /[A-Za-z]/.test(password) && /\d/.test(password);
    };
    const onSubmit = async (values) => {
        const result = await registerUser({
            name: values.name,
            email: values.email,
            phone: values.phone,
            password: values.password,
            confirmPassword: values.confirmPassword,
            terms: values.terms,
        });
        if (!result.ok) {
            toast.error(result.message ?? "We couldn't create your account. Please try again.");
            return;
        }
        toast.success(result.message ?? "Your account is ready. Welcome to BERA!");
        router.push(next ?? "/account");
        router.refresh();
    };
    return (<div className="animate-fade-up">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-600">Join BERA</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink-900">Sign up</h1>
      <p className="mt-2 text-sm text-ink-500">{requiresCheckout ? "Create an account to continue to checkout and place your order." : "A few details and you&apos;re part of the family."}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
        <Field label="Full name" error={errors.name?.message} required>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input {...register("name")} placeholder="Ayesha Rahman" autoComplete="name" className="pl-10" aria-invalid={Boolean(errors.name)}/>
          </div>
        </Field>

        <Field label="Email address" error={errors.email?.message} required>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input {...register("email")} type="email" placeholder="you@example.com" autoComplete="email" className="pl-10" aria-invalid={Boolean(errors.email)}/>
          </div>
        </Field>

        <Field label="Phone number" hint="Bangladeshi mobile number" error={errors.phone?.message} required>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input {...register("phone")} type="tel" placeholder="01712345678" autoComplete="tel" className="pl-10" aria-invalid={Boolean(errors.phone)}/>
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" error={errors.password?.message} required>
            <div className="relative">
              <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Create a password" autoComplete="new-password" className="pr-10" aria-invalid={Boolean(errors.password)}/>
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-400 transition-colors hover:text-brand-700">
                {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
              </button>
            </div>
          </Field>
          <Field label="Confirm password" error={errors.confirmPassword?.message} required>
            <div className="relative">
              <Input {...register("confirmPassword")} type={showPassword ? "text" : "password"} placeholder="Repeat password" autoComplete="new-password" className="pr-10" aria-invalid={Boolean(errors.confirmPassword)}/>
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-400 transition-colors hover:text-brand-700">
                {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
              </button>
            </div>
          </Field>
        </div>

        <ul className="space-y-1 rounded-xl border border-ink-100 bg-ink-50/70 p-3">
          {passwordRules.map((rule, index) => (<li key={rule} className={`flex items-center gap-2 text-[11px] ${password && passwordMet(index) ? "text-emerald-700" : "text-ink-500"}`}>
              <ShieldCheck className="size-3.5 shrink-0"/>
              {rule}
            </li>))}
        </ul>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5">
            <input type="checkbox" {...register("terms")} className="mt-0.5 size-4 shrink-0 rounded border-ink-300 accent-brand-700" aria-invalid={Boolean(errors.terms)}/>
            <span className="text-xs leading-5 text-ink-500">
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-brand-700 hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-brand-700 hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {errors.terms?.message && <p className="mt-1 text-xs text-red-600">{errors.terms.message}</p>}
        </div>

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-bold text-brand-700 hover:text-brand-900 hover:underline">
          Sign in
        </Link>
      </p>
    </div>);
}
