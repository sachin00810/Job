import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select({ id: users.id, email: users.email, fullName: users.fullName, avatarUrl: users.avatarUrl, city: users.city, country: users.country, role: users.role, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { fullName, city, country, avatarUrl } = parsed.data;

  await db.update(users)
    .set({
      ...(fullName !== undefined && { fullName }),
      ...(city !== undefined && { city }),
      ...(country !== undefined && { country }),
      ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }),
    })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
