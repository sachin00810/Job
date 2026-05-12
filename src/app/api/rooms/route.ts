import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { rooms, roomPhotos } from "@/db/schema";
import { and, eq, lte, ilike, or, desc, asc, count } from "drizzle-orm";
import { auth } from "@/auth";
import { createRoomSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const location = searchParams.get("location") ?? "";
  const type = searchParams.get("type") ?? "";
  const maxRent = Number(searchParams.get("maxRent") ?? 0);
  const furnished = searchParams.get("furnished") === "true";
  const billsIncluded = searchParams.get("billsIncluded") === "true";
  const internet = searchParams.get("internet") === "true";
  const parking = searchParams.get("parking") === "true";
  const petsAllowed = searchParams.get("petsAllowed") === "true";
  const sort = searchParams.get("sort") ?? "recent";
  const featuredOnly = searchParams.get("featured") === "true";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 12));
  const offset = (page - 1) * limit;

  const conditions = [];
  if (location) conditions.push(or(ilike(rooms.suburb, `%${location}%`), ilike(rooms.city, `%${location}%`)));
  if (type) conditions.push(eq(rooms.type, type));
  if (maxRent > 0) conditions.push(lte(rooms.rentWeekly, maxRent));
  if (furnished) conditions.push(eq(rooms.furnished, true));
  if (billsIncluded) conditions.push(eq(rooms.billsIncluded, true));
  if (internet) conditions.push(eq(rooms.internet, true));
  if (parking) conditions.push(eq(rooms.parking, true));
  if (petsAllowed) conditions.push(eq(rooms.petsAllowed, true));
  if (featuredOnly) conditions.push(eq(rooms.featured, true));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const orderBy =
    sort === "price-asc" ? asc(rooms.rentWeekly)
    : sort === "price-desc" ? desc(rooms.rentWeekly)
    : desc(rooms.postedAt);

  const [rows, [{ total }]] = await Promise.all([
    db.select().from(rooms).where(where).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ total: count() }).from(rooms).where(where),
  ]);

  const roomsWithPhotos = await Promise.all(
    rows.map(async (room) => {
      const photos = await db
        .select({ url: roomPhotos.url })
        .from(roomPhotos)
        .where(eq(roomPhotos.roomId, room.id))
        .orderBy(roomPhotos.position);
      return {
        ...room,
        postedAt: room.postedAt instanceof Date ? room.postedAt.toISOString() : (room.postedAt ?? ""),
        photos: photos.map((p) => p.url),
      };
    })
  );

  return NextResponse.json({
    rooms: roomsWithPhotos,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createRoomSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;
  const roomId = `room-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const slug = `${d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${roomId.slice(-4)}`;

  await db.insert(rooms).values({
    id: roomId,
    slug,
    title: d.title,
    description: d.description,
    type: d.type,
    rentWeekly: d.rentWeekly,
    bond: d.bond,
    currency: "AUD",
    availableFrom: d.availableFrom,
    minStayMonths: d.minStayMonths,
    suburb: d.suburb,
    city: d.city,
    state: d.state,
    country: "Australia",
    furnished: d.furnished ?? false,
    billsIncluded: d.billsIncluded ?? false,
    internet: d.internet ?? false,
    parking: d.parking ?? false,
    petsAllowed: d.petsAllowed ?? false,
    smokingAllowed: d.smokingAllowed ?? false,
    genderPref: d.genderPref ?? "any",
    ownerName: d.ownerName,
    ownerAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(d.ownerName)}`,
    featured: false,
  });

  if (d.photos?.length) {
    await db.insert(roomPhotos).values(
      d.photos.map((url, i) => ({ roomId, url, position: i }))
    );
  }

  return NextResponse.json({ slug }, { status: 201 });
}
