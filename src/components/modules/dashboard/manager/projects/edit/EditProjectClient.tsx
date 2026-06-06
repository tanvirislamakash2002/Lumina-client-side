"use client";

import { useState } from "react";
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
import { updateProject } from "@/actions/project.action";
import { DeleteProjectDialog } from "../DeleteProjectDialog";

// Form validation schema
const projectEditSchema = z.object({
    name: z.string()
        .min(3, "Project name must be at least 3 characters")
        .max(100, "Project name must not exceed 100 characters"),
    description: z.string()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
    deadline: z.date()
        .min(new Date(), "Deadline cannot be in the past"),
    status: z.enum(["ACTIVE", "ON_HOLD", "COMPLETED"]),
});

type ProjectEditFormValues = z.infer<typeof projectEditSchema>;

interface EditProjectClientProps {
    project: any;
    projectId: string;
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    ON_HOLD: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function EditProjectClient({ project, projectId }: EditProjectClientProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProjectEditFormValues>({
        resolver: zodResolver(projectEditSchema),
        defaultValues: {
            name: project.name,
            description: project.description || "",
            deadline: new Date(project.deadline),
            status: project.status,
        },
    });

    const deadline = watch("deadline");
    const selectedStatus = watch("status");
    const descriptionValue = watch("description") || "";

    const onSubmit = async (data: ProjectEditFormValues) => {
        setIsSubmitting(true);
        try {
            const result = await updateProject(projectId, {
                name: data.name,
                description: data.description,
                deadline: data.deadline.toISOString(),
                status: data.status,
            });

            if (result.success) {
                toast.success("Project updated successfully!");
                router.push(`/dashboard/projects/${projectId}`);
                router.refresh();
            } else {
                toast.error(result.message || "Failed to update project");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error("Update project error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSuccess = () => {
        router.push("/dashboard/projects");
        router.refresh();
    };

    return (
        <div className="space-y-6">
            {/* Header with breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/projects/${projectId}`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
                        <p className="text-muted-foreground mt-1">
                            Update your project information and settings.
                        </p>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status]}`}>
                        Current: {project.status.replace("_", " ")}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 lg:grid-cols-7">
                    {/* Main Form - Left Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Information</CardTitle>
                                <CardDescription>
                                    Update the basic details of your project.
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
                                        {descriptionValue.length}/500 characters
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
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={selectedStatus}
                                        onValueChange={(value) => setValue("status", value as "ACTIVE" | "ON_HOLD" | "COMPLETED")}
                                    >
                                        <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedStatus === "COMPLETED" 
                                            ? "Marking as completed will archive this project." 
                                            : "Projects can be put on hold or marked as completed when done."}
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
                        {/* Project Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Information</CardTitle>
                                <CardDescription>
                                    Read-only project details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Created At</p>
                                    <p className="text-sm font-medium">
                                        {format(new Date(project.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Last Updated</p>
                                    <p className="text-sm font-medium">
                                        {format(new Date(project.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Project ID</p>
                                    <p className="text-sm font-mono text-muted-foreground">
                                        {project.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="border-red-200 dark:border-red-900">
                            <CardHeader>
                                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                                <CardDescription>
                                    Irreversible actions for this project.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Delete Project</p>
                                            <p className="text-sm text-muted-foreground">
                                                Permanently delete this project and all its tasks, comments, and attachments.
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => setDeleteDialogOpen(true)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Project
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            <DeleteProjectDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                project={project}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
}