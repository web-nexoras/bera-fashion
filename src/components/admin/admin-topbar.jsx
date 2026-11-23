"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, LogOut, Menu, Search, Settings, Store, } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { ADMIN_SIDEBAR_TOGGLE } from "./admin-sidebar";
import { Badge } from "@/components/ui/badge";
import { initials, titleCase } from "@/lib/utils";
export function AdminTopbar() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [search, setSearch] = useState("");
    const [openPanel, setOpenPanel] = useState(null);
    const toggleSidebar = () => window.dispatchEvent(new Event(ADMIN_SIDEBAR_TOGGLE));
    const onSearch = (event) => {
        event.preventDefault();
        const term = search.trim();
        if (!term)
            return;
        router.push(`/admin/orders?search=${encodeURIComponent(term)}`);
        setSearch("");
    };
    const onLogout = async () => {
        await logout();
        toast.success("Signed out successfully.");
        router.push("/sign-in");
    };
    return (<header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur-xl">
      <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button aria-label="Toggle navigation" onClick={toggleSidebar} className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700 lg:hidden">
          <Menu className="size-5"/>
        </button>

        <form onSubmit={onSearch} className="relative hidden max-w-md flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders, products, customers…" aria-label="Search admin console" className="h-10 w-full rounded-xl border border-ink-200 bg-ink-50/60 pl-10 pr-4 text-sm text-ink-800 outline-none transition-colors placeholder:text-ink-400 hover:border-ink-300 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"/>
        </form>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Badge tone="brand" dot className="hidden sm:inline-flex">
            Admin
          </Badge>

          <div className="relative">
            <button onClick={() => setOpenPanel(openPanel === "user" ? null : "user")} className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white py-1.5 pl-1.5 pr-2 transition-colors hover:border-brand-300">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-700 text-xs font-bold text-white">
                {initials(user?.name ?? "Account")}
              </span>
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-xs font-semibold text-ink-800">{user?.name ?? "Account"}</span>
                <span className="block text-[10px] text-ink-500">
                  {user?.role ? titleCase(user.role) : "Admin"}
                </span>
              </span>
              <ChevronDown className="size-4 text-ink-400"/>
            </button>
            {openPanel === "user" && (<>
                <button aria-label="Close account menu" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpenPanel(null)}/>
                <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lift">
                  <div className="border-b border-ink-100 px-4 py-3">
                  <p className="truncate text-xs font-semibold text-ink-800">{user?.name ?? "Account"}</p>
                  {user?.email && <p className="truncate text-[11px] text-ink-500">{user.email}</p>}
                  </div>
                  <Link href="/admin/settings" onClick={() => setOpenPanel(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-ink-700 hover:bg-ink-50">
                    <Settings className="size-4 text-ink-400"/> Store settings
                  </Link>
                  <Link href="/" onClick={() => setOpenPanel(null)} className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-ink-700 hover:bg-ink-50">
                    <Store className="size-4 text-ink-400"/> Visit storefront
                  </Link>
                  <button onClick={() => void onLogout()} className="flex w-full items-center gap-2.5 border-t border-ink-100 px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50">
                    <LogOut className="size-4"/> Sign out
                  </button>
                </div>
              </>)}
          </div>
        </div>
      </div>
    </header>);
}
