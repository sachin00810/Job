import Link from "next/link";
import { Briefcase, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Job | appname",
  description: "List your job opening on appname and reach thousands of candidates across Australia.",
};

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mx-auto">
          <Briefcase className="h-8 w-8 text-indigo-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">Post a Job</h1>
        <p className="mt-4 text-slate-600 max-w-md mx-auto">
          Our self-serve job posting form is coming soon. In the meantime, reach
          out and we&apos;ll get your listing published within 24 hours — free
          for early employers.
        </p>

        <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left space-y-4">
          <h2 className="font-semibold text-slate-900">What you get</h2>
          {[
            "Listed to thousands of active job seekers",
            "Featured on the homepage for 7 days",
            "Direct applicant messages via in-app chat",
            "Free during our early-access period",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="mt-0.5 h-4 w-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 text-xs font-bold">
                ✓
              </span>
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="mailto:hello@appname.com.au"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email us to post
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
