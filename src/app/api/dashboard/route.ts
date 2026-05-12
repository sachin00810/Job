import { NextResponse } from "next/server";
import { db } from "@/db";
import { savedJobs, savedRooms, applications, jobs, rooms, companies, jobSkills, roomPhotos, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const [userRow] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  const [savedJobRows, savedRoomRows, applicationRows] = await Promise.all([
    db
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
      .from(savedJobs)
      .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(savedJobs.userId, userId)),

    db.select().from(savedRooms).innerJoin(rooms, eq(savedRooms.roomId, rooms.id)).where(eq(savedRooms.userId, userId)),

    db
      .select({
        id: applications.id,
        status: applications.status,
        appliedAt: applications.appliedAt,
        jobId: jobs.id,
        jobSlug: jobs.slug,
        jobTitle: jobs.title,
        jobCity: jobs.locationCity,
        companyName: companies.name,
        companyLogo: companies.logoUrl,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.userId, userId)),
  ]);

  const savedJobsWithSkills = await Promise.all(
    savedJobRows.map(async (job) => {
      const skills = await db.select({ skill: jobSkills.skill }).from(jobSkills).where(eq(jobSkills.jobId, job.id));
      return { ...job, skills: skills.map((s) => s.skill) };
    })
  );

  const savedRoomsWithPhotos = await Promise.all(
    savedRoomRows.map(async (row) => {
      const photos = await db
        .select({ url: roomPhotos.url })
        .from(roomPhotos)
        .where(eq(roomPhotos.roomId, row.rooms.id))
        .orderBy(roomPhotos.position);
      return { ...row.rooms, photos: photos.map((p) => p.url) };
    })
  );

  return NextResponse.json({
    user: userRow ? { id: userRow.id, email: userRow.email, fullName: userRow.fullName, avatarUrl: userRow.avatarUrl, role: userRow.role } : null,
    savedJobs: savedJobsWithSkills,
    savedRooms: savedRoomsWithPhotos,
    applications: applicationRows,
    stats: {
      savedJobs: savedJobRows.length,
      savedRooms: savedRoomRows.length,
      applications: applicationRows.length,
    },
  });
}
