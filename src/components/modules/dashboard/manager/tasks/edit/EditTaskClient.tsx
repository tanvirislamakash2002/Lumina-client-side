"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Loader2, Trash2, UserPlus } from "lucide-react";
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
import { getProjectMembers, getAvailableMembers, addMember } from "@/actions/project-member.action";
import { DeleteTaskDialog } from "../DeleteTaskDialog";

const taskEditSchema = z.object({
    title: z.string().min(3, "Task title must be at least 3 characters").max(100),
    description: z.string().max(500).optional(),
    projectId: z.string({ message: "Please select a project" }),
    assignedTo: z.string().optional(),
    dueDate: z.date().min(new Date(), "Due date cannot be in the past"),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
});

type TaskEditFormValues = z.infer<typeof taskEditSchema>;

const statusColors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

export function EditTaskClient({ task, projects, members, canEditAll, currentUserId, userRole, taskId }: any) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectMembers, setProjectMembers] = useState<any[]>([]);
    const [availableMembers, setAvailableMembers] = useState<any[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isAddingMember, setIsAddingMember] = useState(false);

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
    const selectedProjectId = watch("projectId");
    const selectedAssignedTo = watch("assignedTo");
    const isTaskCompleted = task.status === "COMPLETED";

    // Fetch project members when project changes
    useEffect(() => {
        const fetchProjectMembers = async () => {
            if (!selectedProjectId) {
                setProjectMembers([]);
                setAvailableMembers([]);
                return;
            }

            setIsLoadingMembers(true);
            try {
                // Fetch current project members
                const membersResult = await getProjectMembers(selectedProjectId, { page: 1, limit: 100 });
                const currentMembers = membersResult.success ? membersResult.data?.members || [] : [];
                setProjectMembers(currentMembers);

                // Fetch available members (users not in project)
                const availableResult = await getAvailableMembers(selectedProjectId);
                const available = availableResult.success ? availableResult.data || [] : [];
                
                // Filter out current assignee if they're not in project (but are assigned to task)
                const filteredAvailable = available.filter((m: any) => m.id !== task.assignedTo?.id);
                setAvailableMembers(filteredAvailable);
            } catch (error) {
                console.error("Failed to fetch project members:", error);
            } finally {
                setIsLoadingMembers(false);
            }
        };

        fetchProjectMembers();
    }, [selectedProjectId, task.assignedTo?.id]);

    const handleAssignToChange = async (memberId: string) => {
        if (memberId === "none") {
            setValue("assignedTo", "");
            return;
        }

        // Check if selected member is already in the project
        const isMember = projectMembers.some((m: any) => m.id === memberId);
        
        if (isMember) {
            setValue("assignedTo", memberId);
        } else {
            setIsAddingMember(true);
            try {
                const addResult = await addMember(selectedProjectId, memberId);
                if (addResult.success) {
                    toast.success("Member added to project");
                    
                    // Refresh project members
                    const membersResult = await getProjectMembers(selectedProjectId, { page: 1, limit: 100 });
                    const updatedMembers = membersResult.success ? membersResult.data?.members || [] : [];
                    setProjectMembers(updatedMembers);
                    
                    // Remove from available
                    setAvailableMembers(prev => prev.filter((m: any) => m.id !== memberId));
                    
                    setValue("assignedTo", memberId);
                    toast.success("Member added to project and assigned to task");
                } else {
                    toast.error(addResult.message || "Failed to add member");
                }
            } catch (error) {
                toast.error("Something went wrong");
            } finally {
                setIsAddingMember(false);
            }
        }
    };

    const onSubmit = async (data: TaskEditFormValues) => {
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
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAssignOptions = () => {
        const options: any[] = [];

        // Current assignee if not in project members
        const currentAssignee = task.assignedTo;
        const isCurrentInProject = projectMembers.some((m: any) => m.id === currentAssignee?.id);
        
        if (currentAssignee && !isCurrentInProject) {
            options.push({
                label: "Current Assignee",
                options: [{
                    value: currentAssignee.id,
                    label: `${currentAssignee.name} (${currentAssignee.email}) - Current`,
                    isAvailable: false,
                }],
            });
        }

        if (projectMembers.length > 0) {
            options.push({
                label: "Project Members",
                options: projectMembers.map((m: any) => ({
                    value: m.id,
                    label: `${m.name} (${m.email})`,
                    isAvailable: false,
                })),
            });
        }

        if (availableMembers.length > 0) {
            options.push({
                label: "Available Members (will be added to project)",
                options: availableMembers.map((m: any) => ({
                    value: m.id,
                    label: `${m.name} (${m.email})`,
                    isAvailable: true,
                })),
            });
        }

        return options;
    };

    const isProjectDisabled = !canEditAll || isTaskCompleted;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/tasks/${taskId}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Task</h1>
                        <p className="text-muted-foreground mt-1">Update your task information.</p>
                    </div>
                </div>
                <Badge className={statusColors[task.status]}>Current: {task.status.replace("_", " ")}</Badge>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Main Form */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                                <CardDescription>Update the details of your task.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label>Task Title <span className="text-red-500">*</span></Label>
                                    <Input {...register("title")} disabled={!canEditAll} />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea rows={4} {...register("description")} />
                                    <p className="text-xs text-muted-foreground">{watch("description")?.length || 0}/500</p>
                                </div>

                                {/* Project */}
                                <div className="space-y-2">
                                    <Label>Project <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={selectedProjectId || "none"}
                                        onValueChange={(value) => setValue("projectId", value === "none" ? "" : value)}
                                        disabled={isProjectDisabled}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a project" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none" disabled>Select a project</SelectItem>
                                            {projects.map((project: any) => (
                                                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {isTaskCompleted && <p className="text-xs text-amber-600">Project cannot be changed for completed tasks.</p>}
                                </div>

                                {/* Assigned To */}
                                <div className="space-y-2">
                                    <Label>Assign To</Label>
                                    <Select
                                        value={selectedAssignedTo || "none"}
                                        onValueChange={handleAssignToChange}
                                        disabled={!selectedProjectId || isLoadingMembers || isAddingMember || isTaskCompleted}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={!selectedProjectId ? "Select a project first" : "Select a team member"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Unassigned</SelectItem>
                                            {getAssignOptions().map((group, idx) => (
                                                <div key={idx}>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{group.label}</div>
                                                    {group.options.map((opt: any) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            <div className="flex items-center gap-2">
                                                                {opt.isAvailable && <UserPlus className="h-3 w-3 text-indigo-500" />}
                                                                <span>{opt.label}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {isTaskCompleted && <p className="text-xs text-amber-600">Completed tasks cannot be reassigned.</p>}
                                    {isAddingMember && <p className="text-xs text-indigo-600">Adding member to project...</p>}
                                </div>

                                {/* Due Date */}
                                <div className="space-y-2">
                                    <Label>Due Date <span className="text-red-500">*</span></Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left", !dueDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, "PPP") : "Select date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={dueDate} onSelect={(date) => setValue("dueDate", date as Date)} disabled={{ before: new Date() }} />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Priority & Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Priority</Label>
                                        <Select value={watch("priority")} onValueChange={(value) => setValue("priority", value as any)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="LOW">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={selectedStatus} onValueChange={(value) => setValue("status", value as any)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TODO">To Do</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-3 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div><p className="text-xs text-muted-foreground">Created At</p><p className="text-sm">{format(new Date(task.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</p></div>
                                <div><p className="text-xs text-muted-foreground">Last Updated</p><p className="text-sm">{format(new Date(task.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}</p></div>
                                <div><p className="text-xs text-muted-foreground">Task ID</p><p className="text-sm font-mono">{task.id}</p></div>
                            </CardContent>
                        </Card>

                        {(userRole === "ADMIN" || userRole === "PROJECT_MANAGER") && (
                            <Card className="border-red-200">
                                <CardHeader><CardTitle className="text-red-600">Danger Zone</CardTitle></CardHeader>
                                <CardContent>
                                    <Button type="button" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete Task
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </form>

            <DeleteTaskDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} task={task} onSuccess={() => router.push("/dashboard/tasks")} />
        </div>
    );
}