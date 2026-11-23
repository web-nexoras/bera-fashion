import { Skeleton } from "@/components/ui/feedback";

export default function AuthLoading() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-3xl border border-ink-100 bg-white p-7 shadow-soft sm:p-9">
      <Skeleton className="mx-auto size-12 rounded-2xl" />
      <div className="space-y-2 text-center">
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-64 max-w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
