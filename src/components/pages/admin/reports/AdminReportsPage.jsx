"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Banknote, ClipboardList, Download, Package, TrendingUp } from "lucide-react";
import { useAdminQuery } from "@/components/admin/admin-data";
import { Skeleton } from "@/components/ui/feedback";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/section-heading";
import { fallbackMonthlySales, fallbackProducts, fallbackStoreSettings } from "@/lib/fallback/data";
import { formatBDT } from "@/lib/utils";

const RevenueAreaChart = dynamic(() => import("@/components/admin/charts").then((mod) => mod.RevenueAreaChart), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
});
const OrdersBarChart = dynamic(() => import("@/components/admin/charts").then((mod) => mod.OrdersBarChart), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
});
const fallbackInventoryReport = {
    totalVariants: fallbackProducts.reduce((sum, product) => sum + product.variants.length, 0),
    lowStock: 14,
    outOfStock: 6,
    totalValue: 2_486_000,
};
const monthDate = (month) => {
    const year = new Date().getFullYear();
    const index = new Date(`${month} 1, ${year}`).getMonth();
    return `${year}-${String(index + 1).padStart(2, "0")}-01`;
};
export default function AdminReportsPage() {
    const salesQuery = useAdminQuery(["admin", "reports", "sales"], "admin/reports/sales", fallbackMonthlySales);
    const inventoryQuery = useAdminQuery(["admin", "reports", "inventory"], "admin/reports/inventory", fallbackInventoryReport);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const sales = Array.isArray(salesQuery.data) ? salesQuery.data : fallbackMonthlySales;
    const inventory = inventoryQuery.data;
    const filtered = useMemo(() => sales.filter((row) => {
        const date = monthDate(row.month);
        return (!from || date >= from) && (!to || date <= to);
    }), [sales, from, to]);
    const totalRevenue = filtered.reduce((sum, row) => sum + row.revenue, 0);
    const totalOrders = filtered.reduce((sum, row) => sum + row.orders, 0);
    const averageOrder = totalOrders ? totalRevenue / totalOrders : 0;
    const exportCsv = () => {
        const csv = [
            "Month,Revenue (BDT),Orders",
            ...filtered.map((row) => `${row.month},${row.revenue},${row.orders}`),
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `bera-sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        toast.success("Sales report exported as CSV.");
    };
    return (<div className="space-y-6">
      <PageHeading title="Reports" description="Sales performance and inventory health at a glance." action={<Button onClick={exportCsv}>
            <Download className="size-4"/> Export CSV
          </Button>}/>

      <Card>
        <CardBody className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-700">From</label>
            <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-44"/>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-700">To</label>
            <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-44"/>
          </div>
          <div className="flex flex-wrap gap-2 pb-0.5">
            <Badge tone="brand">{filtered.length} months in range</Badge>
            <button onClick={() => { setFrom(""); setTo(""); }} className="text-xs font-semibold text-brand-700 hover:underline">
              Reset range
            </button>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue in range" value={formatBDT(totalRevenue)} icon={<Banknote className="size-5"/>} hint={`${fallbackStoreSettings.currency} · filtered period`} trend="flat"/>
        <StatCard label="Orders in range" value={totalOrders.toLocaleString("en-BD")} icon={<ClipboardList className="size-5"/>} hint="Across selected months" trend="flat"/>
        <StatCard label="Average order value" value={formatBDT(Math.round(averageOrder))} icon={<TrendingUp className="size-5"/>} hint="Revenue ÷ orders" trend="flat"/>
        <StatCard label="Inventory value" value={formatBDT(inventory.totalValue)} icon={<Package className="size-5"/>} hint="At current retail prices" trend="flat"/>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader title="Sales report" description="Revenue by month for the selected range"/>
          <CardBody className="pt-3">
            <RevenueAreaChart data={filtered} height={300}/>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Order volume" description="Orders placed by month"/>
          <CardBody className="pt-3">
            <OrdersBarChart data={filtered} height={300}/>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Inventory report" description="Snapshot of catalogue stock health"/>
        <CardBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total variants", value: inventory.totalVariants, note: "Across all products", tone: "text-ink-900" },
            { label: "Low stock", value: inventory.lowStock, note: "Needs restocking", tone: "text-amber-600" },
            { label: "Out of stock", value: inventory.outOfStock, note: "Currently unavailable", tone: "text-red-600" },
            { label: "Stock value", value: formatBDT(inventory.totalValue), note: "Retail valuation", tone: "text-brand-700" },
        ].map((item) => (<div key={item.label} className="rounded-xl border border-ink-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{item.label}</p>
              <p className={`mt-2 font-display text-2xl font-bold ${item.tone}`}>{item.value}</p>
              <p className="mt-1 text-[11px] text-ink-400">{item.note}</p>
            </div>))}
        </CardBody>
      </Card>
    </div>);
}
