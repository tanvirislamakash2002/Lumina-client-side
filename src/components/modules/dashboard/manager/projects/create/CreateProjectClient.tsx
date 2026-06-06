"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createProject } from "@/actions/project.action";

// Form validation schema
const projectSchema = z.object({
    name: z.string()
        .min(3, "Project name must be at least 3 characters")
        .max(100, "Project name must not exceed 100 characters"),
    description: z.string()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
    deadline: z.date()
        .min(new Date(), "Deadline cannot be in the past"),
    status: z.enum(["ACTIVE", "ON_HOLD"], {
        message: "Status is required",
    }),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectClientProps {
    members: any[];
}

export function CreateProjectClient({ members }: CreateProjectClientProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "ACTIVE",
        },
    });

    const deadline = watch("deadline");
    const selectedStatus = watch("status");

    const onSubmit = async (data: ProjectFormValues) => {
        setIsSubmitting(true);

        try {
            const result = await createProject({
                name: data.name,
                description: data.description,
                deadline: data.deadline.toISOString(),
                status: data.status,
            });

            if (result.success) {
                toast.success("Project created successfully!");
                router.push("/dashboard/projects");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to create project");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error("Create project error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with breadcrumb */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/projects">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
                    <p className="text-muted-foreground mt-1">
                        Fill in the details below to create a new project.
                    </p>
                </div>
            </div>

            {/* Project Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Main Form - Left Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Information</CardTitle>
                                <CardDescription>
                                    Basic details about your project.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Project Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Project Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter project name"
                                        {...register("name")}
                                        className={errors.name ? "border-red-500" : ""}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe what this project is about..."
                                        rows={4}
                                        {...register("description")}
                                        className={errors.description ? "border-red-500" : ""}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {watch("description")?.length || 0}/500 characters
                                    </p>
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description.message}</p>
                                    )}
                                </div>

                                {/* Deadline */}
                                <div className="space-y-2">
                                    <Label htmlFor="deadline">
                                        Deadline <span className="text-red-500">*</span>
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !deadline && "text-muted-foreground",
                                                    errors.deadline && "border-red-500"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {deadline ? format(deadline, "PPP") : "Select deadline"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={deadline}
                                                onSelect={(date) => setValue("deadline", date as Date, { shouldValidate: true })}
                                                disabled={{ before: new Date() }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.deadline && (
                                        <p className="text-sm text-red-500">{errors.deadline.message}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedStatus}
                                        onValueChange={(value) => setValue("status", value as "ACTIVE" | "ON_HOLD", { shouldValidate: true })}
                                    >
                                        <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Projects start as Active. Completed status will be set automatically when all tasks are done.
                                    </p>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (3 cols) - Tips & Members */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Tips Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Tips</CardTitle>
                                <CardDescription>
                                    Best practices for creating a great project.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Use a clear, descriptive name</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        Good: "Website Redesign - Q4 2024"
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Set realistic deadlines</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        Consider team capacity and project complexity.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Write detailed descriptions</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        Include goals, scope, and key deliverables.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Start with Active status</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        You can put projects on hold later if needed.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team Members Preview (Optional) */}
                        {members.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Team Members</CardTitle>
                                    <CardDescription>
                                        You can add members after creating the project.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex -space-x-2">
                                        {members.slice(0, 5).map((member) => (
                                            <div
                                                key={member.id}
                                                className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center ring-2 ring-background"
                                                title={member.name}
                                            >
                                                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        ))}
                                        {members.length > 5 && (
                                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center ring-2 ring-background">
                                                <span className="text-xs font-medium">
                                                    +{members.length - 5}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3">
                                        {members.length} team member(s) available. Add them from the project details page.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Project
                    </Button>
                </div>
            </form>
        </div>
    );
}