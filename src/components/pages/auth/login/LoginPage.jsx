"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { loginSchema } from "@/lib/validation";
function safeNext(value) {
    if (!value || !value.startsWith("/") || value.startsWith("//"))
        return null;
    return value;
}
export default function LoginPage() {
    return (<Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>);
}
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onBlur",
    });
    const onSubmit = async (values) => {
        const result = await login(values.email.trim(), values.password);
        if (!result.ok) {
            toast.error(result.message ?? "We couldn't sign you in. Please try again.");
            return;
        }
        toast.success(result.message ?? "Welcome back!");
        const requested = safeNext(searchParams.get("next"));
        const isAdmin = result.user?.role === "admin";
        router.push(requested ?? (isAdmin ? "/admin" : "/account"));
        router.refresh();
    };
    return (<div className="animate-fade-up">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-600">Welcome back</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink-900">Sign in to your account</h1>
      <p className="mt-2 text-sm text-ink-500">Pick up right where you left off.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <Field label="Email address" error={errors.email?.message} required>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com" className="pl-10" aria-invalid={Boolean(errors.email)}/>
          </div>
        </Field>

        <Field label="Password" error={errors.password?.message} required>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input {...register("password")} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" className="px-10" aria-invalid={Boolean(errors.password)}/>
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-400 transition-colors hover:text-brand-700">
              {showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-end">
          <Link href="/forgot-password" className="text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-500">
        New to BERA?{" "}
        <Link href="/register" className="font-bold text-brand-700 hover:text-brand-900 hover:underline">
          Create an account
        </Link>
      </p>
    </div>);
}
function LoginFallback() {
    return (<div className="space-y-5">
      <Skeleton className="h-3 w-24"/>
      <Skeleton className="h-10 w-4/5"/>
      <Skeleton className="h-4 w-2/3"/>
      <Skeleton className="h-12 w-full"/>
      <Skeleton className="h-12 w-full"/>
      <Skeleton className="h-12 w-full rounded-xl"/>
    </div>);
}
