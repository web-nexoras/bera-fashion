import { fallbackCategories } from "@/lib/fallback/data";
export { default } from "@/components/pages/store/categories/[slug]/CategoryDetailPage";

export const revalidate = 300;

export async function generateStaticParams() {
    return fallbackCategories.map((category) => ({ slug: category.slug }));
}
