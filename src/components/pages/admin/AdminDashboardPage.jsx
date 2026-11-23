"use client";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Banknote, ClipboardList, PackageSearch, Plus, ShoppingCart, Users, Warehouse, Boxes, } from "lucide-react";
import { useAdminList, useAdminQuery, entityName } from "@/components/admin/admin-data";
import { Skeleton } from "@/components/ui/feedback";
import { StatCard } from "@/components/admin/stat-card";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageHeading } from "@/components/ui/section-heading";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatBDT, formatDate, titleCase } from "@/lib/utils";

const RevenueAreaChart = dynamic(() => import("@/components/admin/charts").then((mod) => mod.RevenueAreaChart), {
  loading: () => <Skeleton className="h-[280px] w-full" />,
});
const OrdersBarChart = dynamic(() => import("@/components/admin/charts").then((mod) => mod.OrdersBarChart), {
  loading: () => <Skeleton className="h-[250px] w-full" />,
});
const OrderStatusDonut = dynamic(() => import("@/components/admin/charts").then((mod) => mod.OrderStatusDonut), {
  loading: () => <Skeleton className="h-[260px] w-full" />,
});
const number = (value) => new Intl.NumberFormat("en-BD").format(value || 0);
export default function AdminDashboardPage() {
    const statsQuery = useAdminQuery(["admin", "dashboard"], "admin/dashboard");
    const salesQuery = useAdminQuery(["admin", "dashboard", "monthly-sales"], "admin/dashboard/monthly-sales");
    const ordersQuery = useAdminList(["admin", "orders", "dashboard"], "orders/admin/all?page=1&limit=50");
    const stockQuery = useAdminList(["admin", "inventory", "low-stock"], "inventory/low-stock");
    const stats = statsQuery.data;
    const sales = Array.isArray(salesQuery.data) ? salesQuery.data : [];
    const orders = ordersQuery.data.items;
    const lowStock = stockQuery.data.items.slice(0, 6);
    const statusSlices = useMemo(() => {
        const counts = ORDER_STATUSES.reduce((acc, status) => {
            acc[status] = 0;
            return acc;
        }, {});
        orders.forEach((order) => {
            counts[order.orderStatus] = (counts[order.orderStatus] ?? 0) + 1;
        });
        return ORDER_STATUSES.map((status) => ({ name: titleCase(status), value: counts[status] ?? 0 }));
    }, [orders]);
    return (<div className="space-y-6">
      <PageHeading title="Dashboard" description="A live overview of store performance, orders and inventory health." action={<ButtonLink href="/admin/products/new" size="md">
            <Plus className="size-4"/> Add product
          </ButtonLink>}/>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value={stats ? formatBDT(stats.totalRevenue) : "—"} icon={<Banknote className="size-5"/>} growth={stats?.revenueGrowth} hint={stats ? `${formatBDT(stats.todaysRevenue)} today` : "Live data unavailable"}/>
        <StatCard label="Total orders" value={stats ? number(stats.totalOrders) : "—"} icon={<ShoppingCart className="size-5"/>} growth={stats?.orderGrowth} hint={stats ? `${stats.pendingOrders} awaiting fulfilment` : "Live data unavailable"}/>
        <StatCard label="Customers" value={stats ? number(stats.totalCustomers) : "—"} icon={<Users className="size-5"/>} growth={stats?.customerGrowth} hint={stats ? "Registered accounts" : "Live data unavailable"}/>
        <StatCard label="Active products" value={stats ? number(stats.totalProducts) : "—"} icon={<Boxes className="size-5"/>} hint={stats ? `${stats.lowStockItems} variants low in stock` : "Live data unavailable"} trend="flat"/>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <Card>
          <CardHeader title="Revenue overview" description="Monthly revenue across the current year" action={<span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                <Banknote className="size-3.5"/> BDT
              </span>}/>
          <CardBody className="pt-3">
            <RevenueAreaChart data={sales}/>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Order status" description="Distribution of recent orders"/>
          <CardBody className="pt-3">
            <OrderStatusDonut data={statusSlices}/>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <Card>
          <CardHeader title="Order volume" description="Orders placed each month"/>
          <CardBody className="pt-3">
            <OrdersBarChart data={sales} height={250}/>
          </CardBody>
        </Card>
        <Card className="flex flex-col">
          <CardHeader title="Low stock alert" description="Variants that need restocking soon" action={<ButtonLink href="/admin/inventory" variant="ghost" size="sm">
                Manage <ArrowRight className="size-3.5"/>
              </ButtonLink>}/>
          <CardBody className="flex-1 space-y-1 p-3">
            {lowStock.length ? (lowStock.map((item) => (<div key={item._id} className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-brand-50/40">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                    <PackageSearch className="size-4"/>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink-800">
                      {item.productName ?? "Product"}
                    </p>
                    <p className="truncate text-[11px] text-ink-500">
                      {item.sku} {item.size ? `· ${item.size}` : ""}
                    </p>
                  </div>
                  <Badge tone={item.stock === 0 ? "danger" : "warning"}>{item.stock} left</Badge>
                </div>))) : (<p className="px-3 py-10 text-center text-xs text-ink-500">All variants are well stocked.</p>)}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent orders" description="The latest activity across your store" action={<ButtonLink href="/admin/orders" variant="secondary" size="sm">
              View all orders <ArrowRight className="size-3.5"/>
            </ButtonLink>}/>
        <DataTable columns={[
            { key: "order", label: "Order" },
            { key: "customer", label: "Customer" },
            { key: "date", label: "Date" },
            { key: "items", label: "Items", align: "center" },
            { key: "total", label: "Total", align: "right" },
            { key: "payment", label: "Payment" },
            { key: "status", label: "Status" },
        ]} rows={orders.slice(0, 6).map((order) => ({
            order: (<ButtonLink href={`/admin/orders?order=${order._id}`} variant="ghost" size="sm" className="-ml-3 font-semibold text-brand-700">
                {order.orderNumber}
              </ButtonLink>),
            customer: entityName(order.user),
            date: formatDate(order.createdAt),
            items: order.items.length,
            total: <span className="font-semibold text-ink-900">{formatBDT(order.pricing.total)}</span>,
            payment: <Badge status={order.paymentStatus}/>,
            status: <Badge status={order.orderStatus} dot/>,
        }))} empty="No orders yet."/>
      </Card>

      <Card>
        <CardHeader title="Quick actions" description="Common tasks, one click away"/>
        <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { href: "/admin/products/new", label: "Add a product", hint: "Create a new listing", icon: Plus },
            { href: "/admin/orders", label: "Review orders", hint: stats ? `${stats.pendingOrders} pending` : "Open orders", icon: ClipboardList },
            { href: "/admin/inventory", label: "Adjust stock", hint: stats ? `${stats.lowStockItems} low items` : "View stock", icon: Warehouse },
            { href: "/admin/reports", label: "View reports", hint: "Sales & inventory", icon: Banknote },
        ].map((action) => {
            const Icon = action.icon;
            return (<ButtonLink key={action.href} href={action.href} variant="outline" className="h-auto items-start gap-3 p-4 text-left">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="size-4"/>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{action.label}</span>
                  <span className="mt-0.5 block text-[11px] font-normal text-ink-500">{action.hint}</span>
                </span>
              </ButtonLink>);
        })}
        </CardBody>
      </Card>
    </div>);
}
