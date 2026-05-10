"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { jobs as allJobs } from "@/data/jobs";
import JobCard from "@/components/jobs/JobCard";
import { JobCardSkeleton } from "@/components/jobs/JobCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import type { Job } from "@/types";

type SortKey = "recent" | "salary-desc" | "salary-asc";

interface Filters {
  categories: string[];
  employmentTypes: string[];
  workModes: string[];
  minSalary: number;
  visaOnly: boolean;
}

const CATEGORIES = ["Technology", "Healthcare", "Hospitality", "Finance", "Marketing", "Construction"];
const EMPLOYMENT_TYPES: { value: Job["employmentType"]; label: string }[] = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "casual", label: "Casual" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];
const WORK_MODES: { value: Job["workMode"]; label: string }[] = [
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];
const SALARY_STEPS = [0, 50000, 70000, 90000, 110000, 130000, 150000];

function sorted(jobs: Job[], key: SortKey): Job[] {
  const copy = [...jobs];
  if (key === "salary-desc") return copy.sort((a, b) => b.salaryMax - a.salaryMax);
  if (key === "salary-asc") return copy.sort((a, b) => a.salaryMin - b.salaryMin);
  return copy.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

function applyFilters(jobs: Job[], q: string, location: string, filters: Filters): Job[] {
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
  if (filters.categories.length > 0) {
    result = result.filter((j) => filters.categories.includes(j.category));
  }
  if (filters.employmentTypes.length > 0) {
    result = result.filter((j) => filters.employmentTypes.includes(j.employmentType));
  }
  if (filters.workModes.length > 0) {
    result = result.filter((j) => filters.workModes.includes(j.workMode));
  }
  if (filters.minSalary > 0) {
    result = result.filter((j) => j.salaryMax >= filters.minSalary);
  }
  if (filters.visaOnly) {
    result = result.filter((j) => j.visaSponsorship);
  }
  return result;
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

const EMPTY_FILTERS: Filters = {
  categories: [],
  employmentTypes: [],
  workModes: [],
  minSalary: 0,
  visaOnly: false,
};

function activeFilterCount(filters: Filters): number {
  return (
    filters.categories.length +
    filters.employmentTypes.length +
    filters.workModes.length +
    (filters.minSalary > 0 ? 1 : 0) +
    (filters.visaOnly ? 1 : 0)
  );
}

function FilterPanel({
  filters,
  onChange,
  onClear,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
}) {
  const count = activeFilterCount(filters);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        {count > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-indigo-600 hover:underline font-medium"
          >
            Clear all ({count})
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Category</h3>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => onChange({ ...filters, categories: toggle(filters.categories, cat) })}
                className="accent-indigo-600 w-4 h-4"
              />
              <span className="text-sm text-slate-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Employment type */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Employment type</h3>
        <div className="space-y-1.5">
          {EMPLOYMENT_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.employmentTypes.includes(value)}
                onChange={() =>
                  onChange({ ...filters, employmentTypes: toggle(filters.employmentTypes, value) })
                }
                className="accent-indigo-600 w-4 h-4"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work mode */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Work mode</h3>
        <div className="space-y-1.5">
          {WORK_MODES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.workModes.includes(value)}
                onChange={() =>
                  onChange({ ...filters, workModes: toggle(filters.workModes, value) })
                }
                className="accent-indigo-600 w-4 h-4"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum salary */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Minimum salary
          {filters.minSalary > 0 && (
            <span className="ml-1 font-normal text-indigo-600">
              ${(filters.minSalary / 1000).toFixed(0)}k+
            </span>
          )}
        </h3>
        <input
          type="range"
          min={0}
          max={SALARY_STEPS.length - 1}
          value={SALARY_STEPS.indexOf(filters.minSalary) === -1 ? 0 : SALARY_STEPS.indexOf(filters.minSalary)}
          onChange={(e) =>
            onChange({ ...filters, minSalary: SALARY_STEPS[Number(e.target.value)] })
          }
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Any</span>
          <span>$150k+</span>
        </div>
      </div>

      {/* Visa sponsorship */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.visaOnly}
            onChange={() => onChange({ ...filters, visaOnly: !filters.visaOnly })}
            className="accent-indigo-600 w-4 h-4"
          />
          <span className="text-sm text-slate-700">Visa sponsorship only</span>
        </label>
      </div>
    </div>
  );
}

function JobsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const location = searchParams.get("location") ?? "";

  const [sort, setSort] = useState<SortKey>("recent");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;
  const allFiltered = sorted(applyFilters(allJobs, q, location, filters), sort);
  const totalPages = Math.ceil(allFiltered.length / PAGE_SIZE);
  const jobs = allFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasSearch = q || location;
  const filterCount = activeFilterCount(filters);

  function handleFilterChange(f: Filters) {
    setFilters(f);
    setPage(1);
  }

  return (
    <>
      {/* Header strip */}
      <section className="bg-indigo-600 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Find a Job</h1>
          <p className="mt-2 text-indigo-100">
            {hasSearch
              ? `${jobs.length} result${jobs.length !== 1 ? "s" : ""}${q ? ` for "${q}"` : ""}${location ? ` in ${location}` : ""}`
              : `${allJobs.length} jobs available across Australia`}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-slate-50 py-10 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">

            {/* Filter sidebar — desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-xl p-5 sticky top-20 shadow-sm border border-slate-200">
                <FilterPanel
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={() => handleFilterChange(EMPTY_FILTERS)}
                />
              </div>
            </aside>

            {/* Results area */}
            <div className="flex-1 min-w-0">
              {/* Sort + mobile filter bar */}
              <div className="flex justify-between items-center mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600">
                    Showing {allFiltered.length} {allFiltered.length === 1 ? "job" : "jobs"}
                  </p>
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {filterCount > 0 && (
                      <span className="ml-0.5 bg-indigo-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                        {filterCount}
                      </span>
                    )}
                  </button>
                </div>
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

              {/* Active filter chips */}
              {filterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilters({ ...filters, categories: filters.categories.filter((x) => x !== c) })}
                      className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      {c} <X className="h-3 w-3" />
                    </button>
                  ))}
                  {filters.employmentTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilters({ ...filters, employmentTypes: filters.employmentTypes.filter((x) => x !== t) })}
                      className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      {t} <X className="h-3 w-3" />
                    </button>
                  ))}
                  {filters.workModes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setFilters({ ...filters, workModes: filters.workModes.filter((x) => x !== m) })}
                      className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      {m} <X className="h-3 w-3" />
                    </button>
                  ))}
                  {filters.minSalary > 0 && (
                    <button
                      onClick={() => setFilters({ ...filters, minSalary: 0 })}
                      className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      ${(filters.minSalary / 1000).toFixed(0)}k+ <X className="h-3 w-3" />
                    </button>
                  )}
                  {filters.visaOnly && (
                    <button
                      onClick={() => setFilters({ ...filters, visaOnly: false })}
                      className="flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      Visa sponsorship <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Jobs grid or empty state */}
              {allFiltered.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  />
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-500 text-lg">No jobs found.</p>
                  <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
                  {filterCount > 0 && (
                    <button
                      onClick={() => handleFilterChange(EMPTY_FILTERS)}
                      className="mt-4 text-sm text-indigo-600 hover:underline font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onClear={() => handleFilterChange(EMPTY_FILTERS)}
              />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-slate-200">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Show {allFiltered.length} {allFiltered.length === 1 ? "job" : "jobs"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function JobsPageSkeleton() {
  return (
    <>
      <section className="bg-indigo-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Find a Job</h1>
        </div>
      </section>
      <section className="bg-slate-50 py-10 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 animate-pulse rounded" />
                ))}
              </div>
            </aside>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<JobsPageSkeleton />}>
      <JobsContent />
    </Suspense>
  );
}
