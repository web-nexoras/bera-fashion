"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, MapPin, Package, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { PageHeading } from "@/components/ui/section-heading";
import { cancelMyOrder, getMyOrder } from "@/api/orders.js";
import { formatBDT, formatDateTime, titleCase } from "@/lib/utils";
export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id;
    const queryClient = useQueryClient();
    const [cancelling, setCancelling] = useState(false);
    const orderQuery = useQuery({
        queryKey: ["account", "order", id],
        queryFn: () => getMyOrder(id)
            .then((result) => result.data)
            .then((data) => data ?? null),
    });
    const order = orderQuery.data;
    const canCancel = Boolean(order && !["delivered", "cancelled"].includes(order.orderStatus));
    const cancelOrder = async () => {
        if (!order)
            return;
        setCancelling(true);
        const response = await cancelMyOrder(order._id, { reason: "Cancelled by customer" });
        setCancelling(false);
        if (!response.success) {
            toast.error(response.message ?? "We couldn't cancel this order.");
            return;
        }
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["account", "order", id] }),
            queryClient.invalidateQueries({ queryKey: ["account", "orders"] }),
        ]);
        toast.success(response.message ?? "Order cancelled");
    };
    if (orderQuery.isLoading) {
        return (<div className="space-y-5">
        <Skeleton className="h-10 w-64"/>
        <Skeleton className="h-40 w-full rounded-2xl"/>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Skeleton className="h-80 rounded-2xl"/>
          <Skeleton className="h-80 rounded-2xl"/>
        </div>
      </div>);
    }
    if (!order) {
        return (<Card>
        <EmptyState icon={<Package className="size-6"/>} title="Order not found" description="We couldn't find that order. It may have been removed." action={<ButtonLink href="/account/orders" size="sm">
              Back to orders
            </ButtonLink>}/>
      </Card>);
    }
    const timeline = order.timeline?.length
        ? order.timeline
        : [{ status: order.orderStatus, note: "Order placed", at: order.createdAt }];
    return (<div className="animate-fade-up">
      <PageHeading title={`Order ${order.orderNumber}`} description={`Placed on ${formatDateTime(order.createdAt)}`} action={<ButtonLink href="/account/orders" variant="outline" size="sm">
            <ArrowLeft className="size-3.5"/> All orders
          </ButtonLink>}/>

      <Card className="mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Status</p>
            <Badge status={order.orderStatus} dot className="mt-1 text-xs">
              {titleCase(order.orderStatus)}
            </Badge>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Payment</p>
            <Badge status={order.paymentStatus} className="mt-1">
              {titleCase(order.paymentStatus)}
            </Badge>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Method</p>
            <p className="mt-1 text-sm font-semibold text-ink-800">
              {order.paymentMethod === "cod" ? "Cash on delivery" : "SSLCommerz"}
            </p>
          </div>
        </div>
        {canCancel && (<Button variant="outline" size="sm" loading={cancelling} onClick={() => void cancelOrder()} className="text-red-600 hover:border-red-200 hover:bg-red-50">
            <XCircle className="size-3.5"/> Cancel order
          </Button>)}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Card>
            <CardHeader title={`Items (${order.items.length})`} description="What's in this order"/>
            <CardBody className="space-y-4">
              {order.items.map((item, index) => (<div key={`${item.variantId}-${index}`} className="flex items-center gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover"/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.slug}`} className="line-clamp-2 text-sm font-bold text-ink-900 hover:text-brand-700">
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink-500">
                      {[item.size, item.color].filter(Boolean).join(" · ") || "Standard"} · Qty {item.quantity}
                    </p>
                    <p className="mt-1 text-[11px] text-ink-400">SKU: {item.sku}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-ink-900">{formatBDT(item.totalPrice ?? item.subtotal ?? item.price * item.quantity)}</p>
                </div>))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Order timeline" description="Every step, in order"/>
            <CardBody>
              <ol className="space-y-0">
                {timeline.map((event, index) => (<li key={`${event.status}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${index === timeline.length - 1 ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-700"}`}>
                        <Check className="size-4"/>
                      </span>
                      {index < timeline.length - 1 && <span className="my-1 w-px flex-1 bg-ink-200"/>}
                    </div>
                    <div className={index < timeline.length - 1 ? "pb-6" : ""}>
                      <p className="text-sm font-bold capitalize text-ink-900">{titleCase(event.status)}</p>
                      {event.note && <p className="mt-0.5 text-xs text-ink-500">{event.note}</p>}
                      <p className="mt-1 text-[11px] text-ink-400">{formatDateTime(event.at)}</p>
                    </div>
                  </li>))}
              </ol>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Price summary"/>
            <CardBody className="space-y-3 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal</span>
                <span>{formatBDT(order.pricing.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Shipping</span>
                <span>{formatBDT(order.pricing.shippingCharge)}</span>
              </div>
              {order.pricing.discountAmount > 0 && (<div className="flex justify-between text-emerald-600">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span>−{formatBDT(order.pricing.discountAmount)}</span>
                </div>)}
              <div className="flex justify-between border-t border-ink-100 pt-3 text-base font-extrabold text-ink-900">
                <span>Total</span>
                <span className="text-brand-700">{formatBDT(order.pricing.total)}</span>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Delivery address"/>
            <CardBody className="text-sm leading-6 text-ink-600">
              <p className="flex items-start gap-2 font-semibold text-ink-900">
                <MapPin className="mt-1 size-4 shrink-0 text-brand-700"/> {order.shippingAddress.recipientName}
              </p>
              <p className="mt-2">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.district}, {order.shippingAddress.division}
              </p>
              <p className="text-ink-500">+88 {order.shippingAddress.phone}</p>
            </CardBody>
          </Card>

          {order.notes && (<Card>
              <CardHeader title="Your note"/>
              <CardBody className="text-sm leading-6 text-ink-600">{order.notes}</CardBody>
            </Card>)}

          <ButtonLink href="/account/returns" variant="outline" className="w-full">
            Need to return something?
          </ButtonLink>
        </div>
      </div>
    </div>);
}
