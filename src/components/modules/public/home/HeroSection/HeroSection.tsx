"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, LogIn, Rocket, LayoutDashboard, CheckSquare, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPreviewImage = () => {
    if (!mounted) return "/dashboard.png";
    return "/dashboard.png";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full blur-3xl dark:bg-indigo-900/30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full blur-3xl dark:bg-purple-900/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Project Collaboration</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Smart Project & Task
              <span className="text-indigo-600 dark:text-indigo-400"> Collaboration</span>
              <br />
              for Modern Teams
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg">
              Manage projects, track tasks, and collaborate seamlessly with your team in one powerful, intuitive platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link href="/register">
                  <Rocket className="mr-2 h-4 w-4" />
                  Get Started Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  View Demo
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                <span className="text-sm text-muted-foreground">Project Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-indigo-500" />
                <span className="text-sm text-muted-foreground">Task Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span className="text-sm text-muted-foreground">Team Collaboration</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div className="relative">
            <div className="relative rounded-xl shadow-2xl overflow-hidden border border-border">
              {/* Browser Chrome */}
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground">
                  app.lumina.com/dashboard
                </div>
              </div>
              {/* Dashboard Image */}
              <div className="bg-background">
                <Image
                  src={getPreviewImage()}
                  alt="Lumina Dashboard Preview"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}