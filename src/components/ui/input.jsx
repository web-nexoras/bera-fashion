import { cn } from "@/lib/utils";
const fieldBase = "w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-800 placeholder:text-ink-400 transition-colors hover:border-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50";
export function Input({ className, ...props }) {
    return <input className={cn(fieldBase, "h-11", className)} {...props}/>;
}
export function Textarea({ className, ...props }) {
    return <textarea className={cn(fieldBase, "min-h-28 py-2.5", className)} {...props}/>;
}
export function Select({ className, children, ...props }) {
    return (<select className={cn(fieldBase, "h-11 cursor-pointer pr-8", className)} {...props}>
      {children}
    </select>);
}
export function Field({ label, hint, error, required, children, className, }) {
    return (<label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold text-ink-700">
        {label} {required && <span className="text-brand-600">*</span>}
      </span>
      {children}
      {error ? (<span className="mt-1 block text-xs text-red-600">{error}</span>) : hint ? (<span className="mt-1 block text-xs text-ink-400">{hint}</span>) : null}
    </label>);
}
