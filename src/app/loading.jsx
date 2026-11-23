import { Skeleton } from "@/components/ui/feedback";
export default function Loading() {
    return (<div className="min-h-screen bg-canvas">
      <div className="h-2 bg-brand-800"/>
      <div className="container-x py-12">
        <Skeleton className="h-4 w-40"/>
        <Skeleton className="mt-4 h-12 w-2/3 max-w-xl"/>
        <Skeleton className="mt-4 h-4 w-1/2 max-w-md"/>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (<div key={index} className="surface overflow-hidden">
              <Skeleton className="aspect-4/5 rounded-none"/>
              <div className="space-y-2 p-4">
                <Skeleton className="h-3 w-1/3"/>
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-2/3"/>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
}
