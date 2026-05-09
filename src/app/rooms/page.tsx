import { rooms } from "@/data/rooms";
import RoomCard from "@/components/rooms/RoomCard";

export default function RoomsPage() {
  return (
    <>
      {/* Header strip */}
      <section className="bg-amber-500 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Find Your Room</h1>
          <p className="mt-2 text-amber-50">
            {rooms.length} rooms available across Australia
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-slate-50 py-10 min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Filter sidebar — desktop only */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="bg-white rounded-xl p-6 sticky top-20 shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                <p className="mt-3 text-sm text-slate-500">
                  Filter controls coming soon
                </p>
              </div>
            </aside>

            {/* Results area */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-slate-600">
                  Showing {rooms.length} rooms
                </p>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option>Most recent</option>
                  <option>Price: low to high</option>
                  <option>Price: high to low</option>
                </select>
              </div>

              {/* Rooms grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
