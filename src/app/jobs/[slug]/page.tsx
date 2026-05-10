import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Briefcase, Globe, DollarSign, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jobs } from "@/data/jobs";
import { formatCurrency, formatDateRelative } from "@/lib/utils";
import JobCard from "@/components/jobs/JobCard";
import { ApplyModal } from "@/components/jobs/ApplyModal";
import { SaveJobButton } from "@/components/jobs/SaveJobButton";
import { ShareButton } from "@/components/shared/ShareButton";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return jobs.map((job) => ({
    slug: job.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = jobs.find((j) => j.slug === params.slug);
  if (!job) return {};
  
  return {
    title: `${job.title} at ${job.company.name} | appname`,
    description: job.description.slice(0, 160),
  };
}

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = jobs.find((j) => j.slug === params.slug);
  
  if (!job) {
    notFound();
  }

  const similarJobs = jobs.filter((j) => j.id !== job.id).slice(0, 3);

  return (
    <main className="bg-white min-h-screen">
      {/* Top Header Strip */}
      <section className="bg-slate-900 text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <Link href="/jobs" className="text-slate-300 hover:text-white text-sm transition-colors">
            ← Back to jobs
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mt-3">
            {job.title}
          </h1>
          
          <div className="mt-3 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={job.company.logoUrl} alt={job.company.name} />
              <AvatarFallback className="text-xs text-slate-900 font-semibold bg-slate-100">
                {job.company.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link href={`/companies/${job.company.id}`} className="text-lg font-medium hover:text-indigo-300 transition-colors">
              {job.company.name}
            </Link>
            {job.company.verified && (
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{job.locationCity}, {job.locationState}, {job.locationCountry}</span>
            </div>
            <div className="flex items-center gap-1.5 capitalize">
              <Briefcase className="h-4 w-4" />
              <span>{job.employmentType.replace("-", " ")}</span>
            </div>
            <div className="flex items-center gap-1.5 capitalize">
              <Globe className="h-4 w-4" />
              <span>{job.workMode}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              <span>{formatCurrency(job.salaryMin, job.currency)} – {formatCurrency(job.salaryMax, job.currency)}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {job.visaSponsorship && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                Visa Sponsorship
              </span>
            )}
            {job.featured && (
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            )}
            <ShareButton
              title={`${job.title} at ${job.company.name}`}
              className="ml-auto flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Job Description</h2>
            <div className="mt-4">
              {job.description.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-slate-700 leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">About {job.company.name}</h2>
              <p className="text-slate-700 mt-4 leading-relaxed">
                {job.company.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <ApplyModal jobTitle={job.title} companyName={job.company.name} />
              <SaveJobButton jobTitle={job.title} />
              <p className="mt-4 text-center text-sm text-slate-500">
                Posted {formatDateRelative(job.postedAt)} · {job.views} views
              </p>
            </div>

            <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Job summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">Salary</span>
                  <span className="text-sm text-slate-900 font-medium">
                    {formatCurrency(job.salaryMin, job.currency)} – {formatCurrency(job.salaryMax, job.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">Type</span>
                  <span className="text-sm text-slate-900 font-medium capitalize">
                    {job.employmentType.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">Location</span>
                  <span className="text-sm text-slate-900 font-medium">
                    {job.locationCity}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">Work mode</span>
                  <span className="text-sm text-slate-900 font-medium capitalize">
                    {job.workMode}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">Visa sponsor</span>
                  <span className="text-sm text-slate-900 font-medium">
                    {job.visaSponsorship ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">Posted</span>
                  <span className="text-sm text-slate-900 font-medium">
                    {formatDateRelative(job.postedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Jobs Section */}
      {similarJobs.length > 0 && (
        <section className="bg-slate-50 py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Similar Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarJobs.map((similarJob) => (
                <JobCard key={similarJob.id} job={similarJob} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
