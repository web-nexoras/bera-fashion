import { PageHeading } from "@/components/ui/section-heading";
import { Card, CardBody } from "@/components/ui/card";
export const dynamic = "force-static";
const sections = [
    {
        title: "What we collect",
        body: "We collect the details needed to run your account and fulfil your orders: your name, email address, phone number, delivery addresses, order history and the items you save to your wishlist. Payment details are handled by our payment provider and are never stored on our servers.",
    },
    {
        title: "How we use it",
        body: "Your information is used to process and deliver orders, provide customer support, prevent fraud and — with your consent — send updates about new collections and offers. You can change your communication preferences at any time in your account settings.",
    },
    {
        title: "Cookies and sessions",
        body: "We use a secure, httpOnly session cookie to keep you signed in and to remember your cart. These cookies are essential for the store to work and are not used for cross-site advertising.",
    },
    {
        title: "Sharing and retention",
        body: "We share only the data required with trusted service providers such as payment processors, couriers and email delivery services. We retain account and order records for as long as needed to meet legal, accounting and customer-service obligations.",
    },
    {
        title: "Your choices",
        body: "You can review and update your details in your account panel, request a copy of your data, or ask us to delete your account by contacting hello@berafashion.com. We will respond to verified requests within 30 days.",
    },
];
export default function PrivacyPage() {
    return (<div className="container-x animate-fade-up py-14 sm:py-20">
      <PageHeading title="Privacy Policy" description="How BERA FASHION handles the information you share with us."/>
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
