import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LogsLoading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Filters Skeleton */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 flex-1 min-w-[200px]" />
                    </div>
                </CardContent>
            </Card>

            {/* Table Skeleton */}
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 flex items-center gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-8 rounded-md" />
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