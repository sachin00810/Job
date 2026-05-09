import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Renting Tips | appname",
  description: "Everything you need to know about renting a room in Australia.",
};

const steps = [
  {
    step: "1",
    title: "Know your rights",
    body: "Each state has its own tenancy laws. Familiarise yourself with your state's Residential Tenancies Act — it covers bond limits, notice periods, repairs, and eviction rules.",
  },
  {
    step: "2",
    title: "Understand the bond",
    body: "A bond (security deposit) is typically 4 weeks' rent. It must be lodged with your state's tenancy authority, not held by the landlord. You get it back at the end if there's no damage.",
  },
  {
    step: "3",
    title: "Read the lease carefully",
    body: "Before signing, check the lease length, what's included in rent (bills, internet), pet clauses, and what notice period you need to give to leave.",
  },
  {
    step: "4",
    title: "Do a condition report",
    body: "Document the state of the property on day one with photos and a signed condition report. This protects your bond when you move out.",
  },
  {
    step: "5",
    title: "Know what landlords can and can't do",
    body: "Your landlord must give notice before inspections (usually 24–48 hours), keep the property in good repair, and cannot discriminate in tenant selection.",
  },
  {
    step: "6",
    title: "Budget beyond rent",
    body: "Factor in electricity, gas, internet, and contents insurance. If bills aren't included, budget an extra $50–$100/week depending on the property and season.",
  },
];

const redFlags = [
  "Landlord refuses to provide a written lease",
  "Asked to pay bond in cash with no receipt",
  "Property photos look too good to be true (could be a scam)",
  "Pressure to sign immediately without a proper inspection",
  "No condition report provided at move-in",
  "Landlord wants full rent paid upfront for months",
];

export default function RentingTipsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-amber-500 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-200 text-sm font-medium mb-2">Resources</p>
          <h1 className="text-4xl font-bold">Renting Tips</h1>
          <p className="mt-4 text-amber-50 text-lg">
            Everything you need to rent safely and confidently in Australia.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">6 Steps to Renting Safely</h2>
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.step} className="bg-white rounded-xl border border-slate-200 p-6 flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-600">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-red-50 rounded-xl border border-red-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-bold text-slate-900">Red flags to watch out for</h2>
          </div>
          <ul className="space-y-2">
            {redFlags.map((flag) => (
              <li key={flag} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                {flag}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-bold text-slate-900">Before you sign</h2>
          </div>
          <ul className="space-y-2">
            {[
              "Inspect the property in person before paying anything",
              "Confirm bond will be lodged with the state authority",
              "Get everything agreed verbally in writing",
              "Check the neighbourhood at different times of day",
              "Meet your potential housemates if it's a sharehouse",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="text-center">
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
