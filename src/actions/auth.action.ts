"use server";

import { authService } from "@/services/auth.service";

// Get current session
export const getSession = async () => {
    return await authService.getSession();
};
