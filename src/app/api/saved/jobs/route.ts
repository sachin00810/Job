import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedJobs, jobs, companies, jobSkills } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      description: jobs.description,
      category: jobs.category,
      employmentType: jobs.employmentType,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      currency: jobs.currency,
      locationCity: jobs.locationCity,
      locationState: jobs.locationState,
      locationCountry: jobs.locationCountry,
      workMode: jobs.workMode,
      visaSponsorship: jobs.visaSponsorship,
      featured: jobs.featured,
      views: jobs.views,
      postedAt: jobs.postedAt,
      expiresAt: jobs.expiresAt,
      savedAt: savedJobs.savedAt,
      company: {
        id: companies.id,
        name: companies.name,
        logoUrl: companies.logoUrl,
        website: companies.website,
        industry: companies.industry,
        size: companies.size,
        description: companies.description,
        verified: companies.verified,
        city: companies.city,
      },
    })
    .from(savedJobs)
    .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(savedJobs.userId, session.user.id));

  const withSkills = await Promise.all(
    rows.map(async (job) => {
      const skills = await db.select({ skill: jobSkills.skill }).from(jobSkills).where(eq(jobSkills.jobId, job.id));
      return {
        ...job,
        postedAt: job.postedAt instanceof Date ? job.postedAt.toISOString() : (job.postedAt ?? ""),
        expiresAt: job.expiresAt instanceof Date ? job.expiresAt.toISOString() : (job.expiresAt ?? ""),
        company: { ...job.company, website: job.company.website ?? undefined },
        skills: skills.map((s) => s.skill),
      };
    })
  );

  return NextResponse.json(withSkills);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });

  const userId = session.user.id;
  const [existing] = await db
    .select()
    .from(savedJobs)
    .where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)))
    .limit(1);

  if (existing) {
    await db.delete(savedJobs).where(and(eq(savedJobs.userId, userId), eq(savedJobs.jobId, jobId)));
    return NextResponse.json({ saved: false });
  } else {
    await db.insert(savedJobs).values({ userId, jobId });
    return NextResponse.json({ saved: true });
  }
}
