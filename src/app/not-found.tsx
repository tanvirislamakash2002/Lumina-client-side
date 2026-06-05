import Link from "next/link";
import { Home, Search, Lightbulb, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950 dark:to-slate-950 p-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Search className="h-10 w-10 text-amber-600 dark:text-amber-400" />
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
                                <Link href="/ideas">Browse Ideas</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/about">About Us</Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href="/contact">Contact</Link>
                            </Button>
                        </div>
                    </div>
                    
                    {/* Lightbulb Suggestion */}
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <div className="flex items-center gap-2 justify-center">
                            <Lightbulb className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700 dark:text-green-400">
                                Have an idea? Share it with our community!
                            </span>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild variant="default" className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/ideas">
                            <Search className="h-4 w-4" />
                            Browse Ideas
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}