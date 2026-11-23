"use client";
import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Check, CheckCircle2, CreditCard, MapPin, Package, Printer, Receipt, Truck, XCircle, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/feedback";
import { Field, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/section-heading";
import { cancelMyOrder, getMyOrder } from "@/api/orders.js";
import { cn, formatBDT, formatDateTime, titleCase } from "@/lib/utils";
const cancelSchema = z.object({
    reason: z.string().trim().min(5, "Please share a short reason (at least 5 characters)"),
});
function PlacedBanner() {
    const params = useSearchParams();
    if (params.get("placed") !== "1")
        return null;
    return (<div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 print:hidden">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0"/>
      <div>
        <p className="text-sm font-bold">Order placed successfully</p>
        <p className="mt-0.5 text-xs text-emerald-700">Thank you for shopping with BERA FASHION.</p>
      </div>
    </div>);
}
function OrderTimeline({ order }) {
    const events = order.timeline?.length
        ? [...order.timeline].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
        : [
            {
                status: order.orderStatus,
                note: "Current status",
                at: order.updatedAt ?? order.createdAt,
            },
        ];
    return (<ol className="relative space-y-6 border-l border-ink-200 pl-6">
      {events.map((event, index) => (<li key={`${event.status}-${index}`} className="relative">
          <span className={cn("absolute -left-[31px] top-0.5 flex size-4 items-center justify-center rounded-full ring-4 ring-white", event.status === "cancelled" ? "bg-red-600" : "bg-brand-700")}>
            {event.status === "cancelled" ? (<XCircle className="size-3 text-white"/>) : (<Check className="size-2.5 text-white"/>)}
          </span>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold capitalize text-ink-800">{titleCase(event.status)}</p>
            <p className="text-xs text-ink-400">{formatDateTime(event.at)}</p>
          </div>
          {event.note && <p className="mt-0.5 text-xs text-ink-500">{event.note}</p>}
        </li>))}
    </ol>);
}
function PriceRow({ label, value, strong, accent }) {
    return (<div className={cn("flex items-center justify-between gap-4 text-sm", strong && "font-bold")}>
      <span className={strong ? "text-ink-900" : "text-ink-500"}>{label}</span>
      <span className={cn("font-semibold", accent ? "text-emerald-600" : strong ? "text-brand-700" : "text-ink-800")}>
        {value}
      </span>
    </div>);
}
export default function OrderDetailPage() {
    const params = useParams();
    const id = params?.id ?? "";
    const queryClient = useQueryClient();
    const [cancelOpen, setCancelOpen] = useState(false);
    const orderQuery = useQuery({
        queryKey: ["order", id],
        enabled: Boolean(id),
        queryFn: async () => {
            const envelope = await getMyOrder(id);
            if (!envelope.success || !envelope.data) {
                throw new Error(envelope.message ?? "Unable to load this order");
            }
            return envelope.data;
        },
    });
    const cancelForm = useForm({
        resolver: zodResolver(cancelSchema),
        defaultValues: { reason: "" },
    });
    const cancelMutation = useMutation({
        mutationFn: async (reason) => {
            const envelope = await cancelMyOrder(id, { reason });
            if (!envelope.success) {
                throw new Error(envelope.message ?? "Could not cancel this order");
            }
            return envelope.data;
        },
        onSuccess: () => {
            toast.success("Order cancelled");
            setCancelOpen(false);
            cancelForm.reset({ reason: "" });
            void queryClient.invalidateQueries({ queryKey: ["order", id] });
            void queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => toast.error(error.message),
    });
    const order = orderQuery.data;
    const canCancel = order
        ? ["pending", "confirmed", "processing"].includes(order.orderStatus)
        : false;
    return (<div className="container-x py-10 sm:py-14">
      <div className="hidden print:mb-8 print:block">
        <p className="font-display text-3xl font-bold text-brand-800">BERA FASHION</p>
        <p className="mt-1 text-xs text-ink-500">Invoice · {order?.orderNumber ?? "Order details"}</p>
      </div>

      <Suspense fallback={null}>
        <PlacedBanner />
      </Suspense>

      {orderQuery.isPending ? (<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <Skeleton className="h-20 w-full"/>
            <Card className="h-72 p-5">
              <Skeleton className="mb-5 h-6 w-1/3"/>
              <Skeleton className="mb-3 h-16 w-full"/>
              <Skeleton className="mb-3 h-16 w-full"/>
              <Skeleton className="h-16 w-full"/>
            </Card>
            <Card className="h-64 p-5">
              <Skeleton className="mb-5 h-6 w-1/4"/>
              <Skeleton className="mb-4 h-4 w-full"/>
              <Skeleton className="mb-4 h-4 w-3/4"/>
              <Skeleton className="h-4 w-2/3"/>
            </Card>
          </div>
          <div className="space-y-5">
            <Card className="h-40 p-5">
              <Skeleton className="mb-4 h-6 w-2/3"/>
              <Skeleton className="h-4 w-full"/>
            </Card>
            <Card className="h-72 p-5">
              <Skeleton className="mb-4 h-6 w-1/2"/>
              <Skeleton className="mb-3 h-4 w-full"/>
              <Skeleton className="mb-3 h-4 w-full"/>
              <Skeleton className="h-4 w-4/5"/>
            </Card>
          </div>
        </div>) : orderQuery.isError ? (<ErrorState message={orderQuery.error.message} onRetry={() => void orderQuery.refetch()}/>) : !order ? (<div className="surface">
          <EmptyState icon={<Package className="size-6"/>} title="Order not found" description="We couldn't find an order with that reference." action={<ButtonLink href="/orders" size="lg">
                Back to my orders
              </ButtonLink>} className="py-24"/>
        </div>) : (<>
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 print:hidden">
            <div>
              <Link href="/orders" className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 transition-colors hover:text-brand-700">
                <ArrowLeft className="size-4"/> All orders
              </Link>
              <PageHeading title={`Order #${order.orderNumber}`} description={`Placed on ${formatDateTime(order.createdAt)}`}/>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="size-4"/> Print invoice
              </Button>
              {canCancel && (<Button variant="danger" onClick={() => setCancelOpen(true)}>
                  <XCircle className="size-4"/> Cancel order
                </Button>)}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2 print:hidden">
            <Badge status={order.orderStatus} dot/>
            <Badge status={order.paymentStatus}>{order.paymentStatus} payment</Badge>
            <Badge tone="neutral">{order.paymentMethod === "cod" ? "Cash on delivery" : "SSLCommerz"}</Badge>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <Card>
                <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4">
                  <Package className="size-5 text-brand-700"/>
                  <h2 className="font-display text-lg font-bold text-ink-900">Items in this order</h2>
                  <span className="ml-auto text-xs text-ink-400">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </span>
                </div>
                <CardBody className="space-y-4">
                  {order.items.map((item, index) => (<div key={`${item.variantId}-${index}`} className="flex gap-4">
                      <Link href={`/products/${item.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-brand-50 print:hidden">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover"/>
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-bold text-ink-800">{item.name}</p>
                        <p className="mt-1 text-[11px] text-ink-400">SKU: {item.sku}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {item.size && <Badge tone="neutral">Size {item.size}</Badge>}
                          {item.color && <Badge tone="neutral">Color {item.color}</Badge>}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-ink-900">{formatBDT(item.subtotal)}</p>
                        <p className="mt-1 text-[11px] text-ink-400">
                          {formatBDT(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>))}
                </CardBody>
              </Card>

              <Card>
                <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4">
                  <Truck className="size-5 text-brand-700"/>
                  <h2 className="font-display text-lg font-bold text-ink-900">Order timeline</h2>
                </div>
                <CardBody>
                  <OrderTimeline order={order}/>
                </CardBody>
              </Card>

              {order.notes && (<Card className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Your note</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{order.notes}</p>
                </Card>)}
            </div>

            <div className="space-y-5">
              <Card>
                <div className="border-b border-ink-100 px-5 py-4">
                  <h2 className="font-display text-lg font-bold text-ink-900">Payment summary</h2>
                </div>
                <CardBody className="space-y-3">
                  <PriceRow label="Subtotal" value={formatBDT(order.pricing.subtotal)}/>
                  <PriceRow label="Shipping" value={formatBDT(order.pricing.shippingCharge)}/>
                  {order.pricing.discountAmount > 0 && (<PriceRow label="Discount" value={`− ${formatBDT(order.pricing.discountAmount)}`} accent/>)}
                  <div className="border-t border-dashed border-ink-200 pt-3">
                    <PriceRow label="Total paid" value={formatBDT(order.pricing.total)} strong/>
                  </div>
                  {order.couponCode && (<p className="text-[11px] text-ink-400">Coupon: {order.couponCode}</p>)}
                </CardBody>
              </Card>

              <Card>
                <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4">
                  <MapPin className="size-5 text-brand-700"/>
                  <h2 className="font-display text-lg font-bold text-ink-900">Delivery address</h2>
                </div>
                <CardBody>
                  <p className="text-sm font-bold text-ink-800">{order.shippingAddress.recipientName}</p>
                  <p className="mt-1 text-xs text-ink-500">{order.shippingAddress.phone}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.district}, {order.shippingAddress.division}
                    {order.shippingAddress.postalCode ? ` — ${order.shippingAddress.postalCode}` : ""}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4">
                  <CreditCard className="size-5 text-brand-700"/>
                  <h2 className="font-display text-lg font-bold text-ink-900">Payment status</h2>
                </div>
                <CardBody className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-ink-500">Method</span>
                    <span className="text-sm font-bold text-ink-800">
                      {order.paymentMethod === "cod" ? "Cash on delivery" : "SSLCommerz"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-ink-500">Status</span>
                    <Badge status={order.paymentStatus} dot/>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-2.5 text-xs text-brand-800">
                    <Receipt className="size-4 shrink-0"/>
                    {order.paymentStatus === "paid"
                ? "Payment received. Thank you!"
                : order.paymentStatus === "failed"
                    ? "Payment failed — please contact support."
                    : "Payment will be confirmed when your order progresses."}
                  </div>
                </CardBody>
              </Card>

              <ButtonLink href="/track" variant="secondary" className="w-full print:hidden">
                <Truck className="size-4"/> Track this order
              </ButtonLink>
            </div>
          </div>

          <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel this order?" description="Tell us why so we can improve. This action can't be undone." size="sm">
            <form onSubmit={cancelForm.handleSubmit((values) => cancelMutation.mutate(values.reason))} className="space-y-5">
              <Field label="Reason for cancellation" required error={cancelForm.formState.errors.reason?.message}>
                <Textarea {...cancelForm.register("reason")} placeholder="e.g. I ordered the wrong size…" autoFocus/>
              </Field>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setCancelOpen(false)}>
                  Keep order
                </Button>
                <Button type="submit" variant="danger" loading={cancelMutation.isPending}>
                  Yes, cancel order
                </Button>
              </div>
            </form>
          </Modal>
        </>)}
    </div>);
}
