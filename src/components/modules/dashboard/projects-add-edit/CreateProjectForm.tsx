"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
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

import { createProject } from "@/actions/project.action";

// Form validation schema - all fields are required in the form
const projectSchema = z.object({
    name: z.string()
        .min(3, "Project name must be at least 3 characters")
        .max(100, "Project name must be less than 100 characters"),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
    deadline: z.date().nullable().optional(),
    status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD"]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function CreateProjectForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        setError,
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
            deadline: null,
            status: "ACTIVE",
        },
    });

    const deadline = watch("deadline");
    const status = watch("status");

    const onSubmit = async (data: ProjectFormValues) => {
        const toastId = toast.loading("Creating project...");

        try {
            const result = await createProject({
                name: data.name,
                description: data.description,
                deadline: data.deadline ? data.deadline.toISOString() : undefined,
                status: data.status,
            });

            if (!result.success) {
                toast.error(result.message || "Failed to create project", { id: toastId });

                if (result.message?.includes("already exists")) {
                    setError("name", { message: result.message });
                }
                return;
            }

            toast.success("Project created successfully!", { id: toastId });
            router.push("/projects");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong. Please try again.", { id: toastId });
            console.error("Create project error:", error);
        }
    };

    const handleCancel = () => {
        router.push("/projects");
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
                <p className="text-muted-foreground mt-1">
                    Create a new project to start managing tasks and collaborating with your team.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                    <CardDescription>
                        Fill in the details below to create your project.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Project Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-1">
                                Project Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                placeholder="e.g., Website Redesign, Mobile App Development"
                                {...register("name")}
                                className={errors.name ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
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
                                placeholder="Describe what this project is about..."
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

                        {/* Deadline */}
                        <div className="space-y-2">
                            <Label>Deadline (Optional)</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !deadline && "text-muted-foreground"
                                        )}
                                        disabled={isSubmitting}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deadline ? format(deadline, "PPP") : "Pick a deadline"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={deadline || undefined}
                                        onSelect={(date) => setValue("deadline", date || null)}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-xs text-muted-foreground">
                                Leave blank to set a default deadline (30 days from now).
                            </p>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={status}
                                onValueChange={(value) => setValue("status", value as "ACTIVE" | "ON_HOLD")}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Projects start as "Active" by default. "Completed" can be set later.
                            </p>
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
                                        Creating...
                                    </>
                                ) : (
                                    "Create Project"
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