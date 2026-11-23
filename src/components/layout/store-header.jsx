"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, UserRound, X, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { useCart } from "@/features/cart/context/CartContext.jsx";
import { AnnouncementBar } from "@/components/store/announcement-bar";
import { SITE } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/products?isNewArrival=true", label: "New Arrivals" },
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact" },
];
export function StoreHeader({ categories = [] }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();
    const { summary } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [renderedPath, setRenderedPath] = useState(pathname);
    if (renderedPath !== pathname) {
        setRenderedPath(pathname);
        setMenuOpen(false);
        setSearchOpen(false);
    }
    const submitSearch = (event) => {
        event.preventDefault();
        router.push(query.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : "/products");
    };
    return (<header className="sticky top-0 z-50">
      <AnnouncementBar />
      <div className="hidden lg:block">
        <div className="border-b border-ink-100 bg-white">
          <div className="container-x flex h-9 items-center justify-between text-[11px] text-ink-500">
            <span>{SITE.tagline}</span>
            <div className="flex items-center gap-5">
              <span>{SITE.phone}</span>
              <span className="h-3 w-px bg-ink-200"/>
              <span>{SITE.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-ink-100 bg-white/95 backdrop-blur-md">
        <div className="container-x flex h-18 items-center justify-between gap-4">
          <button className="rounded-lg p-2 text-ink-700 lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
            {menuOpen ? <X className="size-5"/> : <Menu className="size-5"/>}
          </button>

          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (<Link key={link.href} href={link.href} className={cn("relative py-2 text-[13px] font-semibold transition-colors hover:text-brand-700", pathname === link.href ? "text-brand-700" : "text-ink-600")}>
                {link.label}
                {pathname === link.href && <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded bg-brand-700"/>}
              </Link>))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen((value) => !value)} className="rounded-xl p-2.5 text-ink-600 hover:bg-brand-50 hover:text-brand-700" aria-label="Search">
              <Search className="size-5"/>
            </button>
            <Link href={user?.role === "admin" ? "/admin" : user ? "/account" : "/login"} className="hidden rounded-xl p-2.5 text-ink-600 hover:bg-brand-50 hover:text-brand-700 sm:block" title={user ? user.name : "Sign in"}>
              {user ? (<span className="flex size-5 items-center justify-center rounded-full bg-brand-700 text-[9px] font-bold text-white">
                  {initials(user.name)}
                </span>) : (<UserRound className="size-5"/>)}
            </Link>
            <Link href="/wishlist" className="relative hidden rounded-xl p-2.5 text-ink-600 hover:bg-brand-50 hover:text-brand-700 sm:block">
              <Heart className="size-5"/>
            </Link>
            <Link href="/cart" className="relative rounded-xl p-2.5 text-ink-600 hover:bg-brand-50 hover:text-brand-700">
              <ShoppingBag className="size-5"/>
              {summary.itemCount > 0 && (<span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-brand-700 text-[9px] font-bold text-white">
                  {summary.itemCount}
                </span>)}
            </Link>
          </div>
        </div>

        {searchOpen && (<div className="border-t border-ink-100 bg-white py-3">
            <form onSubmit={submitSearch} className="container-x flex gap-2">
              <InputAuto value={query} onChange={setQuery}/>
              <button type="submit" className="rounded-xl bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800">
                Search
              </button>
            </form>
          </div>)}
      </div>

      {menuOpen && (<div className="max-h-[75vh] overflow-y-auto border-b border-ink-100 bg-white lg:hidden">
          <nav className="container-x flex flex-col py-3">
            {links.map((link) => (<Link key={link.href} href={link.href} className="border-b border-ink-50 py-3 text-sm font-semibold text-ink-700">
                {link.label}
              </Link>))}
            {categories.slice(0, 6).map((category) => (<Link key={category._id} href={`/categories/${category.slug}`} className="border-b border-ink-50 py-3 pl-4 text-sm text-ink-500">
                {category.name}
              </Link>))}
            <div className="mt-4 flex gap-2 pb-4">
              <Link href="/login" className="flex-1 rounded-xl border border-ink-200 py-2.5 text-center text-sm font-semibold">
                Sign in
              </Link>
              <Link href={user?.role === "admin" ? "/admin" : "/account"} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white">
                <LayoutDashboard className="size-4"/> Dashboard
              </Link>
            </div>
          </nav>
        </div>)}
    </header>);
}
function InputAuto({ value, onChange }) {
    return (<input autoFocus value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search for products, brands and more…" className="h-11 flex-1 rounded-xl border border-ink-200 px-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"/>);
}
