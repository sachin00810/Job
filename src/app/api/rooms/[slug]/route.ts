import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rooms, roomPhotos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const [room] = await db
    .select()
    .from(rooms)
    .where(eq(rooms.slug, params.slug))
    .limit(1);

  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const photos = await db
    .select({ url: roomPhotos.url })
    .from(roomPhotos)
    .where(eq(roomPhotos.roomId, room.id))
    .orderBy(roomPhotos.position);

  return NextResponse.json({ ...room, photos: photos.map((p) => p.url) });
}
