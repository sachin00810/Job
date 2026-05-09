"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroSearch() {
  const router = useRouter();
  const [tab, setTab] = useState<"jobs" | "rooms">("jobs");

  const [jobKeyword, setJobKeyword] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [roomLocation, setRoomLocation] = useState("");
  const [roomType, setRoomType] = useState("");

  function handleJobSearch() {
    const params = new URLSearchParams();
    if (jobKeyword.trim()) params.set("q", jobKeyword.trim());
    if (jobLocation.trim()) params.set("location", jobLocation.trim());
    router.push(`/jobs${params.size ? `?${params}` : ""}`);
  }

  function handleRoomSearch() {
    const params = new URLSearchParams();
    if (roomLocation.trim()) params.set("location", roomLocation.trim());
    if (roomType) params.set("type", roomType);
    router.push(`/rooms${params.size ? `?${params}` : ""}`);
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      {/* Tab toggles */}
      <div className="flex gap-2 justify-center mb-4">
        <button
          onClick={() => setTab("jobs")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
            tab === "jobs"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}
        >
          <Briefcase className="h-4 w-4" />
          Jobs
        </button>
        <button
          onClick={() => setTab("rooms")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors",
            tab === "rooms"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}
        >
          <Home className="h-4 w-4" />
          Rooms
        </button>
      </div>

      {/* Search card */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {tab === "jobs" ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={jobKeyword}
                onChange={(e) => setJobKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJobSearch()}
                placeholder="Job title, keywords, or company"
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJobSearch()}
                placeholder="City or suburb"
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleJobSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Search Jobs
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={roomLocation}
                onChange={(e) => setRoomLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRoomSearch()}
                placeholder="Suburb or city"
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Any type</option>
              <option value="studio">Studio</option>
              <option value="private-room">Private room</option>
              <option value="shared-room">Shared room</option>
              <option value="whole-place">Whole place</option>
            </select>
            <button
              onClick={handleRoomSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Search Rooms
            </button>
          </div>
        )}
      </div>

      {/* Popular searches */}
      <p className="text-center text-slate-500 text-sm mt-4">
        Popular:{" "}
        <span className="text-slate-400">
          Sydney • Melbourne • Brisbane • Remote • Visa sponsorship
        </span>
      </p>
    </div>
  );
}
