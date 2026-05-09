import Link from "next/link";
import { Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | appname",
  description: "Reset your appname account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-indigo-600">appname</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Send reset link
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            Remember your password?{" "}
            <Link
              href="/auth/signin"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
