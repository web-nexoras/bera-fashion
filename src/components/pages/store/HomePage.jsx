import { ProductCard } from "@/components/store/product-card";
import { HeroSlider } from "@/components/store/hero-slider";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories, getProducts } from "@/api/products";
import { CategoryShowcase } from "./home/CategoryShowcase";
import { PromoBannersSection } from "./home/PromoBannersSection";
import { ValuePropsSection } from "./home/ValuePropsSection";
import { NewsletterSection } from "./home/NewsletterSection";

export default async function HomePage() {
  const [categoriesEnvelope, featuredEnvelope, arrivalsEnvelope, bestEnvelope] = await Promise.all([
    getCategories(),
    getProducts("?isFeatured=true&limit=8"),
    getProducts("?isNewArrival=true&limit=8"),
    getProducts("?isBestSeller=true&limit=8"),
  ]);

  const categories = categoriesEnvelope.data ?? [];
  const featured = featuredEnvelope.data ?? [];
  const arrivals = arrivalsEnvelope.data ?? [];
  const bestSellers = bestEnvelope.data ?? [];

  return (
    <>
      <HeroSlider />

      <CategoryShowcase categories={categories} />

      {/* Featured products */}
      <section className="bg-white py-18 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="The edit"
            title="Featured favourites"
            description="The pieces our community keeps coming back for."
            action="Shop all products"
            href="/products"
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {featured.slice(0, 8).map((product, index) => (
              <ProductCard key={product._id} product={product} priority={index < 4} />
            ))}
          </div>
        </div>
      </section>

      {/* New arrivals strip */}
      <section className="container-x py-18 sm:py-24">
        <SectionHeading
          eyebrow="Just landed"
          title="New arrivals"
          description="Fresh silhouettes, first look. Added to the collection this season."
          action="See what's new"
          href="/products?isNewArrival=true"
        />
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {arrivals.map((product) => (
            <div key={product._id} className="w-[72%] shrink-0 snap-start sm:w-[45%] lg:w-[24%]">
              <ProductCard product={product} />
            </div>
          ))}
          {arrivals.length === 0 && (
            <p className="py-8 text-sm text-ink-500">New pieces are on their way.</p>
          )}
        </div>
      </section>

      <PromoBannersSection />

      {/* Best sellers */}
      <section className="bg-brand-50/60 py-18 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Most loved"
            title="Best sellers"
            description="Tried, tested and loved by thousands of customers."
            action="Shop best sellers"
            href="/products?isBestSeller=true"
            centered
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <ValuePropsSection />

      <NewsletterSection />
    </>
  );
}
