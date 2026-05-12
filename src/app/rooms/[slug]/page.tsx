import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  Wifi,
  Car,
  PawPrint,
  CigaretteOff,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/db";
import { rooms as roomsTable, roomPhotos } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { formatRent, formatCurrency, formatDateRelative } from "@/lib/utils";
import RoomCard from "@/components/rooms/RoomCard";
import { RoomActionButtons } from "@/components/rooms/RoomActionButtons";
import { ShareButton } from "@/components/shared/ShareButton";
import type { Metadata } from "next";
import type { Room } from "@/types";

async function getRoom(slug: string) {
  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.slug, slug)).limit(1);
  if (!room) return null;
  const photos = await db.select({ url: roomPhotos.url }).from(roomPhotos).where(eq(roomPhotos.roomId, room.id)).orderBy(roomPhotos.position);
  return {
    ...room,
    postedAt: room.postedAt instanceof Date ? room.postedAt.toISOString() : (room.postedAt ?? ""),
    photos: photos.map((p) => p.url),
  };
}

export async function generateStaticParams() {
  if (!process.env.DATABASE_URL) return [];
  try {
    const rows = await db.select({ slug: roomsTable.slug }).from(roomsTable);
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const room = await getRoom(params.slug);
  if (!room) return {};
  return {
    title: `${room.title} | appname`,
    description: room.description.slice(0, 160),
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const room = await getRoom(params.slug);
  if (!room) notFound();

  const availableDate = new Date(room.availableFrom).toLocaleDateString(
    "en-AU",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const similarRows = await db.select().from(roomsTable).where(ne(roomsTable.id, room.id)).limit(3);
  const similarRooms = await Promise.all(similarRows.map(async (r) => {
    const photos = await db.select({ url: roomPhotos.url }).from(roomPhotos).where(eq(roomPhotos.roomId, r.id)).orderBy(roomPhotos.position);
    return {
      ...r,
      type: r.type as Room["type"],
      genderPref: r.genderPref as Room["genderPref"],
      lat: r.lat ?? 0,
      lng: r.lng ?? 0,
      postedAt: r.postedAt instanceof Date ? r.postedAt.toISOString() : (r.postedAt ?? ""),
      photos: photos.map((p) => p.url),
    } as Room;
  }));

  const summaryCells = [
    { label: "Rent", value: formatRent(room.rentWeekly, room.currency) },
    { label: "Bond", value: formatCurrency(room.bond, room.currency) },
    {
      label: "Type",
      value: room.type.replace(/-/g, " "),
      capitalize: true,
    },
    { label: "Available", value: availableDate },
    {
      label: "Min. stay",
      value: `${room.minStayMonths} month${room.minStayMonths > 1 ? "s" : ""}`,
    },
    { label: "Bills", value: room.billsIncluded ? "Included" : "Not included" },
    {
      label: "Internet",
      value: room.internet ? "Included" : "Not included",
    },
    {
      label: "Parking",
      value: room.parking ? "Available" : "Not available",
    },
    { label: "Pets", value: room.petsAllowed ? "Allowed" : "Not allowed" },
    {
      label: "Smoking",
      value: room.smokingAllowed ? "Allowed" : "Not allowed",
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      {/* Header strip */}
      <section className="bg-amber-500 text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/rooms"
            className="text-amber-100 hover:text-white text-sm transition-colors"
          >
            ← Back to rooms
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mt-3">{room.title}</h1>

          <div className="mt-3 flex items-center gap-2.5">
            <Avatar className="h-8 w-8">
              <AvatarImage src={room.ownerAvatar} alt={room.ownerName} />
              <AvatarFallback className="text-xs font-semibold bg-amber-100 text-amber-900">
                {room.ownerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">Listed by {room.ownerName}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-amber-100">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>
                {room.suburb}, {room.city} {room.state}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Available {availableDate}</span>
            </div>
            <div className="flex items-center gap-1.5 capitalize">
              <Users className="h-4 w-4 shrink-0" />
              <span>{room.type.replace(/-/g, " ")}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center flex-wrap gap-2">
            {room.featured && (
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </span>
            )}
            {room.furnished && (
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Furnished
              </span>
            )}
            {room.billsIncluded && (
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Bills included
              </span>
            )}
            <ShareButton
              title={room.title}
              className="ml-auto flex items-center gap-1.5 text-sm text-amber-100 hover:text-white transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          {/* Hero photo */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
            <Image
              src={room.photos[0]}
              alt={room.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          {/* Thumbnail strip */}
          {room.photos.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {room.photos.slice(1, 4).map((photo, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden"
                >
                  <Image
                    src={photo}
                    alt={`${room.title} photo ${idx + 2}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 22vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Description + amenities */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              About this room
            </h2>
            <div className="mt-4">
              {room.description.split("\n\n").map((para, idx) => (
                <p
                  key={idx}
                  className="text-slate-700 leading-relaxed mb-4 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  {
                    icon: Wifi,
                    label: "Internet included",
                    active: room.internet,
                  },
                  {
                    icon: Car,
                    label: "Parking available",
                    active: room.parking,
                  },
                  {
                    icon: PawPrint,
                    label: "Pets allowed",
                    active: room.petsAllowed,
                  },
                  {
                    icon: CheckCircle2,
                    label: "Furnished",
                    active: room.furnished,
                  },
                  {
                    icon: CigaretteOff,
                    label: "Smoking allowed",
                    active: room.smokingAllowed,
                  },
                ].map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 text-sm ${
                      active
                        ? "text-slate-700"
                        : "text-slate-400 line-through decoration-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {(room.genderPref !== "any" || room.smokingAllowed) && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900">
                  House rules
                </h2>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {room.genderPref !== "any" && (
                    <li className="capitalize">
                      Preferred tenant: {room.genderPref} only
                    </li>
                  )}
                  {room.smokingAllowed && <li>Smoking permitted</li>}
                  {!room.smokingAllowed && <li>No smoking</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24">
            {/* CTA card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-3xl font-bold text-indigo-600">
                {formatRent(room.rentWeekly, room.currency)}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Bond: {formatCurrency(room.bond, room.currency)}
              </p>

              <RoomActionButtons roomTitle={room.title} ownerName={room.ownerName} />

              <p className="mt-4 text-center text-sm text-slate-500">
                Listed {formatDateRelative(room.postedAt)}
              </p>
            </div>

            {/* Summary card */}
            <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Room summary
              </h3>
              <div className="space-y-0">
                {summaryCells.map(({ label, value, capitalize }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm text-slate-500">{label}</span>
                    <span
                      className={`text-sm text-slate-900 font-medium text-right ${
                        capitalize ? "capitalize" : ""
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar rooms */}
      {similarRooms.length > 0 && (
        <section className="bg-slate-50 py-16 border-t border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              More rooms in {room.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarRooms.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
