"use client";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
export function QuantityStepper({ value, onChange, min = 1, max = 99, className, }) {
    return (<div className={cn("inline-flex h-10 items-center rounded-xl border border-ink-200 bg-white", className)}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="flex size-9 items-center justify-center rounded-l-xl text-ink-500 hover:bg-ink-50 disabled:opacity-30" aria-label="Decrease quantity">
        <Minus className="size-3.5"/>
      </button>
      <span className="min-w-8 text-center text-sm font-bold text-ink-800">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="flex size-9 items-center justify-center rounded-r-xl text-ink-500 hover:bg-ink-50 disabled:opacity-30" aria-label="Increase quantity">
        <Plus className="size-3.5"/>
      </button>
    </div>);
}
