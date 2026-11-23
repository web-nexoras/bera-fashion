"use client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/product-form";
import { useAdminAction } from "@/components/admin/admin-data";
import { PageHeading } from "@/components/ui/section-heading";
export default function AdminProductNewPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const create = useAdminAction();
    return (<div className="space-y-6">
      <PageHeading title="New product" description="Add a new item to your BERA catalogue."/>
      <ProductForm pending={create.isPending} onSubmit={(values) => create.mutate({ path: "products", method: "POST", body: values }, {
            onSuccess: () => {
                toast.success("Product created successfully.");
                void queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
                void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
                router.push("/admin/products");
            },
            onError: (error) => toast.error(error.message),
        })}/>
    </div>);
}
