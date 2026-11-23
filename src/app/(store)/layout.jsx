import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { CartProvider } from "@/features/cart/context/CartContext.jsx";
import { getCategories } from "@/api/products";
export default async function StoreLayout({ children }) {
    const envelope = await getCategories();
    const categories = envelope.data ?? [];
    return (<CartProvider>
      <div className="flex min-h-screen flex-col bg-canvas">
        <StoreHeader categories={categories}/>
        <main className="flex-1">{children}</main>
        <StoreFooter />
      </div>
    </CartProvider>);
}
