"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Loader2, X, KeyRound } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { updateProfile } from "@/actions/user.action";
import { uploadAvatar, removeAvatar } from "@/actions/upload.action";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileInfoCardProps {
    user: any;
    profile: any;
    onUpdate: () => void;
    onOpenPasswordDialog: () => void;
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    PROJECT_MANAGER: "Project Manager",
    TEAM_MEMBER: "Team Member",
};

export function ProfileInfoCard({ user, profile, onUpdate, onOpenPasswordDialog }: ProfileInfoCardProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: profile?.name || user.name,
        },
    });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading avatar...");

        const formData = new FormData();
        formData.append("image", file);

        const result = await uploadAvatar(formData);

        if (result.success) {
            toast.success("Avatar updated", { id: toastId });
            setAvatarPreview(result.data?.url);
            onUpdate();
        } else {
            toast.error(result.message || "Failed to upload avatar", { id: toastId });
        }
        setIsUploading(false);
    };

    const handleRemoveAvatar = async () => {
        const toastId = toast.loading("Removing avatar...");
        const result = await removeAvatar();

        if (result.success) {
            toast.success("Avatar removed", { id: toastId });
            setAvatarPreview(null);
            onUpdate();
        } else {
            toast.error(result.message || "Failed to remove avatar", { id: toastId });
        }
    };

    const onSubmit = async (data: ProfileFormValues) => {
        const toastId = toast.loading("Updating profile...");
        const result = await updateProfile({ name: data.name });

        if (result.success) {
            toast.success("Profile updated", { id: toastId });
            onUpdate();
        } else {
            toast.error(result.message || "Failed to update profile", { id: toastId });
            setError("name", { message: result.message });
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your personal information and profile picture
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarPreview || undefined} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                        {!avatarPreview ? (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-600 rounded-full text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4" />
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleRemoveAvatar}
                                disabled={isUploading}
                                className="absolute -bottom-2 -right-2 p-1.5 bg-red-500 rounded-full text-white shadow-md hover:bg-red-600 disabled:opacity-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                        <p className="text-sm text-muted-foreground">
                            Upload a profile picture (JPG, PNG, GIF - max 2MB)
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Recommended size: 200x200 pixels
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                {...register("name")}
                                className={errors.name ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email (read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Email cannot be changed. Contact support if needed.
                            </p>
                        </div>
                    </div>

                    {/* Role (read-only) */}
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Badge className={roleColors[user.role]}>
                            {roleLabels[user.role]}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                            Role determines your permissions. Contact an admin to change your role.
                        </p>
                    </div>

                    {/* Member Since */}
                    <div className="space-y-2">
                        <Label>Member Since</Label>
                        <p className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
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
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onOpenPasswordDialog}
                            className="gap-2"
                        >
                            <KeyRound className="h-4 w-4" />
                            Change Password
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}