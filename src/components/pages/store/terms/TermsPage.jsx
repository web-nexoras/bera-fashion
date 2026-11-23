import { PageHeading } from "@/components/ui/section-heading";
import { Card, CardBody } from "@/components/ui/card";
export const dynamic = "force-static";
const sections = [
    {
        title: "Using our store",
        body: "By placing an order or creating an account with BERA FASHION, you confirm that the information you provide is accurate and that you are eligible to enter into a purchase agreement. We may decline or cancel orders where details cannot be verified.",
    },
    {
        title: "Pricing and availability",
        body: "All prices are shown in Bangladeshi Taka (BDT) and include applicable taxes unless stated otherwise. Product availability, colours and specifications may change. If an item becomes unavailable after your order is placed, we will contact you with options for a replacement or a full refund.",
    },
    {
        title: "Orders, delivery and returns",
        body: "Order confirmation is sent once your payment is authorised. Delivery timelines are estimates and may vary by location. Returns are accepted within 14 days of delivery for unused items in original condition, subject to our returns policy.",
    },
    {
        title: "Your account",
        body: "You are responsible for keeping your account credentials secure and for all activity carried out under your account. Notify us immediately at hello@berafashion.com if you believe your account has been compromised.",
    },
    {
        title: "Changes to these terms",
        body: "We may update these terms as our store evolves. The current version is always available on this page, and continued use of the store after an update constitutes acceptance of the revised terms.",
    },
];
export default function TermsPage() {
    return (<div className="container-x animate-fade-up py-14 sm:py-20">
      <PageHeading title="Terms of Service" description="The ground rules for shopping with BERA FASHION."/>
      <div className="mt-8 max-w-3xl space-y-4">
        {sections.map((section) => (<Card key={section.title}>
            <CardBody className="space-y-2">
              <h2 className="font-display text-xl font-bold text-ink-900">{section.title}</h2>
              <p className="text-sm leading-7 text-ink-500">{section.body}</p>
            </CardBody>
          </Card>))}
      </div>
      <p className="mt-8 text-xs text-ink-400">Last updated November 2026 · BERA FASHION</p>
    </div>);
}
