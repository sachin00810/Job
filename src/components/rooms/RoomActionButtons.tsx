"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export function RoomActionButtons({ roomTitle, ownerName }: { roomTitle: string; ownerName: string }) {
  const [saved, setSaved] = useState(false);

  function toggleSave() {
    const next = !saved;
    setSaved(next);
    if (next) {
      toast.success("Room saved!", { description: `"${roomTitle}" added to your saved rooms.` });
    } else {
      toast("Room removed", { description: `"${roomTitle}" removed from saved rooms.` });
    }
  }

  function handleMessage() {
    toast.info(`Message sent to ${ownerName}`, {
      description: "They'll receive your enquiry and get back to you shortly.",
    });
  }

  return (
    <>
      <button
        onClick={handleMessage}
        className="mt-5 w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg text-base font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <MessageCircle className="h-5 w-5" />
        Message owner
      </button>
      <button
        onClick={toggleSave}
        className={`mt-3 w-full border py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition-colors ${
          saved
            ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
            : "border-slate-200 hover:bg-slate-50 text-slate-700"
        }`}
      >
        <Heart className={`h-5 w-5 ${saved ? "fill-amber-500 text-amber-500" : "text-slate-400"}`} />
        {saved ? "Saved" : "Save room"}
      </button>
    </>
  );
}
