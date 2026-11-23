import Image from "next/image";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/store/contact-form";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";
import { photo } from "@/lib/fallback/data";
export const dynamic = "force-static";
const infoCards = [
    { icon: MapPin, label: "Visit us", lines: [SITE.address] },
    { icon: Mail, label: "Email us", lines: [SITE.email, "We reply within 24 hours"] },
    { icon: Phone, label: "Call us", lines: [SITE.phone, "Sat–Thu, 10am – 7pm"] },
    { icon: Clock3, label: "Support hours", lines: ["Saturday – Thursday", "10:00am – 7:00pm (BST)"] },
];
export default function ContactPage() {
    return (<>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 opacity-20">
          <Image src={photo("photo-1521737711867-e3b97375f902", 1400)} alt="Our team" fill sizes="100vw" className="object-cover"/>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/90 to-brand-800/40"/>
        <div className="container-x relative">
          <Badge tone="gold">We&apos;re here to help</Badge>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Get in touch</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-50/80">
            Questions about sizing, an order or a collaboration? Drop us a note and we&apos;ll get back
            to you as soon as we can.
          </p>
        </div>
      </section>

      {/* Info cards */}
      <section className="container-x -mt-8 relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {infoCards.map(({ icon: Icon, label, lines }) => (<div key={label} className="surface p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon className="size-5"/>
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-ink-400">{label}</p>
            {lines.map((line) => (<p key={line} className="mt-1.5 text-sm font-semibold leading-relaxed text-ink-800">
                {line}
              </p>))}
          </div>))}
      </section>

      {/* Form + aside */}
      <section className="container-x grid gap-8 py-14 sm:py-20 lg:grid-cols-[1.4fr_0.6fr]">
        <ContactForm />

        <aside className="space-y-5">
          <div className="relative min-h-64 overflow-hidden rounded-2xl">
            <Image src={photo("photo-1441986300917-64674bd600d8", 900)} alt="BERA store" fill sizes="(max-width: 1024px) 100vw, 30vw" className="object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent"/>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-xl font-bold text-white">BERA Studio</p>
              <p className="mt-1 text-xs text-brand-50/80">Banani, Dhaka — come say hello.</p>
            </div>
          </div>

          <div className="rounded-2xl bg-brand-50 p-6">
            <MessageCircle className="size-6 text-brand-700"/>
            <h2 className="mt-4 font-display text-xl font-bold text-ink-900">Prefer a quick answer?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Check our size guide and delivery notes — most common questions are answered there.
            </p>
            <p className="mt-4 text-xs font-semibold text-brand-700">{SITE.phone}</p>
          </div>
        </aside>
      </section>
    </>);
}
