"use client";

import { useAuthStore } from "@/store/Auth"; // Assuming you have a Zustand store for authentication
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Account, Client } from "appwrite";

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL!) // API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Project ID

const account = new Account(client);

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { session, verifySession } = useAuthStore(); // Use verifySession from the store
    const router = useRouter();

    // Check for session
    const checkSession = async () => {
        try {
            await verifySession(); // This should check Appwrite session and update your store
        } catch (error) {
            console.error("Failed to fetch session:", error);
        }
    };

    useEffect(() => {
        // If session is not available, verify it
        if (!session) {
            checkSession().then(() => {
                if (!session) {
                    router.push("/login"); // If session does not exist, redirect to login
                }
            });
        }
    }, [session, router]);

    // Prevent rendering protected children until session is verified
    if (!session) {
        return null; // or a loading spinner while verifying session
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center">
            {children}
        </div>
    );
};

export default Layout;
