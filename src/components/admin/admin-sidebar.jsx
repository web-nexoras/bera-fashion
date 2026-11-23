"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, CreditCard, ExternalLink, LayoutDashboard, LifeBuoy, Package, RotateCcw, Settings, ShoppingCart, Tags, Ticket, Users, Warehouse, X, } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
export const ADMIN_SIDEBAR_TOGGLE = "admin:toggle-sidebar";
const groups = [
    {
        heading: "Overview",
        items: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/reports", label: "Reports", icon: BarChart3 },
        ],
    },
    {
        heading: "Commerce",
        items: [
            { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
            { href: "/admin/products", label: "Products", icon: Package },
            { href: "/admin/categories", label: "Categories", icon: Tags },
            { href: "/admin/brands", label: "Brands", icon: Building2 },
            { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
            { href: "/admin/coupons", label: "Coupons", icon: Ticket },
        ],
    },
    {
        heading: "Customers",
        items: [
            { href: "/admin/customers", label: "Customers", icon: Users },
            { href: "/admin/returns", label: "Returns", icon: RotateCcw },
            { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
        ],
    },
    {
        heading: "System",
        items: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
    },
];
export function AdminSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const toggle = () => setOpen((current) => !current);
        const close = () => setOpen(false);
        window.addEventListener(ADMIN_SIDEBAR_TOGGLE, toggle);
        window.addEventListener("admin:close-sidebar", close);
        return () => {
            window.removeEventListener(ADMIN_SIDEBAR_TOGGLE, toggle);
            window.removeEventListener("admin:close-sidebar", close);
        };
    }, []);
    const [renderedPath, setRenderedPath] = useState(pathname);
    if (renderedPath !== pathname) {
        setRenderedPath(pathname);
        setOpen(false);
    }
    const isActive = (href) => pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
    return (<>
      {open && (<button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-ink-900/60 backdrop-blur-sm lg:hidden"/>)}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-white/10 bg-gradient-to-b from-brand-950 via-brand-900 to-brand-950 text-white shadow-lift transition-transform duration-300 ease-out lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Logo href="/admin" light/>
          <button aria-label="Close navigation" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white lg:hidden">
            <X className="size-5"/>
          </button>
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-5">
          {groups.map((group) => (<div key={group.heading} className="mb-6 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                {group.heading}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (<Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors", active
                        ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                        : "text-white/60 hover:bg-white/8 hover:text-white")}>
                      {active && (<span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-gold-300"/>)}
                      <Icon className={cn("size-[18px] shrink-0", active ? "text-gold-300" : "text-white/50 group-hover:text-white/80")}/>
                      {item.label}
                    </Link>);
            })}
              </div>
            </div>))}
        </nav>

        <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
          <Link href="/" className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <span className="flex items-center gap-2">
              <ExternalLink className="size-4"/> View storefront
            </span>
            <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-100"/>
          </Link>
          <div className="flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-white/10">
              <LifeBuoy className="size-3.5 text-gold-300"/>
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold text-white/90">Store status</p>
              <p className="flex items-center gap-1 text-[10px] text-white/50">
                <span className="size-1.5 rounded-full bg-emerald-400"/> All systems operational
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>);
}
