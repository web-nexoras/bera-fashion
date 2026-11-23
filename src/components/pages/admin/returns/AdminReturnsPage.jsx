"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Search, X } from "lucide-react";
import { useAdminAction, useAdminList, entityName } from "@/components/admin/admin-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/section-heading";
import { formatBDT, formatDate, titleCase } from "@/lib/utils";
const STATUSES = ["requested", "approved", "rejected", "completed"];
export default function AdminReturnsPage() {
    const { data } = useAdminList(["admin", "returns"], "returns/admin");
    const action = useAdminAction();
    const [overrides, setOverrides] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [detail, setDetail] = useState(null);
    const returns = overrides ?? data.items;
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return returns.filter((item) => {
            const matchesTerm = !term ||
                item.returnNumber.toLowerCase().includes(term) ||
                item.orderNumber.toLowerCase().includes(term) ||
                entityName(item.user).toLowerCase().includes(term);
            return matchesTerm && (status === "all" || item.status === status);
        });
    }, [returns, search, status]);
    const setReturnStatus = (item, next) => {
        action.mutate({ path: `returns/admin/${item._id}/status`, method: "PUT", body: { status: next } }, {
            onSuccess: () => {
                setOverrides((current) => (current ?? returns).map((entry) => entry._id === item._id ? { ...entry, status: next } : entry));
                toast.success(`Return ${item.returnNumber} ${next}.`);
                setDetail(null);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Returns" description="Review return requests and manage refund decisions."/>

      <Card>
        <CardHeader title="Return requests" description={`${filtered.length} requests`}/>
        <CardBody className="border-b border-ink-100">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Return no., order or customer" className="pl-10" aria-label="Search returns"/>
            </div>
            <Select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by return status">
              <option value="all">All statuses</option>
              {STATUSES.map((item) => (<option key={item} value={item}>{titleCase(item)}</option>))}
            </Select>
          </div>
        </CardBody>
        <DataTable columns={[
            { key: "return", label: "Return" },
            { key: "order", label: "Order" },
            { key: "customer", label: "Customer" },
            { key: "reason", label: "Reason" },
            { key: "refund", label: "Refund", align: "right" },
            { key: "date", label: "Requested" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={filtered.map((item) => ({
            return: (<div>
                <p className="font-semibold text-brand-700">{item.returnNumber}</p>
                <p className="text-[11px] text-ink-400">{item.items.length} item(s)</p>
              </div>),
            order: item.orderNumber,
            customer: entityName(item.user),
            reason: <span className="block max-w-52 truncate text-ink-600">{item.reason}</span>,
            refund: <span className="font-semibold text-ink-900">{formatBDT(item.refundAmount)}</span>,
            date: formatDate(item.createdAt),
            status: <Badge status={item.status} dot/>,
            actions: (<div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => setDetail(item)}>Details</Button>
                {item.status === "requested" && (<>
                    <Button variant="secondary" size="icon" onClick={() => setReturnStatus(item, "approved")} aria-label="Approve return">
                      <Check className="size-4"/>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setReturnStatus(item, "rejected")} aria-label="Reject return">
                      <X className="size-4 text-red-600"/>
                    </Button>
                  </>)}
              </div>),
        }))} empty="No return requests found."/>
      </Card>

      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail ? `Return ${detail.returnNumber}` : "Return details"} description={detail ? `Order ${detail.orderNumber}` : undefined} size="lg">
        {detail && (<div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <Badge status={detail.status} dot/>
              <span className="rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold text-ink-600">
                Customer: {entityName(detail.user)}
              </span>
            </div>
            <div className="rounded-xl border border-ink-100 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-500">Reason</p>
              <p className="mt-1.5 text-sm text-ink-700">{detail.reason}</p>
            </div>
            <div className="divide-y divide-ink-100 rounded-xl border border-ink-100">
              {detail.items.map((item, index) => (<div key={`${item.name}-${index}`} className="flex items-center justify-between gap-4 p-3 text-sm">
                  <div>
                    <p className="font-semibold text-ink-800">{item.name}</p>
                    <p className="text-[11px] text-ink-500">Qty {item.quantity} · {item.reason}</p>
                  </div>
                </div>))}
            </div>
            <div className="flex items-center justify-between rounded-xl bg-brand-50 p-4">
              <span className="text-sm font-semibold text-brand-800">Refund amount</span>
              <span className="font-display text-xl font-bold text-brand-900">{formatBDT(detail.refundAmount)}</span>
            </div>
            {detail.status === "requested" && (<div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReturnStatus(detail, "rejected")} loading={action.isPending}>
                  Reject
                </Button>
                <Button onClick={() => setReturnStatus(detail, "approved")} loading={action.isPending}>
                  Approve return
                </Button>
              </div>)}
          </div>)}
      </Modal>
    </div>);
}
