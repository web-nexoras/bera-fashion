"use client";
import Link from "next/link";
import Image from "next/image";
import { Bell, BadgeCheck, Menu, ShieldCheck, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { initials } from "@/lib/utils";
import { ACCOUNT_SIDEBAR_TOGGLE } from "@/components/account/account-sidebar";
export function AccountTopbar({ initialUser, }) {
    const { user } = useAuth();
    const name = user?.name ?? initialUser?.name ?? "Guest";
    const email = user?.email ?? initialUser?.email ?? "Welcome to BERA";
    const avatar = user?.avatar ?? initialUser?.avatar;
    const firstName = name.split(" ")[0] ?? name;
    return (<header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" aria-label="Open account navigation" onClick={() => window.dispatchEvent(new Event(ACCOUNT_SIDEBAR_TOGGLE))} className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-ink-200 text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700 lg:hidden">
            <Menu className="size-5"/>
          </button>
          {avatar ? (<Image src={avatar} alt={name} width={38} height={38} unoptimized className="size-9.5 rounded-full object-cover ring-2 ring-brand-100"/>) : (<span className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white ring-2 ring-brand-100">
              {initials(name)}
            </span>)}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-bold text-ink-900">Hello, {firstName}</p>
              {user?.isEmailVerified && <BadgeCheck className="size-3.5 shrink-0 text-emerald-600"/>}
            </div>
            <p className="truncate text-[11px] text-ink-400">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {user?.role === "admin" && (<Link href="/admin" className="hidden items-center gap-1.5 rounded-xl border border-brand-100 bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100 sm:inline-flex">
              <ShieldCheck className="size-3.5"/> Admin console
            </Link>)}
          <Link href="/" className="flex size-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700" aria-label="Visit store">
            <Store className="size-4"/>
          </Link>
          <button type="button" aria-label="Notifications" className="relative flex size-9 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700">
            <Bell className="size-4"/>
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand-600 ring-2 ring-white"/>
          </button>
          <Badge tone="brand" className="ml-1 hidden sm:inline-flex" dot>
            Member
          </Badge>
        </div>
      </div>
    </header>);
}
