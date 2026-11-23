import Link from "next/link";
import { ArrowUpRight, Boxes, Clock3, Layers3, RefreshCw, Server, Zap } from "lucide-react";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { SITE } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
export const revalidate = 3600;
const strategies = [
    {
        icon: Layers3,
        name: "SSG — Static Site Generation",
        tone: "success",
        pages: ["/", "/about", "/contact", "/categories"],
        detail: "Rendered once at build time and served as pure static HTML from the edge. Ideal for content that rarely changes: the homepage, brand story and contact details. Configured with dynamic = 'force-static'.",
        code: "export const dynamic = \"force-static\";",
    },
    {
        icon: Server,
        name: "SSR — Server Side Rendering",
        tone: "info",
        pages: ["/products", "/products?search=..."],
        detail: "Rendered fresh on every request so filters, search terms, pagination and stock-aware catalogue data are always current. Configured with dynamic = 'force-dynamic'.",
        code: "export const dynamic = \"force-dynamic\";",
    },
    {
        icon: RefreshCw,
        name: "ISR — Incremental Static Regeneration",
        tone: "warning",
        pages: ["/products/[slug]", "/categories/[slug]"],
        detail: "Statically generated and cached, then regenerated in the background on a timer. Product and category pages stay fast while remaining fresh. Configured with revalidate + generateStaticParams.",
        code: "export const revalidate = 60;",
    },
    {
        icon: Zap,
        name: "CSR — Client Side Rendering",
        tone: "brand",
        pages: ["/cart", "/checkout", "/account/*", "/admin/*"],
        detail: "Interactive dashboards and commerce flows fetch data in the browser through the Next.js BFF using React Query. JWTs stay in httpOnly cookies and never reach client JavaScript.",
        code: '"use client"; // + React Query',
    },
];
export default function RenderingPage() {
    return (<div className="container-x py-14">
      <PageHeading title="Built with every Next.js rendering mode" description="A production reference architecture for BERA FASHION — each strategy is used where it makes the most sense."/>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
            { label: "Rendering strategies", value: "04", icon: Boxes },
            { label: "Route groups", value: "04", icon: Layers3 },
            { label: "BFF route handlers", value: "03", icon: Server },
            { label: "Regeneration window", value: "60s", icon: Clock3 },
        ].map((item) => (<Card key={item.label} className="p-5">
            <item.icon className="mb-3 size-5 text-brand-700"/>
            <p className="font-display text-3xl font-bold text-ink-900">{item.value}</p>
            <p className="mt-1 text-xs font-medium text-ink-500">{item.label}</p>
          </Card>))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {strategies.map((strategy) => (<Card key={strategy.name} className="overflow-hidden">
            <div className="flex items-start gap-4 border-b border-ink-100 bg-brand-50/40 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
                <strategy.icon className="size-5"/>
              </span>
              <div>
                <Badge tone={strategy.tone}>{strategy.name.split(" ")[0]}</Badge>
                <h2 className="mt-2 font-display text-xl font-bold text-ink-900">{strategy.name.split(" — ")[1]}</h2>
              </div>
            </div>
            <CardBody>
              <p className="text-sm leading-relaxed text-ink-600">{strategy.detail}</p>
              <pre className="mt-4 overflow-x-auto rounded-xl bg-ink-900 px-4 py-3 text-xs text-gold-300">
                {strategy.code}
              </pre>
              <div className="mt-4 flex flex-wrap gap-2">
                {strategy.pages.map((page) => (<Link key={page} href={page} className="inline-flex items-center gap-1 rounded-lg border border-ink-200 bg-white px-2.5 py-1.5 font-mono text-[11px] text-ink-600 hover:border-brand-400 hover:text-brand-700">
                    {page} <ArrowUpRight className="size-3"/>
                  </Link>))}
              </div>
            </CardBody>
          </Card>))}
      </div>

      <Card className="mt-8 overflow-hidden bg-brand-900 text-white">
        <CardBody className="p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold-300">Architecture note</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-white">Frontend ↔ Backend contract</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
            ["Express REST API", `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1"} — MongoDB, Redis, JWT, Cloudinary, SSLCommerz.`],
            ["Next.js BFF", "/api/backend/* forwards requests with the httpOnly JWT; /api/auth/* manages secure session cookies."],
            ["Offline resilience", "When the backend is unavailable, a cached local dataset keeps every screen fully functional."],
        ].map(([title, text]) => (<div key={title}>
                <h3 className="text-sm font-bold text-gold-300">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/65">{text}</p>
              </div>))}
          </div>
          <p className="mt-8 text-[11px] text-white/40">Rendered at {formatDateTime(new Date().toISOString())} · {SITE.name}</p>
        </CardBody>
      </Card>
    </div>);
}
