import { fallbackProducts } from "@/lib/fallback/data";
export { default } from "@/components/pages/store/products/[slug]/ProductDetailPage";

export const revalidate = 60;

export async function generateStaticParams() {
    return fallbackProducts.slice(0, 6).map((product) => ({ slug: product.slug }));
}
