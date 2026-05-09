import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Saved Rooms | appname",
  description: "View the rooms you've saved on appname.",
};

export default function SavedRoomsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-amber-500 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Saved Rooms</h1>
          <p className="mt-2 text-amber-50">Rooms you&apos;ve bookmarked for later.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-7 w-7 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No saved rooms yet</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
            When you save a room, it will appear here so you can come back to it later.
          </p>
          <Link
            href="/rooms"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Browse Rooms
          </Link>
        </div>
      </div>
    </div>
  );
}
