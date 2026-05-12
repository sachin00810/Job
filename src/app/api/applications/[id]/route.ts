import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications, jobs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["viewed", "shortlisted", "rejected", "hired"]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Verify the application exists and the job belongs to this employer
  const [app] = await db
    .select({ id: applications.id, jobId: applications.jobId })
    .from(applications)
    .where(eq(applications.id, params.id))
    .limit(1);

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const [job] = await db
    .select({ userId: jobs.userId })
    .from(jobs)
    .where(eq(jobs.id, app.jobId))
    .limit(1);

  if (!job || job.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db
    .update(applications)
    .set({ status: parsed.data.status })
    .where(eq(applications.id, params.id));

  return NextResponse.json({ success: true, status: parsed.data.status });
}
