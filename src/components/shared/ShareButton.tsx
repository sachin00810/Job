"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonProps {
  title: string;
  className?: string;
}

export function ShareButton({ title, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled — fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!", { description: "Share this listing with anyone." });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className={className ?? "flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"}
      aria-label="Share listing"
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
