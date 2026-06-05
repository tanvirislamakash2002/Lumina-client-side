"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

import { updateGeneralSettings } from "@/actions/settings.action";

const generalSchema = z.object({
    siteName: z.string().min(1, "Site name is required"),
    siteDescription: z.string().optional(),
    contactEmail: z.string().email("Invalid email address"),
    timezone: z.string(),
    dateFormat: z.string(),
});

type GeneralFormValues = z.infer<typeof generalSchema>;

const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Asia/Dubai", label: "Dubai" },
    { value: "Asia/Kolkata", label: "Mumbai" },
    { value: "Asia/Tokyo", label: "Tokyo" },
    { value: "Australia/Sydney", label: "Sydney" },
];

const dateFormats = [
    { value: "MM/dd/yyyy", label: "MM/DD/YYYY", example: "12/31/2024" },
    { value: "dd/MM/yyyy", label: "DD/MM/YYYY", example: "31/12/2024" },
    { value: "yyyy-MM-dd", label: "YYYY-MM-DD", example: "2024-12-31" },
    { value: "MMM dd, yyyy", label: "MMM DD, YYYY", example: "Dec 31, 2024" },
];

interface GeneralTabProps {
    initialData: any;
}

export function GeneralTab({ initialData }: GeneralTabProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch } = useForm<GeneralFormValues>({
        resolver: zodResolver(generalSchema),
        defaultValues: {
            siteName: initialData?.siteName ?? "Lumina",
            siteDescription: initialData?.siteDescription ?? "",
            contactEmail: initialData?.contactEmail ?? "",
            timezone: initialData?.timezone ?? "UTC",
            dateFormat: initialData?.dateFormat ?? "MM/dd/yyyy",
        },
    });

    const onSubmit = async (data: GeneralFormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Saving general settings...");

        const result = await updateGeneralSettings(data);

        if (result.success) {
            toast.success("General settings saved", { id: toastId });
        } else {
            toast.error(result.message || "Failed to save settings", { id: toastId });
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                    Manage your site-wide settings
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                            id="siteName"
                            {...register("siteName")}
                            placeholder="Lumina"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="siteDescription">Site Description</Label>
                        <Textarea
                            id="siteDescription"
                            {...register("siteDescription")}
                            placeholder="Describe your platform"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                            id="contactEmail"
                            type="email"
                            {...register("contactEmail")}
                            placeholder="support@example.com"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select
                                value={watch("timezone")}
                                onValueChange={(value) => setValue("timezone", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timezones.map((tz) => (
                                        <SelectItem key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateFormat">Date Format</Label>
                            <Select
                                value={watch("dateFormat")}
                                onValueChange={(value) => setValue("dateFormat", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select date format" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dateFormats.map((format) => (
                                        <SelectItem key={format.value} value={format.value}>
                                            {format.label} ({format.example})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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