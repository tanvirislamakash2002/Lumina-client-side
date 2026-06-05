import { Skeleton } from "@/components/ui/skeleton";

export function HowItWorksSkeleton() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Skeleton className="h-8 w-32 rounded-full mx-auto mb-4" />
          <Skeleton className="h-10 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Steps Grid Skeleton */}
        <div className="grid lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              {/* Step Number */}
              <div className="flex justify-center mb-6">
                <Skeleton className="w-20 h-20 rounded-full" />
              </div>
              {/* Step Card */}
              <div className="rounded-xl border p-6">
                <Skeleton className="w-12 h-12 rounded-xl mb-4" />
                <Skeleton className="h-6 w-32 mb-2 mx-auto" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-4 mx-auto" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Skeleton */}
        <div className="text-center mt-12">
          <Skeleton className="h-11 w-40 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-64 mx-auto mt-4" />
        </div>
      </div>
    </section>
  );
}