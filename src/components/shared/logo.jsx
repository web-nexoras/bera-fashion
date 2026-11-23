import Link from "next/link";
import { Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
export function Logo({ href = "/", compact = false, light = false, className, }) {
    return (<Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className={cn("flex size-9 items-center justify-center rounded-xl transition-transform group-hover:rotate-6", light ? "bg-white/15 text-white ring-1 ring-white/30" : "bg-brand-700 text-white")}>
        <Gem className="size-5" strokeWidth={1.8}/>
      </span>
      {!compact && (<span className="leading-none">
          <span className={cn("block font-display text-xl font-bold tracking-tight", light ? "text-white" : "text-brand-800")}>
            {SITE.shortName}
          </span>
          <span className={cn("mt-0.5 block text-[8px] font-bold uppercase tracking-[0.34em]", light ? "text-white/60" : "text-ink-400")}>
            Fashions
          </span>
        </span>)}
    </Link>);
}
