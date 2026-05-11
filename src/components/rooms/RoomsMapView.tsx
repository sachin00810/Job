"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, X } from "lucide-react";
import { formatRent } from "@/lib/utils";
import type { Room } from "@/types";

// Australia bounding box
const LAT_MIN = -44, LAT_MAX = -10;
const LNG_MIN = 113, LNG_MAX = 154;

function toPercent(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100;
  const y = ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * 100;
  return { x, y: 100 - y }; // flip y axis (north = top)
}

export function RoomsMapView({ rooms }: { rooms: Room[] }) {
  const [active, setActive] = useState<Room | null>(null);

  return (
    <div className="flex gap-4 h-[620px]">
      {/* Map canvas */}
      <div
        className="relative flex-1 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, #dbeafe 0%, #e0f2fe 40%, #f0fdf4 70%, #fafafa 100%)",
        }}
        onClick={() => setActive(null)}
      >
        {/* Grid overlay to suggest map tiles */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#6366f1" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Label */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm z-10">
          {rooms.length} rooms · Australia
        </div>

        {/* Pins */}
        {rooms.map((room) => {
          const { x, y } = toPercent(room.lat, room.lng);
          const isActive = active?.id === room.id;
          return (
            <button
              key={room.id}
              onClick={(e) => { e.stopPropagation(); setActive(isActive ? null : room); }}
              className="absolute z-20 -translate-x-1/2 -translate-y-full group"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={room.title}
            >
              <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-md transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-600 text-white scale-110"
                  : "bg-white text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200"
              }`}>
                <MapPin className="h-3 w-3 shrink-0" />
                {formatRent(room.rentWeekly, room.currency)}
              </div>
            </button>
          );
        })}

        {/* Active room popup */}
        {active && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.photos[0]} alt={active.title} className="w-full h-36 object-cover" />
            <button
              onClick={() => setActive(null)}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5 text-slate-500" />
            </button>
            <div className="p-4">
              <p className="font-semibold text-slate-900 line-clamp-1">{active.title}</p>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {active.suburb}, {active.city}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-indigo-600">{formatRent(active.rentWeekly, active.currency)}</span>
                <Link
                  href={`/rooms/${active.slug}`}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  View room
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Side list — scrollable */}
      <div className="w-72 shrink-0 overflow-y-auto space-y-2 pr-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setActive(active?.id === room.id ? null : room)}
            className={`w-full text-left rounded-xl border p-3 transition-all ${
              active?.id === room.id
                ? "border-indigo-400 bg-indigo-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
            }`}
          >
            <div className="flex gap-3 items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={room.photos[0]}
                alt={room.title}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 line-clamp-1">{room.title}</p>
                <p className="text-xs text-slate-500 flex items-center gap-0.5 mt-0.5">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {room.suburb}, {room.city}
                </p>
                <p className="text-sm font-bold text-indigo-600 mt-1">{formatRent(room.rentWeekly, room.currency)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
