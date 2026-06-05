import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Home, Sparkles, Users, CheckSquare, Clock, Shield, LayoutDashboard } from "lucide-react";

export default function AuthLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background">
            {/* Left Column - Brand Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50 via-purple-50/30 to-background dark:from-indigo-950/20 dark:via-purple-950/10 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Logo and Actions */}
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                                Lumina
                            </span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button variant="ghost" size="sm" asChild className="gap-2">
                                <Link href="/">
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-8 my-auto">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium w-fit">
                                <Sparkles className="w-3 h-3" />
                                <span>Illuminate Your Workflow</span>
                            </div>
                            <h1 className="text-5xl font-bold tracking-tight">
                                Smart Project & Task
                                <span className="text-indigo-600"> Collaboration</span>
                                <br />
                                for Modern Teams
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                Manage projects, track tasks, and collaborate seamlessly with your team in one powerful platform.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 backdrop-blur-sm">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                                    <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Project Dashboard</p>
                                    <p className="text-sm text-muted-foreground">Track progress and get real-time insights</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 backdrop-blur-sm">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Task Management</p>
                                    <p className="text-sm text-muted-foreground">Organize, prioritize, and complete tasks efficiently</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 backdrop-blur-sm">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                                    <Users className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Team Collaboration</p>
                                    <p className="text-sm text-muted-foreground">Work together with role-based access controls</p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Badge */}
                        <div className="pt-6 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-indigo-600" />
                                <span className="text-sm text-muted-foreground">Secure Platform</span>
                            </div>
                            <div className="w-px h-4 bg-border" />
                            <p className="text-sm text-muted-foreground">
                                Trusted by teams worldwide
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Lumina. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Column - Form Section */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                                    Lumina
                                </span>
                            </Link>
                            <div className="flex items-center gap-2">
                                <ThemeToggle />
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/">
                                        <Home className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">Welcome to Lumina</h2>
                            <p className="text-muted-foreground mt-1">Please sign in to continue</p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <Card className="border-0 shadow-none lg:shadow-lg bg-transparent lg:bg-card">
                        <CardContent className="p-0 lg:p-6">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}