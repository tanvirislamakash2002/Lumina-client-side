import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function RolesSectionSkeleton() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Skeleton className="h-8 w-32 rounded-full mx-auto mb-4" />
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Roles Grid Skeleton */}
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-4 w-24 mb-3" />
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-4 w-full mb-2" />
                  ))}
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-3" />
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-4 w-full mb-2" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Note Skeleton */}
        <div className="text-center mt-12">
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
      </div>
    </section>
  );
}