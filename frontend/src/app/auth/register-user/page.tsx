"use client";

import { Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { LoginBody } from "../../../../types/organization";
import { useToast } from "../../toast";

export default function RegisterUserForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<LoginBody>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // {
      //   message: 'Login successful',
      //   token,
      // }

      // {
      //   message: 'Server error',
      //   error: error instanceof Error ? error.message : 'Unknown error',
      // }

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setIsSubmitting(false);
      } else {
        showToast(data.message, "success");
        router.replace("/");
        setFormData({ email: "", password: "" });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.email &&
    formData.password &&
    confirmPassword === formData.password;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-9 relative overflow-hidden">
        {/* Back Button - Top Left */}
        <div className="absolute top-14 left-4 -mt-10 z-10">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <div className="absolute top-10 right-20 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-800/40 text-indigo-100 rounded-full text-sm font-medium border border-indigo-700/30 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            User
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent tracking-tight">
            Register
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-indigo-200 font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
            Set up your user profile to access your dashboard
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Already have an account?
                </h2>
                <p className="text-gray-600 mt-2">
                  Just login to access your dashboard
                </p>
              </div>
              <div className="hidden sm:block">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 border border-indigo-600 font-semibold rounded-lg hover:bg-indigo-200 transition-colors"
                >
                  Login Now
                </Link>
              </div>
            </div>

            {/* Mobile version */}
            <div className="sm:hidden mt-4">
              <Link
                href="/auth/login"
                className="block w-full text-center px-6 py-3 bg-white text-indigo-600 border border-indigo-600 font-semibold rounded-lg hover:bg-indigo-200 transition-colors"
              >
                Login Now
              </Link>
            </div>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full text-gray-700 pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full text-gray-700 px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full text-gray-700 px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
                  isFormValid && !isSubmitting
                    ? "bg-gradient-to-r from-indigo-800 to-purple-800 hover:from-indigo-900 hover:to-purple-900 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
