"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createTask } from "@/actions/task.action";

// Form validation schema
const taskSchema = z.object({
    title: z.string()
        .min(3, "Task title must be at least 3 characters")
        .max(100, "Task title must not exceed 100 characters"),
    description: z.string()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
    projectId: z.string({
        message: "Please select a project",
    }),
    assignedTo: z.string().optional(),
    dueDate: z.date()
        .min(new Date(), "Due date cannot be in the past"),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    status: z.enum(["TODO", "IN_PROGRESS"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface CreateTaskClientProps {
    projects: any[];
    members: any[];
    preSelectedProjectId: string;
    currentUser: {
        id:string;
        role:string;
    };
}

export function CreateTaskClient({ projects, members, preSelectedProjectId, currentUser }: CreateTaskClientProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            projectId: preSelectedProjectId || "",
            assignedTo: "",
            priority: "MEDIUM",
            status: "TODO",
        },
    });

    const dueDate = watch("dueDate");
    const selectedProjectId = watch("projectId");
    const descriptionValue = watch("description") || "";

    const onSubmit = async (data: TaskFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await createTask(data.projectId, {
                title: data.title,
                description: data.description,
                assignedTo: data.assignedTo,
                dueDate: data.dueDate.toISOString(),
                priority: data.priority,
                status: data.status,
            });

            if (result.success) {
                toast.success("Task created successfully!");
                router.push(`/dashboard/tasks/${result.data.id}`);
                router.refresh();
            } else {
                toast.error(result.message || "Failed to create task");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error("Create task error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter members (only show team members and project managers)
    // Filter members for assignment dropdown
    const availableMembers = members.filter((member) => {
        // Admin can see all (but Admin shouldn't be creating tasks typically)
        if (currentUser?.role === "ADMIN") {
            return member?.role === "TEAM_MEMBER" || member.role === "PROJECT_MANAGER";
        }

        // Project Manager can only see:
        // 1. Themselves (current user)
        // 2. Team Members (TEAM_MEMBER role)
        if (currentUser.role === "PROJECT_MANAGER") {
            // Show the current PM and all team members
            // Exclude other Project Managers and Admins
            return member.id === currentUser?.id || member.role === "TEAM_MEMBER";
        }

        // Team Member cannot create tasks (already restricted in page.tsx)
        return false;
    });

    // Get selected project details
    const selectedProject = projects.find((p) => p.id === selectedProjectId);

    return (
        <div className="space-y-6">
            {/* Header with breadcrumb */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/tasks">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
                    <p className="text-muted-foreground mt-1">
                        Fill in the details below to create a new task.
                    </p>
                </div>
            </div>

            {/* Task Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Main Form - Left Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                                <CardDescription>
                                    Basic details about your task.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Task Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">
                                        Task Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter task title"
                                        {...register("title")}
                                        className={errors.title ? "border-red-500" : ""}
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-500">{errors.title.message}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe what needs to be done..."
                                        rows={4}
                                        {...register("description")}
                                        className={errors.description ? "border-red-500" : ""}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {descriptionValue.length}/500 characters
                                    </p>
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description.message}</p>
                                    )}
                                </div>

                                {/* Project */}
                                <div className="space-y-2">
                                    <Label htmlFor="projectId">
                                        Project <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={selectedProjectId || "none"}  // Use "none" instead of empty string
                                        onValueChange={(value) => setValue("projectId", value === "none" ? "" : value, { shouldValidate: true })}
                                    >
                                        <SelectTrigger className={errors.projectId ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none" disabled>Select a project</SelectItem>  {/* Disabled placeholder */}
                                            {projects.map((project) => (
                                                <SelectItem key={project.id} value={project.id}>
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.projectId && (
                                        <p className="text-sm text-red-500">{errors.projectId.message}</p>
                                    )}
                                </div>

                                {/* Assigned To */}
                                <div className="space-y-2">
                                    <Label htmlFor="assignedTo">Assign To</Label>
                                    <Select
                                        value={watch("assignedTo") || "none"}  // Use "none" instead of empty string
                                        onValueChange={(value) => setValue("assignedTo", value === "none" ? "" : value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a team member (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Unassigned</SelectItem>  {/* Changed from "" to "none" */}
                                            {availableMembers.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{member.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ({member.email})
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Due Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">
                                        Due Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !dueDate && "text-muted-foreground",
                                                    errors.dueDate && "border-red-500"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, "PPP") : "Select due date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={(date) => setValue("dueDate", date as Date, { shouldValidate: true })}
                                                disabled={{ before: new Date() }}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.dueDate && (
                                        <p className="text-sm text-red-500">{errors.dueDate.message}</p>
                                    )}
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <Label htmlFor="priority">
                                        Priority <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={watch("priority")}
                                        onValueChange={(value) => setValue("priority", value as "HIGH" | "MEDIUM" | "LOW", { shouldValidate: true })}
                                    >
                                        <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="LOW">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.priority && (
                                        <p className="text-sm text-red-500">{errors.priority.message}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={watch("status")}
                                        onValueChange={(value) => setValue("status", value as "TODO" | "IN_PROGRESS", { shouldValidate: true })}
                                    >
                                        <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">To Do</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        New tasks start as "To Do". You can change status later as work progresses.
                                    </p>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status.message}</p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-4">
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
                                    Create Task
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column (3 cols) - Tips & Info */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Project Info Card */}
                        {selectedProject && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Selected Project</CardTitle>
                                    <CardDescription>
                                        Task will be created in this project.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="font-medium">{selectedProject.name}</p>
                                        {selectedProject.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {selectedProject.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Deadline:</span>
                                            <span>{format(new Date(selectedProject.deadline), "MMM dd, yyyy")}</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2"
                                            asChild
                                        >
                                            <Link href={`/dashboard/projects/${selectedProject.id}`}>
                                                View Project Details
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tips Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Tips</CardTitle>
                                <CardDescription>
                                    Best practices for creating effective tasks.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Write clear, actionable titles</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        Good: "Fix login page validation error"
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Set realistic due dates</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        Consider complexity and dependencies.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Add detailed descriptions</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        Include requirements, acceptance criteria, and references.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Assign to the right person</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        Tasks can be unassigned and assigned later.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">✓ Start with "To Do" status</p>
                                    <p className="text-sm text-muted-foreground pl-4">
                                        Update status as work progresses.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Workflow Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Status Workflow</CardTitle>
                                <CardDescription>
                                    How task status changes work.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                    <span>To Do</span>
                                    <span className="text-muted-foreground">→</span>
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span>In Progress</span>
                                    <span className="text-muted-foreground">→</span>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span>Completed</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    You can move tasks forward or backward as needed. Completed tasks cannot be reassigned.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}