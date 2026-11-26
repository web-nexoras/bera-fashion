import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams;
  const orderId = typeof params?.orderId === "string" ? params.orderId : "";
  if (orderId) {
    redirect(`/orders/${encodeURIComponent(orderId)}?placed=1`);
  }

  return (
    <div className="container-x py-16">
      <Card className="mx-auto max-w-lg p-8 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-ink-900">Payment successful</h1>
        <p className="mt-2 text-sm text-ink-500">
          Thank you for shopping with BERA FASHION. Your order has been confirmed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/account/orders" size="lg">View my orders</ButtonLink>
          <ButtonLink href="/products" variant="outline" size="lg">Continue shopping</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
