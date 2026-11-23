"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, LayoutDashboard, LogOut, MapPin, Package, RotateCcw, Settings, Store, UserRound, } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { cn } from "@/lib/utils";
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
    const isActive = (href, exact) => exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    const handleLogout = async () => {
        await logout();
        toast.success("You've been signed out");
        router.push("/");
        router.refresh();
    };
    return (<>
      {/* Mobile: branded strip + horizontally scrollable navigation */}
      <aside className="border-b border-ink-100 bg-white lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-3">
          <Logo compact/>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-400">My account</span>
          <button type="button" onClick={() => void handleLogout()} className="flex size-8 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700" aria-label="Sign out">
            <LogOut className="size-4"/>
          </button>
        </div>
        <nav className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto px-3 pb-3">
          {links.map(({ href, label, icon: Icon, exact }) => (<Link key={href} href={href} className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors", isActive(href, exact)
                ? "bg-brand-700 text-white shadow-soft"
                : "bg-ink-50 text-ink-600 hover:bg-brand-50 hover:text-brand-700")}>
              <Icon className="size-3.5"/>
              {label}
            </Link>))}
          <Link href="/" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink-50 px-3 py-2 text-xs font-semibold text-ink-600 hover:bg-brand-50 hover:text-brand-700">
            <Store className="size-3.5"/> Store
          </Link>
        </nav>
      </aside>

      {/* Desktop: full-height sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-100 bg-white lg:flex">
        <div className="border-b border-ink-100 px-6 py-6">
          <Logo />
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-ink-400">My account</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {links.map(({ href, label, icon: Icon, exact }) => (<Link key={href} href={href} className={cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all", isActive(href, exact)
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

        <div className="space-y-1 border-t border-ink-100 p-3">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900">
            <Store className="size-4 text-ink-400"/> Back to store
          </Link>
          <button type="button" onClick={() => void handleLogout()} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink-500 transition-colors hover:bg-red-50 hover:text-red-600">
            <LogOut className="size-4"/> Sign out
          </button>
        </div>
      </aside>
    </>);
}
