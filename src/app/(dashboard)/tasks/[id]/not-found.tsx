import Link from "next/link";
import { CheckSquare, Home, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TaskNotFound() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <CheckSquare className="h-8 w-8 text-amber-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Task Not Found</CardTitle>
                    <CardDescription>
                        The task you're looking for doesn't exist or you don't have access to it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-3">
                    <Button asChild variant="outline">
                        <Link href="/tasks">
                            <CheckSquare className="mr-2 h-4 w-4" />
                            All Tasks
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}