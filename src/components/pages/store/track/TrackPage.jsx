"use client";
import Image from "next/image";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Check, CheckCircle2, MapPin, PackageSearch, Search, ShieldCheck, Truck, XCircle, } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Field, Input } from "@/components/ui/input";
import { trackOrder } from "@/api/orders.js";
import { cn, formatBDT, formatDateTime, titleCase } from "@/lib/utils";
const trackSchema = z.object({
    orderNumber: z.string().trim().min(3, "Enter your order number"),
    phone: z.string().trim().min(8, "Enter the phone number used at checkout").max(20, "That phone number looks too long"),
});
function TrackTimeline({ order }) {
    const events = order.timeline?.length
        ? [...order.timeline].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
        : [{ status: order.orderStatus, note: "Current status", at: order.updatedAt ?? order.createdAt }];
    return (<ol className="relative space-y-5 border-l border-ink-200 pl-6">
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
export default function TrackPage() {
    const { isAuthenticated } = useAuth();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(trackSchema),
        defaultValues: { orderNumber: "", phone: "" },
    });
    const trackMutation = useMutation({
        mutationFn: async (values) => {
            const envelope = await trackOrder({ orderNumber: values.orderNumber, phone: values.phone });
            if (!envelope.success || !envelope.data) {
                throw new Error(envelope.message ?? "We couldn't find that order. Please check the details.");
            }
            return envelope.data;
        },
        onError: (error) => toast.error(error.message),
    });
    const order = trackMutation.data;
    return (<>
      <section className="bg-brand-900 text-white">
        <div className="container-x py-12 sm:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">Order tracking</p>
              <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Where&apos;s my order?
              </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                Enter your order number and the phone number used at checkout to follow your parcel. No account needed.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur">
              <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-gold-300">
                <Truck className="size-6"/>
              </span>
              <div>
                <p className="text-sm font-bold">Live delivery updates</p>
                <p className="mt-0.5 text-xs text-white/60">From confirmation to delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-x relative z-10 -mt-8 pb-14 sm:-mt-10">
        <Card className="p-5 shadow-lift sm:p-7">
          <form onSubmit={handleSubmit((values) => trackMutation.mutate(values))} noValidate>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
              <Field label="Order number" required error={errors.orderNumber?.message}>
                <Input {...register("orderNumber")} placeholder="e.g. BF-2026-4831" className="uppercase" autoComplete="off"/>
              </Field>
              <Field label="Phone number" hint="Use the number from checkout" required error={errors.phone?.message}>
                <Input {...register("phone")} placeholder="01XXXXXXXXX" inputMode="tel" autoComplete="tel"/>
              </Field>
              <Button type="submit" size="lg" loading={trackMutation.isPending} className="w-full md:w-auto">
                <Search className="size-4"/> Track order
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-8">
          {trackMutation.isPending ? (<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
              <Card className="h-80 p-6">
                <Skeleton className="mb-6 h-6 w-1/3"/>
                <Skeleton className="mb-5 h-4 w-full"/>
                <Skeleton className="mb-5 h-4 w-3/4"/>
                <Skeleton className="h-4 w-2/3"/>
              </Card>
              <Card className="h-64 p-6">
                <Skeleton className="mb-5 h-6 w-1/2"/>
                <Skeleton className="mb-4 h-16 w-full"/>
                <Skeleton className="h-16 w-full"/>
              </Card>
            </div>) : order ? (<div className="animate-fade-up">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600">Tracking result</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-ink-900">Order #{order.orderNumber}</h2>
                  <p className="mt-1 text-xs text-ink-500">Placed on {formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge status={order.orderStatus} dot/>
                  <Badge status={order.paymentStatus}>{order.paymentStatus} payment</Badge>
                </div>
              </div>

              <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <Card>
                  <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4">
                    <Truck className="size-5 text-brand-700"/>
                    <h3 className="font-display text-lg font-bold text-ink-900">Delivery progress</h3>
                  </div>
                  <CardBody>
                    <TrackTimeline order={order}/>
                    <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-brand-50 px-4 py-3 text-xs text-brand-800">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0"/>
                      Need help with this order? Reach us at support@berafashion.com with the order number above.
                    </div>
                  </CardBody>
                </Card>

                <div className="space-y-5">
                  <Card>
                    <div className="border-b border-ink-100 px-5 py-4">
                      <h3 className="font-display text-lg font-bold text-ink-900">Order summary</h3>
                    </div>
                    <CardBody className="space-y-4">
                      <div className="space-y-3">
                        {order.items.slice(0, 3).map((item, index) => (<div key={`${item.variantId}-${index}`} className="flex items-center gap-3">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                              <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover"/>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-bold text-ink-800">{item.name}</p>
                              <p className="text-[11px] text-ink-400">Qty {item.quantity}</p>
                            </div>
                            <p className="text-xs font-bold text-ink-800">{formatBDT(item.subtotal)}</p>
                          </div>))}
                      </div>
                      <div className="flex items-center justify-between border-t border-dashed border-ink-200 pt-3">
                        <span className="text-sm font-bold text-ink-900">Total</span>
                        <span className="font-display text-xl font-bold text-brand-700">
                          {formatBDT(order.pricing.total)}
                        </span>
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <div className="flex items-center gap-2.5 border-b border-ink-100 px-5 py-4">
                      <MapPin className="size-5 text-brand-700"/>
                      <h3 className="font-display text-lg font-bold text-ink-900">Delivery to</h3>
                    </div>
                    <CardBody>
                      <p className="text-sm font-bold text-ink-800">{order.shippingAddress.recipientName}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                        {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.district}, {order.shippingAddress.division}
                      </p>
                    </CardBody>
                  </Card>

                  {isAuthenticated ? (<ButtonLink href={`/orders/${order._id}`} variant="secondary" className="w-full">
                      View full order details <ArrowRight className="size-4"/>
                    </ButtonLink>) : (<Link href="/sign-in" className="block text-center text-xs font-semibold text-brand-700 hover:underline">
                      Sign in to manage this order
                    </Link>)}
                </div>
              </div>
            </div>) : (<div className="surface">
              <EmptyState icon={<PackageSearch className="size-6"/>} title="Track your delivery" description="Enter your order number above to see its current status, timeline and summary." className="py-16"/>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-ink-100 px-6 py-4 text-[11px] font-medium text-ink-500">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-4 text-emerald-600"/> Order confirmed</span>
                <span className="inline-flex items-center gap-1.5"><Truck className="size-4 text-brand-600"/> Out for delivery</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="size-4 text-gold-600"/> At your door</span>
              </div>
            </div>)}
        </div>
      </div>
    </>);
}
