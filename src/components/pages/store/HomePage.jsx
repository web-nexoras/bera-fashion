import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Headphones, PackageCheck, RotateCcw, ShieldCheck, Truck, } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { HeroSlider } from "@/components/store/hero-slider";
import { ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories, getProducts } from "@/api/products";
import { unsplashPhoto } from "@/lib/images";
const editorialImage = unsplashPhoto("photo-1490481651871-ab68de25d43d", 1100);
const atelierImage = unsplashPhoto("photo-1516257984-b1b4d707412e", 1100);
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
    return (<>
      <HeroSlider />

      {/* Categories */}
      <section className="container-x py-18 sm:py-24">
        <SectionHeading eyebrow="Shop by category" title="Find your next favourite" description="From everyday essentials to occasion-ready statements — curated with care." action="View all categories" href="/categories"/>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {(categories.length ? categories : []).slice(0, 8).map((category) => (<Link key={category._id} href={`/categories/${category.slug}`} className="group relative aspect-4/5 overflow-hidden rounded-2xl bg-brand-50 shadow-soft">
              {category.image && (<Image src={category.image} alt={category.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw" className="object-cover transition-transform duration-700 group-hover:scale-110"/>)}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/15 to-transparent"/>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="font-display text-lg font-bold text-white sm:text-xl">{category.name}</p>
                {category.productCount !== undefined && (<p className="mt-1 text-[11px] font-medium text-white/70">{category.productCount} pieces</p>)}
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold-300 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Explore <ArrowRight className="size-3.5"/>
                </span>
              </div>
            </Link>))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white py-18 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="The edit" title="Featured favourites" description="The pieces our community keeps coming back for." action="Shop all products" href="/products"/>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {featured.slice(0, 8).map((product, index) => (<ProductCard key={product._id} product={product} priority={index < 4}/>))}
          </div>
        </div>
      </section>

      {/* New arrivals strip */}
      <section className="container-x py-18 sm:py-24">
        <SectionHeading eyebrow="Just landed" title="New arrivals" description="Fresh silhouettes, first look. Added to the collection this season." action="See what's new" href="/products?isNewArrival=true"/>
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {arrivals.map((product) => (<div key={product._id} className="w-[72%] shrink-0 snap-start sm:w-[45%] lg:w-[24%]">
              <ProductCard product={product}/>
            </div>))}
          {arrivals.length === 0 && (<p className="py-8 text-sm text-ink-500">New pieces are on their way.</p>)}
        </div>
      </section>

      {/* Promotional split banner */}
      <section className="container-x pb-18 sm:pb-24">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="group relative min-h-96 overflow-hidden rounded-3xl bg-brand-900">
            <Image src={editorialImage} alt="Seasonal editorial" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/60 to-transparent"/>
            <div className="relative flex h-full min-h-96 flex-col justify-end p-8 sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">The autumn edit</p>
              <h3 className="mt-3 max-w-sm font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                Layers that tell a story
              </h3>
              <p className="mt-3 max-w-sm text-sm text-brand-50/80">
                Soft knits, structured outerwear and considered accessories for the cooler days ahead.
              </p>
              <ButtonLink href="/products?isNewArrival=true" variant="gold" className="mt-6 w-fit">
                Discover the edit <ArrowRight className="size-4"/>
              </ButtonLink>
            </div>
          </div>
          <div className="group relative min-h-96 overflow-hidden rounded-3xl bg-brand-50">
            <Image src={atelierImage} alt="Atelier craftsmanship" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-75 transition-transform duration-700 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-l from-brand-950/60 via-brand-950/25 to-transparent"/>
            <div className="relative ml-auto flex h-full min-h-96 max-w-md flex-col justify-end p-8 text-right sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">Made with intention</p>
              <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                Quality you can feel
              </h3>
              <p className="mt-3 text-sm text-white/80">
                Small-batch production, responsible materials and finishes made to last beyond a season.
              </p>
              <ButtonLink href="/about" variant="outline" className="mt-6 ml-auto w-fit border-white/40 bg-white/10 text-white hover:border-white hover:text-white">
                Our story <ArrowRight className="size-4"/>
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-brand-50/60 py-18 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Most loved" title="Best sellers" description="Tried, tested and loved by thousands of customers." action="Shop best sellers" href="/products?isBestSeller=true" centered/>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {bestSellers.slice(0, 4).map((product) => (<ProductCard key={product._id} product={product}/>))}
          </div>
        </div>
      </section>

      {/* Trust / value props */}
      <section className="container-x py-18 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Islandwide delivery", text: "Fast, reliable shipping to your door." },
            { icon: ShieldCheck, title: "Secure payments", text: "Cash on delivery or encrypted checkout." },
            { icon: RotateCcw, title: "7-day returns", text: "Easy exchanges if it isn't quite right." },
            { icon: Headphones, title: "Personal support", text: "Real people, ready to help you." },
        ].map(({ icon: Icon, title, text }) => (<div key={title} className="surface p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Icon className="size-5"/>
              </div>
              <h3 className="mt-4 text-sm font-bold text-ink-900">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{text}</p>
            </div>))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-x pb-18 sm:pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-14 text-center text-white sm:px-12 sm:py-18">
          <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full border border-white/10"/>
          <div className="pointer-events-none absolute -bottom-32 -right-16 size-96 rounded-full border border-white/10"/>
          <div className="relative mx-auto max-w-2xl">
            <PackageCheck className="mx-auto size-8 text-gold-300"/>
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">Join the BERA circle</h2>
            <p className="mt-3 text-sm text-brand-50/80">
              Be first to know about new drops, styling notes and members-only offers. No noise, just the good stuff.
            </p>
            <div className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row">
              <Input type="email" placeholder="Your email address" aria-label="Email address" className="h-12 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-gold-300 focus:ring-gold-300/20"/>
              <ButtonLink href="/products" variant="gold" size="lg" className="h-12 shrink-0">
                Subscribe <ArrowRight className="size-4"/>
              </ButtonLink>
            </div>
            <p className="mt-4 text-[11px] text-brand-50/50">By subscribing you agree to our privacy policy.</p>
          </div>
        </div>
      </section>
    </>);
}
