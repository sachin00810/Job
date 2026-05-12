"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Home, FileText, Bookmark, Clock, ChevronRight, CheckCircle2, Eye, XCircle, Star, MessageSquare, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatSalaryRange, formatRent, formatDateRelative } from "@/lib/utils";
import { JobCardSkeleton } from "@/components/jobs/JobCardSkeleton";
import { RoomCardSkeleton } from "@/components/rooms/RoomCardSkeleton";
import type { Job, Room } from "@/types";

type Tab = "overview" | "saved-jobs" | "saved-rooms" | "applications" | "my-postings";

interface Application {
  id: string;
  status: "applied" | "viewed" | "shortlisted" | "rejected" | "hired";
  appliedAt: string;
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  jobCity: string;
  companyName: string;
  companyLogo: string;
}

interface EmployerApplicant {
  id: string;
  status: string;
  appliedAt: string;
  coverLetter: string;
  applicant: { id: string; fullName: string; email: string; avatarUrl?: string | null };
}

interface EmployerJob {
  id: string;
  slug: string;
  title: string;
  locationCity: string;
  locationState: string;
  employmentType: string;
  views: number;
  postedAt: string;
  applicationCount: number;
  applications: EmployerApplicant[];
  company: { name: string; logoUrl: string };
}

interface DashboardData {
  user: { id: string; email: string; fullName: string; avatarUrl?: string | null; role: string } | null;
  savedJobs: Job[];
  savedRooms: Room[];
  applications: Application[];
  stats: { savedJobs: number; savedRooms: number; applications: number };
}

