import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="flex-1 space-y-8 animate-in fade-in duration-500">
      {/* Generic Heading Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
      </div>

      {/* Generic Grid Skeleton - 3 Top Highlights */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-muted/5 dark:bg-white/5 border border-white/5 backdrop-blur-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px] mb-2" />
              <Skeleton className="h-3 w-[150px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Large Content Area Skeleton */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-[250px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3 p-4 rounded-xl border border-white/5 bg-muted/5 dark:bg-white/5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[85%]" />
                <div className="pt-4 flex gap-2">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
