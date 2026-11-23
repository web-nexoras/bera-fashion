"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
export function Modal({ open, onClose, title, description, children, size = "md", }) {
    useEffect(() => {
        if (!open)
            return;
        const onKey = (event) => event.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);
    if (!open)
        return null;
    const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };
    return (<div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <button aria-label="Close" className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onClose}/>
      <div className={cn("relative z-10 w-full overflow-hidden rounded-2xl bg-white shadow-lift", widths[size])}>
        <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">{title}</h2>
            {description && <p className="mt-1 text-xs text-ink-500">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
            <X className="size-5"/>
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>);
}
