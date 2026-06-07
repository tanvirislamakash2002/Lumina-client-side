"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatar, removeAvatar } from "@/actions/upload.action";
import { format } from "date-fns";

interface ProfileHeaderProps {
    user: any;
    onRefresh: () => void;
}

const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    PROJECT_MANAGER: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    TEAM_MEMBER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export function ProfileHeader({ user, onRefresh }: ProfileHeaderProps) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadAvatar(formData);
            if (result.success) {
                toast.success("Avatar updated successfully");
                onRefresh();
                router.refresh();
            } else {
                toast.error(result.message || "Failed to upload avatar");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!user.image) return;
        if (!confirm("Are you sure you want to remove your avatar?")) return;

        setIsUploading(true);
        try {
            const result = await removeAvatar();
            if (result.success) {
                toast.success("Avatar removed successfully");
                onRefresh();
                router.refresh();
            } else {
                toast.error(result.message || "Failed to remove avatar");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-1 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
                >
                    {isUploading ? (
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                        <Camera className="h-4 w-4 text-white" />
                    )}
                </label>
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                />
                {user.image && (
                    <button
                        onClick={handleRemoveAvatar}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white text-xs hover:bg-red-600 transition-colors"
                        disabled={isUploading}
                    >
                        ×
                    </button>
                )}
            </div>

            <div>
                <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <Badge className={roleColors[user.role]}>
                        {user.role.replace("_", " ")}
                    </Badge>
                    <Badge variant={user.accountStatus === "ACTIVE" ? "default" : "destructive"}>
                        {user.accountStatus}
                    </Badge>
                </div>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Member since {format(new Date(user.createdAt), "MMMM dd, yyyy")}
                </p>
            </div>
        </div>
    );
}