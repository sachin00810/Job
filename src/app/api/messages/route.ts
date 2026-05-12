import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { messages, applications, jobs } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { z } from "zod";

const sendSchema = z.object({
  applicationId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

// GET /api/messages?applicationId=xxx — fetch thread for an application
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applicationId = req.nextUrl.searchParams.get("applicationId");
  if (!applicationId) return NextResponse.json({ error: "applicationId required" }, { status: 400 });

  // Verify the user is part of this application (applicant or job poster)
  const [app] = await db
    .select({ userId: applications.userId, jobId: applications.jobId })
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const [job] = await db
    .select({ posterId: jobs.userId })
    .from(jobs)
    .where(eq(jobs.id, app.jobId))
    .limit(1);

  const isApplicant = app.userId === session.user.id;
  const isPoster = job?.posterId === session.user.id;
  if (!isApplicant && !isPoster) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const thread = await db
    .select()
    .from(messages)
    .where(eq(messages.applicationId, applicationId))
    .orderBy(asc(messages.createdAt));

  return NextResponse.json(thread);
}

// POST /api/messages — send a message in an application thread
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { applicationId, content } = parsed.data;

  const [app] = await db
    .select({ userId: applications.userId, jobId: applications.jobId })
    .from(applications)
    .where(eq(applications.id, applicationId))
    .limit(1);

  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const [job] = await db
    .select({ posterId: jobs.userId })
    .from(jobs)
    .where(eq(jobs.id, app.jobId))
    .limit(1);

  const isApplicant = app.userId === session.user.id;
  const isPoster = job?.posterId === session.user.id;
  if (!isApplicant && !isPoster) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  await db.insert(messages).values({ id, applicationId, senderId: session.user.id, content });

  return NextResponse.json({ success: true, id }, { status: 201 });
}
