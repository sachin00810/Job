"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart, Home } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatRent } from "@/lib/utils";
import type { Room } from "@/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface RoomCardProps {
  room: Room;
}

const HOURS_48 = 48 * 60 * 60 * 1000;

export default function RoomCard({ room }: RoomCardProps) {
  const [saved, setSaved] = useState(false);
  const [fresh, setFresh] = useState(false);

  useEffect(() => {
    setFresh(Date.now() - new Date(room.postedAt).getTime() < HOURS_48);
  }, [room.postedAt]);

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    const next = !saved;
    setSaved(next);
    if (next) {
      toast.success("Room saved!", { description: `"${room.title}" added to saved rooms.` });
    } else {
      toast("Room removed", { description: `"${room.title}" removed from saved rooms.` });
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow group">
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {room.photos[0] ? (
          <Image
            src={room.photos[0]}
            alt={room.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="h-12 w-12 text-slate-300" />
          </div>
        )}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {fresh && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {room.featured && (
            <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>
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
        onClick={toggleSave}
        className={`absolute top-3 right-3 z-[2] bg-white rounded-full p-2 shadow-sm transition-colors ${saved ? "hover:bg-red-50" : "hover:bg-slate-50"}`}
        aria-label="Save to favourites"
      >
        <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : "text-slate-500"}`} />
      </button>
    </div>
  );
}
