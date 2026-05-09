"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jobs as allJobs } from "@/data/jobs";
import JobCard from "@/components/jobs/JobCard";
import type { Job } from "@/types";

type SortKey = "recent" | "salary-desc" | "salary-asc";

function sorted(jobs: Job[], key: SortKey): Job[] {
  const copy = [...jobs];
  if (key === "salary-desc") return copy.sort((a, b) => b.salaryMax - a.salaryMax);
  if (key === "salary-asc") return copy.sort((a, b) => a.salaryMin - b.salaryMin);
  return copy.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

function filtered(jobs: Job[], q: string, location: string): Job[] {
  let result = jobs;
  if (q) {
    const lq = q.toLowerCase();
    result = result.filter(
      (j) =>
        j.title.toLowerCase().includes(lq) ||
        j.company.name.toLowerCase().includes(lq) ||
        j.description.toLowerCase().includes(lq) ||
        j.skills.some((s) => s.toLowerCase().includes(lq))
    );
  }
  if (location) {
    const ll = location.toLowerCase();
    result = result.filter(
      (j) =>
        j.locationCity.toLowerCase().includes(ll) ||
        j.locationState.toLowerCase().includes(ll)
    );
  }
  return result;
}

function JobsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "";
  const [sort, setSort] = useState<SortKey>("recent");

  const jobs = sorted(filtered(allJobs, q, location), sort);
  const hasFilter = q || location;

  return (
    <>
      {/* Header strip */}
      <section className="bg-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Find a Job</h1>
          <p className="mt-2 text-indigo-100">
            {hasFilter
              ? `${jobs.length} result${jobs.length !== 1 ? "s" : ""}${q ? ` for "${q}"` : ""}${location ? ` in ${location}` : ""}`
              : `${allJobs.length} jobs available across Australia`}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-slate-50 py-10 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Filter sidebar — desktop only */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="bg-white rounded-xl p-6 sticky top-20 shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                <p className="mt-3 text-sm text-slate-500">
                  Filter controls coming soon
                </p>
              </div>
            </aside>

            {/* Results area */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-slate-600">
                  Showing {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
                </p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="recent">Most recent</option>
                  <option value="salary-desc">Salary: high to low</option>
                  <option value="salary-asc">Salary: low to high</option>
                </select>
              </div>

              {/* Jobs grid or empty state */}
              {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-500 text-lg">No jobs found.</p>
                  <p className="text-slate-400 text-sm mt-1">Try a different keyword or location.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-indigo-600 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white">Find a Job</h1>
          </div>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
