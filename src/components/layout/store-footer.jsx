import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { SITE } from "@/lib/constants";
const groups = [
    {
        title: "Shop",
        links: [
            { label: "All products", href: "/products" },
            { label: "New arrivals", href: "/products?isNewArrival=true" },
            { label: "Best sellers", href: "/products?isBestSeller=true" },
            { label: "Featured", href: "/products?isFeatured=true" },
            { label: "Wishlist", href: "/wishlist" },
        ],
    },
    {
        title: "My account",
        links: [
            { label: "My profile", href: "/account" },
            { label: "My orders", href: "/account/orders" },
            { label: "Addresses", href: "/account/addresses" },
            { label: "Returns", href: "/account/returns" },
            { label: "Track order", href: "/track" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Our story", href: "/about" },
            { label: "Contact us", href: "/contact" },
        ],
    },
];
export function StoreFooter() {
    return (<footer className="mt-20 bg-brand-950 text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light/>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">{SITE.description}</p>
          <div className="mt-6 space-y-2.5 text-sm text-white/60">
            <p className="flex items-start gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-gold-300"/>{SITE.address}</p>
            <p className="flex items-center gap-2.5"><Phone className="size-4 text-gold-300"/>{SITE.phone}</p>
            <p className="flex items-center gap-2.5"><Mail className="size-4 text-gold-300"/>{SITE.email}</p>
          </div>
        </div>

        {groups.map((group) => (<div key={group.title}>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">{group.title}</h3>
            <ul className="space-y-2.5">
              {group.links.map((link) => (<li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">{link.label}</Link>
                </li>))}
            </ul>
          </div>))}
      </div>

      <div className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-5 text-xs text-white/40">
        <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        <p>Crafted with care in Dhaka, Bangladesh.</p>
      </div>
    </footer>);
}
