"use client";

import { 
  UserPlus, 
  FolderKanban, 
  CheckSquare,
  ArrowRight,
  Mail,
  Users,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  details: string[];
}

const steps: Step[] = [
  {
    number: 1,
    title: "Create an Account",
    description: "Sign up in seconds and choose your role to get started with Lumina.",
    icon: UserPlus,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    details: [
      "Quick registration with email",
      "Choose your role (Admin/PM/Member)",
      "Set up your profile",
      "Start exploring features",
    ],
  },
  {
    number: 2,
    title: "Create or Join Projects",
    description: "Start a new project or join existing ones to collaborate with your team.",
    icon: FolderKanban,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    details: [
      "Create unlimited projects",
      "Invite team members",
      "Set project deadlines",
      "Organize tasks efficiently",
    ],
  },
  {
    number: 3,
    title: "Track Tasks & Progress",
    description: "Assign tasks, update statuses, and monitor progress with real-time insights.",
    icon: CheckSquare,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    details: [
      "Create and assign tasks",
      "Set priorities and due dates",
      "Track completion progress",
      "View analytics and reports",
    ],
  },
];

const connectingLines = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-4">
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            How
            <span className="text-indigo-600 dark:text-indigo-400"> Lumina Works</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in three simple steps and transform how your team collaborates
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Desktop Connecting Lines */}
          <div className="hidden lg:block absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-emerald-200 to-amber-200 dark:from-indigo-800 dark:via-emerald-800 dark:to-amber-800 -translate-y-1/2 z-0">
            <div className="absolute left-1/4 w-2 h-2 rounded-full bg-indigo-400 -top-1" />
            <div className="absolute left-1/2 w-2 h-2 rounded-full bg-emerald-400 -top-1" />
            <div className="absolute right-1/4 w-2 h-2 rounded-full bg-amber-400 -top-1" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step Number Circle */}
                  <div className="flex justify-center mb-6">
                    <div className={`relative w-20 h-20 rounded-full ${step.bgColor} border-2 ${step.borderColor} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                      <span className={`text-3xl font-bold ${step.color}`}>{step.number}</span>
                      {/* Pulsing ring */}
                      <div className={`absolute inset-0 rounded-full ${step.bgColor} animate-ping opacity-20`} />
                    </div>
                  </div>

                  {/* Step Card */}
                  <div className={`rounded-xl border ${step.borderColor} bg-background p-6 shadow-sm hover:shadow-xl transition-all duration-300 group`}>
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-6 w-6 ${step.color}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground mb-4">{step.description}</p>

                    {/* Details List */}
                    <div className="space-y-2 pt-2 border-t border-border">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${step.color.replace('text', 'bg')}`} />
                          <span className="text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Arrow (between steps) */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/register">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required · Free forever for small teams
          </p>
        </div>
      </div>
    </section>
  );
}