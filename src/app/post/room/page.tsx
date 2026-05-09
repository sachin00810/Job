"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, CheckCircle } from "lucide-react";

const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

export default function ListRoomPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Room submitted!</h1>
          <p className="text-slate-600 text-sm mb-6">
            Your listing is under review and will go live within 24 hours. We&apos;ll email you once it&apos;s published.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/rooms"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Browse Rooms
            </Link>
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold rounded-xl transition-colors"
            >
              List another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-amber-500 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Home className="h-7 w-7" />
          <div>
            <h1 className="text-3xl font-bold">List a Room</h1>
            <p className="mt-1 text-amber-50">Find your next tenant fast — free during early access.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Listing basics */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">Listing basics</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Listing title <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Sunny Private Room in Surry Hills Terrace"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Room type <span className="text-red-500">*</span></label>
              <select
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select type</option>
                <option value="private-room">Private room</option>
                <option value="shared-room">Shared room</option>
                <option value="studio">Studio</option>
                <option value="whole-place">Whole place</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea
                required
                rows={5}
                placeholder="Describe the room, the property, housemates, and the neighbourhood..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>
          </section>

          {/* Location */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">Location</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Suburb <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surry Hills"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sydney"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
              <select
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select state</option>
                {states.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">Pricing</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Weekly rent (AUD) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="e.g. 350"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bond (AUD) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="e.g. 1400"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Available from <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Minimum stay (months) <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 6, 12].map((n) => (
                    <option key={n} value={n}>{n} month{n !== 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-lg">Features &amp; preferences</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "furnished", label: "Furnished" },
                { name: "billsIncluded", label: "Bills included" },
                { name: "internet", label: "Internet included" },
                { name: "parking", label: "Parking" },
                { name: "petsAllowed", label: "Pets allowed" },
                { name: "smokingAllowed", label: "Smoking allowed" },
              ].map(({ name, label }) => (
                <label key={name} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name={name} className="accent-amber-500 w-4 h-4" />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender preference</label>
              <div className="flex gap-4">
                {[
                  { value: "any", label: "Any" },
                  { value: "female", label: "Female only" },
                  { value: "male", label: "Male only" },
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="genderPref"
                      value={value}
                      defaultChecked={value === "any"}
                      className="accent-amber-500"
                    />
                    <span className="text-sm text-slate-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-bold text-slate-900 text-lg">Your contact details</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Your name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </section>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Submit listing
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl transition-colors text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
