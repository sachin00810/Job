import type { Metadata } from "next";
import Link from "next/link";
import { Flag } from "lucide-react";

export const metadata: Metadata = {
  title: "Report a Listing | appname",
  description: "Report a suspicious or fraudulent listing on appname.",
};

const reasons = [
  "Fraudulent or scam listing",
  "Misleading or inaccurate information",
  "Offensive or inappropriate content",
  "Duplicate listing",
  "Job or room no longer available",
  "Discrimination or harassment",
  "Other",
];

export default function ReportPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-red-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Report a Listing</h1>
          <p className="mt-4 text-red-100 text-lg">
            Help us keep appname safe and trustworthy for everyone.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Flag className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Submit a report</h2>
              <p className="text-sm text-slate-500">All reports are reviewed within 24 hours.</p>
            </div>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Listing URL or ID
              </label>
              <input
                type="text"
                placeholder="e.g. /jobs/senior-software-engineer-sydney"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Reason for report
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select a reason</option>
                {reasons.map((r) => (
                  <option key={r} value={r.toLowerCase().replace(/\s+/g, "-")}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Details
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe the issue in as much detail as possible..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Your email (optional)
              </label>
              <input
                type="email"
                placeholder="So we can follow up if needed"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Submit report
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need urgent help?{" "}
          <Link href="/contact" className="text-indigo-600 hover:underline">
            Contact support directly
          </Link>
        </p>
      </div>
    </div>
  );
}
