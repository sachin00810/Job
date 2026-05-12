import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobs, companies, jobSkills } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const [job] = await db
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
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.slug, params.slug))
    .limit(1);

  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.update(jobs).set({ views: sql`${jobs.views} + 1` }).where(eq(jobs.id, job.id));

  const skills = await db.select({ skill: jobSkills.skill }).from(jobSkills).where(eq(jobSkills.jobId, job.id));

  return NextResponse.json({ ...job, skills: skills.map((s) => s.skill) });
}
