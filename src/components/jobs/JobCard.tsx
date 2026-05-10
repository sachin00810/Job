"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatSalaryRange, formatDateRelative } from "@/lib/utils";
import type { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <Link
          href={`/companies/${job.company.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 group/company"
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={job.company.logoUrl} alt={job.company.name} />
            <AvatarFallback className="text-xs font-semibold">
              {job.company.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-slate-700 font-medium group-hover/company:text-indigo-600 transition-colors">
            {job.company.name}
          </span>
        </Link>
        {job.featured && (
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900 line-clamp-2">
        {job.title}
      </h3>

      <div className="flex items-center gap-1.5 mt-2">
        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
        <span className="text-sm text-slate-600">
          {job.locationCity}, {job.locationState}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full capitalize">
          {job.employmentType.replace("-", " ")}
        </span>
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full capitalize">
          {job.workMode}
        </span>
        {job.visaSponsorship && (
          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
            Visa sponsor
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="font-semibold text-sm text-slate-900">
          {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
        </span>
        <span className="text-xs text-slate-500">
          {formatDateRelative(job.postedAt)}
        </span>
      </div>
    </Link>
  );
}
