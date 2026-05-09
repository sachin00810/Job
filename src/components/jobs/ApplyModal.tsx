"use client";

import { useState } from "react";
import { X, CheckCircle, Upload } from "lucide-react";

interface Props {
  jobTitle: string;
  companyName: string;
}

export function ApplyModal({ jobTitle, companyName }: Props) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleClose() {
    setOpen(false);
    // Reset after animation
    setTimeout(() => setSubmitted(false), 300);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg text-lg font-medium text-center transition-colors"
      >
        Apply for this job
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">Apply for this role</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {jobTitle} · {companyName}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            {submitted ? (
              <div className="p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Application sent!</h3>
                <p className="text-slate-500 text-sm mb-6">
                  {companyName} will be in touch if your profile is a good match.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Smith"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+61 4XX XXX XXX"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cover letter <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={`Tell ${companyName} why you're the right fit for this role…`}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Resume (PDF or Word)
                  </label>
                  <label className="flex items-center gap-3 w-full px-4 py-2.5 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-500 truncate">
                      {fileName || "Click to upload your resume"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="sr-only"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                    />
                  </label>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Submit application
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
