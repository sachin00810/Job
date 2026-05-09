import Link from "next/link";
import { Home, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List a Room | appname",
  description: "List your room, studio, or whole place on appname and find your next tenant fast.",
};

export default function ListRoomPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 mx-auto">
          <Home className="h-8 w-8 text-amber-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">List a Room</h1>
        <p className="mt-4 text-slate-600 max-w-md mx-auto">
          Our self-serve listing form is coming soon. Get in touch and
          we&apos;ll have your room live within 24 hours — free for early
          landlords and homeowners.
        </p>

        <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-left space-y-4">
          <h2 className="font-semibold text-slate-900">What you get</h2>
          {[
            "Reach thousands of verified room seekers",
            "Photo gallery with up to 10 images",
            "Manage enquiries with in-app messaging",
            "Free during our early-access period",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="mt-0.5 h-4 w-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 text-xs font-bold">
                ✓
              </span>
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="mailto:hello@appname.com.au"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
          >
            <Mail className="h-4 w-4" />
            Email us to list
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
