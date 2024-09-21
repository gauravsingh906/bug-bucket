"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
const BottomGradient = () => (
    <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
);
const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

export default function Register() {
    const { createAccount } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        if (!name || !email || !password) {
            setError("Please fill out all fields");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await createAccount(name.toString(), email.toString(), password.toString());
            if (response.error) {
                setError(response.error.message);
            } else {
                // Optionally, redirect to login or dashboard
            }
        } catch {
            setError("Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto mt-[4rem] w-full max-w-md rounded-lg border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                Welcome to Dev-Deploy
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Sign up to join the Dev-Deploy community. If you already have an account,{" "}
                <Link href="/login" className="text-orange-500 hover:underline">
                    login
                </Link>{" "}
                to access your dashboard.
            </p>

            {error && (
                <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            <form className="my-8" onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                    <LabelInputContainer>
                        <Label htmlFor="firstname">First Name</Label>
                        <Input className="text-black" id="firstname" name="firstname" placeholder="John" type="text" />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">Last Name</Label>
                        <Input className="text-black" id="lastname" name="lastname" placeholder="Doe" type="text" />
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input className="text-black" id="email" name="email" placeholder="john.doe@example.com" type="email" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input className="text-black" id="password" name="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-blue-600 to-blue-800 font-medium text-white shadow-lg hover:bg-gradient-to-tr transition duration-300"
                    type="submit"
                    disabled={isLoading}
                >
                    Sign Up &rarr;
                    <BottomGradient />
                </button>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />


            </form>
        </div>
    );
}
