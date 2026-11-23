"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, LayoutDashboard, LogOut, MapPin, Package, RotateCcw, Settings, Store, UserRound, X, } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { cn } from "@/lib/utils";
export const ACCOUNT_SIDEBAR_TOGGLE = "account:toggle-sidebar";
const links = [
    { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/account/profile", label: "Profile", icon: UserRound },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/returns", label: "Returns", icon: RotateCcw },
    { href: "/account/transactions", label: "Transactions", icon: CreditCard },
    { href: "/account/settings", label: "Settings", icon: Settings },
];
export function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const toggle = () => setOpen((current) => !current);
        const close = () => setOpen(false);
        window.addEventListener(ACCOUNT_SIDEBAR_TOGGLE, toggle);
        window.addEventListener("account:close-sidebar", close);
        return () => {
            window.removeEventListener(ACCOUNT_SIDEBAR_TOGGLE, toggle);
            window.removeEventListener("account:close-sidebar", close);
        };
    }, []);
    const [renderedPath, setRenderedPath] = useState(pathname);
    if (renderedPath !== pathname) {
        setRenderedPath(pathname);
        setOpen(false);
    }
    const isActive = (href, exact) => exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    const handleLogout = async () => {
        await logout();
        toast.success("You've been signed out");
        router.push("/");
        router.refresh();
    };
    return (<>
      {open && <button type="button" aria-label="Close account navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 cursor-default bg-ink-900/50 backdrop-blur-sm lg:hidden"/>}
      <aside aria-label="Account navigation" className={cn("fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-ink-100 bg-white shadow-lift transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:shrink-0 lg:translate-x-0 lg:shadow-none", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-ink-100 px-5 lg:h-auto lg:px-6 lg:py-6">
          <div>
            <Logo/>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-ink-400">My account</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation" className="rounded-lg p-2 text-ink-500 hover:bg-ink-50 lg:hidden">
            <X className="size-5"/>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {links.map(({ href, label, icon: Icon, exact }) => (<Link key={href} href={href} onClick={() => setOpen(false)} aria-current={isActive(href, exact) ? "page" : undefined} className={cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all", isActive(href, exact)
                ? "bg-brand-50 text-brand-800"
                : "text-ink-500 hover:bg-ink-50 hover:text-ink-900")}>
              <span className={cn("flex size-8 items-center justify-center rounded-lg transition-colors", isActive(href, exact)
                ? "bg-brand-700 text-white shadow-soft"
                : "bg-ink-50 text-ink-400 group-hover:text-brand-700")}>
                <Icon className="size-4" strokeWidth={1.8}/>
              </span>
              {label}
              {isActive(href, exact) && <span className="ml-auto size-1.5 rounded-full bg-brand-700"/>}
            </Link>))}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-ink-100 p-3">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900">
            <Store className="size-4 text-ink-400"/> Back to store
          </Link>
          <button type="button" onClick={() => void handleLogout()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4"/> Sign out
          </button>
        </div>
      </aside>

    </>);
}
