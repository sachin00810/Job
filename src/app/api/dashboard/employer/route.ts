import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobs, companies, applications, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all jobs posted by this employer
  const jobRows = await db
    .select({
      id: jobs.id,
      slug: jobs.slug,
      title: jobs.title,
      locationCity: jobs.locationCity,
      locationState: jobs.locationState,
      employmentType: jobs.employmentType,
      featured: jobs.featured,
      views: jobs.views,
      postedAt: jobs.postedAt,
      expiresAt: jobs.expiresAt,
      company: {
        id: companies.id,
        name: companies.name,
        logoUrl: companies.logoUrl,
      },
    })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.userId, session.user.id))
    .orderBy(desc(jobs.postedAt));

  // For each job, get its applications
  const jobsWithApplications = await Promise.all(
    jobRows.map(async (job) => {
      const appRows = await db
        .select({
          id: applications.id,
          status: applications.status,
          appliedAt: applications.appliedAt,
          coverLetter: applications.coverLetter,
          applicant: {
            id: users.id,
            fullName: users.fullName,
            email: users.email,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(applications)
        .innerJoin(users, eq(applications.userId, users.id))
        .where(eq(applications.jobId, job.id))
        .orderBy(desc(applications.appliedAt));

      return {
        ...job,
        postedAt: job.postedAt instanceof Date ? job.postedAt.toISOString() : (job.postedAt ?? ""),
        expiresAt: job.expiresAt instanceof Date ? job.expiresAt.toISOString() : (job.expiresAt ?? ""),
        applicationCount: appRows.length,
        applications: appRows.map((a) => ({
          ...a,
          appliedAt: a.appliedAt instanceof Date ? a.appliedAt.toISOString() : (a.appliedAt ?? ""),
        })),
      };
    })
  );

  return NextResponse.json({ jobs: jobsWithApplications });
}
