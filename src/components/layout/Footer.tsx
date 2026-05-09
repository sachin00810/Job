import Link from "next/link";
import { X } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-bold text-2xl tracking-tight text-white">appname</span>
            </Link>
            <p className="text-sm text-slate-300 max-w-xs">
              Find your next job and your next home &mdash; all in one place.
            </p>
            <p className="text-sm text-slate-400 pt-2">
              Made in Australia 🇦🇺
            </p>
          </div>

          {/* Column 2: For Job Seekers */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Job Seekers</h3>
            <ul className="space-y-3">
              <li><Link href="/jobs" className="text-sm text-slate-300 hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/jobs/alerts" className="text-sm text-slate-300 hover:text-white transition-colors">Job Alerts</Link></li>
              <li><Link href="/resources/career" className="text-sm text-slate-300 hover:text-white transition-colors">Career Advice</Link></li>
              <li><Link href="/resources/resume" className="text-sm text-slate-300 hover:text-white transition-colors">Resume Tips</Link></li>
            </ul>
          </div>

          {/* Column 3: For Room Seekers */}
          <div>
            <h3 className="font-semibold text-lg mb-4">For Room Seekers</h3>
            <ul className="space-y-3">
              <li><Link href="/rooms" className="text-sm text-slate-300 hover:text-white transition-colors">Browse Rooms</Link></li>
              <li><Link href="/rooms/saved" className="text-sm text-slate-300 hover:text-white transition-colors">Saved Rooms</Link></li>
              <li><Link href="/resources/suburbs" className="text-sm text-slate-300 hover:text-white transition-colors">Suburb Guides</Link></li>
              <li><Link href="/resources/renting" className="text-sm text-slate-300 hover:text-white transition-colors">Renting Tips</Link></li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/help" className="text-sm text-slate-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-300 hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-300 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/report" className="text-sm text-slate-300 hover:text-white transition-colors">Report a Listing</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            &copy; 2025 appname. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">X (Twitter)</span>
              <X className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
