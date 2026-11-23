import { cn } from "@/lib/utils";
export function Skeleton({ className }) {
    return <div className={cn("animate-pulse rounded-lg bg-ink-100", className)}/>;
}
export function Spinner({ className }) {
    return (<span className={cn("inline-block size-6 animate-spin rounded-full border-2 border-brand-100 border-t-brand-700", className)}/>);
}
export function EmptyState({ icon, title, description, action, className, }) {
    return (<div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      {icon && (<div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          {icon}
        </div>)}
      <h3 className="font-display text-xl font-bold text-ink-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>);
}
export function ErrorState({ message, onRetry }) {
    return (<EmptyState icon={<span className="text-2xl">!</span>} title="Something went wrong" description={message ?? "We couldn't load this section. Please try again."} action={onRetry && (<button onClick={onRetry} className="text-sm font-semibold text-brand-700 underline underline-offset-4">
            Try again
          </button>)}/>);
}
