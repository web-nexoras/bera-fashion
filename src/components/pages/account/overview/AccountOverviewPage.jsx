"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CreditCard, Heart, MapPin, RotateCcw, Settings, ShoppingBag, Sparkles, UserRound, Wallet, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/feedback";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { getReturns } from "@/api/account.js";
import { getMyOrders } from "@/api/orders.js";
import { getWishlist } from "@/api/wishlist.js";
import { formatBDT, formatDate, initials } from "@/lib/utils";
const quickActions = [
    { href: "/account/profile", label: "Edit profile", description: "Keep your details current", icon: UserRound },
    { href: "/account/addresses", label: "Addresses", description: "Manage delivery locations", icon: MapPin },
    { href: "/account/returns", label: "Returns", description: "Track refund requests", icon: RotateCcw },
    { href: "/account/settings", label: "Settings", description: "Tune your preferences", icon: Settings },
];
export default function AccountOverviewPage() {
    const { user } = useAuth();
    const ordersQuery = useQuery({
        queryKey: ["account", "orders"],
        queryFn: () => getMyOrders().then((result) => result.data ?? []),
    });
    const wishlistQuery = useQuery({
        queryKey: ["account", "wishlist"],
        queryFn: () => getWishlist().then((result) => result.data ?? []),
    });
    const returnsQuery = useQuery({
        queryKey: ["account", "returns"],
        queryFn: () => getReturns().then((result) => result.data ?? []),
    });
    const orders = ordersQuery.data ?? [];
    const totalSpent = orders.length > 0
        ? orders
            .filter((order) => order.orderStatus !== "cancelled")
            .reduce((sum, order) => sum + order.pricing.total, 0)
        : (user?.totalSpent ?? 0);
    const orderCount = orders.length || (user?.totalOrders ?? 0);
    const wishlistCount = wishlistQuery.data?.length ?? 0;
    const returnsCount = returnsQuery.data?.length ?? 0;
    const firstName = (user?.name ?? "there").split(" ")[0];
    const stats = [
        { label: "Total orders", value: String(orderCount), icon: ShoppingBag, tone: "bg-brand-50 text-brand-700" },
        { label: "Total spent", value: formatBDT(totalSpent), icon: Wallet, tone: "bg-emerald-50 text-emerald-600" },
        { label: "Wishlist items", value: String(wishlistCount), icon: Heart, tone: "bg-rose-50 text-rose-600" },
        { label: "Return requests", value: String(returnsCount), icon: RotateCcw, tone: "bg-amber-50 text-amber-600" },
    ];
    return (<div className="animate-fade-up space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl bg-brand-900 p-7 text-white shadow-lift sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border border-white/10"/>
        <div className="pointer-events-none absolute -right-2 -top-12 size-52 rounded-full border border-white/10"/>
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-brand-600/30 blur-3xl"/>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">
              <Sparkles className="size-3.5"/> Your dashboard
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">
              Here&apos;s a quick look at everything happening with your BERA account.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/products" variant="gold" size="sm">
                Continue shopping <ArrowRight className="size-3.5"/>
              </ButtonLink>
              <ButtonLink href="/account/orders" size="sm" className="border border-white/25 bg-white/10 text-white hover:bg-white/20">
                View orders
              </ButtonLink>
            </div>
          </div>
          <div className="hidden items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur sm:flex">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 font-display text-lg font-bold">
              {initials(user?.name ?? "BERA Customer")}
            </span>
            <div>
              <p className="text-xs font-bold">{user?.name ?? "BERA Customer"}</p>
              <p className="text-[11px] text-white/60">Member since {formatDate(user?.createdAt, "MMM yyyy")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (<Card key={label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-ink-500">{label}</p>
                {ordersQuery.isLoading || wishlistQuery.isLoading || returnsQuery.isLoading ? (<Skeleton className="mt-3 h-8 w-24"/>) : (<p className="mt-2 font-display text-2xl font-bold text-ink-900">{value}</p>)}
              </div>
              <span className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="size-[18px]" strokeWidth={1.8}/>
              </span>
            </div>
          </Card>))}
      </section>

      {/* Recent orders */}
      <Card className="overflow-hidden">
        <CardHeader title="Recent orders" description="Your latest purchases at a glance" action={<Link href="/account/orders" className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline">
              View all <ArrowRight className="size-3.5"/>
            </Link>}/>
        {ordersQuery.isLoading ? (<div className="space-y-3 p-5">
            <Skeleton className="h-12 w-full"/>
            <Skeleton className="h-12 w-full"/>
            <Skeleton className="h-12 w-full"/>
          </div>) : (<DataTable columns={[
                { key: "order", label: "Order" },
                { key: "date", label: "Date" },
                { key: "items", label: "Items" },
                { key: "total", label: "Total", align: "right" },
                { key: "status", label: "Status" },
            ]} rows={orders.slice(0, 5).map((order) => ({
                order: (<Link href={`/account/orders/${order._id}`} className="font-bold text-ink-800 hover:text-brand-700">
                  {order.orderNumber}
                </Link>),
                date: <span className="text-ink-500">{formatDate(order.createdAt)}</span>,
                items: <span className="text-ink-500">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>,
                total: <span className="font-semibold text-ink-900">{formatBDT(order.pricing.total)}</span>,
                status: <Badge status={order.orderStatus} dot/>,
            }))} empty="No orders yet. Your first order will appear here."/>)}
      </Card>

      {/* Quick actions */}
      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-ink-900">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ href, label, description, icon: Icon }) => (<Link key={href} href={href} className="group surface p-5 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift">
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                <Icon className="size-[18px]" strokeWidth={1.8}/>
              </span>
              <p className="mt-4 text-sm font-bold text-ink-900">{label}</p>
              <p className="mt-1 text-xs text-ink-500">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-brand-700">
                Open <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5"/>
              </span>
            </Link>))}
        </div>
      </section>

      <Card className="flex flex-wrap items-center justify-between gap-4 bg-brand-50/60 p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-soft">
            <CreditCard className="size-[18px]"/>
          </span>
          <div>
            <p className="text-sm font-bold text-ink-900">Payment history</p>
            <p className="text-xs text-ink-500">Review every transaction in one place.</p>
          </div>
        </div>
        <ButtonLink href="/account/transactions" variant="outline" size="sm">
          View transactions
        </ButtonLink>
      </Card>
    </div>);
}
