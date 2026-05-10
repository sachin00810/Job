"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { rooms as allRooms } from "@/data/rooms";
import RoomCard from "@/components/rooms/RoomCard";
import { RoomCardSkeleton } from "@/components/rooms/RoomCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import type { Room } from "@/types";

type SortKey = "recent" | "price-asc" | "price-desc";

interface Filters {
  types: string[];
  maxRent: number;
  furnished: boolean;
  billsIncluded: boolean;
  internet: boolean;
  parking: boolean;
  petsAllowed: boolean;
}

const ROOM_TYPES: { value: Room["type"]; label: string }[] = [
  { value: "private-room", label: "Private room" },
  { value: "shared-room", label: "Shared room" },
  { value: "studio", label: "Studio" },
  { value: "whole-place", label: "Whole place" },
];

const RENT_STEPS = [0, 200, 300, 400, 500, 600, 700];

function sorted(rooms: Room[], key: SortKey): Room[] {
  const copy = [...rooms];
  if (key === "price-asc") return copy.sort((a, b) => a.rentWeekly - b.rentWeekly);
  if (key === "price-desc") return copy.sort((a, b) => b.rentWeekly - a.rentWeekly);
  return copy.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
}

function applyFilters(rooms: Room[], location: string, urlType: string, filters: Filters): Room[] {
  let result = rooms;
  if (location) {
    const ll = location.toLowerCase();
    result = result.filter(
      (r) =>
        r.suburb.toLowerCase().includes(ll) ||
        r.city.toLowerCase().includes(ll) ||
        r.state.toLowerCase().includes(ll)
    );
  }
  // URL type param takes precedence; otherwise use sidebar types
  const activeTypes = urlType ? [urlType] : filters.types;
  if (activeTypes.length > 0) {
    result = result.filter((r) => activeTypes.includes(r.type));
  }
  if (filters.maxRent > 0) {
    result = result.filter((r) => r.rentWeekly <= filters.maxRent);
  }
  if (filters.furnished) result = result.filter((r) => r.furnished);
  if (filters.billsIncluded) result = result.filter((r) => r.billsIncluded);
  if (filters.internet) result = result.filter((r) => r.internet);
  if (filters.parking) result = result.filter((r) => r.parking);
  if (filters.petsAllowed) result = result.filter((r) => r.petsAllowed);
  return result;
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

const EMPTY_FILTERS: Filters = {
  types: [],
  maxRent: 0,
  furnished: false,
  billsIncluded: false,
  internet: false,
  parking: false,
  petsAllowed: false,
};

function activeFilterCount(filters: Filters): number {
  return (
    filters.types.length +
    (filters.maxRent > 0 ? 1 : 0) +
    (filters.furnished ? 1 : 0) +
    (filters.billsIncluded ? 1 : 0) +
    (filters.internet ? 1 : 0) +
    (filters.parking ? 1 : 0) +
    (filters.petsAllowed ? 1 : 0)
  );
}

function FilterPanel({
  filters,
  onChange,
  onClear,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear: () => void;
}) {
  const count = activeFilterCount(filters);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        {count > 0 && (
          <button onClick={onClear} className="text-xs text-amber-600 hover:underline font-medium">
            Clear all ({count})
          </button>
        )}
      </div>

      {/* Room type */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Room type</h3>
        <div className="space-y-1.5">
          {ROOM_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.types.includes(value)}
                onChange={() => onChange({ ...filters, types: toggle(filters.types, value) })}
                className="accent-amber-500 w-4 h-4"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Max rent */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Max rent / week
          {filters.maxRent > 0 && (
            <span className="ml-1 font-normal text-amber-600">up to ${filters.maxRent}</span>
          )}
        </h3>
        <input
          type="range"
          min={0}
          max={RENT_STEPS.length - 1}
          value={RENT_STEPS.indexOf(filters.maxRent) === -1 ? 0 : RENT_STEPS.indexOf(filters.maxRent)}
          onChange={(e) =>
            onChange({ ...filters, maxRent: RENT_STEPS[Number(e.target.value)] })
          }
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Any</span>
          <span>$700/wk</span>
        </div>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Features</h3>
        <div className="space-y-1.5">
          {[
            { key: "furnished" as const, label: "Furnished" },
            { key: "billsIncluded" as const, label: "Bills included" },
            { key: "internet" as const, label: "Internet included" },
            { key: "parking" as const, label: "Parking" },
            { key: "petsAllowed" as const, label: "Pets allowed" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => onChange({ ...filters, [key]: !filters[key] })}
                className="accent-amber-500 w-4 h-4"
              />
              <span className="text-sm text-slate-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomsContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") ?? "";
  const urlType = searchParams.get("type") ?? "";

  const [sort, setSort] = useState<SortKey>("recent");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;
  const allFiltered = sorted(applyFilters(allRooms, location, urlType, filters), sort);
  const totalPages = Math.ceil(allFiltered.length / PAGE_SIZE);
  const rooms = allFiltered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasSearch = location || urlType;
  const filterCount = activeFilterCount(filters);

  function handleFilterChange(f: Filters) {
    setFilters(f);
    setPage(1);
  }

  return (
    <>
      {/* Header strip */}
      <section className="bg-amber-500 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Find Your Room</h1>
          <p className="mt-2 text-amber-50">
            {hasSearch
              ? `${rooms.length} result${rooms.length !== 1 ? "s" : ""}${location ? ` in ${location}` : ""}${urlType ? ` · ${urlType.replace("-", " ")}` : ""}`
              : `${allRooms.length} rooms available across Australia`}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-slate-50 py-10 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">

            {/* Filter sidebar — desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-xl p-5 sticky top-20 shadow-sm border border-slate-200">
                <FilterPanel
                  filters={filters}
                  onChange={handleFilterChange}
                  onClear={() => handleFilterChange(EMPTY_FILTERS)}
                />
              </div>
            </aside>

            {/* Results area */}
            <div className="flex-1 min-w-0">
              {/* Sort + mobile filter bar */}
              <div className="flex justify-between items-center mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600">
                    Showing {allFiltered.length} {allFiltered.length === 1 ? "room" : "rooms"}
                  </p>
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-200 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {filterCount > 0 && (
                      <span className="ml-0.5 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                        {filterCount}
                      </span>
                    )}
                  </button>
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="recent">Most recent</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </div>

              {/* Active filter chips */}
              {filterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.types.map((t) => {
                    const label = ROOM_TYPES.find((r) => r.value === t)?.label ?? t;
                    return (
                      <button
                        key={t}
                        onClick={() => setFilters({ ...filters, types: filters.types.filter((x) => x !== t) })}
                        className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full hover:bg-amber-200 transition-colors"
                      >
                        {label} <X className="h-3 w-3" />
                      </button>
                    );
                  })}
                  {filters.maxRent > 0 && (
                    <button
                      onClick={() => setFilters({ ...filters, maxRent: 0 })}
                      className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full hover:bg-amber-200 transition-colors"
                    >
                      Up to ${filters.maxRent}/wk <X className="h-3 w-3" />
                    </button>
                  )}
                  {(["furnished", "billsIncluded", "internet", "parking", "petsAllowed"] as const).map((key) => {
                    const labels: Record<string, string> = {
                      furnished: "Furnished",
                      billsIncluded: "Bills included",
                      internet: "Internet",
                      parking: "Parking",
                      petsAllowed: "Pets allowed",
                    };
                    if (!filters[key]) return null;
                    return (
                      <button
                        key={key}
                        onClick={() => setFilters({ ...filters, [key]: false })}
                        className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full hover:bg-amber-200 transition-colors"
                      >
                        {labels[key]} <X className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Rooms grid or empty state */}
              {allFiltered.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <RoomCard key={room.id} room={room} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  />
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-500 text-lg">No rooms found.</p>
                  <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
                  {filterCount > 0 && (
                    <button
                      onClick={() => handleFilterChange(EMPTY_FILTERS)}
                      className="mt-4 text-sm text-amber-600 hover:underline font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                onClear={() => handleFilterChange(EMPTY_FILTERS)}
              />
            </div>
            <div className="sticky bottom-0 p-4 bg-white border-t border-slate-200">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Show {allFiltered.length} {allFiltered.length === 1 ? "room" : "rooms"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function RoomsPageSkeleton() {
  return (
    <>
      <section className="bg-amber-500 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Find Your Room</h1>
        </div>
      </section>
      <section className="bg-slate-50 py-10 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-4 bg-slate-200 animate-pulse rounded" />
                ))}
              </div>
            </aside>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <RoomCardSkeleton key={i} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={<RoomsPageSkeleton />}>
      <RoomsContent />
    </Suspense>
  );
}
