"use client";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAdminAction, useAdminQuery } from "@/components/admin/admin-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/section-heading";
import { fallbackBrands } from "@/lib/fallback/data";
import { slugify } from "@/lib/utils";
export default function AdminBrandsPage() {
    const queryClient = useQueryClient();
    const { data } = useAdminQuery(["admin", "brands"], "brands", fallbackBrands);
    const action = useAdminAction();
    const [overrides, setOverrides] = useState(null);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [target, setTarget] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", website: "", isActive: true });
    const brands = overrides ?? data;
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return brands.filter((brand) => !term || brand.name.toLowerCase().includes(term) || brand.slug.includes(term));
    }, [brands, search]);
    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", description: "", website: "", isActive: true });
        setOpen(true);
    };
    const openEdit = (brand) => {
        setEditing(brand);
        setForm({
            name: brand.name,
            description: brand.description ?? "",
            website: brand.website ?? "",
            isActive: brand.isActive,
        });
        setOpen(true);
    };
    const save = (event) => {
        event.preventDefault();
        const name = form.name.trim();
        if (!name) {
            toast.error("A brand name is required.");
            return;
        }
        const body = {
            name,
            slug: slugify(name),
            description: form.description,
            website: form.website || undefined,
            isActive: form.isActive,
        };
        action.mutate(editing
            ? { path: `brands/${editing._id}`, method: "PUT", body }
            : { path: "brands", method: "POST", body }, {
            onSuccess: () => {
                setOverrides((current) => {
                    const list = current ?? brands;
                    if (editing)
                        return list.map((item) => (item._id === editing._id ? { ...item, ...body } : item));
                    return [...list, { ...body, _id: `brd_${Date.now()}`, productCount: 0 }];
                });
                toast.success(editing ? "Brand updated." : "Brand created.");
                void queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
                setOpen(false);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    const remove = () => {
        if (!target)
            return;
        action.mutate({ path: `brands/${target._id}`, method: "DELETE" }, {
            onSuccess: () => {
                setOverrides((current) => (current ?? brands).filter((item) => item._id !== target._id));
                toast.success("Brand deleted.");
                void queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
                setTarget(null);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Brands" description="Manage the labels featured in your store." action={<Button onClick={openCreate}><Plus className="size-4"/> New brand</Button>}/>

      <Card>
        <CardHeader title="All brands" description={`${filtered.length} brands`}/>
        <CardBody className="border-b border-ink-100">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search brands" className="pl-10" aria-label="Search brands"/>
          </div>
        </CardBody>
        <DataTable columns={[
            { key: "name", label: "Brand" },
            { key: "slug", label: "Slug" },
            { key: "products", label: "Products", align: "center" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={filtered.map((brand) => ({
            name: (<div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 font-display text-lg font-bold text-brand-700">
                  {brand.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-ink-900">{brand.name}</p>
                  <p className="max-w-64 truncate text-[11px] text-ink-500">
                    {brand.description ?? brand.website ?? "No description"}
                  </p>
                </div>
              </div>),
            slug: <span className="font-mono text-xs text-ink-500">{brand.slug}</span>,
            products: brand.productCount ?? "—",
            status: <Badge status={brand.isActive ? "active" : "inactive"} dot/>,
            actions: (<div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(brand)} aria-label="Edit brand">
                  <Pencil className="size-4"/>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setTarget(brand)} aria-label="Delete brand">
                  <Trash2 className="size-4 text-red-600"/>
                </Button>
              </div>),
        }))} empty="No brands found."/>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit brand" : "New brand"} description="Brands help customers discover your labels.">
        <form onSubmit={save} className="space-y-5">
          <Field label="Name" required>
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Atelier 21"/>
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Tell customers about this brand"/>
          </Field>
          <Field label="Website" hint="Optional">
            <Input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} placeholder="https://example.com"/>
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="size-4 accent-brand-700"/>
            Active brand
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={action.isPending}>{editing ? "Save changes" : "Create brand"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(target)} onClose={() => setTarget(null)} title="Delete brand" description="Products will remain but lose their brand association." size="sm">
        <div className="space-y-5">
          <p className="text-sm text-ink-600">Delete <strong className="text-ink-900">{target?.name}</strong>?</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={remove} loading={action.isPending}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>);
}
