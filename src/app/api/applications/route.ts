import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, messages, jobs, companies, jobSkills } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { z } from "zod";

const applySchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().optional(),
  message: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: applications.id,
      status: applications.status,
      appliedAt: applications.appliedAt,
      coverLetter: applications.coverLetter,
      job: {
        id: jobs.id,
        slug: jobs.slug,
        title: jobs.title,
        locationCity: jobs.locationCity,
        locationState: jobs.locationState,
        employmentType: jobs.employmentType,
        salaryMin: jobs.salaryMin,
        salaryMax: jobs.salaryMax,
        currency: jobs.currency,
        workMode: jobs.workMode,
        postedAt: jobs.postedAt,
        category: jobs.category,
        description: jobs.description,
        locationCountry: jobs.locationCountry,
        visaSponsorship: jobs.visaSponsorship,
        featured: jobs.featured,
        views: jobs.views,
        expiresAt: jobs.expiresAt,
      },
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
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(applications.userId, session.user.id));

  const withSkills = await Promise.all(
    rows.map(async (row) => {
      const skills = await db.select({ skill: jobSkills.skill }).from(jobSkills).where(eq(jobSkills.jobId, row.job.id));
      return {
        id: row.id,
        status: row.status,
        appliedAt: row.appliedAt instanceof Date ? row.appliedAt.toISOString() : (row.appliedAt ?? ""),
        coverLetter: row.coverLetter,
        job: {
          ...row.job,
          postedAt: row.job.postedAt instanceof Date ? row.job.postedAt.toISOString() : (row.job.postedAt ?? ""),
          expiresAt: row.job.expiresAt instanceof Date ? row.job.expiresAt.toISOString() : (row.job.expiresAt ?? ""),
          company: { ...row.company, website: row.company.website ?? undefined },
          skills: skills.map((s) => s.skill),
        },
      };
    })
  );

  return NextResponse.json(withSkills);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = applySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const userId = session.user.id;
  const { jobId, coverLetter, message } = parsed.data;

  const [existing] = await db
    .select()
    .from(applications)
    .where(and(eq(applications.userId, userId), eq(applications.jobId, jobId)))
    .limit(1);

  if (existing) return NextResponse.json({ error: "Already applied" }, { status: 409 });

  const appId = `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  await db.insert(applications).values({ id: appId, jobId, userId, coverLetter: coverLetter ?? "", status: "applied" });

  if (message?.trim()) {
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await db.insert(messages).values({ id: msgId, applicationId: appId, senderId: userId, content: message.trim() });
  }

  return NextResponse.json({ success: true, applicationId: appId }, { status: 201 });
}
