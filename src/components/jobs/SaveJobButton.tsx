"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export function SaveJobButton({ jobTitle, jobId }: { jobTitle: string; jobId: string }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const optimistic = !saved;
    setSaved(optimistic);
    try {
      const res = await fetch("/api/saved/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) {
        setSaved(!optimistic);
        toast.error("Sign in to save jobs.");
        return;
      }
      const data = await res.json();
      setSaved(data.saved);
      if (data.saved) {
        toast.success("Job saved!", { description: `"${jobTitle}" added to your saved jobs.` });
      } else {
        toast("Job removed", { description: `"${jobTitle}" removed from saved jobs.` });
      }
    } catch {
      setSaved(!optimistic);
      toast.error("Failed to save job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`mt-3 w-full border py-3 px-4 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors disabled:opacity-60 ${
        saved
          ? "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          : "border-slate-200 hover:bg-slate-50 text-slate-700"
      }`}
    >
      <Heart className={`h-5 w-5 ${saved ? "fill-indigo-500 text-indigo-500" : "text-slate-400"}`} />
      {saved ? "Saved" : "Save job"}
    </button>
  );
}
