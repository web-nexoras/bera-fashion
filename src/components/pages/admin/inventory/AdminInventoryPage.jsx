"use client";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PackageSearch, Search, SlidersHorizontal } from "lucide-react";
import { useAdminAction, useAdminList } from "@/components/admin/admin-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { PageHeading } from "@/components/ui/section-heading";
import { titleCase } from "@/lib/utils";
export default function AdminInventoryPage() {
    const queryClient = useQueryClient();
    const { data } = useAdminList(["admin", "inventory"], "inventory?limit=100");
    const adjust = useAdminAction();
    const [overrides, setOverrides] = useState(null);
    const [tab, setTab] = useState("all");
    const [search, setSearch] = useState("");
    const [target, setTarget] = useState(null);
    const [form, setForm] = useState({ quantity: 1, type: "increment", notes: "" });
    const items = overrides ?? data.items;
    const lowStock = items.filter((item) => item.stock > 0 && item.stock <= (item.lowStockThreshold ?? 8));
    const outOfStock = items.filter((item) => item.stock === 0);
    const visible = useMemo(() => {
        const base = tab === "low" ? lowStock : tab === "out" ? outOfStock : items;
        const term = search.trim().toLowerCase();
        return base.filter((item) => !term ||
            item.sku.toLowerCase().includes(term) ||
            (item.productName ?? "").toLowerCase().includes(term));
    }, [tab, lowStock, outOfStock, items, search]);
    const openAdjust = (item) => {
        setTarget(item);
        setForm({ quantity: 1, type: "increment", notes: "" });
    };
    const submitAdjust = (event) => {
        event.preventDefault();
        if (!target)
            return;
        const quantity = Math.max(1, Number(form.quantity) || 1);
        adjust.mutate({
            path: "inventory/adjust",
            method: "POST",
            body: {
                variantId: target._id,
                quantity,
                type: "adjustment",
                direction: form.type === "decrement" ? "decrease" : "increase",
                notes: form.notes.trim() || undefined,
            },
        }, {
            onSuccess: () => {
                const delta = form.type === "decrement" ? -quantity : quantity;
                setOverrides((current) => (current ?? items).map((item) => item._id === target._id
                    ? { ...item, stock: Math.max(0, item.stock + delta) }
                    : item));
                toast.success(`Stock updated for ${target.sku}.`);
                void queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
                void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
                setTarget(null);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    const table = (rows) => (<Card className="rounded-t-none border-t-0">
      <DataTable columns={[
            { key: "product", label: "Product" },
            { key: "variant", label: "Variant" },
            { key: "sku", label: "SKU" },
            { key: "stock", label: "Stock", align: "center" },
            { key: "threshold", label: "Threshold", align: "center" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={rows.map((item) => ({
            product: (<div className="flex items-center gap-3">
              {item.productImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.productImage} alt="" className="size-10 rounded-lg object-cover"/>) : (<span className="flex size-10 items-center justify-center rounded-lg bg-ink-100 text-ink-500">
                  <PackageSearch className="size-4"/>
                </span>)}
              <p className="max-w-64 truncate font-semibold text-ink-900">{item.productName ?? "Product"}</p>
            </div>),
            variant: (<span className="text-xs text-ink-600">
              {[item.size, item.color].filter(Boolean).join(" · ") || "Standard"}
            </span>),
            sku: <span className="font-mono text-xs text-ink-500">{item.sku}</span>,
            stock: (<span className={`font-bold ${item.stock === 0 ? "text-red-600" : item.stock <= 8 ? "text-amber-600" : "text-ink-800"}`}>
              {item.stock}
            </span>),
            threshold: item.lowStockThreshold ?? 5,
            status: (<Badge status={item.stock === 0 ? "out_of_stock" : item.stock <= (item.lowStockThreshold ?? 8) ? "pending" : "active"} dot>
              {item.stock === 0 ? "Out of stock" : item.stock <= (item.lowStockThreshold ?? 8) ? "Low stock" : "In stock"}
            </Badge>),
            actions: (<Button variant="secondary" size="sm" onClick={() => openAdjust(item)}>
              Adjust
            </Button>),
        }))} empty="No inventory items match this view."/>
    </Card>);
    return (<div className="space-y-6">
      <PageHeading title="Inventory" description="Monitor stock levels and adjust quantities across all variants."/>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
            { label: "Total variants", value: items.length, tone: "text-ink-900" },
            { label: "Low stock", value: lowStock.length, tone: "text-amber-600" },
            { label: "Out of stock", value: outOfStock.length, tone: "text-red-600" },
        ].map((item) => (<Card key={item.label}>
            <CardBody className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{item.label}</p>
              <p className={`mt-1 font-display text-2xl font-bold ${item.tone}`}>{item.value}</p>
            </CardBody>
          </Card>))}
      </div>

      <Card>
        <CardHeader title="Stock levels" description="Live quantity by product variant" action={<SlidersHorizontal className="size-4 text-ink-400"/>}/>
        <CardBody className="border-b border-ink-100 pb-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product or SKU" className="pl-10" aria-label="Search inventory"/>
            </div>
          </div>
          <Tabs className="mt-3" active={tab} onChange={setTab} items={[
            { id: "all", label: "All", count: items.length, content: null },
            { id: "low", label: "Low stock", count: lowStock.length, content: null },
            { id: "out", label: "Out of stock", count: outOfStock.length, content: null },
        ].map((item) => ({ ...item, content: table(visible) }))}/>
        </CardBody>
      </Card>

      <Modal open={Boolean(target)} onClose={() => setTarget(null)} title="Adjust stock" description={target ? `${target.productName ?? "Product"} · ${target.sku}` : undefined} size="sm">
        <form onSubmit={submitAdjust} className="space-y-5">
          <Field label="Adjustment type" required>
            <Select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              <option value="increment">Increment (receive stock)</option>
              <option value="decrement">Decrement (deduct stock)</option>
            </Select>
          </Field>
          <Field label="Quantity" required>
            <Input type="number" min={1} value={form.quantity} onChange={(event) => setForm({ ...form, quantity: Number(event.target.value) })}/>
          </Field>
          <Field label="Notes" hint="Optional, for your records">
            <Textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="e.g. Warehouse restock"/>
          </Field>
          {target && (<div className="rounded-xl bg-ink-50 p-3 text-xs text-ink-600">
              Current stock: <strong className="text-ink-900">{target.stock}</strong> · {titleCase(form.type)}
            </div>)}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button type="submit" loading={adjust.isPending}>Apply adjustment</Button>
          </div>
        </form>
      </Modal>
    </div>);
}
