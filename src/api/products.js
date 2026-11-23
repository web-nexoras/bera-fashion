import { serverFetch } from "@/lib/api/server";

export const getProducts = (query = "") => serverFetch(`products${query}`);
export const getProductBySlug = (slug) => serverFetch(`products/${encodeURIComponent(slug)}`);
export const getRelatedProducts = (slug) => serverFetch(`products/${encodeURIComponent(slug)}/related`);
export const getCategories = () => serverFetch("categories");
export const getCategoryBySlug = (slug) => serverFetch(`categories/${encodeURIComponent(slug)}`);
export const getBrands = () => serverFetch("brands");
