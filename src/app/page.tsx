import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart, MessageSquare, CheckCircle, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { jobs } from "@/data/jobs";
import { rooms } from "@/data/rooms";
import { formatRent, formatDateRelative, formatSalaryRange } from "@/lib/utils";
import { HeroSearch } from "@/components/home/HeroSearch";

const featuredJobs = [
  ...jobs.filter((j) => j.featured),
  ...jobs.filter((j) => !j.featured),
].slice(0, 6);

const featuredRooms = [
  ...rooms.filter((r) => r.featured),
  ...rooms.filter((r) => !r.featured),
].slice(0, 6);

const stats = [
  { value: "12,000+", label: "Active Jobs" },
  { value: "5,400+", label: "Rooms Listed" },
  { value: "350+", label: "Suburbs" },
  { value: "94%", label: "Match Rate" },
];

const steps = [
  {
    Icon: Search,
    number: "01",
    title: "Search",
    desc: "Filter through thousands of verified jobs and rooms across Australia.",
  },
  {
    Icon: MessageSquare,
    number: "02",
    title: "Connect",
    desc: "Message employers and landlords directly through our safe in-app chat.",
  },
  {
    Icon: CheckCircle,
    number: "03",
    title: "Land it",
    desc: "Get the job, lock in the room, and start your new chapter.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section className="bg-gradient-to-b from-indigo-50 via-white to-amber-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1">
            Australia&apos;s #1 Jobs + Rooms marketplace
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
            Find your{" "}
            <span className="text-indigo-600">next job</span>.{" "}
            <br className="hidden sm:block" />
            Find your{" "}
            <span className="text-amber-500">next home</span>.
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            One marketplace, two life essentials. Search thousands of jobs and
            rooms across Australia.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* ── Section 2: Stats Strip ── */}
      <section className="py-12 bg-white border-t border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-indigo-600">{s.value}</p>
                <p className="mt-2 text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Featured Jobs ── */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Jobs</h2>
              <p className="mt-1 text-slate-600">Hand-picked roles hiring right now</p>
            </div>
            <Link
              href="/jobs"
              className="text-indigo-600 font-medium hover:underline hidden sm:block mt-1"
            >
              View all jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={job.company.logoUrl} alt={job.company.name} />
                      <AvatarFallback className="text-xs font-semibold">
                        {job.company.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-700 font-medium">
                      {job.company.name}
                    </span>
                  </div>
                  {job.featured && (
                    <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-semibold text-slate-900 line-clamp-2">
                  {job.title}
                </h3>

                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-600">
                    {job.locationCity}, {job.locationState}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full capitalize">
                    {job.employmentType.replace("-", " ")}
                  </span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full capitalize">
                    {job.workMode}
                  </span>
                  {job.visaSponsorship && (
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                      Visa sponsor
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900">
                    {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDateRelative(job.postedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Link href="/jobs" className="text-indigo-600 font-medium hover:underline">
              View all jobs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: Featured Rooms ── */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Rooms You&apos;ll Love
              </h2>
              <p className="mt-1 text-slate-600">
                Comfortable spaces across Australia
              </p>
            </div>
            <Link
              href="/rooms"
              className="text-indigo-600 font-medium hover:underline hidden sm:block mt-1"
            >
              View all rooms →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRooms.map((room) => (
              <div
                key={room.id}
                className="relative rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow group"
              >
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={room.photos[0]}
                    alt={room.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {room.featured && (
                    <span className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5 bg-white">
                  <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">
                    {room.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-600">
                      {room.suburb}, {room.city} {room.state}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full capitalize">
                      {room.type.replace("-", " ")}
                    </span>
                    {room.furnished && (
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        Furnished
                      </span>
                    )}
                    {room.billsIncluded && (
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        Bills incl.
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-bold text-xl text-indigo-600">
                      {formatRent(room.rentWeekly, room.currency)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={room.ownerAvatar} alt={room.ownerName} />
                        <AvatarFallback className="text-xs font-semibold">
                          {room.ownerName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-slate-600">
                        {room.ownerName.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stretched link covers the whole card */}
                <Link
                  href={`/rooms/${room.slug}`}
                  className="absolute inset-0 z-[1]"
                  aria-label={room.title}
                />

                {/* Heart button sits above the stretched link */}
                <button
                  className="absolute top-3 right-3 z-[2] bg-white rounded-full p-2 shadow-sm hover:bg-slate-50 transition-colors"
                  aria-label="Save to favourites"
                >
                  <Heart className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Link href="/rooms" className="text-indigo-600 font-medium hover:underline">
              View all rooms →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: How It Works ── */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900">How appname works</h2>
          <p className="mt-2 text-slate-600">Simple, fast, free to start</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ Icon, number, title, desc }) => (
              <div key={number} className="flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-indigo-600" />
                </div>
                <p className="mt-4 text-sm font-bold text-indigo-600">{number}</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-600 max-w-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Final CTA ── */}
      <section className="py-20 bg-indigo-600 px-4 sm:px-6 lg:px-8 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to find what you&apos;re looking for?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join thousands of Australians on appname today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
            >
              Sign up free
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
