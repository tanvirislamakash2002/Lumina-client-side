"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Mail, Calendar, Edit2, Save, X, Shield, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateUserRole, suspendUser, activateUser } from "@/actions/admin.action";

interface AdminUserProfileCardProps {
    user: any;
    isOwnProfile: boolean;
    onRefresh: () => void;
}

export function AdminUserProfileCard({ user, isOwnProfile, onRefresh }: AdminUserProfileCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);
    const [isActive, setIsActive] = useState(user.accountStatus === "ACTIVE");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setIsLoading(true);
        try {
            // Update role if changed
            if (role !== user.role && !isOwnProfile) {
                const roleResult = await updateUserRole(user.id, role);
                if (!roleResult.success) {
                    toast.error(roleResult.message || "Failed to update role");
                }
            }

            // Update status if changed
            const newStatus = isActive ? "ACTIVE" : "SUSPENDED";
            if (newStatus !== user.accountStatus && !isOwnProfile) {
                const statusResult = newStatus === "ACTIVE" 
                    ? await activateUser(user.id)
                    : await suspendUser(user.id);
                if (!statusResult.success) {
                    toast.error(statusResult.message || "Failed to update status");
                }
            }

            toast.success("User updated successfully");
            setIsEditing(false);
            onRefresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setIsActive(user.accountStatus === "ACTIVE");
        setIsEditing(false);
    };

    const canEditRole = !isOwnProfile && user.role !== "ADMIN";
    const canEditStatus = !isOwnProfile;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>User account details and settings</CardDescription>
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
                    {isEditing ? (
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm">{user.email}</p>
                        </div>
                    )}
                    {!user.emailVerified && (
                        <p className="text-xs text-amber-600">Email not verified</p>
                    )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                    <Label>Role</Label>
                    {isEditing && canEditRole ? (
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                                <SelectItem value="TEAM_MEMBER">Team Member</SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm capitalize">
                                {user.role === "ADMIN" 
                                    ? "Admin" 
                                    : user.role === "PROJECT_MANAGER" 
                                        ? "Project Manager" 
                                        : "Team Member"}
                            </p>
                        </div>
                    )}
                    {isEditing && !canEditRole && (
                        <p className="text-xs text-muted-foreground">
                            Cannot change role of Admin users
                        </p>
                    )}
                </div>

                {/* Account Status */}
                <div className="space-y-2">
                    <Label>Account Status</Label>
                    {isEditing && canEditStatus ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isActive ? (
                                    <UserCheck className="h-4 w-4 text-emerald-600" />
                                ) : (
                                    <UserX className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-sm">{isActive ? "Active" : "Suspended"}</span>
                            </div>
                            <Switch
                                checked={isActive}
                                onCheckedChange={setIsActive}
                                disabled={isLoading}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {user.accountStatus === "ACTIVE" ? (
                                <UserCheck className="h-4 w-4 text-emerald-600" />
                            ) : (
                                <UserX className="h-4 w-4 text-red-600" />
                            )}
                            <p className="text-sm">{user.accountStatus}</p>
                        </div>
                    )}
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