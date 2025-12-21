"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "@/schema/auth";
import { config } from "@/config";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";


export default function SignUpPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const router = useRouter();


    const onSubmit = async (data: SignupFormData) => {
        try {
            const res = await fetch(`${config.baseUrl}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Your account has been created !");
                router.push("/sign-in");
            } else {
                toast.error(`${result.error}`);
            }

        } catch {
            toast.error("Something went wrong. Please try again.");
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white p-8 rounded-lg shadow"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Create your account
                </h2>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Username</label>
                    <input
                        {...register("username")}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your username"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.username.message}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="mb-2">
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <div className="text-right mb-4">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
                >
                    Create account
                </button>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
}
