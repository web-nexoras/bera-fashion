import { PackageSearch } from "lucide-react";
import { ProductFilters, ProductPagination, } from "@/components/store/product-filters";
import { ProductCard } from "@/components/store/product-card";
import { EmptyState } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { getBrands, getCategories, getProducts } from "@/api/products";
import { buildQuery } from "@/lib/utils";
export const dynamic = "force-dynamic";
const first = (value) => Array.isArray(value) ? value[0] : value;
const isTrue = (value) => first(value) === "true";
const DEFAULT_PAGINATION = {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
};
export default async function ProductsPage({ searchParams }) {
    const params = await searchParams;
    const page = Number(first(params.page) ?? 1) || 1;
    const sort = first(params.sort);
    const filters = {
        page,
        search: first(params.search) || undefined,
        category: first(params.category) || undefined,
        brand: first(params.brand) || undefined,
        sort: sort && ["newest", "oldest", "price_asc", "price_desc", "popular", "rating"].includes(sort)
            ? sort
            : "newest",
        isFeatured: isTrue(params.isFeatured) || undefined,
        isNewArrival: isTrue(params.isNewArrival) || undefined,
        isBestSeller: isTrue(params.isBestSeller) || undefined,
    };
    const query = buildQuery({ ...filters, limit: 12 });
    const [productsEnvelope, categoriesEnvelope, brandsEnvelope] = await Promise.all([
        getProducts(query),
        getCategories(),
        getBrands(),
    ]);
    const products = productsEnvelope.data ?? [];
    const categories = categoriesEnvelope.data ?? [];
    const brands = brandsEnvelope.data ?? [];
    const pagination = productsEnvelope.pagination ?? {
        ...DEFAULT_PAGINATION,
        total: products.length,
        page,
    };
    const activeLabel = (filters.search && `for “${filters.search}”`) ||
        (filters.category && `in ${filters.category.replace(/-/g, " ")}`) ||
        (filters.isNewArrival && "— new arrivals") ||
        (filters.isBestSeller && "— best sellers") ||
        (filters.isFeatured && "— featured");
    const pageTitle = filters.isNewArrival
        ? "New arrivals"
        : filters.isBestSeller
            ? "Best sellers"
            : filters.isFeatured
                ? "Featured edit"
                : "All products";
    return (<>
      <section className="bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 py-12 text-white sm:py-14">
        <div className="container-x flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">BERA Collection</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">{pageTitle}</h1>
            <p className="mt-2.5 max-w-xl text-sm text-white/85">
              {activeLabel ? `Explore the collection ${activeLabel}.` : "Explore the full BERA collection crafted for everyday elegance."}
            </p>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-gold-300 backdrop-blur-xs">
            {pagination.total} pieces
          </span>
        </div>
      </section>

      <div className="container-x py-10 sm:py-12">

      <ProductFilters categories={categories} brands={brands} filters={filters} total={pagination.total}/>

      {products.length > 0 ? (<>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-ink-500">
              Showing <strong className="text-ink-800">{(pagination.page - 1) * pagination.limit + 1}</strong>–
              <strong className="text-ink-800">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </strong>{" "}
              of <strong className="text-ink-800">{pagination.total}</strong>
            </p>
            <span className="text-xs text-ink-400">Page {pagination.page} of {pagination.totalPages}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (<ProductCard key={product._id} product={product} priority={index < 4}/>))}
          </div>
          <ProductPagination pagination={pagination} filters={filters}/>
        </>) : (<div className="surface">
          <EmptyState icon={<PackageSearch className="size-6"/>} title="No pieces found" description="We couldn't find anything matching those filters. Try clearing a filter or browsing the full collection." action={<ButtonLink href="/products" variant="primary">
                View all products
              </ButtonLink>}/>
        </div>)}
    </div>
    </>);
}
