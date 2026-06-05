import { Skeleton } from "@/components/ui/skeleton";

export function HeroSectionSkeleton() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column Skeleton */}
          <div className="space-y-8">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-16 w-full max-w-2xl" />
            <Skeleton className="h-6 w-full max-w-lg" />
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-11 w-40 rounded-lg" />
              <Skeleton className="h-11 w-32 rounded-lg" />
            </div>
            <div className="flex items-center gap-6 pt-4">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="relative">
            <div className="rounded-xl shadow-2xl overflow-hidden border border-border">
              <Skeleton className="h-12 w-full rounded-none" />
              <div className="bg-background p-4">
                <Skeleton className="w-full aspect-video rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}