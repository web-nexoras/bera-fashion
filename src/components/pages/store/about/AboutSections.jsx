import Image from "next/image";
import { Compass, HeartHandshake, Leaf, Sparkles, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { unsplashPhoto } from "@/lib/images";

const craftImage = unsplashPhoto("photo-1556905055-8f358a7a47b2", 1200);
const teamImage = unsplashPhoto("photo-1445205170230-053b83016050", 1400);

const stats = [
  ["2021", "Year founded"],
  ["12k+", "Happy customers"],
  ["48+", "Styles in the edit"],
  ["8", "Retail partners"],
];

const values = [
  {
    icon: Sparkles,
    title: "Considered design",
    text: "Every silhouette begins with a sketch, a fabric swatch and a question: will this feel as good as it looks?",
  },
  {
    icon: Leaf,
    title: "Responsible materials",
    text: "We favour natural fibres, lower-impact dyes and small-batch production over disposable trends.",
  },
  {
    icon: HeartHandshake,
    title: "Made for real life",
    text: "Comfort, fit and versatility guide every decision. Clothes should work around you, not the other way round.",
  },
  {
    icon: Compass,
    title: "Quiet confidence",
    text: "We believe style is personal. Our pieces are designed to whisper, never shout.",
  },
];

export function AboutStatsSection() {
  return (
    <section className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-950 py-14 text-white">
      <div className="container-x grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="text-center">
            <p className="font-display text-4xl font-bold text-gold-300 sm:text-5xl">{value}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutValuesSection() {
  return (
    <section className="container-x py-18 sm:py-24">
      <SectionHeading
        eyebrow="What we believe"
        title="The values we dress by"
        description="A few simple principles that guide everything we make and every decision we take."
        centered
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="surface card-3d p-6">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-200/60">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-ink-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutCraftSection() {
  return (
    <section className="bg-white py-18 sm:py-24">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="card-3d relative order-2 aspect-4/3 overflow-hidden rounded-3xl shadow-soft lg:order-1">
          <Image
            src={craftImage}
            alt="Fabric and craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">The craft</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Beauty lives in the details
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-ink-600">
            We work closely with a small network of makers who share our standards. From the first
            fabric swatch to the final stitch, each piece is checked for fit, finish and feel.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-600">
            The result is clothing that keeps its shape, softens with wear and stays in your
            wardrobe for seasons to come.
          </p>
          <div className="mt-8 border-l-2 border-gold-500 pl-5">
            <p className="font-display text-lg italic text-brand-800">
              “Buy less, choose well, and wear it often.”
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
              Our guiding thought
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutTeamCtaSection() {
  return (
    <section className="container-x py-18 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-brand-950 shadow-3d">
        <div className="absolute inset-0 opacity-25">
          <Image src={teamImage} alt="The BERA atelier" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-800/50" />
        <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Users className="size-7 text-gold-300" />
            <h2 className="mt-4 max-w-xl font-display text-3xl font-bold text-white sm:text-4xl">
              A dedicated team with a big love for good clothes
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85">
              Designers, makers and customer care specialists — all working together to make your
              BERA experience feel personal.
            </p>
          </div>
          <ButtonLink href="/contact" variant="gold" size="lg" className="w-fit">
            Say hello
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
