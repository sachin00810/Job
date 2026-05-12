import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { messages, applications, jobs, companies, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// GET /api/messages/threads — returns all application threads the user is part of
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // Applications where the user is the applicant
  const asApplicant = await db
    .select({
      applicationId: applications.id,
      jobId: applications.jobId,
      jobTitle: jobs.title,
      jobSlug: jobs.slug,
      companyName: companies.name,
      companyLogo: companies.logoUrl,
      posterId: jobs.userId,
      status: applications.status,
      appliedAt: applications.appliedAt,
      unreadCount: sql<number>`(
        SELECT COUNT(*)::int FROM messages m
        WHERE m.application_id = ${applications.id}
          AND m.sender_id != ${userId}
          AND m.read_at IS NULL
      )`,
      lastMessageAt: sql<string | null>`(
        SELECT created_at FROM messages m
        WHERE m.application_id = ${applications.id}
        ORDER BY created_at DESC LIMIT 1
      )`,
      lastMessageContent: sql<string | null>`(
        SELECT content FROM messages m
        WHERE m.application_id = ${applications.id}
        ORDER BY created_at DESC LIMIT 1
      )`,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(applications.userId, userId));

  // Applications where the user is the job poster
  const asPoster = await db
    .select({
      applicationId: applications.id,
      jobId: applications.jobId,
      jobTitle: jobs.title,
      jobSlug: jobs.slug,
      companyName: companies.name,
      companyLogo: companies.logoUrl,
      applicantId: applications.userId,
      status: applications.status,
      appliedAt: applications.appliedAt,
      unreadCount: sql<number>`(
        SELECT COUNT(*)::int FROM messages m
        WHERE m.application_id = ${applications.id}
          AND m.sender_id != ${userId}
          AND m.read_at IS NULL
      )`,
      lastMessageAt: sql<string | null>`(
        SELECT created_at FROM messages m
        WHERE m.application_id = ${applications.id}
        ORDER BY created_at DESC LIMIT 1
      )`,
      lastMessageContent: sql<string | null>`(
        SELECT content FROM messages m
        WHERE m.application_id = ${applications.id}
        ORDER BY created_at DESC LIMIT 1
      )`,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.userId, userId));

  // Fetch applicant names for poster view
  const posterThreads = await Promise.all(
    asPoster.map(async (t) => {
      const [applicant] = await db
        .select({ fullName: users.fullName, email: users.email, avatarUrl: users.avatarUrl })
        .from(users)
        .where(eq(users.id, t.applicantId))
        .limit(1);
      return { ...t, role: "poster" as const, otherParty: applicant ?? null };
    })
  );

  const applicantThreads = asApplicant.map((t) => ({ ...t, role: "applicant" as const, otherParty: null }));

  // Filter out poster threads that have no messages (nothing to show)
  const allThreads = [
    ...applicantThreads,
    ...posterThreads.filter((t) => t.lastMessageAt !== null || t.unreadCount > 0),
  ].sort((a, b) => {
    const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.appliedAt).getTime();
    const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.appliedAt).getTime();
    return bTime - aTime;
  });

  return NextResponse.json(allThreads);
}
