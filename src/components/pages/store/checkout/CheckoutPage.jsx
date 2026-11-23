"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, CreditCard, Lock, MapPin, Plus, RotateCcw, ShieldCheck, TicketPercent, Truck, Wallet, } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { useCart } from "@/features/cart/context/CartContext.jsx";
import { OrderSummary } from "@/components/store/order-summary";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/section-heading";
import { getAddresses } from "@/api/account.js";
import { checkout } from "@/api/orders.js";
import { BANGLADESH_DIVISIONS } from "@/lib/constants";
import { cn, formatBDT } from "@/lib/utils";
const checkoutSchema = z.object({
    recipientName: z.string().trim().min(2, "Enter the recipient's name"),
    phone: z
        .string()
        .trim()
        .min(10, "Enter a valid phone number")
        .regex(/^[0-9+\-\s()]+$/, "Use digits only"),
    addressLine1: z.string().trim().min(3, "Enter your street address"),
    addressLine2: z.string().trim().max(120, "This field is too long").optional(),
    city: z.string().trim().min(1, "Enter your city or area"),
    district: z.string().trim().min(1, "Enter your district"),
    division: z.string().min(1, "Select a division"),
    postalCode: z.string().trim().max(10, "Invalid postal code").optional(),
    paymentMethod: z.enum(["cod", "sslcommerz"]),
    couponCode: z.string().trim().optional(),
    notes: z.string().trim().max(500, "Please keep notes under 500 characters").optional(),
});
function StepHeader({ step, title, description }) {
    return (<div className="flex items-start gap-3 border-b border-ink-100 px-5 py-4">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white shadow-soft">
        {step}
      </span>
      <div>
        <h2 className="font-display text-lg font-bold text-ink-900">{title}</h2>
        <p className="mt-0.5 text-xs text-ink-500">{description}</p>
      </div>
    </div>);
}
export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { cart, summary, isLoading: cartLoading, applyCoupon, removeCoupon, clearCart, } = useCart();
    const [selectedAddressId, setSelectedAddressId] = useState("new");
    const autoAppliedAddress = useRef(false);
    const [couponInput, setCouponInput] = useState("");
    const [couponBusy, setCouponBusy] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, reset, getValues, setValue, control, setError, clearErrors, formState: { errors }, } = useForm({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            recipientName: "",
            phone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            district: "",
            division: "Dhaka",
            postalCode: "",
            paymentMethod: "cod",
            couponCode: "",
            notes: "",
        },
    });
    const paymentMethod = useWatch({ control, name: "paymentMethod" });
    const addressesQuery = useQuery({
        queryKey: ["addresses"],
        enabled: isAuthenticated,
        queryFn: async () => {
            const envelope = await getAddresses();
            if (!envelope.success) {
                throw new Error(envelope.message ?? "Unable to load saved addresses");
            }
            return envelope.data ?? [];
        },
    });
    const addresses = useMemo(() => addressesQuery.data ?? [], [addressesQuery.data]);
    const applyAddress = useCallback((address) => {
        setSelectedAddressId(address._id);
        reset({
            ...getValues(),
            recipientName: address.recipientName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 ?? "",
            city: address.city,
            district: address.district,
            division: address.division,
            postalCode: address.postalCode ?? "",
        });
    }, [getValues, reset]);
    useEffect(() => {
        if (autoAppliedAddress.current || (selectedAddressId !== "new" && selectedAddressId !== ""))
            return;
        const address = addresses.find((item) => item.isDefault) ?? addresses[0];
        if (address) {
            autoAppliedAddress.current = true;
            // One-time hydration of the form from the saved address after the query resolves.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            applyAddress(address);
        }
    }, [addresses, selectedAddressId, applyAddress]);
    useEffect(() => {
        if (user?.name && !getValues("recipientName"))
            setValue("recipientName", user.name);
        if (user?.phone && !getValues("phone"))
            setValue("phone", user.phone);
    }, [user, getValues, setValue]);
    useEffect(() => {
        if (!authLoading && !cartLoading && !isAuthenticated && cart.items.length > 0) {
            toast.info("Create an account to continue with your order.");
            router.replace("/register?next=%2Fcheckout");
        }
    }, [authLoading, cartLoading, isAuthenticated, cart.items.length, router]);
    const redeemCoupon = async () => {
        const value = couponInput.trim();
        if (!value || couponBusy)
            return;
        setCouponBusy(true);
        const ok = await applyCoupon(value);
        if (ok) {
            setCouponInput("");
            setValue("couponCode", value.toUpperCase());
        }
        setCouponBusy(false);
    };
    const onSubmit = async (values) => {
        if (!cart.items.length) {
            toast.error("Your bag is empty");
            return;
        }
        setSubmitting(true);
        clearErrors("root");
        const selected = addresses.find((address) => address._id === selectedAddressId);
        const shippingAddress = {
            _id: selected?._id ?? "",
            label: selected?.label ?? "home",
            recipientName: values.recipientName,
            phone: values.phone,
            addressLine1: values.addressLine1,
            addressLine2: values.addressLine2 || undefined,
            city: values.city,
            district: values.district,
            division: values.division,
            postalCode: values.postalCode || undefined,
            isDefault: selected?.isDefault ?? false,
        };
        const envelope = await checkout({
            shippingAddress,
            paymentMethod: values.paymentMethod,
            couponCode: values.couponCode || cart.appliedCoupon?.code || undefined,
            notes: values.notes || undefined,
        });
        if (!envelope.success || !envelope.data?.order) {
            const details = Array.isArray(envelope.errors)
                ? envelope.errors
                    .map((entry) => {
                    if (typeof entry === "string")
                        return entry;
                    if (entry && typeof entry === "object" && "message" in entry) {
                        const message = entry.message;
                        return typeof message === "string" ? message : null;
                    }
                    return null;
                })
                    .filter((entry) => Boolean(entry))
                : [];
            const message = [envelope.message, ...details].filter(Boolean).join(" · ");
            setError("root", { message: message || "We couldn't place your order. Please try again." });
            toast.error(envelope.message ?? "Could not place your order");
            setSubmitting(false);
            return;
        }
        toast.success(envelope.message || "Order placed successfully");
        await clearCart();
        if (envelope.data.paymentUrl) {
            window.location.assign(envelope.data.paymentUrl);
            return;
        }
        router.push(`/orders/${envelope.data.order._id}?placed=1`);
    };
    if (cartLoading || authLoading) {
        return (<div className="container-x py-10 sm:py-14">
        <PageHeading title="Checkout" description="Preparing your secure checkout…"/>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            {[0, 1, 2].map((index) => (<Card key={index} className="h-64 p-5">
                <Skeleton className="mb-5 h-6 w-1/3"/>
                <Skeleton className="mb-3 h-11 w-full"/>
                <Skeleton className="mb-3 h-11 w-full"/>
                <Skeleton className="h-11 w-2/3"/>
              </Card>))}
          </div>
          <Card className="h-96 p-5">
            <Skeleton className="mb-5 h-6 w-1/2"/>
            <Skeleton className="mb-3 h-4 w-full"/>
            <Skeleton className="mb-3 h-4 w-4/5"/>
            <Skeleton className="mt-8 h-12 w-full"/>
          </Card>
        </div>
      </div>);
    }
    if (!cart.items.length) {
        return (<div className="container-x py-10 sm:py-14">
        <PageHeading title="Checkout"/>
        <div className="surface">
          <EmptyState icon={<Lock className="size-6"/>} title="Nothing to check out" description="Add a few pieces to your bag and come back to complete your order." action={<ButtonLink href="/products" size="lg">
                Browse products
              </ButtonLink>} className="py-24"/>
        </div>
      </div>);
    }
    if (!isAuthenticated) {
        return (<div className="container-x py-10 sm:py-14">
        <PageHeading title="Create an account to order" description="Sign up to continue to checkout. Your bag will be waiting for you." />
        <div className="surface flex flex-col items-center gap-4 px-6 py-12 text-center">
          <p className="max-w-md text-sm text-ink-500">You&apos;ll return to checkout after creating your account and can finish placing your order there.</p>
          <ButtonLink href="/register?next=%2Fcheckout" size="lg">Create your account</ButtonLink>
        </div>
      </div>);
    }
    return (<div className="container-x py-10 sm:py-14">
      <PageHeading title="Checkout" description="A few details and your order is on its way." action={<Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 transition-colors hover:text-brand-700">
            <ArrowLeft className="size-4"/> Back to bag
          </Link>}/>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Card className="overflow-hidden">
            <StepHeader step={1} title="Delivery address" description="Where should we send your order?"/>
            <CardBody className="space-y-5">
              {isAuthenticated && (<div>
                  <div className="mb-2.5 flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Saved addresses</p>
                    {addressesQuery.isFetching && <span className="text-[11px] text-ink-400">Loading…</span>}
                  </div>
                  {authLoading || addressesQuery.isPending ? (<div className="grid gap-2 sm:grid-cols-2">
                      <Skeleton className="h-24"/>
                      <Skeleton className="h-24"/>
                    </div>) : addresses.length ? (<div className="grid gap-2 sm:grid-cols-2">
                      {addresses.map((address) => {
                    const active = selectedAddressId === address._id;
                    return (<button key={address._id} type="button" onClick={() => applyAddress(address)} className={cn("rounded-xl border p-3 text-left transition-all", active
                            ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                            : "border-ink-200 bg-white hover:border-brand-300")}>
                            <div className="flex items-center justify-between gap-2">
                              <Badge tone={active ? "brand" : "neutral"}>{address.label}</Badge>
                              {address.isDefault && <span className="text-[10px] font-semibold text-ink-400">Default</span>}
                            </div>
                            <p className="mt-2 truncate text-sm font-bold text-ink-800">{address.recipientName}</p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">
                              {address.addressLine1}, {address.city}, {address.district}
                            </p>
                          </button>);
                })}
                    </div>) : null}

                  <button type="button" onClick={() => setSelectedAddressId("new")} className={cn("mt-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold transition-colors", selectedAddressId === "new" ? "text-brand-700" : "text-ink-500 hover:text-brand-700")}>
                    <Plus className="size-3.5"/> Use a new address
                  </button>
                </div>)}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Recipient name" required error={errors.recipientName?.message}>
                  <Input {...register("recipientName")} placeholder="Full name" autoComplete="name"/>
                </Field>
                <Field label="Phone number" required error={errors.phone?.message}>
                  <Input {...register("phone")} placeholder="01XXXXXXXXX" inputMode="tel" autoComplete="tel"/>
                </Field>
                <Field label="Address line 1" required error={errors.addressLine1?.message} className="sm:col-span-2">
                  <Input {...register("addressLine1")} placeholder="House, flat, street" autoComplete="address-line1"/>
                </Field>
                <Field label="Address line 2" error={errors.addressLine2?.message} className="sm:col-span-2">
                  <Input {...register("addressLine2")} placeholder="Area, landmark (optional)" autoComplete="address-line2"/>
                </Field>
                <Field label="City / Area" required error={errors.city?.message}>
                  <Input {...register("city")} placeholder="e.g. Banani" autoComplete="address-level2"/>
                </Field>
                <Field label="District" required error={errors.district?.message}>
                  <Input {...register("district")} placeholder="e.g. Dhaka" autoComplete="address-level3"/>
                </Field>
                <Field label="Division" required error={errors.division?.message}>
                  <Select {...register("division")} autoComplete="address-level1">
                    {BANGLADESH_DIVISIONS.map((division) => (<option key={division} value={division}>
                        {division}
                      </option>))}
                  </Select>
                </Field>
                <Field label="Postal code" error={errors.postalCode?.message}>
                  <Input {...register("postalCode")} placeholder="e.g. 1213" inputMode="numeric" autoComplete="postal-code"/>
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card className="overflow-hidden">
            <StepHeader step={2} title="Payment method" description="Choose how you'd like to pay."/>
            <CardBody className="grid gap-3 sm:grid-cols-2">
              <label className="cursor-pointer">
                <input type="radio" value="cod" {...register("paymentMethod")} className="sr-only"/>
                <div className={cn("flex h-full items-start gap-3 rounded-xl border p-4 transition-all", paymentMethod === "cod"
            ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
            : "border-ink-200 bg-white hover:border-brand-300")}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                    <Wallet className="size-5"/>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink-900">Cash on delivery</span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                      Pay in cash when your order arrives at your door.
                    </span>
                  </span>
                  <span className={cn("mt-1 size-4 shrink-0 rounded-full border-2", paymentMethod === "cod" ? "border-brand-600 bg-brand-600 ring-2 ring-brand-100" : "border-ink-300")}/>
                </div>
              </label>

              <label className="cursor-pointer">
                <input type="radio" value="sslcommerz" {...register("paymentMethod")} className="sr-only"/>
                <div className={cn("flex h-full items-start gap-3 rounded-xl border p-4 transition-all", paymentMethod === "sslcommerz"
            ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
            : "border-ink-200 bg-white hover:border-brand-300")}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm">
                    <CreditCard className="size-5"/>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-ink-900">SSLCommerz</span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                      Secure online payment via cards, bKash and mobile banking.
                    </span>
                  </span>
                  <span className={cn("mt-1 size-4 shrink-0 rounded-full border-2", paymentMethod === "sslcommerz"
            ? "border-brand-600 bg-brand-600 ring-2 ring-brand-100"
            : "border-ink-300")}/>
                </div>
              </label>
            </CardBody>
          </Card>

          <Card className="overflow-hidden">
            <StepHeader step={3} title="Review & place order" description="Last touches before we pack your order."/>
            <CardBody className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-700">Coupon code</label>
                <div className="flex gap-2">
                  <Input value={couponInput} onChange={(event) => setCouponInput(event.target.value.toUpperCase())} onKeyDown={(event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                void redeemCoupon();
            }
        }} placeholder="Optional · e.g. SAVE20" aria-label="Coupon code" disabled={couponBusy}/>
                  <Button type="button" variant="secondary" onClick={() => void redeemCoupon()} loading={couponBusy} disabled={!couponInput.trim()} className="shrink-0">
                    <TicketPercent className="size-4"/> Apply
                  </Button>
                </div>
                {cart.appliedCoupon && (<p className="mt-2 text-xs font-semibold text-emerald-600">
                    {cart.appliedCoupon.code} is applied — {formatBDT(summary.discountAmount)} off.
                  </p>)}
              </div>

              <Field label="Order notes" hint="Delivery instructions or a note for our team (optional)." error={errors.notes?.message}>
                <Textarea {...register("notes")} placeholder="e.g. Please call before delivery…"/>
              </Field>

              {errors.root?.message && (<div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 size-4 shrink-0"/>
                  <span>{errors.root.message}</span>
                </div>)}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-brand-50/60 px-4 py-3.5 text-[11px] font-semibold text-brand-800">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4"/> Secure checkout</span>
                <span className="inline-flex items-center gap-1.5"><Truck className="size-4"/> Fast delivery</span>
                <span className="inline-flex items-center gap-1.5"><RotateCcw className="size-4"/> Easy returns</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="size-4"/> Nationwide shipping</span>
              </div>
            </CardBody>
          </Card>
        </form>

        <div className="lg:sticky lg:top-24">
          <OrderSummary summary={summary} appliedCoupon={cart.appliedCoupon} onRemoveCoupon={removeCoupon} action={<Button type="submit" form="checkout-form" size="lg" loading={submitting} className="w-full">
                {submitting ? "Placing order…" : `Place order · ${formatBDT(summary.total)}`}
              </Button>}>
            <div className="rounded-xl bg-ink-50 px-3 py-2.5 text-[11px] leading-relaxed text-ink-500">
              <Lock className="mr-1 inline size-3"/>
              By placing this order you agree to our terms and returns policy.
            </div>
          </OrderSummary>
        </div>
      </div>
    </div>);
}
