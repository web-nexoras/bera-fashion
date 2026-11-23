import { cn } from "@/lib/utils";
export function Card({ className, ...props }) {
    return <div className={cn("surface", className)} {...props}/>;
}
export function CardHeader({ title, description, action, className, }) {
    return (<div className={cn("flex flex-wrap items-start justify-between gap-3 border-b border-ink-100 px-5 py-4", className)}>
      <div>
        <h3 className="text-sm font-bold text-ink-900">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-ink-500">{description}</p>}
      </div>
      {action}
    </div>);
}
export function CardBody({ className, ...props }) {
    return <div className={cn("p-5", className)} {...props}/>;
}
export function CardFooter({ className, ...props }) {
    return <div className={cn("border-t border-ink-100 px-5 py-4", className)} {...props}/>;
}
