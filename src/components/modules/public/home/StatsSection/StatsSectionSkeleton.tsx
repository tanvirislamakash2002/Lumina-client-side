import { Skeleton } from "@/components/ui/skeleton";

export function StatsSectionSkeleton() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Skeleton className="h-8 w-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-border">
              <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-4" />
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
              <Skeleton className="w-12 h-0.5 mx-auto mt-4" />
            </div>
          ))}
        </div>

        {/* Trust Badges Skeleton */}
        <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-border">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
    </section>
  );
}