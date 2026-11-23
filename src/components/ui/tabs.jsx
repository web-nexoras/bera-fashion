"use client";
import { cn } from "@/lib/utils";
export function Tabs({ items, active, onChange, className, }) {
    return (<div className={className}>
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-ink-100">
        {items.map((item) => (<button key={item.id} onClick={() => onChange(item.id)} className={cn("relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors", active === item.id ? "text-brand-700" : "text-ink-500 hover:text-ink-800")}>
            {item.label}
            {item.count !== undefined && (<span className="ml-1.5 rounded-full bg-ink-100 px-1.5 py-0.5 text-[10px] text-ink-500">
                {item.count}
              </span>)}
            {active === item.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-700"/>}
          </button>))}
      </div>
      <div className="pt-5">{items.find((item) => item.id === active)?.content}</div>
    </div>);
}
