"use client";
import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function GlobalError({ error, reset, }) {
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (<div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-red-50 text-red-600">
          <TriangleAlert className="size-9"/>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Something went wrong</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink-900">We hit a snag</h1>
        <p className="mt-4 text-sm text-ink-500">
          An unexpected error occurred while rendering this page. Your data is safe — try again.
        </p>
        <Button onClick={reset} className="mt-8">
          <RotateCcw className="size-4"/> Try again
        </Button>
      </div>
    </div>);
}
