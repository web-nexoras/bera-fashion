"use client";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { buildQuery, titleCase } from "@/lib/utils";
const SORT_OPTIONS = ["newest", "oldest", "price_asc", "price_desc", "popular", "rating"];
function normalizedQuery(filters) {
    const next = { ...filters };
    Object.keys(next).forEach((key) => {
        const value = next[key];
        if (value === undefined || value === null || value === "" || value === false)
            delete next[key];
        if (key === "page" && Number(value) <= 1)
            delete next[key];
    });
    return next;
}
export function ProductFilters({ categories, brands, filters, total, }) {
    const router = useRouter();
    const [search, setSearch] = useState(filters.search ?? "");
    const navigate = (patch) => {
        const next = { ...filters, ...patch };
        if (!("page" in patch))
            delete next.page;
        router.push(`/products${buildQuery(normalizedQuery(next))}`);
    };
    const activeChips = [];
    if (filters.search)
        activeChips.push({ key: "search", label: `Search: ${filters.search}` });
    if (filters.category) {
        const category = categories.find((item) => item.slug === filters.category || item._id === filters.category);
        activeChips.push({ key: "category", label: category?.name ?? filters.category });
    }
    if (filters.brand) {
        const brand = brands.find((item) => item.slug === filters.brand || item._id === filters.brand);
        activeChips.push({ key: "brand", label: brand?.name ?? filters.brand });
    }
    if (filters.isFeatured)
        activeChips.push({ key: "isFeatured", label: "Featured" });
    if (filters.isNewArrival)
        activeChips.push({ key: "isNewArrival", label: "New arrivals" });
    if (filters.isBestSeller)
        activeChips.push({ key: "isBestSeller", label: "Best sellers" });
    if (filters.sort && filters.sort !== "newest") {
        activeChips.push({ key: "sort", label: `Sort: ${titleCase(filters.sort)}` });
    }
    const clearAll = () => router.push("/products");
    return (<div className="surface mb-7 p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <form className="relative flex-1" onSubmit={(event) => {
            event.preventDefault();
            navigate({ search: search.trim() || undefined });
        }}>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for styles, fabrics…" aria-label="Search products" className="pl-10"/>
        </form>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex">
          <Select aria-label="Filter by category" value={filters.category ?? ""} onChange={(event) => navigate({ category: event.target.value || undefined })} className="lg:w-44">
            <option value="">All categories</option>
            {categories.map((category) => (<option key={category._id} value={category.slug}>
                {category.name}
              </option>))}
          </Select>
          <Select aria-label="Filter by brand" value={filters.brand ?? ""} onChange={(event) => navigate({ brand: event.target.value || undefined })} className="lg:w-40">
            <option value="">All brands</option>
            {brands.map((brand) => (<option key={brand._id} value={brand.slug}>
                {brand.name}
              </option>))}
          </Select>
          <Select aria-label="Sort products" value={filters.sort ?? "newest"} onChange={(event) => navigate({ sort: event.target.value })} className="col-span-2 sm:col-span-1 lg:w-40">
            {SORT_OPTIONS.map((option) => (<option key={option} value={option}>
                {option === "price_asc"
                ? "Price: low to high"
                : option === "price_desc"
                    ? "Price: high to low"
                    : titleCase(option)}
              </option>))}
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4">
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-500">
          <SlidersHorizontal className="size-3.5"/> Quick filters
        </span>
        {[
            ["isFeatured", "Featured"],
            ["isNewArrival", "New arrivals"],
            ["isBestSeller", "Best sellers"],
        ].map(([key, label]) => (<button key={key} type="button" onClick={() => navigate(key === "isFeatured"
                ? { isFeatured: !filters.isFeatured }
                : key === "isNewArrival"
                    ? { isNewArrival: !filters.isNewArrival }
                    : { isBestSeller: !filters.isBestSeller })} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${filters[key]
                ? "bg-brand-700 text-white"
                : "bg-ink-50 text-ink-600 hover:bg-brand-50 hover:text-brand-700"}`}>
            {label}
          </button>))}
        <span className="ml-auto text-xs font-medium text-ink-500">
          <strong className="text-ink-800">{total}</strong> {total === 1 ? "piece" : "pieces"}
        </span>
      </div>

      {activeChips.length > 0 && (<div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (<button key={chip.key} type="button" onClick={() => navigate({ [chip.key]: undefined })} className="group inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100">
              {chip.label}
              <X className="size-3 transition-transform group-hover:rotate-90"/>
            </button>))}
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-ink-500">
            Clear all
          </Button>
        </div>)}

      {activeChips.length === 0 && total > 0 && (<div className="mt-3 flex flex-wrap gap-1.5">
          <Badge tone="brand" dot>
            Curated edit
          </Badge>
          <span className="self-center text-xs text-ink-400">Premium fabrics · Considered design</span>
        </div>)}
    </div>);
}
export function ProductPagination({ pagination, filters, }) {
    const router = useRouter();
    return (<Pagination pagination={pagination} onPage={(page) => {
            const next = { ...filters, page };
            router.push(`/products${buildQuery(normalizedQuery(next))}`);
        }} className="mt-10"/>);
}
