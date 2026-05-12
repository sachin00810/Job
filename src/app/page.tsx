import Link from "next/link";
import { ShieldCheck, Zap, Users } from "lucide-react";
import { db } from "@/db";
import { jobs, companies, jobSkills, rooms, roomPhotos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { HeroSearch } from "@/components/home/HeroSearch";
import JobCard from "@/components/jobs/JobCard";
import RoomCard from "@/components/rooms/RoomCard";
import type { Job, Room } from "@/types";

export const dynamic = "force-dynamic";

const stats = [
  { value: "12,000+", label: "Active Jobs" },
  { value: "5,400+", label: "Rooms Listed" },
  { value: "350+", label: "Suburbs" },
  { value: "94%", label: "Match Rate" },
];

const trustPoints = [
  {
    Icon: ShieldCheck,
    title: "Verified listings",
    desc: "Every employer and landlord goes through identity verification before posting.",
  },
  {
    Icon: Zap,
    title: "Apply in minutes",
    desc: "One profile, instant applications — no repeated form-filling across sites.",
  },
  {
    Icon: Users,
    title: "Built for newcomers",
    desc: "Visa sponsorship filters, suburb guides, and a community that gets it.",
  },
];

async function getHomepageJobs(): Promise<Job[]> {
  try {
    let rows = await db
      .select({
        id: jobs.id, slug: jobs.slug, title: jobs.title, description: jobs.description,
        category: jobs.category, employmentType: jobs.employmentType,
        salaryMin: jobs.salaryMin, salaryMax: jobs.salaryMax, currency: jobs.currency,
        locationCity: jobs.locationCity, locationState: jobs.locationState, locationCountry: jobs.locationCountry,
        workMode: jobs.workMode, visaSponsorship: jobs.visaSponsorship,
        featured: jobs.featured, views: jobs.views, postedAt: jobs.postedAt, expiresAt: jobs.expiresAt,
        company: {
          id: companies.id, name: companies.name, logoUrl: companies.logoUrl, website: companies.website,
          industry: companies.industry, size: companies.size, description: companies.description,
          verified: companies.verified, city: companies.city,
        },
      })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.featured, true))
      .orderBy(desc(jobs.postedAt))
      .limit(6);

    if (rows.length === 0) {
      rows = await db
        .select({
          id: jobs.id, slug: jobs.slug, title: jobs.title, description: jobs.description,
          category: jobs.category, employmentType: jobs.employmentType,
          salaryMin: jobs.salaryMin, salaryMax: jobs.salaryMax, currency: jobs.currency,
          locationCity: jobs.locationCity, locationState: jobs.locationState, locationCountry: jobs.locationCountry,
          workMode: jobs.workMode, visaSponsorship: jobs.visaSponsorship,
          featured: jobs.featured, views: jobs.views, postedAt: jobs.postedAt, expiresAt: jobs.expiresAt,
          company: {
            id: companies.id, name: companies.name, logoUrl: companies.logoUrl, website: companies.website,
            industry: companies.industry, size: companies.size, description: companies.description,
            verified: companies.verified, city: companies.city,
          },
        })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .orderBy(desc(jobs.postedAt))
        .limit(6);
    }

    return await Promise.all(
      rows.map(async (job) => {
        const skills = await db.select({ skill: jobSkills.skill }).from(jobSkills).where(eq(jobSkills.jobId, job.id));
        return {
          ...job,
          postedAt: job.postedAt instanceof Date ? job.postedAt.toISOString() : (job.postedAt ?? ""),
          expiresAt: job.expiresAt instanceof Date ? job.expiresAt.toISOString() : (job.expiresAt ?? ""),
          company: { ...job.company, website: job.company.website ?? undefined },
          skills: skills.map((s) => s.skill),
        } as Job;
      })
    );
  } catch {
    return [];
  }
}

async function getHomepageRooms(): Promise<Room[]> {
  try {
    let rows = await db
      .select()
      .from(rooms)
      .where(eq(rooms.featured, true))
      .orderBy(desc(rooms.postedAt))
      .limit(6);

    if (rows.length === 0) {
      rows = await db.select().from(rooms).orderBy(desc(rooms.postedAt)).limit(6);
    }

    return await Promise.all(
      rows.map(async (room) => {
        const photos = await db
          .select({ url: roomPhotos.url })
          .from(roomPhotos)
          .where(eq(roomPhotos.roomId, room.id))
          .orderBy(roomPhotos.position);
        return {
          ...room,
          postedAt: room.postedAt instanceof Date ? room.postedAt.toISOString() : (room.postedAt ?? ""),
          photos: photos.map((p) => p.url),
        } as Room;
      })
    );
  } catch {
    return [];
  }
}

export default async function Home() {
  const [featuredJobs, featuredRooms] = await Promise.all([
    getHomepageJobs(),
    getHomepageRooms(),
  ]);

  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section className="bg-gradient-to-b from-indigo-50 via-white to-amber-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1">
            Australia&apos;s #1 Jobs + Rooms marketplace
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
            Find your{" "}
            <span className="text-indigo-600">next job</span>.{" "}
            <br className="hidden sm:block" />
            Find your{" "}
            <span className="text-amber-500">next home</span>.
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            One marketplace, two life essentials. Search thousands of jobs and
            rooms across Australia.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* ── Section 2: Stats Strip ── */}
      <section className="py-12 bg-white border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-indigo-600">{s.value}</p>
                <p className="mt-2 text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Jobs ── */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Jobs</h2>
              <p className="mt-1 text-slate-600">Hand-picked roles hiring right now</p>
            </div>
            <Link
              href="/jobs"
              className="text-indigo-600 font-medium hover:underline hidden sm:block mt-1"
            >
              View all jobs →
            </Link>
          </div>

          {featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p>No jobs listed yet.</p>
              <Link href="/post/job" className="mt-3 inline-block text-indigo-600 hover:underline font-medium">
                Post the first job →
              </Link>
            </div>
          )}

          <div className="mt-6 sm:hidden text-center">
            <Link href="/jobs" className="text-indigo-600 font-medium hover:underline">
              View all jobs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: Featured Rooms ── */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Rooms You&apos;ll Love
              </h2>
              <p className="mt-1 text-slate-600">
                Comfortable spaces across Australia
              </p>
            </div>
            <Link
              href="/rooms"
              className="text-indigo-600 font-medium hover:underline hidden sm:block mt-1"
            >
              View all rooms →
            </Link>
          </div>

          {featuredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p>No rooms listed yet.</p>
              <Link href="/post/room" className="mt-3 inline-block text-amber-600 hover:underline font-medium">
                List the first room →
              </Link>
            </div>
          )}

          <div className="mt-6 sm:hidden text-center">
            <Link href="/rooms" className="text-indigo-600 font-medium hover:underline">
              View all rooms →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: How It Works ── */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900">Why people choose appname</h2>
          <p className="mt-2 text-slate-600">Built for Australians, trusted by thousands</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustPoints.map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-600 max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Final CTA ── */}
      <section className="py-20 bg-indigo-600 px-4 sm:px-6 lg:px-8 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to find what you&apos;re looking for?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join thousands of Australians on appname today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
            >
              Sign up free
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
