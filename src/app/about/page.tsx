import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | appname",
  description: "Learn about appname — Australia's all-in-one job and room marketplace.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold">About appname</h1>
          <p className="mt-4 text-indigo-100 text-lg">
            Australia&apos;s all-in-one marketplace for jobs and rooms.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            Moving to a new city for work is hard enough. We built appname to make two of the
            biggest hurdles — finding a job and finding a place to live — easier to tackle together.
            Whether you&apos;re a recent graduate, a skilled migrant, or a local changing careers,
            appname connects you to opportunities across Australia.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What We Offer</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Jobs</h3>
              <p className="text-sm text-slate-600">
                Browse thousands of listings across technology, healthcare, hospitality, finance,
                and more. Filter by salary, work mode, and visa sponsorship.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Rooms</h3>
              <p className="text-sm text-slate-600">
                Find private rooms, studios, shared rooms, and whole places from verified
                landlords across Sydney, Melbourne, Brisbane, and beyond.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Made in Australia</h2>
          <p className="text-slate-600 leading-relaxed">
            appname is proudly built and operated in Australia. We understand the local job market
            and rental landscape, and we&apos;re committed to helping Australians and newcomers
            find their footing.
          </p>
        </section>

        <div className="pt-4">
          <Link
            href="/contact"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
