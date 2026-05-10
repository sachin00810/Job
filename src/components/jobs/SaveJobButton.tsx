"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export function SaveJobButton({ jobTitle }: { jobTitle: string }) {
  const [saved, setSaved] = useState(false);

  function toggle() {
    const next = !saved;
    setSaved(next);
    if (next) {
      toast.success("Job saved!", { description: `"${jobTitle}" added to your saved jobs.` });
    } else {
      toast("Job removed", { description: `"${jobTitle}" removed from saved jobs.` });
    }
  }

  return (
    <button
      onClick={toggle}
      className={`mt-3 w-full border py-3 px-4 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors ${
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
