"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-5">
          <LayoutDashboard className="h-7 w-7 text-indigo-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Dashboard error</h2>
        <p className="text-slate-500 text-sm mb-6">Something went wrong loading your dashboard.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Try again
          </button>
          <Link href="/" className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold rounded-xl transition-colors">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
