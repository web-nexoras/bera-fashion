"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
export function Pagination({ pagination, onPage, className, }) {
    if (pagination.totalPages <= 1)
        return null;
    const pages = Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
        const start = Math.max(1, Math.min(pagination.page - 2, pagination.totalPages - 4));
        return start + index;
    }).filter((page) => page >= 1 && page <= pagination.totalPages);
    return (<nav className={cn("flex items-center justify-center gap-1.5", className)} aria-label="Pagination">
      <button onClick={() => onPage(pagination.page - 1)} disabled={!pagination.hasPrevPage} className="flex size-9 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-600 hover:border-brand-400 hover:text-brand-700 disabled:opacity-40">
        <ChevronLeft className="size-4"/>
      </button>
      {pages.map((page) => (<button key={page} onClick={() => onPage(page)} className={cn("size-9 rounded-lg text-sm font-semibold transition-colors", page === pagination.page
                ? "bg-brand-700 text-white"
                : "border border-ink-200 bg-white text-ink-600 hover:border-brand-400 hover:text-brand-700")}>
          {page}
        </button>))}
      <button onClick={() => onPage(pagination.page + 1)} disabled={!pagination.hasNextPage} className="flex size-9 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-600 hover:border-brand-400 hover:text-brand-700 disabled:opacity-40">
        <ChevronRight className="size-4"/>
      </button>
    </nav>);
}
