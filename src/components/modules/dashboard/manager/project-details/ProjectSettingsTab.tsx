"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProject } from "@/actions/project.action";

const projectEditSchema = z.object({
    name: z.string()
        .min(3, "Project name must be at least 3 characters")
        .max(100, "Project name must not exceed 100 characters"),
    description: z.string()
        .max(500, "Description must not exceed 500 characters")
        .optional(),
    deadline: z.date()
        .min(new Date(), "Deadline cannot be in the past"),
    status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"]),
});

type ProjectEditFormValues = z.infer<typeof projectEditSchema>;

interface ProjectSettingsTabProps {
    project: any;
    projectId: string;
    onProjectUpdate: () => void;
}

export function ProjectSettingsTab({ project, projectId, onProjectUpdate }: ProjectSettingsTabProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                toast.success("Project updated successfully");
                onProjectUpdate();
            } else {
                toast.error(result.message || "Failed to update project");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                    <CardDescription>
                        Update your project information and settings.
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
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={selectedStatus}
                            onValueChange={(value) => setValue("status", value as "ACTIVE" | "COMPLETED" | "ON_HOLD")}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Mark as completed when all tasks are done.
                        </p>
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
            </form>
        </Card>
    );
}