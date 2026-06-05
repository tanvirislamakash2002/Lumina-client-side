"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { updateSystemSettings } from "@/actions/settings.action";

const systemSchema = z.object({
    maintenanceMode: z.boolean(),
    allowRegistration: z.boolean(),
    requireEmailVerification: z.boolean(),
    defaultUserRole: z.enum(["TEAM_MEMBER", "PROJECT_MANAGER"]),
    maxProjectPerUser: z.number().min(1).max(1000),
    maxFileSize: z.number().min(1).max(50),
});

type SystemFormValues = z.infer<typeof systemSchema>;

interface SystemTabProps {
    initialData: any;
}

export function SystemTab({ initialData }: SystemTabProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch } = useForm<SystemFormValues>({
        resolver: zodResolver(systemSchema),
        defaultValues: {
            maintenanceMode: initialData?.maintenanceMode ?? false,
            allowRegistration: initialData?.allowRegistration ?? true,
            requireEmailVerification: initialData?.requireEmailVerification ?? false,
            defaultUserRole: initialData?.defaultUserRole ?? "TEAM_MEMBER",
            maxProjectPerUser: initialData?.maxProjectPerUser ?? 50,
            maxFileSize: initialData?.maxFileSize ?? 5,
        },
    });

    const onSubmit = async (data: SystemFormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Saving system settings...");

        const result = await updateSystemSettings(data);

        if (result.success) {
            toast.success("System settings saved", { id: toastId });
        } else {
            toast.error(result.message || "Failed to save settings", { id: toastId });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                    Configure system-wide settings and limits
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* System Status */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">System Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Put the site into maintenance mode
                                    </p>
                                </div>
                                <Switch
                                    id="maintenanceMode"
                                    {...register("maintenanceMode")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Registration Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Registration</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="allowRegistration">Allow Registration</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow new users to register
                                    </p>
                                </div>
                                <Switch
                                    id="allowRegistration"
                                    {...register("allowRegistration")}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Users must verify email before accessing the platform
                                    </p>
                                </div>
                                <Switch
                                    id="requireEmailVerification"
                                    {...register("requireEmailVerification")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="defaultUserRole">Default User Role</Label>
                                <Select
                                    value={watch("defaultUserRole")}
                                    onValueChange={(value) => setValue("defaultUserRole", value as "TEAM_MEMBER" | "PROJECT_MANAGER")}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                                        <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Limits */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Limits</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="maxProjectPerUser">Max Projects per User</Label>
                                <Input
                                    id="maxProjectPerUser"
                                    type="number"
                                    {...register("maxProjectPerUser", { valueAsNumber: true })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                                <Input
                                    id="maxFileSize"
                                    type="number"
                                    step="1"
                                    {...register("maxFileSize", { valueAsNumber: true })}
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}