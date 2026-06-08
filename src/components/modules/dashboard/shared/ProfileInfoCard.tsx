"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Calendar, Edit2, Save, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateProfile } from "@/actions/user.action";
import { ProfileChangePasswordModal } from "./ProfileChangePasswordModal";

interface ProfileInfoCardProps {
    user: any;
    onRefresh: () => void;
}

export function ProfileInfoCard({ user, onRefresh }: ProfileInfoCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateProfile({ name: name.trim() });
            if (result.success) {
                toast.success("Profile updated successfully");
                setIsEditing(false);
                onRefresh();
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user.name);
        setIsEditing(false);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your personal information</CardDescription>
                </div>
                {!isEditing && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />
                    ) : (
                        <p className="text-sm">{user.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{user.email}</p>
                    </div>
                    {!user.emailVerified && (
                        <p className="text-xs text-amber-600">Email not verified</p>
                    )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <Label>Role</Label>
                    <p className="text-sm capitalize">
                        {user.role === "ADMIN" 
                            ? "Admin" 
                            : user.role === "PROJECT_MANAGER" 
                                ? "Project Manager" 
                                : "Team Member"}
                    </p>
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                            {format(new Date(user.createdAt), "MMMM dd, yyyy")}
                        </p>
                    </div>
                </div>

                {/* Change Password Button */}
                <div className="pt-2">
                    <ProfileChangePasswordModal onRefresh={onRefresh} />
                </div>

                {/* Edit Actions */}
                {isEditing && (
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isLoading ? (
                                <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function LoaderIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}