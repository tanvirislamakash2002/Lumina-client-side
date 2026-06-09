"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, Loader2, Users, UserPlus } from "lucide-react";
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
import { getProjectMembers } from "@/actions/project-member.action";
import { getAvailableMembers } from "@/actions/project-member.action";
import { addMember } from "@/actions/project-member.action";

const taskSchema = z.object({
    title: z.string().min(3, "Task title must be at least 3 characters").max(100),
    description: z.string().max(500).optional(),
    projectId: z.string({ message: "Please select a project" }),
    assignedTo: z.string().optional(),
    dueDate: z.date().min(new Date(), "Due date cannot be in the past"),
    priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
    status: z.enum(["TODO", "IN_PROGRESS"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface Member {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
}

export function CreateTaskClient({ projects, members, preSelectedProjectId, currentUser }: any) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projectMembers, setProjectMembers] = useState<Member[]>([]);
    const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isAddingMember, setIsAddingMember] = useState(false);

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
    const selectedAssignedTo = watch("assignedTo");

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
                setAvailableMembers(available);

                // Reset assignedTo when project changes
                setValue("assignedTo", "");
            } catch (error) {
                console.error("Failed to fetch project members:", error);
            } finally {
                setIsLoadingMembers(false);
            }
        };

        fetchProjectMembers();
    }, [selectedProjectId, setValue]);

    const handleAssignToChange = async (memberId: string) => {
        if (memberId === "none") {
            setValue("assignedTo", "");
            return;
        }

        // Check if selected member is already in the project
        const isMember = projectMembers.some(m => m.id === memberId);
        
        if (isMember) {
            // Already in project, just assign
            setValue("assignedTo", memberId);
        } else {
            // Need to add to project first
            setIsAddingMember(true);
            try {
                const addResult = await addMember(selectedProjectId, memberId);
                if (addResult.success) {
                    toast.success(`${addResult.data?.name || "Member"} added to project`);
                    // Refresh project members list
                    const membersResult = await getProjectMembers(selectedProjectId, { page: 1, limit: 100 });
                    const updatedMembers = membersResult.success ? membersResult.data?.members || [] : [];
                    setProjectMembers(updatedMembers);
                    
                    // Remove from available list
                    setAvailableMembers(prev => prev.filter(m => m.id !== memberId));
                    
                    // Assign the task
                    setValue("assignedTo", memberId);
                    toast.success("Member added to project and assigned to task");
                } else {
                    toast.error(addResult.message || "Failed to add member to project");
                }
            } catch (error) {
                toast.error("Something went wrong");
            } finally {
                setIsAddingMember(false);
            }
        }
    };

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
        } finally {
            setIsSubmitting(false);
        }
    };

    // Combine project members and available members for dropdown
    const getAssignOptions = () => {
        const options: { label: string; options: { value: string; label: string; isAvailable?: boolean }[] }[] = [];

        if (projectMembers.length > 0) {
            options.push({
                label: "Project Members",
                options: projectMembers.map(m => ({
                    value: m.id,
                    label: `${m.name} (${m.email})`,
                    isAvailable: false,
                })),
            });
        }

        if (availableMembers.length > 0) {
            options.push({
                label: "Available Members (will be added to project)",
                options: availableMembers.map(m => ({
                    value: m.id,
                    label: `${m.name} (${m.email})`,
                    isAvailable: true,
                })),
            });
        }

        return options;
    };

    const selectedProject = projects.find((p: any) => p.id === selectedProjectId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/tasks">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Task</h1>
                    <p className="text-muted-foreground mt-1">Fill in the details below to create a new task.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Main Form */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                                <CardDescription>Basic details about your task.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Task Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Task Title <span className="text-red-500">*</span></Label>
                                    <Input id="title" placeholder="Enter task title" {...register("title")} />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="Describe what needs to be done..." rows={4} {...register("description")} />
                                    <p className="text-xs text-muted-foreground">{watch("description")?.length || 0}/500 characters</p>
                                </div>

                                {/* Project */}
                                <div className="space-y-2">
                                    <Label htmlFor="projectId">Project <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={selectedProjectId || "none"}
                                        onValueChange={(value) => setValue("projectId", value === "none" ? "" : value)}
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
                                    {errors.projectId && <p className="text-sm text-red-500">{errors.projectId.message}</p>}
                                </div>

                                {/* Assigned To - Disabled until project selected */}
                                <div className="space-y-2">
                                    <Label htmlFor="assignedTo">Assign To</Label>
                                    <Select
                                        value={selectedAssignedTo || "none"}
                                        onValueChange={handleAssignToChange}
                                        disabled={!selectedProjectId || isLoadingMembers || isAddingMember}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                !selectedProjectId 
                                                    ? "Select a project first" 
                                                    : isLoadingMembers 
                                                        ? "Loading members..." 
                                                        : "Select a team member (optional)"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Unassigned</SelectItem>
                                            {getAssignOptions().map((group, idx) => (
                                                <div key={idx}>
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                        {group.label}
                                                    </div>
                                                    {group.options.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            <div className="flex items-center gap-2">
                                                                {opt.isAvailable && <UserPlus className="h-3 w-3 text-indigo-500" />}
                                                                <span>{opt.label}</span>
                                                                {opt.isAvailable && (
                                                                    <span className="text-xs text-indigo-500">(will be added)</span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {isAddingMember && (
                                        <p className="text-xs text-indigo-600 flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Adding member to project...
                                        </p>
                                    )}
                                </div>

                                {/* Due Date */}
                                <div className="space-y-2">
                                    <Label>Due Date <span className="text-red-500">*</span></Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, "PPP") : "Select due date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={dueDate} onSelect={(date) => setValue("dueDate", date as Date)} disabled={{ before: new Date() }} />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Priority & Status in two columns */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Priority</Label>
                                        <Select value={watch("priority")} onValueChange={(value) => setValue("priority", value as any)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="LOW">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select value={watch("status")} onValueChange={(value) => setValue("status", value as any)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="TODO">To Do</SelectItem>
                                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Task
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column - Tips */}
                    <div className="lg:col-span-3 space-y-6">
                        {selectedProject && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Selected Project</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="font-medium">{selectedProject.name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{selectedProject.description}</p>
                                    <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                                        <Link href={`/dashboard/projects/${selectedProject.id}`}>View Project</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Task Tips</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>✓ Write clear, actionable titles</p>
                                <p>✓ Set realistic due dates</p>
                                <p>✓ Add detailed descriptions with acceptance criteria</p>
                                <p>✓ Select a project first, then assign to team members</p>
                                <p>✓ Available members will be automatically added to the project</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}