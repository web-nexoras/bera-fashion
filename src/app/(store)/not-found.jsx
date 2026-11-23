import { Compass } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
export default function StoreNotFound() {
    return (<div className="container-x flex min-h-140 items-center justify-center py-16">
      <div className="surface w-full max-w-xl text-center">
        <EmptyState icon={<Compass className="size-6"/>} title="This page took a different turn" description="We couldn't find what you're looking for. The piece may have moved, or the link might be out of date." action={<div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/">Back to home</ButtonLink>
              <ButtonLink href="/products" variant="outline">
                Browse products
              </ButtonLink>
            </div>}/>
        <div className="border-t border-ink-100 px-6 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-400">404 · Page not found</p>
        </div>
      </div>
    </div>);
}
