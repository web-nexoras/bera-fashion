"use client";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BadgeCheck, CalendarDays, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/feedback";
import { Field, Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/section-heading";
import { useAuth } from "@/features/auth/context/AuthContext.jsx";
import { getProfile, updateProfile } from "@/api/account.js";
import { formatDate, initials } from "@/lib/utils";
const schema = z.object({
    name: z.string().trim().min(2, "Please enter your full name"),
    phone: z
        .string()
        .trim()
        .min(7, "Enter a valid phone number")
        .max(20, "Enter a valid phone number")
        .regex(/^[0-9+\-\s]+$/, "Use digits only, with an optional country code"),
});
export default function ProfilePage() {
    const queryClient = useQueryClient();
    const { user, setUser } = useAuth();
    const profileQuery = useQuery({
        queryKey: ["account", "profile"],
        queryFn: () => getProfile()
            .then((result) => result.data)
            .then((data) => data ?? null),
    });
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", phone: "" },
    });
    useEffect(() => {
        const profile = profileQuery.data;
        if (profile)
            reset({ name: profile.name, phone: profile.phone ?? "" });
    }, [profileQuery.data, reset]);
    const onSubmit = async (values) => {
        const response = await updateProfile({ name: values.name, phone: values.phone });
        if (!response.success || !response.data) {
            toast.error(response.message ?? "We couldn't save your profile.");
            return;
        }
        setUser(response.data);
        await queryClient.invalidateQueries({ queryKey: ["account", "profile"] });
        toast.success(response.message ?? "Profile updated successfully");
    };
    const profile = profileQuery.data;
    const displayed = profile ?? user;
    return (<div className="animate-fade-up">
      <PageHeading title="My profile" description="Manage the personal details on your BERA account."/>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card className="h-fit overflow-hidden">
          <div className="relative h-24 bg-brand-900">
            <div className="pointer-events-none absolute -right-8 -top-14 size-40 rounded-full border border-white/10"/>
          </div>
          <CardBody className="relative -mt-10 text-center">
            <span className="mx-auto flex size-20 items-center justify-center rounded-2xl border-4 border-white bg-brand-700 font-display text-2xl font-bold text-white shadow-soft">
              {initials(displayed?.name ?? "BERA Customer")}
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-ink-900">{displayed?.name ?? "—"}</h2>
            <p className="mt-1 text-xs text-ink-500">{displayed?.email ?? "—"}</p>
            <div className="mt-3 flex justify-center">
              {displayed?.isEmailVerified ? (<Badge tone="success" dot>
                  Email verified
                </Badge>) : (<Badge tone="warning" dot>
                  Verification pending
                </Badge>)}
            </div>

            <div className="mt-6 space-y-3 border-t border-ink-100 pt-5 text-left text-xs">
              <p className="flex items-center gap-2 text-ink-600">
                <Mail className="size-3.5 text-ink-400"/> {displayed?.email ?? "—"}
              </p>
              <p className="flex items-center gap-2 text-ink-600">
                <CalendarDays className="size-3.5 text-ink-400"/>
                Member since {formatDate(displayed?.createdAt, "MMM yyyy")}
              </p>
              <p className="flex items-center gap-2 text-ink-600">
                <ShieldCheck className="size-3.5 text-ink-400"/>
                {displayed?.role === "admin" ? "Administrator account" : "Customer account"}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Personal information" description="Update your name and contact number." action={displayed?.isEmailVerified ? (<span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <BadgeCheck className="size-3.5"/> Verified
                </span>) : undefined}/>
          <CardBody>
            {profileQuery.isLoading ? (<div className="space-y-5">
                <Skeleton className="h-20 w-full"/>
                <Skeleton className="h-20 w-full"/>
                <Skeleton className="h-20 w-full"/>
              </div>) : (<form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5" noValidate>
                <Field label="Full name" error={errors.name?.message} required>
                  <Input {...register("name")} placeholder="Your full name" autoComplete="name"/>
                </Field>
                <Field label="Phone number" error={errors.phone?.message} required>
                  <Input {...register("phone")} type="tel" placeholder="01712345678" autoComplete="tel"/>
                </Field>
                <Field label="Email address" hint="Your email address cannot be changed from here.">
                  <Input value={displayed?.email ?? ""} readOnly disabled className="bg-ink-50"/>
                </Field>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
                    Save changes
                  </Button>
                  {isDirty && (<Button type="button" variant="ghost" onClick={() => reset({ name: profile?.name ?? "", phone: profile?.phone ?? "" })}>
                      Discard
                    </Button>)}
                </div>
              </form>)}
          </CardBody>
        </Card>
      </div>
    </div>);
}
