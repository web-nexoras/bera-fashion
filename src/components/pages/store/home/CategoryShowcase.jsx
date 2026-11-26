import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

export function CategoryShowcase({ categories = [] }) {
  return (
    <section className="container-x py-18 sm:py-24">
      <SectionHeading
        eyebrow="Shop by category"
        title="Find your next favourite"
        description="From everyday essentials to occasion-ready statements — curated with care."
        action="View all categories"
        href="/categories"
      />
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {categories.slice(0, 8).map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className="card-3d group relative aspect-4/5 overflow-hidden rounded-2xl bg-brand-900 shadow-soft"
          >
            {category.image && (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="font-display text-lg font-bold text-white sm:text-xl">{category.name}</p>
              {category.productCount !== undefined && (
                <p className="mt-1 text-[11px] font-medium text-white/85">{category.productCount} pieces</p>
              )}
              <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-300 opacity-0 transition-all duration-300 group-hover:opacity-100">
                Explore <ArrowRight className="size-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
