"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, CheckCircle, ChevronLeft } from "lucide-react";
import { StepProgress } from "@/components/shared/StepProgress";
import { toast } from "sonner";

const STEPS = ["Listing basics", "Location & pricing", "Features & contact"];
const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

const FIELD_CLASS =
  "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500";
const SELECT_CLASS =
  "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500";

export default function ListRoomPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) { next(); return; }
    setSubmitted(true);
    toast.success("Room submitted!", { description: "Your listing will go live within 24 hours." });
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
            Your listing is under review and will go live within 24 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/rooms" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors">
              Browse Rooms
            </Link>
            <button
              onClick={() => { setSubmitted(false); setStep(0); }}
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
        <StepProgress steps={STEPS} current={step} color="amber" />

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Step 1 — Listing basics */}
          {step === 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg">Listing basics</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Listing title <span className="text-red-500">*</span></label>
                <input type="text" required placeholder="e.g. Sunny Private Room in Surry Hills Terrace" className={FIELD_CLASS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Room type <span className="text-red-500">*</span></label>
                <select required className={SELECT_CLASS}>
                  <option value="">Select type</option>
                  <option value="private-room">Private room</option>
                  <option value="shared-room">Shared room</option>
                  <option value="studio">Studio</option>
                  <option value="whole-place">Whole place</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea required rows={5} placeholder="Describe the room, property, housemates, and neighbourhood..." className={`${FIELD_CLASS} resize-none`} />
              </div>
            </section>
          )}

          {/* Step 2 — Location & pricing */}
          {step === 1 && (
            <>
              <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h2 className="font-bold text-slate-900 text-lg">Location</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Suburb <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="e.g. Surry Hills" className={FIELD_CLASS} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="e.g. Sydney" className={FIELD_CLASS} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
                  <select required className={SELECT_CLASS}>
                    <option value="">Select state</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h2 className="font-bold text-slate-900 text-lg">Pricing</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Weekly rent (AUD) <span className="text-red-500">*</span></label>
                    <input type="number" required min={1} placeholder="e.g. 350" className={FIELD_CLASS} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Bond (AUD) <span className="text-red-500">*</span></label>
                    <input type="number" required min={0} placeholder="e.g. 1400" className={FIELD_CLASS} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Available from <span className="text-red-500">*</span></label>
                    <input type="date" required className={FIELD_CLASS} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Minimum stay <span className="text-red-500">*</span></label>
                    <select required className={SELECT_CLASS}>
                      <option value="">Select</option>
                      {[1, 2, 3, 6, 12].map((n) => (
                        <option key={n} value={n}>{n} month{n !== 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Step 3 — Features & contact */}
          {step === 2 && (
            <>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gender preference</label>
                  <div className="flex gap-4">
                    {[{ value: "any", label: "Any" }, { value: "female", label: "Female only" }, { value: "male", label: "Male only" }].map(({ value, label }) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="genderPref" value={value} defaultChecked={value === "any"} className="accent-amber-500" />
                        <span className="text-sm text-slate-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h2 className="font-bold text-slate-900 text-lg">Your contact details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Your name <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="e.g. Sarah Jenkins" className={FIELD_CLASS} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address <span className="text-red-500">*</span></label>
                    <input type="email" required placeholder="you@example.com" className={FIELD_CLASS} />
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700">
                  Your listing will be reviewed within 24 hours and emailed to you once live.
                </div>
              </section>
            </>
          )}

          {/* Nav buttons */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl transition-colors text-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {step === STEPS.length - 1 ? "Submit listing" : `Next: ${STEPS[step + 1]}`}
            </button>
            {step === 0 && (
              <Link href="/" className="px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl transition-colors text-sm">
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
