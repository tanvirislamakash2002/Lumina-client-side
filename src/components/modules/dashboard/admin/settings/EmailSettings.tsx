"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Eye, EyeOff, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export function EmailSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [settings, setSettings] = useState({
        smtpHost: "",
        smtpPort: 587,
        encryption: "tls",
        smtpUsername: "",
        smtpPassword: "",
        fromEmail: "",
        fromName: "",
    });
    const [testEmail, setTestEmail] = useState("");

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Email settings saved successfully");
        } catch (error) {
            toast.error("Failed to save email settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestEmail = async () => {
        if (!testEmail) {
            toast.error("Please enter a test email address");
            return;
        }
        
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success(`Test email sent to ${testEmail}`);
            setTestEmail("");
        } catch (error) {
            toast.error("Failed to send test email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                    Configure SMTP server for sending emails.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* SMTP Configuration */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium">SMTP Configuration</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                            id="smtpHost"
                            placeholder="smtp.gmail.com"
                            value={settings.smtpHost}
                            onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                            id="smtpPort"
                            type="number"
                            placeholder="587"
                            value={settings.smtpPort}
                            onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) || 587 })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="encryption">Encryption</Label>
                        <Select
                            value={settings.encryption}
                            onValueChange={(value) => setSettings({ ...settings, encryption: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="tls">TLS/STARTTLS</SelectItem>
                                <SelectItem value="ssl">SSL/TLS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="smtpUsername">SMTP Username</Label>
                        <Input
                            id="smtpUsername"
                            placeholder="user@example.com"
                            value={settings.smtpUsername}
                            onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                        <div className="relative">
                            <Input
                                id="smtpPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={settings.smtpPassword}
                                onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sender Information */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">Sender Information</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="fromEmail">From Email</Label>
                        <Input
                            id="fromEmail"
                            type="email"
                            placeholder="noreply@lumina.com"
                            value={settings.fromEmail}
                            onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fromName">From Name</Label>
                        <Input
                            id="fromName"
                            placeholder="Lumina Team"
                            value={settings.fromName}
                            onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                        />
                    </div>
                </div>

                {/* Test Email */}
                <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-sm font-medium">Test Email</h3>
                    
                    <div className="flex gap-2">
                        <Input
                            placeholder="test@example.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                        />
                        <Button variant="outline" onClick={handleTestEmail} disabled={isLoading || !testEmail}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Send a test email to verify SMTP configuration
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Email Settings
                </Button>
            </CardFooter>
        </Card>
    );
}