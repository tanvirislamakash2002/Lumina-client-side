"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { updateTask } from "@/actions/task.action";
import { DeleteTaskDialog } from "../DeleteTaskDialog";

// Form validation schema
const taskEditSchema = z.object({
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
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
});

type TaskEditFormValues = z.infer<typeof taskEditSchema>;

interface EditTaskClientProps {
    task: any;
    projects: any[];
    members: any[];
    canEditAll: boolean;
    currentUserId: string;
    userRole: string;
    taskId: string;
}

const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function EditTaskClient({
    task,
    projects,
    members,
    canEditAll,
    currentUserId,
    userRole,
    taskId,
}: EditTaskClientProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [filteredMembers, setFilteredMembers] = useState(members);

    // Filter members based on role for dropdown
    useEffect(() => {
        let filtered = members;
        if (userRole === "PROJECT_MANAGER") {
            filtered = members.filter(
                (member: any) => member.id === currentUserId || member.role === "TEAM_MEMBER"
            );
        }
        setFilteredMembers(filtered);
    }, [members, userRole, currentUserId]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TaskEditFormValues>({
        resolver: zodResolver(taskEditSchema),
        defaultValues: {
            title: task.title,
            description: task.description || "",
            projectId: task.project?.id || "",
            assignedTo: task.assignedTo?.id || "",
            dueDate: new Date(task.dueDate),
            priority: task.priority,
            status: task.status,
        },
    });

    const dueDate = watch("dueDate");
    const selectedStatus = watch("status");
    const descriptionValue = watch("description") || "";
    const isTaskCompleted = task.status === "COMPLETED";

    const onSubmit = async (data: TaskEditFormValues) => {
        // Prevent reassigning completed tasks
        if (isTaskCompleted && data.assignedTo !== task.assignedTo?.id) {
            toast.error("Completed tasks cannot be reassigned");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateTask(taskId, {
                title: data.title,
                description: data.description,
                assignedTo: data.assignedTo,
                dueDate: data.dueDate.toISOString(),
                priority: data.priority,
                status: data.status,
            });

            if (result.success) {
                toast.success("Task updated successfully!");
                router.push(`/dashboard/tasks/${taskId}`);
                router.refresh();
            } else {
                toast.error(result.message || "Failed to update task");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error("Update task error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSuccess = () => {
        router.push("/dashboard/tasks");
        router.refresh();
    };

    // Determine which fields are disabled
    const isProjectDisabled = !canEditAll || isTaskCompleted;
    const isAssigneeDisabled = !canEditAll || isTaskCompleted;
    const isDueDateDisabled = !canEditAll;
    const isPriorityDisabled = !canEditAll;
    const isStatusDisabled = !canEditAll && !canEditAll; // Assigned user can change status

    return (
        <div className="space-y-6">
            {/* Header with breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/tasks/${taskId}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
                        <p className="text-muted-foreground mt-1">
                            Update your task information.
                        </p>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <Badge className={statusColors[task.status]}>
                        Current: {task.status.replace("_", " ")}
                    </Badge>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Main Form - Left Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                                <CardDescription>
                                    Update the details of your task.
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
                                        disabled={!canEditAll}
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
                                        value={watch("projectId") || "none"}
                                        onValueChange={(value) => setValue("projectId", value === "none" ? "" : value, { shouldValidate: true })}
                                        disabled={isProjectDisabled}
                                    >
                                        <SelectTrigger className={errors.projectId ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none" disabled>Select a project</SelectItem>
                                            {projects.map((project) => (
                                                <SelectItem key={project.id} value={project.id}>
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {isTaskCompleted && (
                                        <p className="text-xs text-amber-600">
                                            Project cannot be changed for completed tasks.
                                        </p>
                                    )}
                                    {errors.projectId && (
                                        <p className="text-sm text-red-500">{errors.projectId.message}</p>
                                    )}
                                </div>

                                {/* Assigned To */}
                                <div className="space-y-2">
                                    <Label htmlFor="assignedTo">Assign To</Label>
                                    <Select
                                        value={watch("assignedTo") || "none"}
                                        onValueChange={(value) => setValue("assignedTo", value === "none" ? "" : value)}
                                        disabled={isAssigneeDisabled}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a team member" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Unassigned</SelectItem>
                                            {filteredMembers.map((member: any) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{member.name}</span>
                                                        {member.id === currentUserId && (
                                                            <span className="text-xs text-indigo-600">(Me)</span>
                                                        )}
                                                        {member.role === "TEAM_MEMBER" && (
                                                            <span className="text-xs text-muted-foreground">(Member)</span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {isTaskCompleted && (
                                        <p className="text-xs text-amber-600">
                                            Completed tasks cannot be reassigned.
                                        </p>
                                    )}
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
                                                disabled={isDueDateDisabled}
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
                                        disabled={isPriorityDisabled}
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
                                        value={selectedStatus}
                                        onValueChange={(value) => setValue("status", value as "TODO" | "IN_PROGRESS" | "COMPLETED", { shouldValidate: true })}
                                    >
                                        <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="TODO">To Do</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedStatus === "COMPLETED" 
                                            ? "Marking as completed will archive this task." 
                                            : "Update status as work progresses."}
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
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column (3 cols) - Info & Danger Zone */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Task Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                                <CardDescription>
                                    Read-only task details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Created At</p>
                                    <p className="text-sm font-medium">
                                        {format(new Date(task.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                    <p className="text-sm font-medium">
                                        {format(new Date(task.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Task ID</p>
                                    <p className="text-sm font-mono text-muted-foreground">
                                        {task.id}
                                    </p>
                                </div>
                                {task.createdBy && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Created By</p>
                                        <p className="text-sm font-medium">{task.createdBy.name}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Danger Zone - Only for PM/Admin */}
                        {(userRole === "ADMIN" || userRole === "PROJECT_MANAGER") && (
                            <Card className="border-red-200 dark:border-red-900">
                                <CardHeader>
                                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                    <CardDescription>
                                        Irreversible actions for this task.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Delete Task</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Permanently delete this task and all its comments and attachments.
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => setDeleteDialogOpen(true)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Task
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </form>

            <DeleteTaskDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                task={task}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}