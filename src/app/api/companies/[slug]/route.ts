import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies, jobs, jobSkills } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, params.slug))
    .limit(1);

  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const openJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.companyId, company.id));

  const jobsWithSkills = await Promise.all(
    openJobs.map(async (job) => {
      const skills = await db
        .select({ skill: jobSkills.skill })
        .from(jobSkills)
        .where(eq(jobSkills.jobId, job.id));
      return { ...job, company, skills: skills.map((s) => s.skill) };
    })
  );

  return NextResponse.json({ ...company, jobs: jobsWithSkills });
}
