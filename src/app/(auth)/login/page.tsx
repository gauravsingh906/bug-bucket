"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { Client, Account, OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL!) // API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!); // Project ID

const account = new Account(client);

const BottomGradient = () => (
    <>
        <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
);

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

export default function Login() {
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const router = useRouter();

    const handleGitHubLogin = async () => {
        setIsLoading(true);
        try {
            await account.createOAuth2Session(
                OAuthProvider.Github,
                `/questions`, // Success URL
                `/login` // Failure URL
            );
        } catch (error) {
            setError("GitHub login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await account.createOAuth2Session(
                OAuthProvider.Google,
                `/questions`, // Success URL
                `/login`, // Failure URL
                ['profile', 'email']
            );
        } catch (error) {
            setError("Google login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password) {
            setError("Please fill out all fields");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await login(email.toString(), password.toString());
            if (response.error) {
                setError(response.error.message);
            } else {
                router.push("/questions");
            }
        } catch {
            setError("Login failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full mt-[4rem] max-w-md rounded-lg border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Login to bug bucket</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Welcome back to <strong>bug-bucket</strong> : your bug-fixing headquarters!
                <br /> New here?{" "}
                <Link href="/register" className="text-orange-500 hover:underline">Create an account</Link> and join the team to squash those bugs!
            </p>

            {error && <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">{error}</p>}
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input className="text-black" id="email" name="email" placeholder="your-email@example.com" type="email" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input className="text-black" id="password" name="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-lg hover:bg-gradient-to-tr transition duration-300"
                    type="submit"
                    disabled={isLoading}
                >
                    Log in &rarr;
                    <BottomGradient />
                </button>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col space-y-4">
                    <button
                        className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">Sign in with Google</span>
                        <BottomGradient />
                    </button>
                    <button
                        className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                        onClick={handleGitHubLogin}
                        disabled={isLoading}
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">Sign in with GitHub</span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
}
