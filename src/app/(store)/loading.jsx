import { Skeleton } from "@/components/ui/feedback";
export default function StoreLoading() {
    return (<div className="container-x py-10">
      {/* Announcement + hero placeholders */}
      <Skeleton className="mx-auto mb-8 h-6 w-72 rounded-full"/>
      <div className="surface mb-12 grid overflow-hidden p-0 lg:grid-cols-2">
        <div className="space-y-5 p-8 sm:p-12">
          <Skeleton className="h-6 w-40 rounded-full"/>
          <Skeleton className="h-12 w-full max-w-md"/>
          <Skeleton className="h-12 w-4/5 max-w-sm"/>
          <Skeleton className="h-4 w-full max-w-lg"/>
          <Skeleton className="h-4 w-3/4 max-w-md"/>
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 w-40 rounded-xl"/>
            <Skeleton className="h-12 w-36 rounded-xl"/>
          </div>
        </div>
        <Skeleton className="m-6 hidden min-h-96 rounded-2xl lg:block"/>
      </div>

      {/* Section heading */}
      <div className="mb-7 space-y-3">
        <Skeleton className="h-3 w-32"/>
        <Skeleton className="h-9 w-72"/>
        <Skeleton className="h-4 w-96 max-w-full"/>
      </div>

      {/* Category grid */}
      <div className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (<Skeleton key={index} className="aspect-4/5 rounded-2xl"/>))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (<div key={index} className="surface overflow-hidden">
            <Skeleton className="aspect-4/5 rounded-none"/>
            <div className="space-y-2.5 p-4">
              <Skeleton className="h-3 w-1/3"/>
              <Skeleton className="h-4 w-full"/>
              <Skeleton className="h-4 w-2/3"/>
              <Skeleton className="h-5 w-1/2"/>
            </div>
          </div>))}
      </div>
    </div>);
}
