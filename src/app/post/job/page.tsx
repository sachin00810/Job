"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, CheckCircle } from "lucide-react";

const categories = [
  "Technology", "Healthcare", "Hospitality", "Finance",
  "Marketing", "Construction", "Education", "Legal",
  "Retail", "Transport & Logistics", "Other",
];

const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

export default function PostJobPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Job submitted!</h1>
          <p className="text-slate-600 text-sm mb-6">
            Your listing is under review and will go live within 24 hours. We&apos;ll email you once it&apos;s published.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/jobs"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Browse Jobs
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold rounded-xl transition-colors"
            >
              Post another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Briefcase className="h-7 w-7" />
          <div>
            <h1 className="text-3xl font-bold">Post a Job</h1>
            <p className="mt-1 text-indigo-100">Reach thousands of active candidates across Australia.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Company details */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">Company details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company website</label>
                <input
                  type="url"
                  placeholder="https://yourcompany.com.au"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact email <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                placeholder="hiring@yourcompany.com.au"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </section>

          {/* Job details */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">Job details</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c.toLowerCase()}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Employment type <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="casual">Casual</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Job description <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={6}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Required skills</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, TypeScript (comma-separated)"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </section>

          {/* Location & work mode */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">Location &amp; work mode</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sydney"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Work mode <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {["onsite", "hybrid", "remote"].map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="workMode"
                      value={mode}
                      required
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-slate-700 capitalize">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Salary & extras */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">Salary &amp; extras</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Salary min (AUD/yr)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 80000"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Salary max (AUD/yr)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 110000"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-indigo-600 w-4 h-4" />
                <span className="text-sm text-slate-700">Visa sponsorship available</span>
              </label>
            </div>
          </section>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Submit listing
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl transition-colors text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
