import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
export default function NotFound() {
    return (<div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-brand-50 text-brand-700">
          <SearchX className="size-9"/>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600">Error 404</p>
        <h1 className="mt-3 font-display text-5xl font-bold text-ink-900">Page not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          The page you&apos;re looking for may have moved, been renamed, or never existed at all.
          Let&apos;s get you back to something beautiful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/products" variant="outline">
            <ArrowLeft className="size-4"/> Browse collection
          </ButtonLink>
        </div>
        <Link href="/contact" className="mt-6 inline-block text-xs font-semibold text-brand-700 underline underline-offset-4">
          Need help? Contact support
        </Link>
      </div>
    </div>);
}
