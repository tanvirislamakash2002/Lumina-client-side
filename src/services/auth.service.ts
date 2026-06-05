import { env } from "@/env";
import { cookies } from "next/headers";

const AUTH_URL = env.AUTH_URL;

export const authService = {
    // Get current session
    getSession: async () => {
        try {
            const cookieStore = await cookies();
            const res = await fetch(`${AUTH_URL}/get-session`, {
                headers: {
                    Cookie: cookieStore.toString()
                },
                cache: 'no-store'
            });
            const session = await res.json();
            
            if (session === null) {
                return { 
                    success: false, 
                    message: "Session is missing." 
                };
            }
            
            return { 
                success: true, 
                data: session 
            };
        } catch (error) {
            console.error("Get session error:", error);
            return { 
                success: false, 
                message: 'Something went wrong' 
            };
        }
    },


};