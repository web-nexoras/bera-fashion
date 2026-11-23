"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { useAdminAction, useAdminList, entityName, paginationFor } from "@/components/admin/admin-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { PageHeading } from "@/components/ui/section-heading";
import { PAYMENT_STATUSES } from "@/lib/constants";
import { fallbackTransactions } from "@/lib/fallback/data";
import { formatBDT, formatDateTime, titleCase } from "@/lib/utils";
export default function AdminTransactionsPage() {
    const { data } = useAdminList(["admin", "transactions"], "payments/admin/all", fallbackTransactions);
    const refund = useAdminAction();
    const [overrides, setOverrides] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [target, setTarget] = useState(null);
    const transactions = overrides ?? data.items;
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return transactions.filter((item) => {
            const matchesTerm = !term ||
                item.transactionId.toLowerCase().includes(term) ||
                (item.orderNumber ?? "").toLowerCase().includes(term) ||
                entityName(item.user).toLowerCase().includes(term);
            return matchesTerm && (status === "all" || item.status === status);
        });
    }, [transactions, search, status]);
    const pagination = paginationFor(filtered.length, page, 10);
    const rows = filtered.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);
    const onRefund = () => {
        if (!target)
            return;
        refund.mutate({ path: `payments/admin/${target._id}/refund`, method: "PUT", body: { reason: "Admin-initiated refund" } }, {
            onSuccess: () => {
                setOverrides((current) => (current ?? transactions).map((item) => item._id === target._id ? { ...item, status: "refunded" } : item));
                toast.success(`Refund issued for ${target.transactionId}.`);
                setTarget(null);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Transactions" description="Review gateway payments and issue refunds."/>

      <Card>
        <CardHeader title="All transactions" description={`${filtered.length} transactions`}/>
        <CardBody className="border-b border-ink-100">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
              <Input value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
        }} placeholder="Transaction or order no., customer" className="pl-10" aria-label="Search transactions"/>
            </div>
            <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filter by payment status">
              <option value="all">All payment statuses</option>
              {PAYMENT_STATUSES.map((item) => (<option key={item} value={item}>{titleCase(item)}</option>))}
            </Select>
          </div>
        </CardBody>
        <DataTable columns={[
            { key: "transaction", label: "Transaction" },
            { key: "order", label: "Order" },
            { key: "customer", label: "Customer" },
            { key: "method", label: "Method" },
            { key: "amount", label: "Amount", align: "right" },
            { key: "date", label: "Date" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={rows.map((item) => ({
            transaction: (<div>
                <p className="font-mono font-semibold text-ink-900">{item.transactionId}</p>
                <p className="text-[11px] text-ink-400">#{item._id.slice(-6)}</p>
              </div>),
            order: item.orderNumber ?? item.orderId,
            customer: entityName(item.user),
            method: <Badge tone="neutral">{item.method === "cod" ? "Cash on delivery" : "SSLCommerz"}</Badge>,
            amount: <span className="font-semibold text-ink-900">{formatBDT(item.amount)}</span>,
            date: formatDateTime(item.createdAt),
            status: <Badge status={item.status} dot/>,
            actions: (<Button variant="outline" size="sm" disabled={item.status !== "paid"} onClick={() => setTarget(item)}>
                Refund
              </Button>),
        }))} empty="No transactions found."/>
        <div className="border-t border-ink-100 p-4">
          <Pagination pagination={pagination} onPage={setPage}/>
        </div>
      </Card>

      <Modal open={Boolean(target)} onClose={() => setTarget(null)} title="Issue refund" description="This will mark the payment as refunded." size="sm">
        <div className="space-y-5">
          <div className="rounded-xl border border-ink-100 p-4 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-ink-500">Transaction</span>
              <span className="font-mono font-semibold text-ink-800">{target?.transactionId}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-500">Amount</span>
              <span className="font-semibold text-ink-900">{formatBDT(target?.amount ?? 0)}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={onRefund} loading={refund.isPending}>Confirm refund</Button>
          </div>
        </div>
      </Modal>
    </div>);
}
