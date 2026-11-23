"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BriefcaseBusiness, Home, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, Skeleton } from "@/components/ui/feedback";
import { Field, Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeading } from "@/components/ui/section-heading";
import { deleteAddress, getAddresses, saveAddress } from "@/api/account.js";
import { BANGLADESH_DIVISIONS } from "@/lib/constants";
const schema = z.object({
    label: z.enum(["home", "work", "other"]),
    recipientName: z.string().trim().min(2, "Enter the recipient's name"),
    phone: z
        .string()
        .trim()
        .min(7, "Enter a valid phone number")
        .max(20, "Enter a valid phone number")
        .regex(/^[0-9+\-\s]+$/, "Use digits only, with an optional country code"),
    addressLine1: z.string().trim().min(3, "Enter the street or house address"),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim().min(2, "Enter your city or area"),
    district: z.string().trim().min(2, "Enter your district"),
    division: z.string().min(1, "Select a division"),
    postalCode: z.string().trim().optional(),
    isDefault: z.boolean(),
});
const emptyValues = {
    label: "home",
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    division: "",
    postalCode: "",
    isDefault: false,
};
const labelIcons = { home: Home, work: BriefcaseBusiness, other: MapPin };
export default function AddressesPage() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const addressesQuery = useQuery({
        queryKey: ["account", "addresses"],
        queryFn: () => getAddresses().then((result) => result.data ?? []),
    });
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: emptyValues,
    });
    const openCreate = () => {
        setEditingId(null);
        reset(emptyValues);
        setOpen(true);
    };
    const openEdit = (address) => {
        setEditingId(address._id);
        reset({
            label: address.label,
            recipientName: address.recipientName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 ?? "",
            city: address.city,
            district: address.district,
            division: address.division,
            postalCode: address.postalCode ?? "",
            isDefault: address.isDefault,
        });
        setOpen(true);
    };
    const onSubmit = async (values) => {
        const response = await saveAddress(editingId, values);
        if (!response.success) {
            toast.error(response.message ?? "We couldn't save this address.");
            return;
        }
        await queryClient.invalidateQueries({ queryKey: ["account", "addresses"] });
        setOpen(false);
        toast.success(response.message ?? (editingId ? "Address updated" : "Address added"));
    };
    const removeAddress = async (id) => {
        setDeletingId(id);
        const response = await deleteAddress(id);
        setDeletingId(null);
        if (!response.success) {
            toast.error(response.message ?? "We couldn't delete this address.");
            return;
        }
        await queryClient.invalidateQueries({ queryKey: ["account", "addresses"] });
        toast.success(response.message ?? "Address deleted");
    };
    const addresses = addressesQuery.data ?? [];
    return (<div className="animate-fade-up">
      <PageHeading title="Saved addresses" description="Keep your favourite delivery destinations ready to go." action={<Button onClick={openCreate} size="sm">
            <Plus className="size-4"/> Add address
          </Button>}/>

      {addressesQuery.isLoading ? (<div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-56 rounded-2xl"/>
          <Skeleton className="h-56 rounded-2xl"/>
        </div>) : addresses.length === 0 ? (<Card>
          <EmptyState icon={<MapPin className="size-6"/>} title="No addresses saved" description="Add an address to make checkout faster next time." action={<Button onClick={openCreate}>Add your first address</Button>}/>
        </Card>) : (<div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => {
                const Icon = labelIcons[address.label] ?? MapPin;
                return (<Card key={address._id} className="flex flex-col p-5 transition-shadow hover:shadow-lift">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon className="size-[18px]"/>
                    </span>
                    <div>
                      <p className="text-sm font-bold capitalize text-ink-900">{address.label}</p>
                      <p className="text-xs text-ink-500">{address.recipientName}</p>
                    </div>
                  </div>
                  {address.isDefault && <Badge tone="brand" dot>Default</Badge>}
                </div>

                <div className="mt-4 flex-1 space-y-1 text-sm leading-6 text-ink-600">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.district}, {address.division}
                    {address.postalCode ? ` — ${address.postalCode}` : ""}
                  </p>
                  <p className="text-xs text-ink-400">+88 {address.phone}</p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-ink-100 pt-4">
                  <Button variant="outline" size="sm" onClick={() => openEdit(address)}>
                    <Pencil className="size-3.5"/> Edit
                  </Button>
                  <Button variant="ghost" size="sm" loading={deletingId === address._id} onClick={() => void removeAddress(address._id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="size-3.5"/> Delete
                  </Button>
                </div>
              </Card>);
            })}
        </div>)}

      <Modal open={open} onClose={() => setOpen(false)} title={editingId ? "Edit address" : "Add a new address"} description="We'll use this address for deliveries and order updates." size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Address label" required>
              <Select {...register("label")}>
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Field label="Recipient name" error={errors.recipientName?.message} required>
              <Input {...register("recipientName")} placeholder="Full name"/>
            </Field>
          </div>

          <Field label="Phone number" error={errors.phone?.message} required>
            <Input {...register("phone")} type="tel" placeholder="01712345678"/>
          </Field>

          <Field label="Address line 1" error={errors.addressLine1?.message} required>
            <Input {...register("addressLine1")} placeholder="House / flat / street"/>
          </Field>
          <Field label="Address line 2" hint="Optional — apartment, landmark, etc.">
            <Input {...register("addressLine2")} placeholder="Additional details"/>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City / area" error={errors.city?.message} required>
              <Input {...register("city")} placeholder="e.g. Banani"/>
            </Field>
            <Field label="District" error={errors.district?.message} required>
              <Input {...register("district")} placeholder="e.g. Dhaka"/>
            </Field>
            <Field label="Division" error={errors.division?.message} required>
              <Select {...register("division")}>
                <option value="">Select division</option>
                {BANGLADESH_DIVISIONS.map((division) => (<option key={division} value={division}>
                    {division}
                  </option>))}
              </Select>
            </Field>
            <Field label="Postal code" hint="Optional">
              <Input {...register("postalCode")} placeholder="e.g. 1213"/>
            </Field>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
            <input type="checkbox" {...register("isDefault")} className="size-4 accent-brand-700"/>
            Set as my default delivery address
          </label>

          <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {editingId ? "Save changes" : "Add address"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>);
}
