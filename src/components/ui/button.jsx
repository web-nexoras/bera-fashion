import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
const variants = {
    primary: "bg-gradient-to-b from-brand-600 to-brand-800 text-white hover:from-brand-700 hover:to-brand-900 btn-3d disabled:from-brand-700/60 disabled:to-brand-800/60",
    secondary: "bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-200/80 shadow-xs",
    outline: "bg-white text-ink-800 border border-ink-200 hover:border-brand-500 hover:text-brand-700 shadow-xs",
    ghost: "bg-transparent text-ink-700 hover:bg-ink-100 hover:text-ink-900",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    gold: "bg-gradient-to-b from-gold-300 to-gold-500 text-brand-950 font-bold hover:from-gold-100 hover:to-gold-300 shadow-[0_10px_24px_-10px_rgba(201,162,39,0.65),inset_0_1px_0_rgba(255,255,255,0.4)]",
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
