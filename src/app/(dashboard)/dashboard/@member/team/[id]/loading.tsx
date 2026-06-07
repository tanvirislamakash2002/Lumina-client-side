import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MemberTeamMemberDetailsLoading() {
    return (
        <div className="space-y-6">
            {/* Back button and header */}
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-32" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Shared Projects Card */}
            <Card>
                <CardContent className="p-6">
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-8 w-24" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}