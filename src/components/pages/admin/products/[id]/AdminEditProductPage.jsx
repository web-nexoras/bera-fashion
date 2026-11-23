"use client";
import { useRouter, useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/product-form";
import { useAdminAction, useAdminQuery } from "@/components/admin/admin-data";
import { PageHeading } from "@/components/ui/section-heading";
export default function AdminProductEditPage() {
    const router = useRouter();
    const params = useParams();
    const id = String(params.id ?? "");
    const queryClient = useQueryClient();
    const update = useAdminAction();
    const productQuery = useAdminQuery(["admin", "product", id], `products/${id}`);
    return (<div className="space-y-6">
      <PageHeading title="Edit product" description={`Updating ${productQuery.data?.name ?? "catalogue item"}.`}/>
      <ProductForm initial={productQuery.data ?? undefined} loading={productQuery.isFetching && !productQuery.data} pending={update.isPending} title="Edit product details" description="Update pricing, taxonomy and merchandising flags." onSubmit={(values) => update.mutate({ path: `products/${id}`, method: "PUT", body: values }, {
            onSuccess: () => {
                toast.success("Product updated successfully.");
                void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
                void queryClient.invalidateQueries({ queryKey: ["admin", "product", id] });
                void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
                router.push("/admin/products");
            },
            onError: (error) => toast.error(error.message),
        })}/>
    </div>);
}
