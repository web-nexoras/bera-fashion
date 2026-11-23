import { cn } from "@/lib/utils";
import { statusTone } from "@/lib/utils";
const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-200",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    warning: "bg-amber-50 text-amber-700 ring-amber-200",
    danger: "bg-red-50 text-red-700 ring-red-200",
    info: "bg-sky-50 text-sky-700 ring-sky-200",
    neutral: "bg-ink-100 text-ink-600 ring-ink-200",
    gold: "bg-gold-100 text-gold-700 ring-gold-300",
};
export function Badge({ children, tone = "neutral", status, className, dot = false, }) {
    const resolved = (status ? statusTone(status) : tone);
    return (<span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ring-inset", tones[resolved] ?? tones.neutral, className)}>
      {dot && <span className="size-1.5 rounded-full bg-current"/>}
      {children ?? status}
    </span>);
}
