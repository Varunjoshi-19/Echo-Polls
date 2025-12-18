"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schema/loginSchema";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Invalid email or password");
        return;
      }

      router.push("/");
    } catch {
      setServerError("Something went wrong. Please try again.");
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.2 1.53 7.62 2.8l5.18-5.18C33.64 4.15 29.23 2 24 2 14.82 2 7.02 7.38 3.69 15.2l6.99 5.42C12.3 14.3 17.67 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.1 24.5c0-1.7-.15-2.96-.47-4.27H24v8.1h12.7c-.26 2.03-1.7 5.1-4.9 7.15l7.52 5.83c4.38-4.05 6.78-10 6.78-16.8z"
            />
            <path
              fill="#FBBC05"
              d="M10.68 28.62a14.9 14.9 0 010-9.24l-6.99-5.42a23.9 23.9 0 000 20.08l6.99-5.42z"
            />
            <path
              fill="#34A853"
              d="M24 46c6.48 0 11.9-2.13 15.87-5.8l-7.52-5.83c-2.02 1.4-4.73 2.38-8.35 2.38-6.33 0-11.7-4.8-13.32-11.12l-6.99 5.42C7.02 40.62 14.82 46 24 46z"
            />
          </svg>
          <span>Login with Google</span>
        </button>
      </form>
    </div>
  );
}
