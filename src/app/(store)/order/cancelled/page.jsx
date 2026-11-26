import { XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function OrderCancelledPage() {
  return (
    <div className="container-x py-16">
      <Card className="mx-auto max-w-lg p-8 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <XCircle className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-ink-900">Payment cancelled</h1>
        <p className="mt-2 text-sm text-ink-500">
          Your payment was cancelled. No charge was made, and you can retry anytime from your orders.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/account/orders" size="lg">View my orders</ButtonLink>
          <ButtonLink href="/products" variant="outline" size="lg">Browse products</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
