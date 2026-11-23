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
import { fallbackStoreSettings } from "@/lib/fallback/data";
export default function AdminSettingsPage() {
    const queryClient = useQueryClient();
    const { data } = useAdminQuery(["admin", "settings"], "admin/settings", fallbackStoreSettings);
    const saveSettings = useAdminAction();
    const [form, setForm] = useState(fallbackStoreSettings);
    const [loadedSettings, setLoadedSettings] = useState(null);
    // Adopt fetched settings during render (React's documented "adjust state when
    // props change" pattern) so the form is never one render behind the query.
    if (data && data !== loadedSettings) {
        setLoadedSettings(data);
        setForm(data);
    }
    const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const save = (event) => {
        event.preventDefault();
        if (!form.storeName.trim()) {
            toast.error("A store name is required.");
            return;
        }
        saveSettings.mutate({ path: "admin/settings", method: "PUT", body: form }, {
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
              <Input value={form.storeName} onChange={(event) => set("storeName", event.target.value)}/>
            </Field>
            <Field label="Tagline">
              <Input value={form.tagline} onChange={(event) => set("tagline", event.target.value)}/>
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Contact details" description="Shown on invoices and the contact page"/>
          <CardBody className="grid gap-5 md:grid-cols-2">
            <Field label="Support email">
              <Input type="email" value={form.email} onChange={(event) => set("email", event.target.value)}/>
            </Field>
            <Field label="Phone">
              <Input value={form.phone} onChange={(event) => set("phone", event.target.value)}/>
            </Field>
            <Field label="Address" className="md:col-span-2">
              <Textarea value={form.address} onChange={(event) => set("address", event.target.value)}/>
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Commerce" description="Currency and shipping preferences"/>
          <CardBody className="grid gap-5 md:grid-cols-2">
            <Field label="Currency">
              <Select value={form.currency} onChange={(event) => set("currency", event.target.value)}>
                <option value="BDT">BDT — Bangladeshi Taka</option>
                <option value="USD">USD — US Dollar</option>
              </Select>
            </Field>
            <Field label="Free shipping threshold (BDT)">
              <Input type="number" min={0} value={form.freeShippingThreshold} onChange={(event) => set("freeShippingThreshold", Number(event.target.value))}/>
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Maintenance & announcements" description="Control storefront availability and customer notices"/>
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
            <Field label="Announcement" hint="Displayed as a banner across the storefront">
              <Textarea value={form.announcements} onChange={(event) => set("announcements", event.target.value)} placeholder="e.g. Free delivery on orders above ৳5,000"/>
            </Field>
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
