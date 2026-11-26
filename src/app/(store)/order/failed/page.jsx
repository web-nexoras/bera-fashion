import { AlertCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function OrderFailedPage() {
  return (
    <div className="container-x py-16">
      <Card className="mx-auto max-w-lg p-8 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle className="size-8" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-ink-900">Payment failed</h1>
        <p className="mt-2 text-sm text-ink-500">
          We couldn&apos;t complete your online payment. You can try again from your orders or checkout.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/account/orders" size="lg">View my orders</ButtonLink>
          <ButtonLink href="/checkout" variant="outline" size="lg">Return to checkout</ButtonLink>
        </div>
      </Card>
    </div>
  );
}
