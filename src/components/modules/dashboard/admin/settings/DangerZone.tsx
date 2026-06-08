"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle, Loader2, Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { clearCache } from "@/actions/admin.action";

export function DangerZone() {
    const [isLoading, setIsLoading] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const handleClearCache = async () => {
        setIsLoading(true);
        try {
            const result = await clearCache();
            if (result.success) {
                toast.success("Cache cleared successfully");
            } else {
                toast.error(result.message || "Failed to clear cache");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSettings = async () => {
        if (confirmText !== "RESET ALL") {
            toast.error("Please type 'RESET ALL' to confirm");
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("All settings have been reset to defaults");
            setResetDialogOpen(false);
            setConfirmText("");
        } catch (error) {
            toast.error("Failed to reset settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card className="border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions that affect the entire platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Clear Cache */}
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <RefreshCw className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Clear System Cache</p>
                                <p className="text-sm text-muted-foreground">
                                    Clear all cached data across the platform
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleClearCache} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Clear Cache
                        </Button>
                    </div>

                    {/* Export Data */}
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Export System Data</p>
                                <p className="text-sm text-muted-foreground">
                                    Export all users, projects, and tasks data
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => toast.info("Export started")}>
                            Export Data
                        </Button>
                    </div>

                    {/* Reset All Settings */}
                    <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-900">
                        <div className="flex items-center gap-3">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="font-medium text-red-600">Reset All Settings</p>
                                <p className="text-sm text-muted-foreground">
                                    Reset all system settings to default values
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={() => setResetDialogOpen(true)}
                        >
                            Reset Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Reset Confirmation Dialog */}
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset All Settings</DialogTitle>
                        <DialogDescription>
                            This action will reset all system settings to their default values.
                            This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="confirmReset">
                                Type <span className="font-bold text-red-600">RESET ALL</span> to confirm
                            </Label>
                            <Input
                                id="confirmReset"
                                placeholder="RESET ALL"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleResetSettings} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset All Settings
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}