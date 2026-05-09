import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Suburb Guides | appname",
  description: "Find the right neighbourhood for your budget and lifestyle across Australia.",
};

const suburbs = [
  {
    city: "Sydney",
    state: "NSW",
    items: [
      { name: "Surry Hills", vibe: "Cafes, creatives, nightlife", rent: "$400–$600/wk" },
      { name: "Newtown", vibe: "Artsy, student-friendly, diverse", rent: "$320–$480/wk" },
      { name: "Bondi", vibe: "Beach lifestyle, young professionals", rent: "$450–$700/wk" },
      { name: "Parramatta", vibe: "Affordable, well-connected, growing", rent: "$280–$420/wk" },
    ],
  },
  {
    city: "Melbourne",
    state: "VIC",
    items: [
      { name: "Fitzroy", vibe: "Bohemian, cafes, galleries", rent: "$300–$500/wk" },
      { name: "South Yarra", vibe: "Upscale, shopping, dining", rent: "$450–$700/wk" },
      { name: "Footscray", vibe: "Multicultural, affordable, up-and-coming", rent: "$220–$380/wk" },
      { name: "Richmond", vibe: "Sporty, vibrant, central", rent: "$320–$520/wk" },
    ],
  },
  {
    city: "Brisbane",
    state: "QLD",
    items: [
      { name: "West End", vibe: "Creative, progressive, walkable", rent: "$280–$420/wk" },
      { name: "New Farm", vibe: "Leafy, riverside, relaxed", rent: "$350–$550/wk" },
      { name: "Fortitude Valley", vibe: "Nightlife, young crowd, arts", rent: "$300–$480/wk" },
    ],
  },
  {
    city: "Perth",
    state: "WA",
    items: [
      { name: "Subiaco", vibe: "Stylish, walkable, great cafes", rent: "$350–$550/wk" },
      { name: "Fremantle", vibe: "Maritime, artsy, relaxed", rent: "$300–$480/wk" },
      { name: "Northbridge", vibe: "Lively, central, multicultural", rent: "$250–$420/wk" },
    ],
  },
];

export default function SuburbGuidesPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-amber-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-200 text-sm font-medium mb-2">Resources</p>
          <h1 className="text-4xl font-bold">Suburb Guides</h1>
          <p className="mt-4 text-amber-50 text-lg max-w-xl">
            Find the right neighbourhood for your budget and lifestyle.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {suburbs.map((group) => (
          <section key={group.city}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {group.city}
              <span className="ml-2 text-base font-normal text-slate-400">{group.state}</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {group.items.map((s) => (
                <div key={s.name} className="bg-white rounded-xl border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900 mb-1">{s.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{s.vibe}</p>
                  <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                    {s.rent}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="bg-amber-50 rounded-2xl p-8 text-center border border-amber-100">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Ready to find your room?</h3>
          <p className="text-slate-600 text-sm mb-5">Browse available rooms across all these suburbs.</p>
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
