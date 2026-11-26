"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, ShieldCheck } from "lucide-react";
import { useAdminAction, useAdminQuery } from "@/components/admin/admin-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/section-heading";
const emptySettings = {
    storeName: "",
    storeLogo: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
    currency: "BDT",
    deliveryChargeInsideDhaka: 60,
    deliveryChargeOutsideDhaka: 120,
    sslcommerzEnabled: true,
    codEnabled: true,
    maintenanceMode: false,
};
export default function AdminSettingsPage() {
    const queryClient = useQueryClient();
    const { data } = useAdminQuery(["admin", "settings"], "admin/settings");
    const saveSettings = useAdminAction();
    const [form, setForm] = useState(emptySettings);
    const [loadedSettings, setLoadedSettings] = useState(null);
    // Adopt fetched settings during render (React's documented "adjust state when
    // props change" pattern) so the form is never one render behind the query.
    if (data && data !== loadedSettings) {
        setLoadedSettings(data);
        setForm({
            storeName: data.storeName ?? "",
            storeLogo: data.storeLogo ?? "",
            storeEmail: data.storeEmail ?? "",
            storePhone: data.storePhone ?? "",
            storeAddress: data.storeAddress ?? "",
            currency: data.currency ?? "BDT",
            deliveryChargeInsideDhaka: Number(data.deliveryChargeInsideDhaka ?? 60),
            deliveryChargeOutsideDhaka: Number(data.deliveryChargeOutsideDhaka ?? 120),
            sslcommerzEnabled: data.sslcommerzEnabled ?? true,
            codEnabled: data.codEnabled ?? true,
            maintenanceMode: Boolean(data.maintenanceMode),
        });
    }
    const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const save = (event) => {
        event.preventDefault();
        if (!form.storeName.trim()) {
            toast.error("A store name is required.");
            return;
        }
        const body = {
            storeName: form.storeName.trim(),
            storeLogo: form.storeLogo.trim(),
            ...(form.storeEmail.trim() ? { storeEmail: form.storeEmail.trim() } : {}),
            storePhone: form.storePhone.trim(),
            storeAddress: form.storeAddress.trim(),
            currency: form.currency,
            deliveryChargeInsideDhaka: Number(form.deliveryChargeInsideDhaka) || 0,
            deliveryChargeOutsideDhaka: Number(form.deliveryChargeOutsideDhaka) || 0,
            sslcommerzEnabled: Boolean(form.sslcommerzEnabled),
            codEnabled: Boolean(form.codEnabled),
            maintenanceMode: Boolean(form.maintenanceMode),
        };
        saveSettings.mutate({ path: "admin/settings", method: "PUT", body }, {
            onSuccess: () => {
                toast.success("Store settings saved.");
                void queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Settings" description="Configure your storefront identity and operational preferences." action={<Badge tone="brand" dot>
            <ShieldCheck className="mr-1 size-3"/> Admin access
          </Badge>}/>

      <form onSubmit={save} className="space-y-5">
        <Card>
          <CardHeader title="Store identity" description="How your store appears to customers"/>
          <CardBody className="grid gap-5 md:grid-cols-2">
            <Field label="Store name" required>
              <Input value={form.storeName} onChange={(event) => set("storeName", event.target.value)} placeholder="e.g. BERA FASHION"/>
            </Field>
            <Field label="Store logo URL">
              <Input value={form.storeLogo} onChange={(event) => set("storeLogo", event.target.value)} placeholder="https://res.cloudinary.com/.../logo.png"/>
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Contact details" description="Shown on invoices and the contact page"/>
          <CardBody className="grid gap-5 md:grid-cols-2">
            <Field label="Support email">
              <Input type="email" value={form.storeEmail} onChange={(event) => set("storeEmail", event.target.value)} placeholder="support@berafashion.com"/>
            </Field>
            <Field label="Phone">
              <Input value={form.storePhone} onChange={(event) => set("storePhone", event.target.value)} placeholder="+880 1712-345678"/>
            </Field>
            <Field label="Address" className="md:col-span-2">
              <Textarea value={form.storeAddress} onChange={(event) => set("storeAddress", event.target.value)} placeholder="House 12, Road 5, Dhanmondi, Dhaka 1205"/>
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Commerce & payments" description="Currency, delivery charges and payment gateways"/>
          <CardBody className="grid gap-5 md:grid-cols-3">
            <Field label="Currency">
              <Select value={form.currency} onChange={(event) => set("currency", event.target.value)}>
                <option value="BDT">BDT — Bangladeshi Taka</option>
                <option value="USD">USD — US Dollar</option>
              </Select>
            </Field>
            <Field label="Delivery inside Dhaka (BDT)">
              <Input type="number" min={0} value={form.deliveryChargeInsideDhaka} onChange={(event) => set("deliveryChargeInsideDhaka", Number(event.target.value))} placeholder="60"/>
            </Field>
            <Field label="Delivery outside Dhaka (BDT)">
              <Input type="number" min={0} value={form.deliveryChargeOutsideDhaka} onChange={(event) => set("deliveryChargeOutsideDhaka", Number(event.target.value))} placeholder="120"/>
            </Field>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-ink-200 p-4 transition-colors hover:border-brand-300 md:col-span-3">
              <span>
                <span className="block text-sm font-semibold text-ink-800">Cash on delivery (COD)</span>
                <span className="mt-0.5 block text-xs text-ink-500">Allow customers to pay in cash upon delivery.</span>
              </span>
              <input type="checkbox" checked={form.codEnabled} onChange={(event) => set("codEnabled", event.target.checked)} className="size-4 accent-brand-700"/>
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-ink-200 p-4 transition-colors hover:border-brand-300 md:col-span-3">
              <span>
                <span className="block text-sm font-semibold text-ink-800">SSLCommerz online payment</span>
                <span className="mt-0.5 block text-xs text-ink-500">Allow cards, bKash, Nagad and mobile banking via SSLCommerz.</span>
              </span>
              <input type="checkbox" checked={form.sslcommerzEnabled} onChange={(event) => set("sslcommerzEnabled", event.target.checked)} className="size-4 accent-brand-700"/>
            </label>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Maintenance" description="Control storefront availability"/>
          <CardBody className="space-y-5">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-ink-200 p-4 transition-colors hover:border-brand-300">
              <span>
                <span className="block text-sm font-semibold text-ink-800">Maintenance mode</span>
                <span className="mt-0.5 block text-xs text-ink-500">
                  Temporarily pause orders while you update the store.
                </span>
              </span>
              <span className="relative shrink-0">
                <input type="checkbox" checked={form.maintenanceMode} onChange={(event) => set("maintenanceMode", event.target.checked)} className="peer sr-only"/>
                <span className="block h-6 w-11 rounded-full bg-ink-200 transition-colors peer-checked:bg-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300"/>
                <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"/>
              </span>
            </label>
            {form.maintenanceMode && (<Badge tone="warning" dot>Maintenance mode is currently enabled</Badge>)}
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" loading={saveSettings.isPending}>
            <Save className="size-4"/> Save settings
          </Button>
        </div>
      </form>
    </div>);
}
