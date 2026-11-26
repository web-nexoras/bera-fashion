import { ArrowRight, PackageCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="container-x pb-18 sm:pb-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 px-6 py-14 text-center text-white shadow-3d sm:px-12 sm:py-18">
        <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full border border-white/15 bg-white/5 blur-xs" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full border border-gold-300/15 bg-gold-300/5 blur-xs" />
        <div className="relative mx-auto max-w-2xl">
          <PackageCheck className="mx-auto size-9 text-gold-300 animate-float" />
          <h2 className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl">
            Join the BERA circle
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/90">
            Be first to know about new drops, styling notes and members-only offers. No noise, just the good stuff.
          </p>
          <div className="mx-auto mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              className="h-12 border-white/30 bg-white/15 text-white placeholder:text-white/75 focus:border-gold-300 focus:ring-gold-300/25"
            />
            <ButtonLink href="/products" variant="gold" size="lg" className="h-12 shrink-0">
              Subscribe <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <p className="mt-4 text-[11px] text-white/75">
            By subscribing you agree to our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}
