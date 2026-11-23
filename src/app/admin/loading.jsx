import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/feedback";
export default function AdminLoading() {
    return (<div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56"/>
          <Skeleton className="h-4 w-72"/>
        </div>
        <Skeleton className="h-11 w-36 rounded-xl"/>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (<Card key={index}>
            <CardBody className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="size-10 rounded-xl"/>
                <Skeleton className="h-6 w-14 rounded-full"/>
              </div>
              <Skeleton className="h-3 w-24"/>
              <Skeleton className="h-8 w-32"/>
              <Skeleton className="h-3 w-40"/>
            </CardBody>
          </Card>))}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (<Card key={index}>
            <CardHeader title={<Skeleton className="h-4 w-32"/>}/>
            <CardBody>
              <Skeleton className="h-64 w-full"/>
            </CardBody>
          </Card>))}
      </div>
      <Card>
        <CardHeader title={<Skeleton className="h-4 w-40"/>}/>
        <CardBody className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (<Skeleton key={index} className="h-10 w-full"/>))}
        </CardBody>
      </Card>
    </div>);
}
