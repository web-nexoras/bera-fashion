import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
const variants = {
    primary: "bg-brand-700 text-white hover:bg-brand-800 shadow-soft disabled:bg-brand-300",
    secondary: "bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-100",
    outline: "bg-white text-ink-700 border border-ink-200 hover:border-brand-400 hover:text-brand-700",
    ghost: "bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
    gold: "bg-gold-500 text-ink-900 hover:bg-gold-300",
};
const sizes = {
    sm: "h-9 px-3.5 text-xs gap-1.5",
    md: "h-11 px-5 text-sm gap-2",
    lg: "h-13 px-7 text-sm gap-2.5",
    icon: "h-10 w-10",
};
const base = "inline-flex shrink-0 items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";
export function Button({ variant = "primary", size = "md", loading = false, className, children, disabled, ...props }) {
    return (<button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="size-4 animate-spin"/>}
      {children}
    </button>);
}
export function ButtonLink({ variant = "primary", size = "md", className, children, href, ...props }) {
    return (<Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>);
}
