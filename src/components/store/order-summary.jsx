"use client";
import { useState } from "react";
import { CheckCircle2, Tag, TicketPercent, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, formatBDT } from "@/lib/utils";
export function OrderSummary({ summary, appliedCoupon, showCoupon = false, onApplyCoupon, onRemoveCoupon, action, children, className, }) {
    const [code, setCode] = useState("");
    const [applying, setApplying] = useState(false);
    const apply = async () => {
        const value = code.trim();
        if (!value || !onApplyCoupon || applying)
            return;
        setApplying(true);
        const ok = await onApplyCoupon(value);
        if (ok)
            setCode("");
        setApplying(false);
    };
    return (<Card className={cn("overflow-hidden", className)}>
      <div className="border-b border-ink-100 bg-brand-50/50 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">Order summary</h2>
            <p className="mt-0.5 text-xs text-ink-500">
              {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"} in your bag
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
            <Tag className="size-5"/>
          </span>
        </div>
      </div>

      <CardBody className="space-y-4">
        {showCoupon && onApplyCoupon && (<div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-700">Have a coupon?</label>
            <div className="flex gap-2">
              <Input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} onKeyDown={(event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    void apply();
                }
            }} placeholder="Enter code" aria-label="Coupon code" disabled={applying}/>
              <Button type="button" variant="secondary" onClick={() => void apply()} loading={applying} disabled={!code.trim()} className="shrink-0">
                Apply
              </Button>
            </div>
            <p className="mt-1.5 text-[11px] text-ink-400">Try SAVE20 or WELCOME10</p>
          </div>)}

        {appliedCoupon && (<div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
            <span className="inline-flex min-w-0 items-center gap-2 text-xs font-bold text-emerald-800">
              <TicketPercent className="size-4 shrink-0"/>
              <span className="truncate">{appliedCoupon.code}</span>
              <span className="font-medium text-emerald-600">applied</span>
            </span>
            {onRemoveCoupon && (<button type="button" onClick={() => void onRemoveCoupon()} aria-label="Remove coupon" className="rounded-md p-1 text-emerald-700 transition-colors hover:bg-emerald-100">
                <X className="size-3.5"/>
              </button>)}
          </div>)}

        <div className="space-y-2.5 border-t border-dashed border-ink-200 pt-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-ink-500">Subtotal</span>
            <span className="font-semibold text-ink-800">{formatBDT(summary.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-ink-500">Shipping</span>
            {summary.shippingCharge === 0 ? (<span className="font-semibold text-emerald-600">Free</span>) : (<span className="font-semibold text-ink-800">{formatBDT(summary.shippingCharge)}</span>)}
          </div>
          {summary.discountAmount > 0 && (<div className="flex items-center justify-between gap-4">
              <span className="text-ink-500">Discount</span>
              <span className="font-semibold text-emerald-600">− {formatBDT(summary.discountAmount)}</span>
            </div>)}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-4">
          <div>
            <p className="text-sm font-bold text-ink-900">Total</p>
            <p className="text-[11px] text-ink-400">Inclusive of all charges</p>
          </div>
          <p className="font-display text-2xl font-bold text-brand-700">{formatBDT(summary.total)}</p>
        </div>

        {children}

        {action && <div className="pt-1">{action}</div>}

        <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] font-medium text-ink-400">
          <CheckCircle2 className="size-3.5 text-emerald-600"/>
          Secure checkout · Easy returns
        </div>
      </CardBody>
    </Card>);
}
