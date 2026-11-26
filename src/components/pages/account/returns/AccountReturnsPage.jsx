"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PackageOpen, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Field, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/section-heading";
import { getReturns, requestReturn } from "@/api/account.js";
import { getMyOrders } from "@/api/orders.js";
import { formatBDT, formatDate, titleCase } from "@/lib/utils";
const schema = z.object({
    orderId: z.string().min(1, "Select an order to return"),
    reasonType: z.enum(["Size mismatch", "Damaged item", "Wrong item", "Fabric quality", "Changed mind", "Other"]),
    details: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(500, "Please keep it under 500 characters"),
});
export default function ReturnsPage() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const returnsQuery = useQuery({
        queryKey: ["account", "returns"],
        queryFn: () => getReturns().then((result) => result.data ?? []),
    });
    const ordersQuery = useQuery({
        queryKey: ["account", "orders"],
        queryFn: () => getMyOrders().then((result) => result.data ?? []),
    });
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { orderId: "", reasonType: "Size mismatch", details: "" },
    });
    const openModal = () => {
        reset({ orderId: "", reasonType: "Size mismatch", details: "" });
        setOpen(true);
    };
    const onSubmit = async (values) => {
        const order = (ordersQuery.data ?? []).find((item) => item._id === values.orderId);
        const firstItem = order?.items?.[0];
        if (!firstItem?._id) {
            toast.error("No returnable item found for this order.");
            return;
        }
        const response = await requestReturn({
            orderId: values.orderId,
            items: [
                {
                    orderItemId: firstItem._id,
                    quantity: 1,
                    reason: `${values.reasonType}: ${values.details}`.slice(0, 500),
                },
            ],
        });
        if (!response.success) {
            toast.error(response.message ?? "We couldn't submit your return request.");
            return;
        }
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["account", "returns"] }),
            queryClient.invalidateQueries({ queryKey: ["account", "orders"] }),
        ]);
        setOpen(false);
        toast.success(response.message ?? "Return request submitted");
    };
    const returns = returnsQuery.data ?? [];
    return (<div className="animate-fade-up">
      <PageHeading title="Returns & refunds" description="Track your requests and start a new one whenever you need to." action={<Button size="sm" onClick={openModal}>
            <Plus className="size-4"/> Request a return
          </Button>}/>

      {returnsQuery.isLoading ? (<div className="space-y-4">
          <Skeleton className="h-44 rounded-2xl"/>
          <Skeleton className="h-44 rounded-2xl"/>
        </div>) : returns.length === 0 ? (<Card>
          <EmptyState icon={<RotateCcw className="size-6"/>} title="No return requests" description="If something isn't quite right, you can request a return from any delivered order." action={<Button onClick={openModal} size="sm">Request a return</Button>}/>
        </Card>) : (<div className="space-y-4">
          {returns.map((entry) => (<Card key={entry._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-ink-900">{entry.returnNumber}</p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    Order{" "}
                    <Link href={`/account/orders/${entry.orderId}`} className="font-semibold text-brand-700 hover:underline">
                      {entry.orderNumber}
                    </Link>{" "}
                    · {formatDate(entry.createdAt)}
                  </p>
                </div>
                <Badge status={entry.status} dot className="text-xs">
                  {titleCase(entry.status)}
                </Badge>
              </div>

              <div className="mt-4 rounded-xl bg-ink-50/70 p-4">
                {entry.items.map((item, index) => (<p key={`${item.name}-${index}`} className="text-sm text-ink-700">
                    <span className="font-semibold">{item.name}</span> · Qty {item.quantity}
                    <span className="text-ink-400"> — {item.reason}</span>
                  </p>))}
                <p className="mt-3 border-t border-ink-100 pt-3 text-xs leading-5 text-ink-500">{entry.reason}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4">
                <p className="text-xs text-ink-500">
                  Estimated refund <span className="text-base font-extrabold text-brand-700">{formatBDT(entry.refundAmount)}</span>
                </p>
                <p className="text-[11px] text-ink-400">We&apos;ll notify you once this is reviewed.</p>
              </div>
            </Card>))}
        </div>)}

      <Modal open={open} onClose={() => setOpen(false)} title="Request a return" description="Tell us what went wrong and our team will review it shortly.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="Order" error={errors.orderId?.message} required>
            <Select {...register("orderId")}>
              <option value="">Select an order</option>
              {(ordersQuery.data ?? []).map((order) => (<option key={order._id} value={order._id}>
                  {order.orderNumber} — {formatDate(order.createdAt)}
                </option>))}
            </Select>
          </Field>
          <Field label="Reason" error={errors.reasonType?.message} required>
            <Select {...register("reasonType")}>
              {["Size mismatch", "Damaged item", "Wrong item", "Fabric quality", "Changed mind", "Other"].map((reason) => (<option key={reason} value={reason}>
                  {reason}
                </option>))}
            </Select>
          </Field>
          <Field label="Tell us more" error={errors.details?.message} required>
            <Textarea {...register("details")} placeholder="Describe the issue so we can help quickly..."/>
          </Field>

          <div className="flex items-start gap-2 rounded-xl bg-brand-50 p-3 text-xs leading-5 text-ink-600">
            <PackageOpen className="mt-0.5 size-4 shrink-0 text-brand-700"/>
            Eligible items can be returned within 14 days of delivery. Refunds are processed after review.
          </div>

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Submit request
            </Button>
          </div>
        </form>
      </Modal>
    </div>);
}
