import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { ProductDetail } from "@/components/store/product-detail";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProductBySlug, getRelatedProducts } from "@/api/products";
export const revalidate = 60;
export default async function ProductDetailPage({ params, }) {
    const { slug } = await params;
    const [productEnvelope, relatedEnvelope] = await Promise.all([
        getProductBySlug(slug),
        getRelatedProducts(slug),
    ]);
    const product = productEnvelope.data;
    if (!product)
        notFound();
    const related = relatedEnvelope.data ?? [];
    const categoryName = typeof product.category === "object" ? product.category.name : "Collection";
    const categorySlug = typeof product.category === "object" ? product.category.slug : undefined;
    return (<div className="container-x py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-ink-400">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight className="size-3"/>
        <Link href="/products" className="hover:text-brand-700">Products</Link>
        <ChevronRight className="size-3"/>
        {categorySlug ? (<>
            <Link href={`/categories/${categorySlug}`} className="hover:text-brand-700">{categoryName}</Link>
            <ChevronRight className="size-3"/>
          </>) : (<>
            <span>{categoryName}</span>
            <ChevronRight className="size-3"/>
          </>)}
        <span className="font-semibold text-ink-700">{product.name}</span>
      </nav>

      <ProductDetail product={product}/>

      {/* Related products */}
      {related.length > 0 && (<section className="mt-20 border-t border-ink-100 pt-14">
          <SectionHeading eyebrow="You may also like" title="Complete the look" description="More pieces from the same collection." action="View all products" href="/products"/>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.slice(0, 4).map((item) => (<ProductCard key={item._id} product={item}/>))}
          </div>
        </section>)}
    </div>);
}
