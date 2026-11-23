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
import { fallbackCategories } from "@/lib/fallback/data";
import { slugify } from "@/lib/utils";
export default function AdminCategoriesPage() {
    const queryClient = useQueryClient();
    const { data } = useAdminQuery(["admin", "categories"], "categories", fallbackCategories);
    const action = useAdminAction();
    const [overrides, setOverrides] = useState(null);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [target, setTarget] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", isActive: true });
    const categories = overrides ?? data;
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return categories.filter((category) => !term || category.name.toLowerCase().includes(term) || category.slug.includes(term));
    }, [categories, search]);
    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", description: "", isActive: true });
        setOpen(true);
    };
    const openEdit = (category) => {
        setEditing(category);
        setForm({
            name: category.name,
            description: category.description ?? "",
            isActive: category.isActive,
        });
        setOpen(true);
    };
    const save = (event) => {
        event.preventDefault();
        const name = form.name.trim();
        if (!name) {
            toast.error("A category name is required.");
            return;
        }
        const body = { name, slug: slugify(name), description: form.description, isActive: form.isActive };
        action.mutate(editing
            ? { path: `categories/${editing._id}`, method: "PUT", body }
            : { path: "categories", method: "POST", body }, {
            onSuccess: () => {
                setOverrides((current) => {
                    const list = current ?? categories;
                    if (editing) {
                        return list.map((item) => item._id === editing._id ? { ...item, ...body } : item);
                    }
                    return [...list, { ...body, _id: `cat_${Date.now()}`, productCount: 0 }];
                });
                toast.success(editing ? "Category updated." : "Category created.");
                void queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
                setOpen(false);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    const remove = () => {
        if (!target)
            return;
        action.mutate({ path: `categories/${target._id}`, method: "DELETE" }, {
            onSuccess: () => {
                setOverrides((current) => (current ?? categories).filter((item) => item._id !== target._id));
                toast.success("Category deleted.");
                void queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
                setTarget(null);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Categories" description="Organise products into intuitive collections." action={<Button onClick={openCreate}><Plus className="size-4"/> New category</Button>}/>

      <Card>
        <CardHeader title="All categories" description={`${filtered.length} categories`}/>
        <CardBody className="border-b border-ink-100">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories" className="pl-10" aria-label="Search categories"/>
          </div>
        </CardBody>
        <DataTable columns={[
            { key: "name", label: "Category" },
            { key: "slug", label: "Slug" },
            { key: "products", label: "Products", align: "center" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={filtered.map((category) => ({
            name: (<div className="flex items-center gap-3">
                {category.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={category.image} alt="" className="size-10 rounded-lg object-cover"/>) : (<span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    {category.name.charAt(0)}
                  </span>)}
                <div>
                  <p className="font-semibold text-ink-900">{category.name}</p>
                  <p className="max-w-64 truncate text-[11px] text-ink-500">
                    {category.description ?? "No description"}
                  </p>
                </div>
              </div>),
            slug: <span className="font-mono text-xs text-ink-500">{category.slug}</span>,
            products: category.productCount ?? "—",
            status: <Badge status={category.isActive ? "active" : "inactive"} dot/>,
            actions: (<div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(category)} aria-label="Edit category">
                  <Pencil className="size-4"/>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setTarget(category)} aria-label="Delete category">
                  <Trash2 className="size-4 text-red-600"/>
                </Button>
              </div>),
        }))} empty="No categories found."/>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit category" : "New category"} description="Categories help customers browse your collections.">
        <form onSubmit={save} className="space-y-5">
          <Field label="Name" required>
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Summer essentials"/>
          </Field>
          <Field label="Description">
            <Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What belongs in this collection?"/>
          </Field>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="size-4 accent-brand-700"/>
            Active (visible in the storefront)
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" loading={action.isPending}>{editing ? "Save changes" : "Create category"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(target)} onClose={() => setTarget(null)} title="Delete category" description="Products in this category will remain, but lose their grouping." size="sm">
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
