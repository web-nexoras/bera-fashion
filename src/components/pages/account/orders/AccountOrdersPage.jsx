"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { PageHeading } from "@/components/ui/section-heading";
import { Tabs } from "@/components/ui/tabs";
import { getMyOrders } from "@/api/orders.js";
import { formatBDT, formatDate } from "@/lib/utils";
const filters = [
    { id: "all", label: "All orders" },
    { id: "pending", label: "Pending" },
    { id: "confirmed", label: "Confirmed" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
];
export default function OrdersPage() {
    const [active, setActive] = useState("all");
    const ordersQuery = useQuery({
        queryKey: ["account", "orders"],
        queryFn: () => getMyOrders().then((result) => result.data ?? []),
    });
    const orders = ordersQuery.data ?? [];
    const visible = active === "all" ? orders : orders.filter((order) => order.orderStatus === active);
    const content = ordersQuery.isLoading ? (<div className="space-y-4">
      <Skeleton className="h-44 rounded-2xl"/>
      <Skeleton className="h-44 rounded-2xl"/>
      <Skeleton className="h-44 rounded-2xl"/>
    </div>) : visible.length === 0 ? (<Card>
      <EmptyState icon={<Package className="size-6"/>} title="No orders here yet" description={active === "all" ? "When you place an order, it will show up here." : "Try another status to see your orders."} action={<ButtonLink href="/products" size="sm">
            Explore products
          </ButtonLink>}/>
    </Card>) : (<div className="space-y-4">
      {visible.map((order) => (<Card key={order._id} className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/50 px-5 py-3.5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Order</p>
                <Link href={`/account/orders/${order._id}`} className="text-sm font-bold text-ink-900 hover:text-brand-700">
                  {order.orderNumber}
                </Link>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Placed</p>
                <p className="text-xs font-medium text-ink-600">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Payment</p>
                <Badge status={order.paymentStatus} className="mt-0.5"/>
              </div>
            </div>
            <Badge status={order.orderStatus} dot className="text-xs">
              {order.orderStatus.replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="divide-y divide-ink-100">
            {order.items.map((item, index) => (<div key={`${item.variantId}-${index}`} className="flex items-center gap-4 px-5 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover"/>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900">{item.name}</p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {[item.size, item.color].filter(Boolean).join(" · ") || "Standard"} · Qty {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-ink-800">{formatBDT(item.subtotal)}</p>
              </div>))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 px-5 py-3.5">
            <p className="text-xs text-ink-500">
              Total: <span className="text-base font-extrabold text-brand-700">{formatBDT(order.pricing.total)}</span>
            </p>
            <ButtonLink href={`/account/orders/${order._id}`} variant="outline" size="sm">
              View details <ArrowRight className="size-3.5"/>
            </ButtonLink>
          </div>
        </Card>))}
    </div>);
    return (<div className="animate-fade-up">
      <PageHeading title="My orders" description="Follow every order from checkout to delivery."/>

      <Tabs active={active} onChange={setActive} items={filters.map((filter) => ({
            id: filter.id,
            label: filter.label,
            count: filter.id === "all" ? orders.length : orders.filter((order) => order.orderStatus === filter.id).length,
            content,
        }))}/>
    </div>);
}
