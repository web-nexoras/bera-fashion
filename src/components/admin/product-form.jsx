"use client";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { useAdminQuery } from "./admin-data";
import { PRODUCT_STATUSES } from "@/lib/constants";
import { fallbackBrands, fallbackCategories } from "@/lib/fallback/data";
import { titleCase } from "@/lib/utils";
const blank = {
    name: "",
    description: "",
    sku: "",
    category: "",
    brand: "",
    basePrice: 0,
    status: "active",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
};
const relationId = (value) => typeof value === "string" ? value : (value?._id ?? "");
export function ProductForm({ initial, loading = false, pending = false, onSubmit, title = "Product details", description = "Basic information, pricing and merchandising flags.", }) {
    const [values, setValues] = useState(blank);
    const [errors, setErrors] = useState({});
    const { data: categories } = useAdminQuery(["admin", "categories", "options"], "categories", fallbackCategories);
    const { data: brands } = useAdminQuery(["admin", "brands", "options"], "brands", fallbackBrands);
    const [loadedInitial, setLoadedInitial] = useState(initial);
    if (initial && initial !== loadedInitial) {
        setLoadedInitial(initial);
        setValues({
            name: initial.name ?? "",
            description: initial.description ?? "",
            sku: initial.sku ?? "",
            category: relationId(initial.category),
            brand: typeof initial.brand === "string" ? initial.brand : (initial.brand?._id ?? ""),
            basePrice: Number(initial.basePrice ?? 0),
            status: initial.status ?? "active",
            isFeatured: Boolean(initial.isFeatured),
            isNewArrival: Boolean(initial.isNewArrival),
            isBestSeller: Boolean(initial.isBestSeller),
        });
    }
    const set = (key, value) => setValues((current) => ({ ...current, [key]: value }));
    const submit = (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (!values.name.trim())
            nextErrors.name = "A product name is required.";
        if (!values.sku.trim())
            nextErrors.sku = "A SKU is required.";
        if (!values.category)
            nextErrors.category = "Choose a category.";
        if (!Number.isFinite(values.basePrice) || values.basePrice <= 0) {
            nextErrors.basePrice = "Enter a valid base price.";
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length)
            return;
        onSubmit({ ...values, name: values.name.trim(), sku: values.sku.trim().toUpperCase() });
    };
    const flags = [
        { key: "isFeatured", label: "Featured product" },
        { key: "isNewArrival", label: "New arrival" },
        { key: "isBestSeller", label: "Best seller" },
    ];
    return (<form onSubmit={submit} className="space-y-5">
      <Card>
        <CardHeader title={title} description={description}/>
        <CardBody className="space-y-5">
          {loading ? (<p className="py-8 text-center text-sm text-ink-500">Loading product…</p>) : (<>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Product name" required error={errors.name}>
                  <Input value={values.name} onChange={(event) => set("name", event.target.value)} placeholder="e.g. Signature Oxford Shirt"/>
                </Field>
                <Field label="SKU" required error={errors.sku}>
                  <Input value={values.sku} onChange={(event) => set("sku", event.target.value)} placeholder="BF-0001"/>
                </Field>
              </div>
              <Field label="Description">
                <Textarea value={values.description} onChange={(event) => set("description", event.target.value)} placeholder="Describe the product, fabric and fit…"/>
              </Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Category" required error={errors.category}>
                  <Select value={values.category} onChange={(event) => set("category", event.target.value)}>
                    <option value="">Select a category</option>
                    {categories.map((category) => (<option key={category._id} value={category._id}>{category.name}</option>))}
                  </Select>
                </Field>
                <Field label="Brand">
                  <Select value={values.brand} onChange={(event) => set("brand", event.target.value)}>
                    <option value="">No brand</option>
                    {brands.map((brand) => (<option key={brand._id} value={brand._id}>{brand.name}</option>))}
                  </Select>
                </Field>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Base price (BDT)" required error={errors.basePrice}>
                  <Input type="number" min={0} step="1" value={values.basePrice} onChange={(event) => set("basePrice", Number(event.target.value))}/>
                </Field>
                <Field label="Status">
                  <Select value={values.status} onChange={(event) => set("status", event.target.value)}>
                    {PRODUCT_STATUSES.map((status) => (<option key={status} value={status}>{titleCase(status)}</option>))}
                  </Select>
                </Field>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-ink-700">Merchandising flags</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {flags.map((flag) => (<label key={flag.key} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-ink-200 px-3 py-3 text-xs font-medium text-ink-700 transition-colors hover:border-brand-300">
                      <input type="checkbox" checked={values[flag.key]} onChange={(event) => set(flag.key, event.target.checked)} className="size-4 accent-brand-700"/>
                      {flag.label}
                    </label>))}
                </div>
              </div>
            </>)}
        </CardBody>
      </Card>

      <div className="flex justify-end gap-3">
        <ButtonLink href="/admin/products" variant="outline">Cancel</ButtonLink>
        <Button type="submit" loading={pending} disabled={loading}>
          {initial ? "Save changes" : "Create product"}
        </Button>
      </div>
    </form>);
}
