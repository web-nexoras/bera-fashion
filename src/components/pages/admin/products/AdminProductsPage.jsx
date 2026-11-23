"use client";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAdminAction, useAdminList, useAdminQuery } from "@/components/admin/admin-data";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/section-heading";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { fallbackCategories, fallbackProducts } from "@/lib/fallback/data";
import { formatBDT, mainImage, productPrice, titleCase } from "@/lib/utils";
const relationName = (value) => typeof value === "string" ? value : (value?.name ?? "—");
const relationId = (value) => typeof value === "string" ? value : (value?._id ?? "");
export default function AdminProductsPage() {
    const queryClient = useQueryClient();
    const { data, refetch, isFetching } = useAdminList(["admin", "products"], "products?limit=50", fallbackProducts);
    const { data: categories } = useAdminQuery(["admin", "categories", "options"], "categories", fallbackCategories);
    const remove = useAdminAction();
    const [overrides, setOverrides] = useState(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [category, setCategory] = useState("all");
    const [target, setTarget] = useState(null);
    const products = overrides ?? data.items;
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return products.filter((product) => {
            const matchesTerm = !term ||
                product.name.toLowerCase().includes(term) ||
                product.sku.toLowerCase().includes(term);
            return (matchesTerm &&
                (status === "all" || product.status === status) &&
                (category === "all" || relationId(product.category) === category));
        });
    }, [products, search, status, category]);
    const onDelete = () => {
        if (!target)
            return;
        remove.mutate({ path: `products/${target._id}`, method: "DELETE" }, {
            onSuccess: () => {
                setOverrides((current) => (current ?? products).filter((item) => item._id !== target._id));
                toast.success(`${target.name} deleted.`);
                void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
                void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
                setTarget(null);
            },
            onError: (error) => toast.error(error.message),
        });
    };
    return (<div className="space-y-6">
      <PageHeading title="Products" description="Manage your catalogue, pricing and product visibility." action={<ButtonLink href="/admin/products/new">
            <Plus className="size-4"/> New product
          </ButtonLink>}/>

      <Card>
        <CardHeader title="Catalogue" description={`${filtered.length} of ${products.length} products`} action={<Button variant="ghost" size="sm" onClick={() => void refetch()} loading={isFetching}>
              Refresh
            </Button>}/>
        <CardBody className="border-b border-ink-100">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"/>
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or SKU" className="pl-10" aria-label="Search products"/>
            </div>
            <Select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status">
              <option value="all">All statuses</option>
              {PRODUCT_STATUSES.map((item) => (<option key={item} value={item}>{titleCase(item)}</option>))}
            </Select>
            <Select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
              <option value="all">All categories</option>
              {categories.map((item) => (<option key={item._id} value={item._id}>{item.name}</option>))}
            </Select>
          </div>
        </CardBody>
        <DataTable columns={[
            { key: "product", label: "Product" },
            { key: "category", label: "Category" },
            { key: "price", label: "Price", align: "right" },
            { key: "stock", label: "Stock", align: "center" },
            { key: "status", label: "Status" },
            { key: "actions", label: "Actions", align: "right" },
        ]} rows={filtered.map((product) => {
            const stock = product.variants?.reduce((sum, variant) => sum + variant.stock, 0) ?? 0;
            return {
                product: (<div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mainImage(product.images)} alt={product.name} className="size-11 rounded-lg object-cover ring-1 ring-ink-100"/>
                  <div className="min-w-0">
                    <p className="max-w-64 truncate font-semibold text-ink-900">{product.name}</p>
                    <p className="text-[11px] text-ink-400">{product.sku}</p>
                  </div>
                </div>),
                category: (<div>
                  <p className="text-ink-700">{relationName(product.category)}</p>
                  <p className="text-[11px] text-ink-400">
                    {product.brand ? relationName(product.brand) : "No brand"}
                  </p>
                </div>),
                price: <span className="font-semibold text-ink-900">{formatBDT(productPrice(product))}</span>,
                stock: <Badge tone={stock === 0 ? "danger" : stock <= 10 ? "warning" : "success"}>{stock}</Badge>,
                status: <Badge status={product.status} dot/>,
                actions: (<div className="flex justify-end gap-1">
                  <ButtonLink href={`/admin/products/${product._id}`} variant="ghost" size="icon" aria-label="Edit product">
                    <Pencil className="size-4"/>
                  </ButtonLink>
                  <Button variant="ghost" size="icon" onClick={() => setTarget(product)} aria-label="Delete product">
                    <Trash2 className="size-4 text-red-600"/>
                  </Button>
                </div>),
            };
        })} empty="No products found."/>
      </Card>

      <Modal open={Boolean(target)} onClose={() => setTarget(null)} title="Delete product" description="This action cannot be undone." size="sm">
        <div className="space-y-5">
          <p className="text-sm text-ink-600">
            Are you sure you want to delete <strong className="text-ink-900">{target?.name}</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={onDelete} loading={remove.isPending}>Delete product</Button>
          </div>
        </div>
      </Modal>
    </div>);
}
