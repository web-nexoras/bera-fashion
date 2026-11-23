import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export function StatCard({ label, value, icon, growth, trend, hint, className, }) {
    const resolvedTrend = trend ?? (growth === undefined ? "flat" : growth > 0 ? "up" : growth < 0 ? "down" : "flat");
    const TrendIcon = resolvedTrend === "up" ? ArrowUpRight : resolvedTrend === "down" ? ArrowDownRight : Minus;
    const tone = resolvedTrend === "up" ? "success" : resolvedTrend === "down" ? "danger" : "neutral";
    return (<div className={cn("surface p-5 transition-shadow hover:shadow-lift", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
          {icon}
        </div>
        {growth !== undefined && (<Badge tone={tone} className="gap-0.5">
            <TrendIcon className="size-3"/>
            {Math.abs(growth).toFixed(1)}%
          </Badge>)}
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-ink-900 sm:text-[1.75rem]">
        {value}
      </p>
      <p className="mt-2 text-xs text-ink-400">{hint ?? "Compared with previous period"}</p>
    </div>);
}
