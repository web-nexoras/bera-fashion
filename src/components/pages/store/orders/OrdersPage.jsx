"use client";
import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/feedback";
import { PageHeading } from "@/components/ui/section-heading";
import { getMyOrders } from "@/api/orders.js";
import { cn, formatBDT, formatDate } from "@/lib/utils";
function PlacedBanner() {
    const params = useSearchParams();
    if (params.get("placed") !== "1")
        return null;
    return (<div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0"/>
      <div>
        <p className="text-sm font-bold">Thank you — your order is placed!</p>
        <p className="mt-0.5 text-xs text-emerald-700">
          We&apos;ve sent a confirmation and will notify you as it moves along.
        </p>
      </div>
    </div>);
}
export default function OrdersPage() {
    const [filter, setFilter] = useState("all");
    const ordersQuery = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const envelope = await getMyOrders();
            if (!envelope.success) {
                throw new Error(envelope.message ?? "Unable to load your orders");
            }
            return envelope.data ?? [];
        },
    });
    const orders = useMemo(() => ordersQuery.data ?? [], [ordersQuery.data]);
    const counts = useMemo(() => ({
        all: orders.length,
        active: orders.filter((order) => !["delivered", "cancelled"].includes(order.orderStatus)).length,
        delivered: orders.filter((order) => order.orderStatus === "delivered").length,
        cancelled: orders.filter((order) => order.orderStatus === "cancelled").length,
    }), [orders]);
    const visible = useMemo(() => {
        if (filter === "active") {
            return orders.filter((order) => !["delivered", "cancelled"].includes(order.orderStatus));
        }
        if (filter === "cancelled") {
            return orders.filter((order) => order.orderStatus === "cancelled");
        }
        if (filter === "delivered") {
            return orders.filter((order) => order.orderStatus === "delivered");
        }
        return orders;
    }, [orders, filter]);
    const tabs = [
        { id: "all", label: "All orders", count: counts.all },
        { id: "active", label: "In progress", count: counts.active },
        { id: "delivered", label: "Delivered", count: counts.delivered },
        { id: "cancelled", label: "Cancelled", count: counts.cancelled },
    ];
    return (<div className="container-x py-10 sm:py-14">
      <PageHeading title="My orders" description="Track, review and revisit everything you've purchased." action={<ButtonLink href="/products" variant="outline" size="sm">
            <ShoppingBag className="size-4"/> Shop more
          </ButtonLink>}/>

      <Suspense fallback={null}>
        <PlacedBanner />
      </Suspense>

      {ordersQuery.isPending ? (<div className="space-y-4">
          {[0, 1, 2].map((index) => (<Card key={index}>
              <Skeleton className="h-14 w-full rounded-t-2xl"/>
              <CardBody className="flex items-center gap-4">
                <Skeleton className="size-12"/>
                <Skeleton className="h-4 flex-1"/>
                <Skeleton className="h-8 w-28"/>
              </CardBody>
            </Card>))}
        </div>) : ordersQuery.isError ? (<ErrorState message={ordersQuery.error.message} onRetry={() => void ordersQuery.refetch()}/>) : orders.length === 0 ? (<div className="surface">
          <EmptyState icon={<Package className="size-6"/>} title="No orders yet" description="Once you place your first order, its status and details will appear here." action={<ButtonLink href="/products" size="lg">
                Start shopping
              </ButtonLink>} className="py-24"/>
        </div>) : (<>
          <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (<button key={tab.id} type="button" onClick={() => setFilter(tab.id)} className={cn("inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all", filter === tab.id
                    ? "border-brand-700 bg-brand-700 text-white shadow-soft"
                    : "border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700")}>
                {tab.label}
                <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", filter === tab.id ? "bg-white/20 text-white" : "bg-ink-100 text-ink-500")}>
                  {tab.count}
                </span>
              </button>))}
          </div>

          {visible.length === 0 ? (<div className="surface">
              <EmptyState icon={<Package className="size-6"/>} title="Nothing here yet" description="There are no orders matching this filter." className="py-20"/>
            </div>) : (<div className="space-y-4">
              {visible.map((order) => (<Card key={order._id} className="overflow-hidden transition-shadow hover:shadow-lift">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/70 px-5 py-3.5">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Order</p>
                        <p className="text-sm font-bold text-ink-900">#{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Placed on</p>
                        <p className="text-sm font-semibold text-ink-700">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge status={order.orderStatus} dot/>
                      <Badge status={order.paymentStatus}>{order.paymentStatus} payment</Badge>
                    </div>
                  </div>

                  <CardBody className="flex flex-wrap items-center gap-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (<div key={`${item.variantId}-${index}`} className="relative size-12 overflow-hidden rounded-xl border-2 border-white bg-brand-50 shadow-sm">
                          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover"/>
                        </div>))}
                      {order.items.length > 3 && (<span className="flex size-12 items-center justify-center rounded-xl border-2 border-white bg-brand-50 text-xs font-bold text-brand-700">
                          +{order.items.length - 3}
                        </span>)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-800">{order.items[0]?.name ?? "Order items"}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items ·{" "}
                        {order.paymentMethod === "cod" ? "Cash on delivery" : "SSLCommerz"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Total</p>
                      <p className="text-lg font-extrabold text-brand-700">{formatBDT(order.pricing.total)}</p>
                    </div>

                    <ButtonLink href={`/orders/${order._id}`} variant="secondary" size="sm" className="shrink-0">
                      View details <ArrowRight className="size-3.5"/>
                    </ButtonLink>
                  </CardBody>
                </Card>))}
            </div>)}
        </>)}
    </div>);
}
