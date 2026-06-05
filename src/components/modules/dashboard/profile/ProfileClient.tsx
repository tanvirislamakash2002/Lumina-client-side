"use client";

import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileInfoCard } from "./ProfileInfoCard";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { DeleteAccountCard } from "./DeleteAccountCard";

interface ProfileClientProps {
    user: any;
    profile: any;
    settings: any;
}

export function ProfileClient({ user, profile, settings }: ProfileClientProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    const refreshProfile = () => {
        setIsRefreshing(true);
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            <ProfileHeader />

            {/* Profile Information */}
            <ProfileInfoCard
                user={user}
                profile={profile}
                onUpdate={refreshProfile}
                onOpenPasswordDialog={() => setIsPasswordDialogOpen(true)}
            />

            {/* Delete Account */}
            <DeleteAccountCard />

            {/* Change Password Dialog */}
            <ChangePasswordDialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
            />
        </div>
    );
}