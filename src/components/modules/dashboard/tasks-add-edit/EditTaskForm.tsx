"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2, ChevronRight, Home } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

import { updateTask } from "@/actions/task.action";

// Form validation schema
const taskSchema = z.object({
    title: z.string()
        .min(3, "Task title must be at least 3 characters")
        .max(100, "Task title must be less than 100 characters"),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    assignedTo: z.string().optional().nullable(),
    dueDate: z.date().nullable().optional(),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface EditTaskFormProps {
    task: any;
    members: any[];
    userRole: string;
    currentUserId: string;
}

export function EditTaskForm({ task, members, userRole, currentUserId }: EditTaskFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        setError,
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task.title,
            description: task.description || "",
            assignedTo: task.assignedTo?.id || null,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            priority: task.priority,
            status: task.status,
        },
    });

    const dueDate = watch("dueDate");
    const priority = watch("priority");
    const status = watch("status");
    const assignedTo = watch("assignedTo");

    const canAssign = userRole === "ADMIN" || userRole === "PROJECT_MANAGER";
    const isCurrentUserAssigned = task.assignedTo?.id === currentUserId;
    const canEditStatus = canAssign || isCurrentUserAssigned;

    const onSubmit = async (data: TaskFormValues) => {
        const toastId = toast.loading("Updating task...");

        try {
            const result = await updateTask(task.id, {
                title: data.title,
                description: data.description,
                assignedTo: data.assignedTo || null,
                dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
                priority: data.priority,
                status: data.status,
            });

            if (!result.success) {
                toast.error(result.message || "Failed to update task", { id: toastId });

                if (result.message?.includes("already exists")) {
                    setError("title", { message: result.message });
                }
                return;
            }

            toast.success("Task updated successfully!", { id: toastId });
            router.push(`/tasks/${task.id}`);
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong. Please try again.", { id: toastId });
            console.error("Update task error:", error);
        }
    };

    const handleCancel = () => {
        router.push(`/tasks/${task.id}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Link href="/dashboard" className="hover:text-foreground transition-colors">
                        <Home className="h-4 w-4" />
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/tasks" className="hover:text-foreground transition-colors">
                        Tasks
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href={`/tasks/${task.id}`} className="hover:text-foreground transition-colors truncate max-w-[150px]">
                        {task.title.length > 20 ? task.title.slice(0, 20) + "..." : task.title}
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">Edit</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
                <p className="text-muted-foreground mt-1">
                    Update task details below.
                </p>
            </div>

            {/* Form Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Task Information</CardTitle>
                    <CardDescription>
                        Make changes to your task details.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Project (Read-only) */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-1">
                                Project <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                value={task.project.name}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Project cannot be changed. Create a new task in the desired project if needed.
                            </p>
                        </div>

                        {/* Task Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-1">
                                Task Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="e.g., Implement login feature, Fix navigation bug"
                                {...register("title")}
                                className={errors.title ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Minimum 3 characters, maximum 100 characters.
                            </p>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe what needs to be done..."
                                rows={4}
                                {...register("description")}
                                className={errors.description ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Maximum 500 characters.
                            </p>
                        </div>

                        {/* Assignee */}
                        <div className="space-y-2">
                            <Label htmlFor="assignedTo">Assign To</Label>
                            <Select
                                value={assignedTo || "unassigned"}
                                onValueChange={(value) => setValue("assignedTo", value === "unassigned" ? null : value)}
                                disabled={!canAssign || isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {members.map((member) => (
                                        <SelectItem key={member.id} value={member.id}>
                                            {member.name} ({member.role === "PROJECT_MANAGER" ? "PM" : "Member"})
                                            {member.id === currentUserId && " (You)"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!canAssign && (
                                <p className="text-xs text-muted-foreground">
                                    Only Admins and Project Managers can change task assignment.
                                </p>
                            )}
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <Label>Due Date (Optional)</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !dueDate && "text-muted-foreground"
                                        )}
                                        disabled={isSubmitting}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dueDate ? format(dueDate, "PPP") : "Pick a due date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dueDate || undefined}
                                        onSelect={(date) => setValue("dueDate", date || null)}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Priority and Status */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Priority */}
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={priority}
                                    onValueChange={(value) => setValue("priority", value as any)}
                                    disabled={isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HIGH">High</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="LOW">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={status}
                                    onValueChange={(value) => setValue("status", value as any)}
                                    disabled={!canEditStatus || isSubmitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TODO">To Do</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {!canEditStatus && (
                                    <p className="text-xs text-muted-foreground">
                                        Only Admins, Project Managers, and the assigned user can change status.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Task"
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}