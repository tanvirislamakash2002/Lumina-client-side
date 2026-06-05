import Link from "next/link";
import { Home, Search, LayoutDashboard, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 p-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Search className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-bold">404</CardTitle>
                    <CardTitle className="text-xl mt-2">Page Not Found</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        The page you're looking for doesn't exist or has been moved.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            You may have typed the address incorrectly or followed an outdated link.
                        </p>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Here are some helpful links:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/dashboard">Go to Dashboard</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/projects">Browse Projects</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/team">View Team</Link>
                            </Button>
                        </div>
                    </div>
                    
                    {/* Sparkles Suggestion */}
                    <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                        <div className="flex items-center gap-2 justify-center">
                            <Sparkles className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm text-indigo-700 dark:text-indigo-400">
                                Ready to streamline your workflow? Get started with a project!
                            </span>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}