const STATUS_CONFIG = {
  applied:     { label: "Applied",     color: "bg-slate-100 text-slate-700",   icon: Clock },
  viewed:      { label: "Viewed",      color: "bg-blue-100 text-blue-700",     icon: Eye },
  shortlisted: { label: "Shortlisted", color: "bg-green-100 text-green-700",   icon: Star },
  rejected:    { label: "Rejected",    color: "bg-red-100 text-red-600",       icon: XCircle },
  hired:       { label: "Hired",       color: "bg-indigo-100 text-indigo-700", icon: CheckCircle2 },
};

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [employerJobs, setEmployerJobs] = useState<EmployerJob[]>([]);
  const [employerLoading, setEmployerLoading] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [updatingApp, setUpdatingApp] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === "my-postings" && employerJobs.length === 0) {
      setEmployerLoading(true);
      fetch("/api/dashboard/employer")
        .then((r) => r.json())
        .then((d) => { setEmployerJobs(d.jobs ?? []); setEmployerLoading(false); })
        .catch(() => setEmployerLoading(false));
    }
  }, [tab]);

  async function updateApplicationStatus(appId: string, status: string) {
    setUpdatingApp(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEmployerJobs((prev) =>
          prev.map((job) => ({
            ...job,
            applications: job.applications.map((a) =>
              a.id === appId ? { ...a, status } : a
            ),
          }))
        );
      }
    } finally {
      setUpdatingApp(null);
    }
  }

  const user = data?.user;
  const savedJobs = data?.savedJobs ?? [];
  const savedRooms = data?.savedRooms ?? [];
  const applications = data?.applications ?? [];
  const stats = data?.stats ?? { savedJobs: 0, savedRooms: 0, applications: 0 };

  const tabs = [
    { id: "overview" as Tab,     label: "Overview",     icon: Briefcase },
    { id: "saved-jobs" as Tab,   label: "Saved Jobs",   icon: Bookmark,  count: stats.savedJobs },
    { id: "saved-rooms" as Tab,  label: "Saved Rooms",  icon: Home,      count: stats.savedRooms },
    { id: "applications" as Tab, label: "Applications", icon: FileText,  count: stats.applications },
    ...(user?.role === "employer" ? [{ id: "my-postings" as Tab, label: "My Postings", icon: Users }] : []),
  ];


  const displayName = user?.fullName ?? "Your Account";
  const displayEmail = user?.email ?? "";
  const avatarUrl = user?.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-indigo-600 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center gap-5">
          <Avatar className="h-16 w-16 ring-2 ring-white/30">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="text-lg font-bold bg-indigo-700 text-white">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-indigo-200 text-sm mt-0.5">{displayEmail}</p>
          </div>
          <Link href="/dashboard/messages" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center ${tab === id ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {count !== undefined && count > 0 && (
                <span className={`text-xs rounded-full px-2 py-0.5 leading-none ${tab === id ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Saved Jobs", value: stats.savedJobs, icon: Bookmark, color: "text-indigo-600 bg-indigo-50", tab: "saved-jobs" as Tab },
              { label: "Saved Rooms", value: stats.savedRooms, icon: Home, color: "text-amber-600 bg-amber-50", tab: "saved-rooms" as Tab },
              { label: "Applications", value: stats.applications, icon: FileText, color: "text-green-600 bg-green-50", tab: "applications" as Tab },
            ].map(({ label, value, icon: Icon, color, tab: t }) => (
              <button key={label} onClick={() => setTab(t)} className="bg-white rounded-xl border border-slate-200 p-6 text-left hover:shadow-md transition-shadow group">
                <div className={`inline-flex p-3 rounded-xl ${color} mb-3`}><Icon className="h-6 w-6" /></div>
                <div className="text-3xl font-bold text-slate-900">{loading ? "—" : value}</div>
                <div className="text-sm text-slate-500 mt-1">{label}</div>
                <div className="flex items-center gap-1 text-xs text-indigo-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">View all <ChevronRight className="h-3 w-3" /></div>
              </button>
            ))}
          </div>
        )}

        {/* Saved Jobs */}
        {tab === "saved-jobs" && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Saved Jobs</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Bookmark className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No saved jobs yet.</p>
                <Link href="/jobs" className="mt-4 inline-block text-sm text-indigo-600 hover:underline font-medium">Browse jobs →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.slug}`} className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={job.company.logoUrl} alt={job.company.name} />
                        <AvatarFallback className="text-xs font-semibold">{job.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</div>
                        <div className="text-sm text-slate-500">{job.company.name} · {job.locationCity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}</div>
                      <div className="text-xs text-slate-400 capitalize">{job.employmentType.replace("-", " ")}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Rooms */}
        {tab === "saved-rooms" && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Saved Rooms</h2>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <RoomCardSkeleton key={i} />)}
              </div>
            ) : savedRooms.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Home className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No saved rooms yet.</p>
                <Link href="/rooms" className="mt-4 inline-block text-sm text-amber-600 hover:underline font-medium">Browse rooms →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedRooms.map((room) => (
                  <Link key={room.id} href={`/rooms/${room.slug}`} className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow group">
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">{room.title}</div>
                      <div className="text-sm text-slate-500">{room.suburb}, {room.city} · {room.type.replace("-", " ")}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-indigo-600">{formatRent(room.rentWeekly, room.currency)}</div>
                      <div className="text-xs text-slate-400">Bond {formatRent(room.bond, room.currency)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications */}
        {tab === "applications" && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">My Applications</h2>
            {loading ? (
              <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />)}</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No applications yet.</p>
                <Link href="/jobs" className="mt-4 inline-block text-sm text-indigo-600 hover:underline font-medium">Find jobs →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => {
                  const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.applied;
                  const Icon = cfg.icon;
                  return (
                    <Link key={app.id} href={`/jobs/${app.jobSlug}`} className="flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={app.companyLogo} alt={app.companyName} />
                          <AvatarFallback className="text-xs font-semibold">{app.companyName.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{app.jobTitle}</div>
                          <div className="text-sm text-slate-500">{app.companyName} · Applied {formatDateRelative(app.appliedAt)}</div>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {cfg.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {/* My Postings — Employer Only */}
        {tab === "my-postings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">My Job Postings</h2>
              <Link href="/post/job" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
                + Post a job
              </Link>
            </div>
            {employerLoading ? (
              <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />)}</div>
            ) : employerJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No jobs posted yet.</p>
                <Link href="/post/job" className="mt-4 inline-block text-sm text-indigo-600 hover:underline font-medium">Post your first job →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {employerJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={job.company.logoUrl} alt={job.company.name} />
                          <AvatarFallback className="text-xs font-semibold">{job.company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900">{job.title}</div>
                          <div className="text-sm text-slate-500">{job.locationCity} · {job.employmentType.replace("-", " ")} · {job.views} views</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-indigo-600">{job.applicationCount} application{job.applicationCount !== 1 ? "s" : ""}</span>
                        {expandedJob === job.id ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </div>
                    </button>

                    {expandedJob === job.id && (
                      <div className="border-t border-slate-100 divide-y divide-slate-100">
                        {job.applications.length === 0 ? (
                          <div className="py-8 text-center text-slate-500 text-sm">No applications yet for this job.</div>
                        ) : (
                          job.applications.map((app) => {
                            const cfg = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.applied;
                            const Icon = cfg.icon;
                            return (
                              <div key={app.id} className="flex items-center justify-between px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={app.applicant.avatarUrl ?? undefined} alt={app.applicant.fullName} />
                                    <AvatarFallback className="text-xs">{app.applicant.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="text-sm font-medium text-slate-900">{app.applicant.fullName}</div>
                                    <div className="text-xs text-slate-500">{app.applicant.email} · Applied {formatDateRelative(app.appliedAt)}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.color}`}>
                                    <Icon className="h-3 w-3" />{cfg.label}
                                  </span>
                                  <select
                                    value={app.status}
                                    disabled={updatingApp === app.id}
                                    onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                                  >
                                    <option value="applied">Applied</option>
                                    <option value="viewed">Viewed</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="hired">Hired</option>
                                  </select>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
