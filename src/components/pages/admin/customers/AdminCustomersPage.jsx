"use client";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, UserX, UserCheck } from "lucide-react";
import { useAdminAction, useAdminList, paginationFor } from "@/components/admin/admin-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { PageHeading } from "@/components/ui/section-heading";
import { fallbackCustomers } from "@/lib/fallback/data";
import { formatBDT, formatDate, initials } from "@/lib/utils";
export default function AdminCustomersPage() {
    const { data } = useAdminList(["admin", "customers"], "admin/customers?page=1&limit=100", fallbackCustomers);
    const toggleBlock = useAdminAction();
    const [overrides, setOverrides] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const customers = overrides ?? data.items;
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return customers.filter((customer) => !term ||
            customer.name.toLowerCase().includes(term) ||
            customer.email.toLowerCase().includes(term) ||
            (customer.phone ?? "").includes(term));
    }, [customers, search]);
    const pagination = paginationFor(filtered.length, page, 10);
    const rows = filtered.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit);
    const onToggle = (customer) => {
        const isBlocked = !customer.isBlocked;
        toggleBlock.mutate({
            path: `admin/customers/${customer._id}/block`,
            method: "PUT",
            body: { isBlocked },
        }, {
            onSuccess: () => {
                setOverrides((current) => (current ?? customers).map((item) => item._id === customer._id ? { ...item, isBlocked } : item));
                toast.success(`${customer.name} ${isBlocked ? "blocked" : "unblocked"}.`);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Customers" description="Manage customer accounts and store access."/>

      <Card>
        <CardHeader title="All customers" description={`${filtered.length} accounts`}/>
        <CardBody className="border-b border-ink-100">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input value={search} onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
        }} placeholder="Name, email or phone" className="pl-10" aria-label="Search customers"/>
          </div>
        </CardBody>
        <DataTable columns={[
            { key: "customer", label: "Customer" },
            { key: "phone", label: "Phone" },
            { key: "orders", label: "Orders", align: "center" },
            { key: "spent", label: "Total spent", align: "right" },
            { key: "joined", label: "Joined" },
            { key: "verified", label: "Email" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={rows.map((customer) => ({
            customer: (<div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">
                  {initials(customer.name)}
                </span>
                <div>
                  <p className="font-semibold text-ink-900">{customer.name}</p>
                  <p className="text-[11px] text-ink-500">{customer.email}</p>
                </div>
              </div>),
            phone: customer.phone ?? "—",
            orders: customer.totalOrders ?? 0,
            spent: formatBDT(customer.totalSpent ?? 0),
            joined: formatDate(customer.createdAt),
            verified: (<Badge tone={customer.isEmailVerified ? "success" : "warning"}>
                {customer.isEmailVerified ? "Verified" : "Unverified"}
              </Badge>),
            status: <Badge status={customer.isBlocked ? "rejected" : "active"} dot/>,
            actions: (<Button variant={customer.isBlocked ? "secondary" : "outline"} size="sm" onClick={() => onToggle(customer)} loading={toggleBlock.isPending}>
                {customer.isBlocked ? <UserCheck className="size-3.5"/> : <UserX className="size-3.5"/>}
                {customer.isBlocked ? "Unblock" : "Block"}
              </Button>),
        }))} empty="No customers found."/>
        <div className="border-t border-ink-100 p-4">
          <Pagination pagination={pagination} onPage={setPage}/>
        </div>
      </Card>
    </div>);
}
