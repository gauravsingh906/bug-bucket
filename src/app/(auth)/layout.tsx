"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { useAuthStore } from "@/store/Auth";
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

  // Check for session after OAuth flow is completed
  const checkSession = async () => {
    try {
      await verifySession();
      if (session) {
        router.push("/"); // Redirect to homepage or dashboard
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };

  useEffect(() => {
    if (!session) {
      checkSession(); // Check and update session if not available
    } else {
      router.push("/"); // If session already exists, redirect to home
    }
  }, [session, router]);

  // If a session exists, prevent rendering the login page
  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <BackgroundBeams />
      <div className="relative">{children}</div>
    </div>
  );
};

export default Layout;

