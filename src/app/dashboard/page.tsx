"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Home, FileText, Bookmark, Clock, ChevronRight, CheckCircle2, Eye, XCircle, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jobs } from "@/data/jobs";
import { rooms } from "@/data/rooms";
import { formatSalaryRange, formatRent, formatDateRelative } from "@/lib/utils";

type Tab = "overview" | "saved-jobs" | "saved-rooms" | "applications";

const MOCK_USER = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  memberSince: "2026-01-15T00:00:00.000Z",
};

const MOCK_SAVED_JOBS = jobs.slice(0, 4);
const MOCK_SAVED_ROOMS = rooms.slice(0, 4);

const MOCK_APPLICATIONS = [
  { job: jobs[0], status: "viewed" as const, appliedAt: "2026-05-08T10:00:00.000Z" },
  { job: jobs[1], status: "applied" as const, appliedAt: "2026-05-06T14:00:00.000Z" },
  { job: jobs[2], status: "shortlisted" as const, appliedAt: "2026-05-03T09:00:00.000Z" },
  { job: jobs[3], status: "rejected" as const, appliedAt: "2026-04-28T11:00:00.000Z" },
];

const STATUS_CONFIG = {
  applied:     { label: "Applied",     color: "bg-slate-100 text-slate-700",  icon: Clock },
  viewed:      { label: "Viewed",      color: "bg-blue-100 text-blue-700",    icon: Eye },
  shortlisted: { label: "Shortlisted", color: "bg-green-100 text-green-700",  icon: Star },
  rejected:    { label: "Rejected",    color: "bg-red-100 text-red-600",      icon: XCircle },
  hired:       { label: "Hired",       color: "bg-indigo-100 text-indigo-700", icon: CheckCircle2 },
};

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs = [
    { id: "overview" as Tab,      label: "Overview",     icon: Briefcase },
    { id: "saved-jobs" as Tab,    label: "Saved Jobs",   icon: Bookmark,  count: MOCK_SAVED_JOBS.length },
    { id: "saved-rooms" as Tab,   label: "Saved Rooms",  icon: Home,      count: MOCK_SAVED_ROOMS.length },
    { id: "applications" as Tab,  label: "Applications", icon: FileText,  count: MOCK_APPLICATIONS.length },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-5">
          <Avatar className="h-16 w-16 ring-2 ring-white/30">
            <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
            <AvatarFallback className="text-lg font-bold bg-indigo-700 text-white">
              {MOCK_USER.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{MOCK_USER.name}</h1>
            <p className="text-indigo-200 text-sm mt-0.5">{MOCK_USER.email}</p>
            <p className="text-indigo-300 text-xs mt-1">Member since {formatDateRelative(MOCK_USER.memberSince)}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab nav */}
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center ${
                tab === id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Saved Jobs",    value: MOCK_SAVED_JOBS.length,    color: "text-indigo-600" },
                { label: "Saved Rooms",   value: MOCK_SAVED_ROOMS.length,   color: "text-amber-500" },
                { label: "Applications",  value: MOCK_APPLICATIONS.length,  color: "text-green-600" },
                { label: "Shortlisted",   value: MOCK_APPLICATIONS.filter(a => a.status === "shortlisted").length, color: "text-blue-600" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                  <p className="text-sm text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Recent Applications</h2>
                <button onClick={() => setTab("applications")} className="text-sm text-indigo-600 hover:underline">View all</button>
              </div>
              <ul className="divide-y divide-slate-100">
                {MOCK_APPLICATIONS.slice(0, 3).map(({ job, status, appliedAt }) => {
                  const cfg = STATUS_CONFIG[status];
                  const StatusIcon = cfg.icon;
                  return (
                    <li key={job.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={job.company.logoUrl} alt={job.company.name} />
                          <AvatarFallback className="text-xs font-semibold">{job.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.company.name} · {formatDateRelative(appliedAt)}</p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ml-3 ${cfg.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/jobs" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Browse Jobs</p>
                    <p className="text-xs text-slate-500">Find your next opportunity</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </Link>
              <Link href="/rooms" className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Home className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Browse Rooms</p>
                    <p className="text-xs text-slate-500">Find your next home</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              </Link>
            </div>
          </div>
        )}

        {/* Saved Jobs */}
        {tab === "saved-jobs" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">{MOCK_SAVED_JOBS.length} saved jobs</p>
            {MOCK_SAVED_JOBS.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={job.company.logoUrl} alt={job.company.name} />
                    <AvatarFallback className="text-xs font-semibold">{job.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{job.title}</p>
                    <p className="text-sm text-slate-500">{job.company.name} · {job.locationCity}</p>
                    <p className="text-sm font-medium text-indigo-600 mt-0.5">{formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        )}

        {/* Saved Rooms */}
        {tab === "saved-rooms" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">{MOCK_SAVED_ROOMS.length} saved rooms</p>
            {MOCK_SAVED_ROOMS.map((room) => (
              <Link
                key={room.id}
                href={`/rooms/${room.slug}`}
                className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{room.title}</p>
                  <p className="text-sm text-slate-500">{room.suburb}, {room.city} · {room.type.replace(/-/g, " ")}</p>
                  <p className="text-sm font-bold text-amber-600 mt-0.5">{formatRent(room.rentWeekly, room.currency)}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 shrink-0 ml-3" />
              </Link>
            ))}
          </div>
        )}

        {/* Applications */}
        {tab === "applications" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">{MOCK_APPLICATIONS.length} applications</p>
            {MOCK_APPLICATIONS.map(({ job, status, appliedAt }) => {
              const cfg = STATUS_CONFIG[status];
              const StatusIcon = cfg.icon;
              return (
                <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src={job.company.logoUrl} alt={job.company.name} />
                        <AvatarFallback className="text-xs font-semibold">{job.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Link href={`/jobs/${job.slug}`} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-sm text-slate-500">{job.company.name} · {job.locationCity}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Applied {formatDateRelative(appliedAt)}</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${cfg.color}`}>
                      <StatusIcon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      {(["applied", "viewed", "shortlisted", "hired"] as const).map((s) => (
                        <span key={s} className={["applied","viewed","shortlisted","hired"].indexOf(s) <= ["applied","viewed","shortlisted","hired"].indexOf(status as "applied"|"viewed"|"shortlisted"|"hired") ? "text-indigo-600 font-medium" : ""}>
                          {STATUS_CONFIG[s].label}
                        </span>
                      ))}
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${status === "rejected" ? "bg-red-400" : "bg-indigo-600"}`}
                        style={{ width: status === "rejected" ? "100%" : `${(["applied","viewed","shortlisted","hired"].indexOf(status as "applied"|"viewed"|"shortlisted"|"hired") + 1) * 25}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
