import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { savedRooms, rooms, roomPhotos } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(savedRooms)
    .innerJoin(rooms, eq(savedRooms.roomId, rooms.id))
    .where(eq(savedRooms.userId, session.user.id));

  const withPhotos = await Promise.all(
    rows.map(async (row) => {
      const photos = await db
        .select({ url: roomPhotos.url })
        .from(roomPhotos)
        .where(eq(roomPhotos.roomId, row.rooms.id))
        .orderBy(roomPhotos.position);
      return {
        ...row.rooms,
        postedAt: row.rooms.postedAt instanceof Date ? row.rooms.postedAt.toISOString() : (row.rooms.postedAt ?? ""),
        photos: photos.map((p) => p.url),
        savedAt: row.saved_rooms.savedAt,
      };
    })
  );

  return NextResponse.json(withPhotos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId } = await req.json();
  if (!roomId) return NextResponse.json({ error: "roomId required" }, { status: 400 });

  const userId = session.user.id;
  const [existing] = await db
    .select()
    .from(savedRooms)
    .where(and(eq(savedRooms.userId, userId), eq(savedRooms.roomId, roomId)))
    .limit(1);

  if (existing) {
    await db.delete(savedRooms).where(and(eq(savedRooms.userId, userId), eq(savedRooms.roomId, roomId)));
    return NextResponse.json({ saved: false });
  } else {
    await db.insert(savedRooms).values({ userId, roomId });
    return NextResponse.json({ saved: true });
  }
}
