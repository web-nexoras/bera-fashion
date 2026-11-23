"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, HeartCrack, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/features/cart/context/CartContext.jsx";
import { ProductCard, ProductCardSkeleton } from "@/components/store/product-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { PageHeading } from "@/components/ui/section-heading";
import { getWishlist, removeFromWishlist } from "@/api/wishlist.js";
export default function WishlistPage() {
    const queryClient = useQueryClient();
    const { addItem } = useCart();
    const wishlistQuery = useQuery({
        queryKey: ["wishlist"],
        queryFn: async () => {
            const envelope = await getWishlist();
            if (!envelope.success) {
                throw new Error(envelope.message ?? "Unable to load your wishlist");
            }
            return envelope.data ?? [];
        },
    });
    const removeMutation = useMutation({
        mutationFn: async (productId) => {
            const envelope = await removeFromWishlist(productId);
            if (!envelope.success) {
                throw new Error(envelope.message ?? "Could not remove this item");
            }
        },
        onSuccess: () => {
            toast.success("Removed from wishlist");
            void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
        onError: (error) => toast.error(error.message),
    });
    const products = wishlistQuery.data ?? [];
    const moveToCart = async (product) => {
        const variant = product.variants.find((item) => item.isActive && item.stock > 0) ??
            product.variants.find((item) => item.isActive) ??
            product.variants[0];
        if (!variant) {
            toast.error("This product is currently unavailable");
            return;
        }
        const added = await addItem(product._id, variant._id, 1);
        if (added)
            removeMutation.mutate(product._id);
    };
    return (<div className="container-x py-10 sm:py-14">
      <PageHeading title="Your wishlist" description="The pieces you saved for later, all in one place." action={<ButtonLink href="/products" variant="outline" size="sm">
            Browse collection
          </ButtonLink>}/>

      {wishlistQuery.isPending ? (<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (<ProductCardSkeleton key={index}/>))}
        </div>) : wishlistQuery.isError ? (<ErrorState message={wishlistQuery.error.message} onRetry={() => void wishlistQuery.refetch()}/>) : products.length === 0 ? (<div className="surface">
          <EmptyState icon={<HeartCrack className="size-6"/>} title="No favourites yet" description="Tap the heart on any product to save it here for later." action={<ButtonLink href="/products" size="lg">
                Find something you love
              </ButtonLink>} className="py-24"/>
        </div>) : (<>
          <p className="mb-5 text-sm font-semibold text-ink-500">
            {products.length} {products.length === 1 ? "piece" : "pieces"} saved
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (<div key={product._id} className="animate-fade-up flex flex-col gap-2">
                <ProductCard product={product}/>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" size="sm" variant="secondary" onClick={() => void moveToCart(product)}>
                    <ShoppingBag className="size-3.5"/> Move to bag
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => removeMutation.mutate(product._id)} disabled={removeMutation.isPending}>
                    <Trash2 className="size-3.5"/> Remove
                  </Button>
                </div>
              </div>))}
          </div>
          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-ink-400">
            <Heart className="size-3.5 text-brand-400"/> Saved items stay here until you remove them.
          </p>
        </>)}
    </div>);
}
