import Link from "next/link";
import { Briefcase, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xl text-indigo-600">appname</span>
        </Link>

        {/* 404 */}
        <p className="text-8xl font-black text-slate-200 leading-none select-none">404</p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-500 text-sm leading-relaxed">
          This page doesn&apos;t exist or may have been moved. Try searching for what you need.
        </p>

        {/* Quick links */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Jobs
          </Link>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Rooms
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold rounded-xl transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
