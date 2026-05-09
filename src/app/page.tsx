import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center min-h-[calc(100vh-64px-400px)]">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
          Jobs and rooms, all in one place
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Australia&apos;s friendliest marketplace for finding work and finding home.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/jobs" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-lg h-14 px-8")}>
            Find Jobs
          </Link>
          <Link href="/rooms" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-lg h-14 px-8")}>
            Find Rooms
          </Link>
        </div>
      </div>
    </section>
  );
}
