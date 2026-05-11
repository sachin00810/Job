"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, CheckCircle, ChevronLeft } from "lucide-react";
import { StepProgress } from "@/components/shared/StepProgress";
import { toast } from "sonner";

const STEPS = ["Company", "Job details", "Salary & review"];

const categories = [
  "Technology", "Healthcare", "Hospitality", "Finance",
  "Marketing", "Construction", "Education", "Legal",
  "Retail", "Transport & Logistics", "Other",
];
const states = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

const FIELD_CLASS =
  "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const SELECT_CLASS =
  "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

export default function PostJobPage() {
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
    toast.success("Job submitted!", { description: "Your listing will go live within 24 hours." });
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Job submitted!</h1>
          <p className="text-slate-600 text-sm mb-6">
            Your listing is under review and will go live within 24 hours.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/jobs" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Browse Jobs
            </Link>
            <button
              onClick={() => { setSubmitted(false); setStep(0); }}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm font-semibold rounded-xl transition-colors"
            >
              Post another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Briefcase className="h-7 w-7" />
          <div>
            <h1 className="text-3xl font-bold">Post a Job</h1>
            <p className="mt-1 text-indigo-100">Reach thousands of active candidates across Australia.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <StepProgress steps={STEPS} current={step} color="indigo" />

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Step 1 — Company */}
          {step === 0 && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg">Company details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company name <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="e.g. Acme Corp" className={FIELD_CLASS} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company website</label>
                  <input type="url" placeholder="https://yourcompany.com.au" className={FIELD_CLASS} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact email <span className="text-red-500">*</span></label>
                <input type="email" required placeholder="hiring@yourcompany.com.au" className={FIELD_CLASS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                <select className={SELECT_CLASS}>
                  <option value="">Select industry</option>
                  {categories.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
              </div>
            </section>
          )}

          {/* Step 2 — Job details */}
          {step === 1 && (
            <>
              <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h2 className="font-bold text-slate-900 text-lg">Job details</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Job title <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="e.g. Senior Software Engineer" className={FIELD_CLASS} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                    <select required className={SELECT_CLASS}>
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Employment type <span className="text-red-500">*</span></label>
                    <select required className={SELECT_CLASS}>
                      <option value="">Select type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="casual">Casual</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Job description <span className="text-red-500">*</span></label>
                  <textarea required rows={6} placeholder="Describe the role, responsibilities, and requirements..." className={`${FIELD_CLASS} resize-none`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Required skills</label>
                  <input type="text" placeholder="e.g. React, Node.js, TypeScript (comma-separated)" className={FIELD_CLASS} />
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
                <h2 className="font-bold text-slate-900 text-lg">Location &amp; work mode</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                    <input type="text" required placeholder="e.g. Sydney" className={FIELD_CLASS} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">State <span className="text-red-500">*</span></label>
                    <select required className={SELECT_CLASS}>
                      <option value="">Select state</option>
                      {states.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Work mode <span className="text-red-500">*</span></label>
                  <div className="flex gap-4">
                    {["onsite", "hybrid", "remote"].map((mode) => (
                      <label key={mode} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="workMode" value={mode} required className="accent-indigo-600" />
                        <span className="text-sm text-slate-700 capitalize">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Step 3 — Salary & review */}
          {step === 2 && (
            <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-bold text-slate-900 text-lg">Salary &amp; extras</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Salary min (AUD/yr)</label>
                  <input type="number" min={0} placeholder="e.g. 80000" className={FIELD_CLASS} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Salary max (AUD/yr)</label>
                  <input type="number" min={0} placeholder="e.g. 110000" className={FIELD_CLASS} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-indigo-600 w-4 h-4" />
                <span className="text-sm text-slate-700">Visa sponsorship available</span>
              </label>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-700">
                Your listing will be reviewed within 24 hours and emailed to you once live.
              </div>
            </section>
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
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
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
