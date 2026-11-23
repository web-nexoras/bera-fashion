"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/features/cart/context/CartContext.jsx";
import { OrderSummary } from "@/components/store/order-summary";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { PageHeading } from "@/components/ui/section-heading";
import { QuantityStepper } from "@/components/ui/quantity";
import { cn, formatBDT } from "@/lib/utils";
export default function CartPage() {
    const { cart, summary, isLoading, updateQuantity, removeItem, applyCoupon, removeCoupon, clearCart } = useCart();
    const [busyVariant, setBusyVariant] = useState(null);
    const changeQuantity = async (variantId, quantity) => {
        setBusyVariant(variantId);
        await updateQuantity(variantId, quantity);
        setBusyVariant(null);
    };
    const heading = (<PageHeading title="Your bag" description="Review your picks before checkout." action={<Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-brand-700">
          <ArrowLeft className="size-4"/> Continue shopping
        </Link>}/>);
    if (isLoading) {
        return (<div className="container-x py-10 sm:py-14">
        {heading}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (<Card key={index} className="flex gap-4 p-5">
                <Skeleton className="size-24 shrink-0 sm:size-28"/>
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-2/3"/>
                  <Skeleton className="h-3 w-1/3"/>
                  <Skeleton className="h-10 w-28"/>
                </div>
              </Card>))}
          </div>
          <Card className="h-96 p-5">
            <Skeleton className="mb-5 h-6 w-1/2"/>
            <Skeleton className="mb-3 h-10 w-full"/>
            <Skeleton className="mb-3 h-4 w-full"/>
            <Skeleton className="mb-3 h-4 w-4/5"/>
            <Skeleton className="mt-8 h-12 w-full"/>
          </Card>
        </div>
      </div>);
    }
    if (!cart.items.length) {
        return (<div className="container-x py-10 sm:py-14">
        {heading}
        <Card>
          <EmptyState icon={<ShoppingBag className="size-6"/>} title="Your bag is empty" description="Looks like you haven't added anything yet. Explore the collection and find something you love." action={<ButtonLink href="/products" size="lg">
                Explore products <ArrowRight className="size-4"/>
              </ButtonLink>} className="py-24"/>
        </Card>
      </div>);
    }
    return (<div className="container-x py-10 sm:py-14">
      {heading}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink-700">
              {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"}
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={() => void clearCart()} className="text-ink-500 hover:text-red-600">
              <Trash2 className="size-3.5"/> Clear bag
            </Button>
          </div>

          <div className="space-y-4">
            {cart.items.map((item) => (<Card key={item.variantId} className="p-4 transition-shadow hover:shadow-lift sm:p-5">
                <div className="flex gap-4">
                  <Link href={`/products/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-brand-50 sm:size-28">
                    <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 96px, 112px" className="object-cover"/>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-bold text-ink-800 transition-colors hover:text-brand-700">
                          {item.name}
                        </Link>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-ink-400">
                          SKU: {item.sku}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.size && <Badge tone="neutral">Size {item.size}</Badge>}
                          {item.color && <Badge tone="neutral">Color {item.color}</Badge>}
                        </div>
                      </div>
                      <button type="button" onClick={() => void removeItem(item.variantId)} aria-label={`Remove ${item.name}`} className="shrink-0 rounded-lg p-2 text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="size-4"/>
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                      <div className={cn("flex items-center gap-3", busyVariant === item.variantId && "pointer-events-none opacity-60")}>
                        <QuantityStepper value={item.quantity} min={1} max={Math.max(1, item.stock)} onChange={(quantity) => void changeQuantity(item.variantId, quantity)}/>
                        <span className="text-[11px] text-ink-400">{item.stock} available</span>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-extrabold text-brand-700">{formatBDT(item.subtotal)}</p>
                        {item.quantity > 1 && (<p className="text-[11px] text-ink-400">{formatBDT(item.price)} each</p>)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <OrderSummary summary={summary} appliedCoupon={cart.appliedCoupon} showCoupon onApplyCoupon={applyCoupon} onRemoveCoupon={removeCoupon} action={<ButtonLink href="/checkout" size="lg" className="w-full">
                Proceed to checkout <ArrowRight className="size-4"/>
              </ButtonLink>}/>
        </div>
      </div>
    </div>);
}
