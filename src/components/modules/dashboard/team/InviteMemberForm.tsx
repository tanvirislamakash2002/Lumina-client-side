"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAvailableMembers, addMember } from "@/actions/project-member.action";

const formSchema = z.object({
    userId: z.string().min(1, "Please select a user"),
});

type FormValues = z.infer<typeof formSchema>;

interface InviteMemberFormProps {
    projectId: string;
    onClose: () => void;
}

export function InviteMemberForm({ projectId, onClose }: InviteMemberFormProps) {
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userId: "",
        },
    });

    const selectedUserId = watch("userId");

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const result = await getAvailableMembers(projectId);
            if (result.success && result.data) {
                setAvailableUsers(result.data);
            }
            setIsLoading(false);
        };
        fetchUsers();
    }, [projectId]);

    const filteredUsers = availableUsers.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const selectedUser = availableUsers.find((u) => u.id === selectedUserId);

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        const toastId = toast.loading("Adding member to project...");
        
        const result = await addMember(projectId, data.userId);
        
        if (result.success) {
            toast.success("Team member added successfully!", { id: toastId });
            onClose();
        } else {
            toast.error(result.message || "Failed to add member", { id: toastId });
        }
        setIsSubmitting(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* User Selection */}
            <div className="space-y-2">
                <Label>Select User</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="border rounded-lg max-h-48 overflow-y-auto divide-y">
                    {filteredUsers.length === 0 ? (
                        <p className="p-4 text-center text-muted-foreground text-sm">
                            No available users found
                        </p>
                    ) : (
                        filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
                                    selectedUserId === user.id ? "bg-muted" : ""
                                }`}
                                onClick={() => setValue("userId", user.id)}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.image || undefined} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {user.role === "PROJECT_MANAGER" ? "PM" : 
                                     user.role === "TEAM_MEMBER" ? "Member" : user.role}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
                {errors.userId && (
                    <p className="text-sm text-red-500">{errors.userId.message}</p>
                )}
            </div>

            {/* Selected User Preview */}
            {selectedUser && (
                <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Selected User</p>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={selectedUser.image || undefined} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                {getInitials(selectedUser.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{selectedUser.name}</span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
                <Button
                    type="submit"
                    disabled={isSubmitting || !selectedUserId}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        "Add to Project"
                    )}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}