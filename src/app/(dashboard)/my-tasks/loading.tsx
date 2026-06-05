import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyTasksLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-20" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters Skeleton */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3">
                        <Skeleton className="h-10 flex-1 min-w-[200px]" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 flex flex-wrap items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <Skeleton className="h-5 w-48 mb-1" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Pagination Skeleton */}
            <div className="flex justify-center">
                <Skeleton className="h-10 w-64 rounded-lg" />
            </div>
        </div>
    );
}