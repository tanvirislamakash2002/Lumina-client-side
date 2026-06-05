"use client";

import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Clock, 
  Bell,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: LayoutDashboard,
    title: "Project Management",
    description: "Create, track, and manage all your projects in one place with intuitive dashboards and real-time updates.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: CheckSquare,
    title: "Task Tracking",
    description: "Assign tasks, set priorities, track progress, and never miss a deadline with smart task management.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Add team members, assign roles, and work together seamlessly with real-time collaboration tools.",
    color: "from-amber-500 to-amber-600",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Visualize project progress with beautiful charts and insights to make data-driven decisions.",
    color: "from-rose-500 to-rose-600",
  },
  {
    icon: Clock,
    title: "Activity Logs",
    description: "Track every action with detailed activity history, ensuring complete transparency and accountability.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: Bell,
    title: "Real-time Notifications",
    description: "Stay updated with instant notifications for task assignments, status changes, and team mentions.",
    color: "from-purple-500 to-purple-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-4">
            <span>Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to
            <span className="text-indigo-600 dark:text-indigo-400"> Manage Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to help your team work better together
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link 
                    href="/register" 
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
                  >
                    Learn More
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Join thousands of teams already using Lumina
          </p>
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/register">
              Get Started Free
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}