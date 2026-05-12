"use client";

import { useState } from "react";
import { X, CheckCircle, Upload, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  jobId: string;
  jobTitle: string;
  companyName: string;
}

export function ApplyModal({ jobId, jobTitle, companyName }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) {
      router.push("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }
    const form = e.currentTarget;
    const coverLetter = (form.elements.namedItem("coverLetter") as HTMLTextAreaElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, coverLetter, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          toast.error("You have already applied for this job.");
        } else {
          toast.error(data.error ?? "Failed to submit application.");
        }
        return;
      }
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
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
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
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

            {submitted ? (
              <div className="p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Application sent!</h3>
                <p className="text-slate-500 text-sm mb-6">
                  {companyName} will be in touch. You can continue the conversation in your dashboard.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-colors text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {!session && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                    You need to be signed in to apply. Clicking submit will redirect you to sign in.
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cover letter <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="coverLetter"
                    required
                    rows={4}
                    placeholder={`Tell ${companyName} why you're the right fit for this role…`}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                    Message to employer <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Any quick note or question for the hiring manager…"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    This starts a direct conversation thread with the job poster.
                  </p>
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
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    {loading ? "Submitting…" : "Submit application"}
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
