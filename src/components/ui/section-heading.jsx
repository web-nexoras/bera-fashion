import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function SectionHeading({ eyebrow, title, description, action, href, centered = false, }) {
    return (<div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${centered ? "text-center" : ""}`}>
      <div className={centered ? "mx-auto max-w-2xl" : ""}>
        {eyebrow && (<p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-600">{eyebrow}</p>)}
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{title}</h2>
        {description && <p className="mt-2 max-w-xl text-sm text-ink-500">{description}</p>}
      </div>
      {action && href && (<Link href={href} className="group inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900">
          {action}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1"/>
        </Link>)}
    </div>);
}
export function PageHeading({ title, description, action, }) {
    return (<div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>);
}
