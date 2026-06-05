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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { updateSecuritySettings } from "@/actions/settings.action";

const securitySchema = z.object({
    twoFactorEnabled: z.boolean(),
    sessionTimeout: z.number(),
    loginNotifications: z.boolean(),
});

type SecurityFormValues = z.infer<typeof securitySchema>;

interface SecurityTabProps {
    initialData: any;
}

const sessionTimeoutOptions = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 240, label: "4 hours" },
    { value: 480, label: "8 hours" },
    { value: 1440, label: "24 hours" },
];

export function SecurityTab({ initialData }: SecurityTabProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch } = useForm<SecurityFormValues>({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            twoFactorEnabled: initialData?.twoFactorEnabled ?? false,
            sessionTimeout: initialData?.sessionTimeout ?? 60,
            loginNotifications: initialData?.loginNotifications ?? true,
        },
    });

    const sessionTimeout = watch("sessionTimeout");

    const onSubmit = async (data: SecurityFormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Saving security settings...");

        const result = await updateSecuritySettings(data);

        if (result.success) {
            toast.success("Security settings saved", { id: toastId });
        } else {
            toast.error(result.message || "Failed to save settings", { id: toastId });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                    Manage your account security preferences
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Two-Factor Authentication */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="twoFactorEnabled">Two-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to your account
                                </p>
                            </div>
                            <Switch
                                id="twoFactorEnabled"
                                {...register("twoFactorEnabled")}
                            />
                        </div>
                        {watch("twoFactorEnabled") && (
                            <div className="rounded-lg bg-muted p-4">
                                <p className="text-sm text-muted-foreground">
                                    2FA setup will be available soon. Please contact support for assistance.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Session Timeout */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Session Management</h3>
                        <div className="space-y-2">
                            <Label htmlFor="sessionTimeout">Session Timeout</Label>
                            <Select
                                value={sessionTimeout.toString()}
                                onValueChange={(value) => setValue("sessionTimeout", parseInt(value))}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select timeout" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sessionTimeoutOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value.toString()}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Automatically log out after period of inactivity
                            </p>
                        </div>
                    </div>

                    {/* Login Notifications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="loginNotifications">Login Notifications</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive email notifications for new logins
                                </p>
                            </div>
                            <Switch
                                id="loginNotifications"
                                {...register("loginNotifications")}
                            />
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