"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { addToWishlist, removeFromWishlist } from "@/api/wishlist.js";
import { useCart } from "@/features/cart/context/CartContext.jsx";
import { cn, discountPercent, formatBDT, mainImage, productCompareAt, productPrice, } from "@/lib/utils";
export function ProductCard({ product, priority = false }) {
    const { addItem } = useCart();
    const [favorite, setFavorite] = useState(false);
    const [busy, setBusy] = useState(false);
    const price = productPrice(product);
    const compareAt = productCompareAt(product);
    const discount = discountPercent(price, compareAt);
    const firstVariant = product.variants.find((variant) => variant.isActive) ?? product.variants[0];
    const toggleFavorite = async () => {
        setFavorite((value) => !value);
        if (favorite)
            await removeFromWishlist(product._id);
        else
            await addToWishlist(product._id);
    };
    const quickAdd = async () => {
        if (!firstVariant)
            return;
        setBusy(true);
        await addItem(product._id, firstVariant._id, 1);
        setBusy(false);
    };
    return (<article className="group surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-4/5 overflow-hidden bg-brand-50">
        <Link href={`/products/${product.slug}`}>
          <Image src={mainImage(product.images)} alt={product.name} fill priority={priority} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105"/>
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge tone="danger">-{discount}%</Badge>}
          {product.isNewArrival && <Badge tone="brand">New</Badge>}
          {product.isBestSeller && !product.isNewArrival && <Badge tone="gold">Bestseller</Badge>}
        </div>
        <button onClick={toggleFavorite} aria-label="Toggle wishlist" className={cn("absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-colors", favorite ? "text-brand-700" : "text-ink-500 hover:text-brand-700")}>
          <Heart className={cn("size-4", favorite && "fill-current")}/>
        </button>
        <button onClick={quickAdd} disabled={busy} className="absolute inset-x-3 bottom-3 flex h-10 translate-y-16 items-center justify-center gap-2 rounded-xl bg-brand-700 text-xs font-bold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 disabled:opacity-70">
          <ShoppingBag className="size-4"/> Quick add
        </button>
      </div>

      <div className="p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-bold uppercase tracking-wider text-ink-400">
            {typeof product.brand === "object" ? product.brand.name : "BERA"}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-ink-500">
            <Star className="size-3 fill-gold-500 text-gold-500"/>
            {product.averageRating.toFixed(1)}
          </span>
        </div>
        <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-10 text-sm font-bold text-ink-800 transition-colors hover:text-brand-700">
          {product.name}
        </Link>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-base font-extrabold text-brand-700">{formatBDT(price)}</span>
          {compareAt && compareAt > price && (<span className="text-xs text-ink-400 line-through">{formatBDT(compareAt)}</span>)}
        </div>
      </div>
    </article>);
}
export function ProductCardSkeleton() {
    return (<div className="surface overflow-hidden">
      <div className="aspect-4/5 animate-pulse bg-ink-100"/>
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-ink-100"/>
        <div className="h-4 w-full animate-pulse rounded bg-ink-100"/>
        <div className="h-4 w-2/3 animate-pulse rounded bg-ink-100"/>
        <div className="h-5 w-1/2 animate-pulse rounded bg-ink-100"/>
      </div>
    </div>);
}
