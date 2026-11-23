"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { useAdminAction, useAdminList, entityName, paginationFor, } from "@/components/admin/admin-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Field, Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { PageHeading } from "@/components/ui/section-heading";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import { cn, formatBDT, formatDateTime, titleCase } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
export default function AdminOrdersPage() {
    const queryClient = useQueryClient();
    const initialSearch = () => typeof window === "undefined"
        ? ""
        : new URLSearchParams(window.location.search).get("search") ?? "";
    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState("all");
    const [payment, setPayment] = useState("all");
    const [page, setPage] = useState(1);
    const [detail, setDetail] = useState(null);
    const [statusTarget, setStatusTarget] = useState(null);
    const [nextStatus, setNextStatus] = useState("confirmed");
    const { data, isFetching, refetch } = useAdminList(["admin", "orders", "all"], "orders/admin/all?page=1&limit=100");
    const updateStatus = useAdminAction();
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return data.items.filter((order) => {
            const matchesTerm = !term ||
                order.orderNumber.toLowerCase().includes(term) ||
                entityName(order.user).toLowerCase().includes(term) ||
                order.items.some((item) => item.name.toLowerCase().includes(term));
            return (matchesTerm &&
                (status === "all" || order.orderStatus === status) &&
                (payment === "all" || order.paymentStatus === payment));
        });
    }, [data.items, search, status, payment]);
    const pagination = paginationFor(filtered.length, page, 10);
    const rows = filtered.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);
    const openStatus = (order) => {
        setStatusTarget(order);
        setNextStatus(order.orderStatus);
    };
    const onUpdateStatus = () => {
        if (!statusTarget)
            return;
        updateStatus.mutate({
            path: `orders/admin/${statusTarget._id}/status`,
            method: "PUT",
            body: { status: nextStatus },
        }, {
            onSuccess: () => {
                toast.success(`Order ${statusTarget.orderNumber} moved to ${titleCase(nextStatus)}.`);
                void queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
                void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
                setStatusTarget(null);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Orders" description="Track fulfilment, payment status and order details." action={<Button variant="outline" onClick={() => void refetch()} loading={isFetching}>
            <RefreshCw className="size-4"/> Refresh
          </Button>}/>

      <Card>
        <CardHeader title="All orders" description={`${filtered.length} order${filtered.length === 1 ? "" : "s"} found`} action={<SlidersHorizontal className="size-4 text-ink-400"/>}/>
        <CardBody className="border-b border-ink-100">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
              <Input value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
        }} placeholder="Order no., customer or product" className="pl-10" aria-label="Search orders"/>
            </div>
            <Select value={status} onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
        }} aria-label="Filter by order status">
              <option value="all">All order statuses</option>
              {ORDER_STATUSES.map((item) => (<option key={item} value={item}>
                  {titleCase(item)}
                </option>))}
            </Select>
            <Select value={payment} onChange={(event) => {
            setPayment(event.target.value);
            setPage(1);
        }} aria-label="Filter by payment status">
              <option value="all">All payment statuses</option>
              {PAYMENT_STATUSES.map((item) => (<option key={item} value={item}>
                  {titleCase(item)}
                </option>))}
            </Select>
            <Button variant="ghost" onClick={() => {
            setSearch("");
            setStatus("all");
            setPayment("all");
            setPage(1);
        }}>
              Clear filters
            </Button>
          </div>
        </CardBody>
        <DataTable columns={[
            { key: "order", label: "Order" },
            { key: "customer", label: "Customer" },
            { key: "date", label: "Placed" },
            { key: "items", label: "Items", align: "center" },
            { key: "total", label: "Total", align: "right" },
            { key: "payment", label: "Payment" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={rows.map((order) => ({
            order: (<div>
                <p className="font-semibold text-ink-900">{order.orderNumber}</p>
                <p className="text-[11px] text-ink-400">#{order._id.slice(-6)}</p>
              </div>),
            customer: entityName(order.user),
            date: formatDateTime(order.createdAt),
            items: order.items.length,
            total: <span className="font-semibold text-ink-900">{formatBDT(order.pricing.total)}</span>,
            payment: <Badge status={order.paymentStatus}/>,
            status: <Badge status={order.orderStatus} dot/>,
            actions: (<div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => setDetail(order)} aria-label="View order">
                  <Eye className="size-4"/>
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openStatus(order)}>
                  Update
                </Button>
              </div>),
        }))} empty="No orders match these filters."/>
        <div className="border-t border-ink-100 p-4">
          <Pagination pagination={pagination} onPage={setPage}/>
        </div>
      </Card>

      <Modal open={Boolean(statusTarget)} onClose={() => setStatusTarget(null)} title="Update order status" description={statusTarget ? `${statusTarget.orderNumber} · ${entityName(statusTarget.user)}` : undefined} size="sm">
        <div className="space-y-5">
          <Field label="New status" required>
            <Select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)}>
              {ORDER_STATUSES.map((item) => (<option key={item} value={item}>
                  {titleCase(item)}
                </option>))}
            </Select>
          </Field>
          {statusTarget && (<div className="rounded-xl bg-ink-50 p-3 text-xs text-ink-600">
              Current status: <Badge status={statusTarget.orderStatus} className="ml-1"/>
            </div>)}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStatusTarget(null)}>
              Cancel
            </Button>
            <Button onClick={onUpdateStatus} loading={updateStatus.isPending}>
              Save changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail ? `Order ${detail.orderNumber}` : "Order details"} description={detail ? `Placed ${formatDateTime(detail.createdAt)}` : undefined} size="xl">
        {detail && (<div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge status={detail.orderStatus} dot/>
              <Badge status={detail.paymentStatus}/>
              <Badge tone="neutral">{detail.paymentMethod === "cod" ? "Cash on delivery" : "SSLCommerz"}</Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Customer", value: entityName(detail.user) },
                { label: "Recipient", value: detail.shippingAddress.recipientName },
                { label: "Phone", value: detail.shippingAddress.phone },
            ].map((item) => (<div key={item.label} className="rounded-xl border border-ink-100 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink-400">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-ink-800">{item.value}</p>
                </div>))}
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-500">Items</p>
              <div className="divide-y divide-ink-100 rounded-xl border border-ink-100">
                {detail.items.map((item) => (<div key={item.variantId} className="flex items-center gap-3 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="size-12 rounded-lg object-cover"/>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-800">{item.name}</p>
                      <p className="text-[11px] text-ink-500">
                        {item.sku} {item.size ? `· ${item.size}` : ""} {item.color ? `· ${item.color}` : ""} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-ink-900">{formatBDT(item.subtotal)}</p>
                  </div>))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-ink-100 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Pricing</p>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between text-ink-600"><dt>Subtotal</dt><dd>{formatBDT(detail.pricing.subtotal)}</dd></div>
                  <div className="flex justify-between text-ink-600"><dt>Shipping</dt><dd>{formatBDT(detail.pricing.shippingCharge)}</dd></div>
                  <div className="flex justify-between text-ink-600"><dt>Discount</dt><dd>-{formatBDT(detail.pricing.discountAmount)}</dd></div>
                  <div className="flex justify-between border-t border-ink-100 pt-2 font-bold text-ink-900">
                    <dt>Total</dt><dd>{formatBDT(detail.pricing.total)}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-xl border border-ink-100 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-ink-500">Shipping address</p>
                <p className="text-sm text-ink-700">{detail.shippingAddress.addressLine1}</p>
                {detail.shippingAddress.addressLine2 && (<p className="text-sm text-ink-600">{detail.shippingAddress.addressLine2}</p>)}
                <p className="mt-1 text-sm text-ink-600">
                  {detail.shippingAddress.city}, {detail.shippingAddress.district}, {detail.shippingAddress.division}
                </p>
                {detail.timeline && detail.timeline.length > 0 && (<div className="mt-4 space-y-2 border-t border-ink-100 pt-3">
                    {detail.timeline.map((step, index) => (<div key={`${step.status}-${index}`} className="flex items-center gap-2 text-[11px]">
                        <span className={cn("size-1.5 rounded-full", index === detail.timeline.length - 1 ? "bg-brand-600" : "bg-ink-300")}/>
                        <span className="font-semibold text-ink-700">{titleCase(step.status)}</span>
                        <span className="text-ink-400">{formatDateTime(step.at)}</span>
                      </div>))}
                  </div>)}
              </div>
            </div>

            {detail.notes && (<div className="rounded-xl bg-brand-50 p-3 text-xs text-brand-800">
                <strong>Customer note:</strong> {detail.notes}
              </div>)}
          </div>)}
      </Modal>
    </div>);
}
