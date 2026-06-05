"use client";

import { 
  Shield, 
  Briefcase, 
  UserCheck,
  Settings,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Clock,
  Bell,
  LayoutDashboard
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Role {
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
  permissions: string[];
}

const roles: Role[] = [
  {
    title: "Admin",
    icon: Shield,
    description: "Full system control with complete oversight and configuration capabilities.",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    features: [
      "User Management",
      "System Settings",
      "Audit Logs",
      "Platform Analytics",
    ],
    permissions: [
      "Full system access",
      "Manage all users and roles",
      "Configure system settings",
      "View audit trail",
      "Delete any project/task",
    ],
  },
  {
    title: "Project Manager",
    icon: Briefcase,
    description: "Create and manage projects, assign tasks, and oversee team progress.",
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    features: [
      "Project Creation",
      "Task Assignment",
      "Team Management",
      "Progress Tracking",
    ],
    permissions: [
      "Create and manage projects",
      "Assign tasks to members",
      "Add/remove team members",
      "View team workload",
      "Update project settings",
    ],
  },
  {
    title: "Team Member",
    icon: UserCheck,
    description: "Collaborate on tasks, track personal progress, and stay productive.",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    features: [
      "Task Management",
      "Personal Dashboard",
      "Comments & Files",
      "Activity Tracking",
    ],
    permissions: [
      "View assigned tasks",
      "Update task status",
      "Add comments and files",
      "View team members",
      "Track personal progress",
    ],
  },
];

const roleIcons = {
  Admin: [Settings, Users, BarChart3],
  "Project Manager": [FolderKanban, CheckSquare, Users],
  "Team Member": [LayoutDashboard, Clock, Bell],
};

export function RolesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-4">
            <span>Role-Based Access</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Built for Every
            <span className="text-indigo-600 dark:text-indigo-400"> Team Role</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailored experiences for admins, project managers, and team members
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const RoleSpecificIcons = roleIcons[role.title as keyof typeof roleIcons];
            
            return (
              <Card 
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 border-2 ${role.borderColor} hover:border-${role.color.split(' ')[0]}-400 overflow-hidden`}
              >
                {/* Header with gradient background */}
                <div className={`${role.bgColor} p-6 border-b ${role.borderColor}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl bg-white dark:bg-background shadow-md`}>
                      <Icon className={`h-6 w-6 ${role.color}`} />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${role.bgColor} ${role.color} border ${role.borderColor}`}
                    >
                      {role.title}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {role.description}
                  </CardDescription>
                </div>

                <CardContent className="p-6 space-y-6">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {role.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${role.color.replace('text', 'bg')}`} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Permissions
                    </h4>
                    <div className="space-y-2">
                      {role.permissions.map((permission, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckSquare className={`h-3.5 w-3.5 mt-0.5 ${role.color}`} />
                          <span className="text-muted-foreground">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Role-specific icons */}
                  <div className="pt-4 flex justify-around">
                    {RoleSpecificIcons.map((RoleIcon, i) => (
                      <div 
                        key={i} 
                        className={`p-2 rounded-lg ${role.bgColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <RoleIcon className={`h-4 w-4 ${role.color}`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All roles include secure authentication, real-time updates, and activity logging.
          </p>
        </div>
      </div>
    </section>
  );
}