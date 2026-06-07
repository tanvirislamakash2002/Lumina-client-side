"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { CalendarIcon, Loader2, User, Flag, Calendar as CalendarIcon2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateTask } from "@/actions/task.action";
import { getTeamMembers } from "@/actions/user.action";
import { useEffect } from "react";

interface TaskSidebarProps {
    task: any;
    canEdit: boolean;
    currentUserId: string;
    userRole: string;
    onTaskUpdate: () => void;
}

export function TaskSidebar({ task, canEdit, currentUserId, userRole, onTaskUpdate }: TaskSidebarProps) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [selectedAssignee, setSelectedAssignee] = useState(task.assignedTo?.id || "");
    const [selectedPriority, setSelectedPriority] = useState(task.priority);
    const [selectedDueDate, setSelectedDueDate] = useState<Date>(new Date(task.dueDate));

    useEffect(() => {
        const loadMembers = async () => {
            const result = await getTeamMembers();
            if (result.success) {
                let filteredMembers = result.data || [];

                if (userRole === "PROJECT_MANAGER") {
                    filteredMembers = filteredMembers.filter(
                        (member: { id: string; role: string }) => member.id === currentUserId || member.role === "TEAM_MEMBER"
                    );
                }
                setMembers(filteredMembers);
            }
        };
        if (canEdit) {
            loadMembers();
        }
    }, [canEdit, currentUserId, userRole]);

    const handleUpdate = async (field: string, value: any) => {
        setIsUpdating(true);
        try {
            const updateData: any = {};
            if (field === "assignedTo") updateData.assignedTo = value || null;
            if (field === "priority") updateData.priority = value;
            if (field === "dueDate") updateData.dueDate = value.toISOString();

            const result = await updateTask(task.id, updateData);
            if (result.success) {
                toast.success(`${field} updated successfully`);
                onTaskUpdate();
            } else {
                toast.error(result.message || `Failed to update ${field}`);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!canEdit) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Task Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Priority</span>
                        <span className="text-sm font-medium">{task.priority}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Due Date</span>
                        <span className="text-sm">{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Assigned To</span>
                        <span className="text-sm">{task.assignedTo?.name || "Unassigned"}</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Assign To */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Assign To
                    </label>
                    <Select
                        value={selectedAssignee}
                        onValueChange={(value) => {
                            setSelectedAssignee(value);
                            handleUpdate("assignedTo", value === "none" ? "" : value);
                        }}
                        disabled={isUpdating}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Unassigned</SelectItem>
                            {members.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                    {member.name} {member.id === currentUserId && "(Me)"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Flag className="h-4 w-4" />
                        Priority
                    </label>
                    <Select
                        value={selectedPriority}
                        onValueChange={(value) => {
                            setSelectedPriority(value);
                            handleUpdate("priority", value);
                        }}
                        disabled={isUpdating}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <CalendarIcon2 className="h-4 w-4" />
                        Due Date
                    </label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !selectedDueDate && "text-muted-foreground"
                                )}
                                disabled={isUpdating}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDueDate ? format(selectedDueDate, "PPP") : "Select date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDueDate}
                                onSelect={(date) => {
                                    if (date) {
                                        setSelectedDueDate(date);
                                        handleUpdate("dueDate", date);
                                    }
                                }}
                                disabled={{ before: new Date() }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {isUpdating && (
                    <div className="flex justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}