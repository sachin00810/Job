import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatRent } from "@/lib/utils";
import type { Room } from "@/types";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow group">
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={room.photos[0]}
          alt={room.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {room.featured && (
          <span className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 bg-white">
        <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">
          {room.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-sm text-slate-600">
            {room.suburb}, {room.city} {room.state}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full capitalize">
            {room.type.replace("-", " ")}
          </span>
          {room.furnished && (
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              Furnished
            </span>
          )}
          {room.billsIncluded && (
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
              Bills incl.
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-xl text-indigo-600">
            {formatRent(room.rentWeekly, room.currency)}
          </span>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={room.ownerAvatar} alt={room.ownerName} />
              <AvatarFallback className="text-xs font-semibold">
                {room.ownerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-slate-600">
              {room.ownerName.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Stretched link covers the whole card */}
      <Link
        href={`/rooms/${room.slug}`}
        className="absolute inset-0 z-[1]"
        aria-label={room.title}
      />

      {/* Heart button sits above the stretched link */}
      <button
        className="absolute top-3 right-3 z-[2] bg-white rounded-full p-2 shadow-sm hover:bg-slate-50 transition-colors"
        aria-label="Save to favourites"
      >
        <Heart className="h-4 w-4 text-slate-500" />
      </button>
    </div>
  );
}
