"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schema/auth";
import { useRouter } from "next/navigation";
import { config } from "@/config";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Page() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const res = await fetch(`${config.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Logged In Successful !");
        router.push("/");
        login(result.user);

      } else {
        toast.error(result.error || "Failed to login! Please try again");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Sign In
        </h1>

        {serverError && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {serverError}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">
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
          className="w-full bg-blue-600 text-white py-2 pointer
          rounded hover:bg-blue-700 transition disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>


        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
