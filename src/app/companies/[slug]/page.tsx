import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Globe, Users, CheckCircle2, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { companies } from "@/data/companies";
import { jobs } from "@/data/jobs";
import JobCard from "@/components/jobs/JobCard";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return companies.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const company = companies.find((c) => c.id === params.slug);
  if (!company) return {};
  return {
    title: `${company.name} Jobs | appname`,
    description: company.description,
  };
}

const INDUSTRY_LABELS: Record<string, string> = {
  tech: "Technology",
  hospitality: "Hospitality",
  healthcare: "Healthcare",
  finance: "Finance",
  retail: "Retail",
  construction: "Construction",
};

export default function CompanyProfilePage({ params }: { params: { slug: string } }) {
  const company = companies.find((c) => c.id === params.slug);
  if (!company) notFound();

  const companyJobs = jobs.filter((j) => j.company.id === company.id);

  return (
    <main className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link href="/jobs" className="text-slate-400 hover:text-white text-sm transition-colors">
            ← Back to jobs
          </Link>

          <div className="mt-6 flex items-start gap-6">
            <Avatar className="h-20 w-20 rounded-xl shrink-0">
              <AvatarImage src={company.logoUrl} alt={company.name} />
              <AvatarFallback className="text-lg font-bold bg-slate-700 text-white rounded-xl">
                {company.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">{company.name}</h1>
                {company.verified && (
                  <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {company.city}, Australia
                </span>
                <span className="flex items-center gap-1.5 capitalize">
                  <Briefcase className="h-4 w-4" />
                  {INDUSTRY_LABELS[company.industry] ?? company.industry}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {company.size} employees
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-indigo-300 hover:text-indigo-200 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">About {company.name}</h2>
            <p className="mt-4 text-slate-700 leading-relaxed">{company.description}</p>
          </div>

          {/* Open roles */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Open roles
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({companyJobs.length} {companyJobs.length === 1 ? "position" : "positions"})
              </span>
            </h2>
            {companyJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {companyJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-slate-500">No open roles right now.</p>
                <p className="text-slate-400 text-sm mt-1">Check back soon or browse all jobs.</p>
                <Link href="/jobs" className="mt-4 inline-block text-sm text-indigo-600 hover:underline font-medium">
                  Browse all jobs →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Company info</h3>
            <div className="space-y-0">
              {[
                { label: "Industry", value: INDUSTRY_LABELS[company.industry] ?? company.industry },
                { label: "Company size", value: `${company.size} employees` },
                { label: "Location", value: `${company.city}, Australia` },
                { label: "Verified", value: company.verified ? "Yes" : "No" },
                { label: "Open roles", value: String(companyJobs.length) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm text-slate-900 font-medium text-right">{value}</span>
                </div>
              ))}
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full text-center py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Visit website →
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
