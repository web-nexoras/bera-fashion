import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/feedback";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories, getCategoryBySlug, getProducts } from "@/api/products";
import { buildQuery } from "@/lib/utils";
export const revalidate = 300;
export default async function CategoryPage({ params, }) {
    const { slug } = await params;
    const [categoryEnvelope, productsEnvelope, categoriesEnvelope] = await Promise.all([
        getCategoryBySlug(slug),
        getProducts(buildQuery({ category: slug, limit: 12 })),
        getCategories(),
    ]);
    const category = categoryEnvelope.data;
    if (!category)
        notFound();
    const products = productsEnvelope.data ?? [];
    const otherCategories = (categoriesEnvelope.data ?? []).filter((item) => item.slug !== slug);
    return (<>
      {/* Category hero */}
      <section className="relative isolate overflow-hidden bg-brand-950 py-16 text-white sm:py-20">
        {category.image && (<div className="absolute inset-0 opacity-30">
            <Image src={category.image} alt={category.name} fill sizes="100vw" className="object-cover"/>
          </div>)}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-800/35"/>
        <div className="container-x relative">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-brand-50/60">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="size-3"/>
            <Link href="/categories" className="hover:text-white">Categories</Link>
            <ChevronRight className="size-3"/>
            <span className="font-semibold text-white">{category.name}</span>
          </nav>
          <Badge tone="gold">Collection</Badge>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">{category.name}</h1>
          {category.description && (<p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-50/80">{category.description}</p>)}
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            {products.length} pieces in this edit
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="container-x py-14 sm:py-20">
        {products.length > 0 ? (<>
            <SectionHeading eyebrow="The collection" title={`Shop ${category.name}`} description="Hand-picked pieces, designed to be lived in." action="Browse all products" href="/products"/>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (<ProductCard key={product._id} product={product} priority={index < 4}/>))}
            </div>
          </>) : (<div className="surface">
            <EmptyState title="This collection is being restyled" description="New pieces are on the way. In the meantime, explore everything else in the store." action={<Link href="/products" className="text-sm font-bold text-brand-700 underline underline-offset-4">
                  Browse all products
                </Link>}/>
          </div>)}
      </section>

      {/* Other categories */}
      {otherCategories.length > 0 && (<section className="bg-brand-50/60 py-14 sm:py-20">
          <div className="container-x">
            <SectionHeading eyebrow="Keep exploring" title="More collections"/>
            <div className="flex flex-wrap gap-3">
              {otherCategories.map((item) => (<Link key={item._id} href={`/categories/${item.slug}`} className="rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-700 hover:text-white">
                  {item.name}
                </Link>))}
            </div>
          </div>
        </section>)}
    </>);
}
