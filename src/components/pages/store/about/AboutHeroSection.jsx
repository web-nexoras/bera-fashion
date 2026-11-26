import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { unsplashPhoto } from "@/lib/images";

const storyImage = unsplashPhoto("photo-1490481651871-ab68de25d43d", 1200);

export function AboutHeroSection() {
  return (
    <section className="container-x grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
      <div className="animate-fade-up">
        <Badge tone="brand">Our story</Badge>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
          Fashion with a <span className="italic text-brand-700">little more meaning.</span>
        </h1>
        <p className="mt-6 text-base leading-relaxed text-ink-600">
          BERA began with a simple idea: getting dressed should feel effortless, and the things we
          wear should be worth keeping. We set out to make clothing that honours both the person in
          it and the hands that made it.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-500">
          Today, we&apos;re a dedicated team in Dhaka curating modern essentials for people who
          value quality over quantity — and quiet confidence over noise.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/products">Explore the collection</ButtonLink>
          <ButtonLink href="/contact" variant="outline">
            Get in touch
          </ButtonLink>
        </div>
      </div>

      <div className="relative animate-fade-up">
        <div className="absolute -left-5 -top-5 hidden h-full w-full rounded-3xl border-2 border-brand-200/80 sm:block" />
        <div className="card-3d relative aspect-4/5 overflow-hidden rounded-3xl shadow-lift">
          <Image
            src={storyImage}
            alt="BERA FASHION editorial collection"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="animate-float absolute -bottom-5 -right-3 hidden rounded-2xl bg-gradient-to-br from-brand-700 to-brand-950 px-6 py-5 text-white shadow-3d ring-1 ring-gold-300/30 sm:block">
          <p className="font-display text-3xl font-bold text-gold-300">100%</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/90">
            Thoughtfully crafted
          </p>
        </div>
      </div>
    </section>
  );
}
