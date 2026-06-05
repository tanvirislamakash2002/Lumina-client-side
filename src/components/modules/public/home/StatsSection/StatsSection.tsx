"use client";

import { useEffect, useState } from "react";
import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  TrendingUp,
  Award,
  Clock,
  Building2,
  Star
} from "lucide-react";

interface Stat {
  id: number;
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const stats: Stat[] = [
  {
    id: 1,
    label: "Projects Managed",
    value: 500,
    suffix: "+",
    icon: FolderKanban,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    id: 2,
    label: "Tasks Completed",
    value: 10000,
    suffix: "+",
    icon: CheckSquare,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    id: 3,
    label: "Active Teams",
    value: 100,
    suffix: "+",
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    id: 4,
    label: "User Satisfaction",
    value: 98,
    suffix: "%",
    icon: Star,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
  },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    let timer: NodeJS.Timeout;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        setCount(Math.floor(current));
        timer = setTimeout(updateCounter, 16);
      } else {
        setCount(target);
      }
    };

    updateCounter();

    return () => clearTimeout(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export function StatsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Our Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Trusted by Teams
            <span className="text-indigo-600 dark:text-indigo-400"> Worldwide</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Helping teams collaborate better and achieve more together
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="relative group text-center p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background Glow */}
                <div className={`absolute inset-0 ${stat.bgColor} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0`} />
                
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>

                {/* Value */}
                <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-1`}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>

                {/* Decorative line */}
                <div className={`w-12 h-0.5 ${stat.bgColor} mx-auto mt-4 rounded-full`} />
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-muted-foreground">4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-muted-foreground">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-muted-foreground">Enterprise Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}