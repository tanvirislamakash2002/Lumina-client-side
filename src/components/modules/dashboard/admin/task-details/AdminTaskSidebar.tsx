"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface AdminTaskSidebarProps {
    task: any;
}

export function AdminTaskSidebar({ task }: AdminTaskSidebarProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Task Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Task ID</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-mono">{task.id}</p>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(task.id, "task-id")}
                            >
                                {copiedId === "task-id" ? (
                                    <Check className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Project ID</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-mono">{task.project?.id || "N/A"}</p>
                            {task.project?.id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(task.project.id, "project-id")}
                                >
                                    {copiedId === "project-id" ? (
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                    {task.createdBy && (
                        <div>
                            <p className="text-xs text-muted-foreground">Created By ID</p>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm font-mono">{task.createdBy.id}</p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(task.createdBy.id, "createdby-id")}
                                >
                                    {copiedId === "createdby-id" ? (
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Audit Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">This task is being viewed in read-only mode.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            As an administrator, you can view all details but cannot make changes.
                            To modify this task, please contact the project manager.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}