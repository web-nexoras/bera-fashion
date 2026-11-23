"use client";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { useAdminAction, useAdminList } from "@/components/admin/admin-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Field, Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/section-heading";
import { fallbackCoupons } from "@/lib/fallback/data";
import { formatBDT, formatDate, titleCase } from "@/lib/utils";
export default function AdminCouponsPage() {
    const queryClient = useQueryClient();
    const { data } = useAdminList(["admin", "coupons"], "coupons", fallbackCoupons);
    const action = useAdminAction();
    const [overrides, setOverrides] = useState(null);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        code: "",
        type: "percentage",
        value: 10,
        minimumOrderAmount: 0,
        maximumDiscount: 0,
        expiresAt: "",
        usageLimit: 100,
        isActive: true,
    });
    const coupons = overrides ?? data.items;
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return coupons.filter((coupon) => !term || coupon.code.toLowerCase().includes(term));
    }, [coupons, search]);
    const save = (event) => {
        event.preventDefault();
        const code = form.code.trim().toUpperCase();
        if (!code) {
            toast.error("A coupon code is required.");
            return;
        }
        if (!form.expiresAt) {
            toast.error("Choose an expiry date.");
            return;
        }
        const body = {
            code,
            type: form.type,
            value: Number(form.value),
            minimumOrderAmount: Number(form.minimumOrderAmount),
            maximumDiscount: form.type === "percentage" ? Number(form.maximumDiscount) || undefined : undefined,
            usageLimit: Number(form.usageLimit) || undefined,
            expiresAt: new Date(`${form.expiresAt}T23:59:59`).toISOString(),
            isActive: form.isActive,
        };
        action.mutate({ path: "coupons", method: "POST", body }, {
            onSuccess: (created) => {
                setOverrides((current) => [
                    {
                        ...body,
                        _id: created?._id ?? `cpn_${Date.now()}`,
                        usedCount: 0,
                    },
                    ...(current ?? coupons),
                ]);
                toast.success(`Coupon ${code} created.`);
                void queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
                setOpen(false);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    const toggle = (coupon) => {
        const isActive = !coupon.isActive;
        action.mutate({ path: `coupons/${coupon._id}`, method: "PUT", body: { isActive } }, {
            onSuccess: () => {
                setOverrides((current) => (current ?? coupons).map((item) => (item._id === coupon._id ? { ...item, isActive } : item)));
                toast.success(`Coupon ${coupon.code} ${isActive ? "activated" : "paused"}.`);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Coupons" description="Create and monitor promotional discounts." action={<Button onClick={() => setOpen(true)}><Plus className="size-4"/> New coupon</Button>}/>

      <Card>
        <CardHeader title="All coupons" description={`${filtered.length} coupons`}/>
        <CardBody className="border-b border-ink-100">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search coupon code" className="pl-10" aria-label="Search coupons"/>
          </div>
        </CardBody>
        <DataTable columns={[
            { key: "code", label: "Code" },
            { key: "discount", label: "Discount" },
            { key: "minimum", label: "Minimum", align: "right" },
            { key: "usage", label: "Usage", align: "center" },
            { key: "expires", label: "Expires" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={filtered.map((coupon) => ({
            code: <span className="font-mono font-semibold text-ink-900">{coupon.code}</span>,
            discount: (<div>
                <p className="font-semibold text-ink-800">
                  {coupon.type === "percentage" ? `${coupon.value}%` : formatBDT(coupon.value)}
                </p>
                <p className="text-[11px] text-ink-400">{titleCase(coupon.type)}</p>
              </div>),
            minimum: coupon.minimumOrderAmount ? formatBDT(coupon.minimumOrderAmount) : "—",
            usage: `${coupon.usedCount ?? 0}${coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}`,
            expires: formatDate(coupon.expiresAt),
            status: (<Badge status={coupon.isActive ? "active" : "inactive"} dot/>),
            actions: (<Button variant={coupon.isActive ? "outline" : "secondary"} size="sm" onClick={() => toggle(coupon)}>
                {coupon.isActive ? "Pause" : "Activate"}
              </Button>),
        }))} empty="No coupons found."/>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="New coupon" description="Offer a discount to customers at checkout.">
        <form onSubmit={save} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Code" required>
              <Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="SAVE20" className="uppercase"/>
            </Field>
            <Field label="Discount type" required>
              <Select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </Select>
            </Field>
            <Field label={form.type === "percentage" ? "Percentage (%)" : "Amount (BDT)"} required>
              <Input type="number" min={1} value={form.value} onChange={(event) => setForm({ ...form, value: Number(event.target.value) })}/>
            </Field>
            <Field label="Minimum order (BDT)">
              <Input type="number" min={0} value={form.minimumOrderAmount} onChange={(event) => setForm({ ...form, minimumOrderAmount: Number(event.target.value) })}/>
            </Field>
            <Field label="Maximum discount (BDT)" hint="Percentage coupons only">
              <Input type="number" min={0} disabled={form.type !== "percentage"} value={form.maximumDiscount} onChange={(event) => setForm({ ...form, maximumDiscount: Number(event.target.value) })}/>
            </Field>
            <Field label="Usage limit">
              <Input type="number" min={1} value={form.usageLimit} onChange={(event) => setForm({ ...form, usageLimit: Number(event.target.value) })}/>
            </Field>
            <Field label="Expires on" required className="sm:col-span-2">
              <Input type="date" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })}/>
            </Field>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="size-4 accent-brand-700"/>
            Coupon is active
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={action.isPending}>Create coupon</Button>
          </div>
        </form>
      </Modal>
    </div>);
}
