import type { Metadata } from "next";
import { Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Job Alerts | appname",
  description: "Get notified when new jobs matching your criteria are posted.",
};

export default function JobAlertsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">Job Alerts</h1>
          <p className="mt-4 text-indigo-100 text-lg">
            Be the first to know when new matching jobs are posted.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Create a job alert</h2>
              <p className="text-sm text-slate-500">We&apos;ll email you new matches daily.</p>
            </div>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Keywords
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineer, Nurse, Marketing"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Sydney, Melbourne, Remote"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Category
              </label>
              <select className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Any category</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="hospitality">Hospitality</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="construction">Construction</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Alert frequency
              </label>
              <div className="flex gap-3">
                {["Daily", "Weekly"].map((freq) => (
                  <label key={freq} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq.toLowerCase()}
                      defaultChecked={freq === "Daily"}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-slate-700">{freq}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Create alert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
