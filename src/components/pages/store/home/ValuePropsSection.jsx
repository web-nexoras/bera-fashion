import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const propsList = [
  { icon: Truck, title: "Islandwide delivery", text: "Fast, reliable shipping right to your door." },
  { icon: ShieldCheck, title: "Secure payments", text: "Cash on delivery or encrypted SSLCommerz checkout." },
  { icon: RotateCcw, title: "7-day returns", text: "Easy exchanges if the fit isn't quite right." },
  { icon: Headphones, title: "Personal support", text: "Real people, ready to help you every day." },
];

export function ValuePropsSection() {
  return (
    <section className="container-x py-18 sm:py-24">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {propsList.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="surface card-3d p-6 text-center"
          >
            <div className="mx-auto flex size-13 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-700 shadow-xs ring-1 ring-brand-200/60">
              <Icon className="size-5" />
            </div>
            <h3 className="mt-4 text-sm font-bold text-ink-900">{title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
