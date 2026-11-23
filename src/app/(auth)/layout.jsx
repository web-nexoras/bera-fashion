import Link from "next/link";
import { ArrowLeft, BadgeCheck, Sparkles, Truck } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { SITE } from "@/lib/constants";
const highlights = [
    {
        icon: Sparkles,
        title: "Curated with intention",
        copy: "Considered pieces, premium fabrics and silhouettes made to last beyond a season.",
    },
    {
        icon: Truck,
        title: "Delivery across Bangladesh",
        copy: "From Dhaka to the hills, your order arrives quickly and beautifully packed.",
    },
    {
        icon: BadgeCheck,
        title: "An account that works for you",
        copy: "Track orders, save addresses and manage returns from one elegant dashboard.",
    },
];
export default function AuthLayout({ children }) {
    return (<div className="min-h-screen bg-canvas lg:grid lg:grid-cols-[46%_54%]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-brand-900 px-12 py-12 text-white lg:flex lg:flex-col xl:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(222,103,147,0.38),transparent_52%)]"/>
        <div className="pointer-events-none absolute -right-28 -top-24 size-96 rounded-full border border-white/10"/>
        <div className="pointer-events-none absolute -right-10 -top-10 size-72 rounded-full border border-white/10"/>
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-[28rem] rounded-full border border-white/5"/>

        <div className="relative z-10 flex items-center justify-between">
          <Logo light/>
          <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Customer portal
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-lg py-14">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-gold-300">
            Welcome to {SITE.shortName}
          </p>
          <h2 className="font-display text-5xl font-bold leading-[1.12] tracking-tight xl:text-6xl">
            Your style,
            <br />
            <span className="text-brand-200">beautifully organised.</span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-white/70">
            A private space to follow every order, keep your details close and discover new favourites.
          </p>

          <div className="mt-12 space-y-7">
            {highlights.map(({ icon: Icon, title, copy }) => (<div key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-gold-300">
                  <Icon className="size-[18px]" strokeWidth={1.8}/>
                </span>
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-white/85">{copy}</p>
                </div>
              </div>))}
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-6 border-t border-white/10 pt-6">
          <div>
            <p className="font-display text-lg italic text-white/90">&ldquo;Elegance is the balance of ease and detail.&rdquo;</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/75">The BERA edit</p>
          </div>
          <span className="font-display text-4xl font-bold text-white/10">N.</span>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between gap-4 px-5 py-6 sm:px-10">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link href="/" className="group inline-flex items-center gap-2 text-xs font-semibold text-ink-500 transition-colors hover:text-brand-700">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5"/>
            Back to store
          </Link>
        </div>

        <main className="flex flex-1 items-center justify-center px-5 pb-14 pt-4 sm:px-10">
          <div className="w-full max-w-[430px]">{children}</div>
        </main>

        <footer className="px-5 pb-6 text-center text-[11px] text-ink-400 sm:px-10">
          © {new Date().getFullYear()} {SITE.name}. Crafted with care in Dhaka.
        </footer>
      </div>
    </div>);
}
