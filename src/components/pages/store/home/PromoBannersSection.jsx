import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { unsplashPhoto } from "@/lib/images";

const editorialImage = unsplashPhoto("photo-1581044777550-4cfa60707c03", 1200);
const atelierImage = unsplashPhoto("photo-1588117305388-c2631a279f82", 1200);

export function PromoBannersSection() {
  return (
    <section className="container-x pb-18 sm:pb-24">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-3d group relative min-h-96 overflow-hidden rounded-3xl bg-brand-950 shadow-soft">
          <Image
            src={editorialImage}
            alt="Seasonal editorial"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-950/55 to-transparent" />
          <div className="relative flex h-full min-h-96 flex-col justify-end p-8 sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">Full sleeve collection</p>
            <h3 className="mt-3 max-w-sm font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Effortless style, every sleeve
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90">
              Elegant full-sleeve tops and statement pieces crafted for the modern woman — from daily wear to special occasions.
            </p>
            <ButtonLink href="/products?isNewArrival=true" variant="gold" className="mt-6 w-fit">
              Discover the edit <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="card-3d group relative min-h-96 overflow-hidden rounded-3xl bg-brand-950 shadow-soft">
          <Image
            src={atelierImage}
            alt="Atelier craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-950/90 via-brand-950/55 to-transparent" />
          <div className="relative ml-auto flex h-full min-h-96 max-w-md flex-col justify-end p-8 text-right sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">Made with intention</p>
            <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Quality you can feel
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Small-batch production, responsible materials and finishes made to last beyond a season.
            </p>
            <ButtonLink
              href="/about"
              variant="outline"
              className="mt-6 ml-auto w-fit border-white/50 bg-white/15 text-white backdrop-blur-sm hover:border-gold-300 hover:bg-brand-800 hover:text-gold-300"
            >
              Our story <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
