import { Skeleton } from "@/components/ui/skeleton";

export function CTASectionSkeleton() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge Skeleton */}
        <Skeleton className="h-8 w-32 rounded-full mx-auto mb-6 bg-white/20" />
        
        {/* Heading Skeleton */}
        <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
        
        {/* Subheading Skeleton */}
        <Skeleton className="h-6 w-96 mx-auto mb-8 bg-white/20" />
        
        {/* Buttons Skeleton */}
        <div className="flex justify-center gap-4 mb-8">
          <Skeleton className="h-11 w-40 rounded-lg bg-white/20" />
          <Skeleton className="h-11 w-32 rounded-lg bg-white/20" />
        </div>
        
        {/* Trust Indicators Skeleton */}
        <div className="flex justify-center gap-6">
          <Skeleton className="h-5 w-36 bg-white/20" />
          <Skeleton className="h-5 w-32 bg-white/20" />
          <Skeleton className="h-5 w-28 bg-white/20" />
        </div>
      </div>
    </section>
  );
}