"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw, Bug, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", {
            message: error.message,
            stack: error.stack,
            digest: error.digest,
            timestamp: new Date().toISOString(),
        });
    }, [error]);

    // Determine if it's a development environment for showing details
    const isDev = process.env.NODE_ENV === "development";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-4">
            <Card className="max-w-md w-full shadow-lg border-red-200 dark:border-red-800">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Something Went Wrong</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        An unexpected error has occurred. Our team has been notified.
                    </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    {/* Error Message */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-mono text-destructive break-words">
                            {error.message || "Unknown error occurred"}
                        </p>
                    </div>
                    
                    {/* Error Details (Development Only) */}
                    {isDev && error.stack && (
                        <div className="p-3 bg-muted/30 rounded-lg overflow-auto max-h-48">
                            <div className="flex items-center gap-2 mb-2">
                                <Bug className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-semibold text-muted-foreground">Stack Trace</span>
                            </div>
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                                {error.stack}
                            </pre>
                        </div>
                    )}
                    
                    {/* Error Digest (if available) */}
                    {error.digest && (
                        <div className="text-xs text-muted-foreground text-center">
                            <span className="font-mono">Error ID: {error.digest}</span>
                        </div>
                    )}
                    
                    {/* Help Text */}
                    <div className="text-sm text-muted-foreground text-center space-y-1">
                        <p>This error has been logged and will be investigated.</p>
                        <p>If the problem persists, please contact support.</p>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="pt-2">
                        <p className="text-xs text-center text-muted-foreground mb-2">You can try:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button onClick={reset} variant="outline" size="sm" className="gap-1">
                                <RefreshCw className="h-3 w-3" />
                                Refresh Page
                            </Button>
                            <Button asChild variant="outline" size="sm" className="gap-1">
                                <Link href="/dashboard">
                                    <LayoutDashboard className="h-3 w-3" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} variant="default" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}