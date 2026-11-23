import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories } from "@/api/products";
import { photo } from "@/lib/fallback/data";
export const revalidate = 300;
export default async function CategoriesPage() {
    const envelope = await getCategories();
    const categories = envelope.data ?? [];
    return (<>
      <section className="relative overflow-hidden bg-brand-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 opacity-25">
          <Image src={photo("photo-1483985988355-763728e1935b", 1400)} alt="Fashion collection" fill sizes="100vw" className="object-cover"/>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-800/40"/>
        <div className="container-x relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">The collections</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Shop by category
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-50/80">
            Explore the BERA world, one thoughtfully curated collection at a time.
          </p>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <SectionHeading eyebrow="Browse the edit" title="Everyday, elevated" description="Find exactly what you're looking for — or something you didn't know you needed."/>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (<Link key={category._id} href={`/categories/${category.slug}`} className="group surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="relative aspect-16/10 overflow-hidden bg-brand-50">
                {category.image && (<Image src={category.image} alt={category.name} fill priority={index < 3} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105"/>)}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent"/>
                <span className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90 text-brand-700 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="size-4"/>
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                    {category.name}
                  </h2>
                  {category.productCount !== undefined && (<Badge tone="brand">{category.productCount} pieces</Badge>)}
                </div>
                {category.description && (<p className="mt-2 text-sm leading-relaxed text-ink-500">{category.description}</p>)}
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-brand-700">
                  Explore collection →
                </span>
              </div>
            </Link>))}
        </div>
      </section>
    </>);
}
