"use client";

import Link from "next/link";
import { Briefcase, Menu, Search, X, Clock, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { jobs } from "@/data/jobs";
import { rooms } from "@/data/rooms";

const STORAGE_KEY = "appname_recent_searches";
const MAX_RECENT = 5;

function loadRecent(): { query: string; tab: "jobs" | "rooms" }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(entry: { query: string; tab: "jobs" | "rooms" }) {
  const existing = loadRecent().filter((r) => !(r.query === entry.query && r.tab === entry.tab));
  const next = [entry, ...existing].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!session?.user) {
    return (
      <>
        <Link href="/auth/signin" className={buttonVariants({ variant: "ghost" })}>Sign in</Link>
        <Link href="/auth/signup" className={cn(buttonVariants({ variant: "default" }), "bg-indigo-600 hover:bg-indigo-700 text-white")}>
          Sign up
        </Link>
      </>
    );
  }

  const name = session.user.name ?? session.user.email ?? "User";
  const initials = name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
          {initials}
        </div>
        <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{name.split(" ")[0]}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{session.user.email}</p>
          </div>
          <Link href="/dashboard" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <LayoutDashboard className="h-4 w-4 text-slate-400" />
            Dashboard
          </Link>
          <Link href="/profile" onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Settings className="h-4 w-4 text-slate-400" />
            Profile & Settings
          </Link>
          <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<"jobs" | "rooms">("jobs");
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<{ query: string; tab: "jobs" | "rooms" }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { name: "Find Jobs", href: "/jobs" },
    { name: "Find Rooms", href: "/rooms" },
    { name: "Post a Job", href: "/post/job" },
    { name: "List a Room", href: "/post/room" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
      setRecentSearches(loadRecent());
    }
  }, [searchOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeSearch();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function runSearch(q: string, tab: "jobs" | "rooms") {
    if (!q.trim()) return;
    saveRecent({ query: q.trim(), tab });
    const params = new URLSearchParams();
    if (tab === "jobs") {
      params.set("q", q.trim());
      router.push(`/jobs?${params}`);
    } else {
      params.set("location", q.trim());
      router.push(`/rooms?${params}`);
    }
    closeSearch();
  }

  function handleSearch() {
    runSearch(query, searchTab);
  }

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    if (searchTab === "jobs") {
      const titles = jobs.filter((j) => j.title.toLowerCase().includes(q)).map((j) => j.title);
      const companies = jobs.filter((j) => j.company.name.toLowerCase().includes(q)).map((j) => j.company.name);
      return Array.from(new Set([...titles, ...companies])).slice(0, 5);
    } else {
      const suburbs = rooms
        .filter((r) => r.suburb.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
        .map((r) => `${r.suburb}, ${r.city}`);
      return Array.from(new Set(suburbs)).slice(0, 5);
    }
  }, [query, searchTab]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl text-indigo-600">appname</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative",
                    active
                      ? "text-indigo-600 after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full"
                      : "text-gray-700 dark:text-slate-300 hover:text-indigo-600"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search + Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <button onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <UserMenu />
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setSearchOpen((v) => !v)}
              className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="text-gray-700" />}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col space-y-6 mt-6">
                  {session?.user && (
                    <div className="flex items-center gap-3 px-1 pb-4 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                        {(session.user.name ?? "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{session.user.name}</p>
                        <p className="text-xs text-slate-500">{session.user.email}</p>
                      </div>
                    </div>
                  )}
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => {
                      const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                      return (
                        <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                          className={cn("text-lg font-medium transition-colors", active ? "text-indigo-600" : "text-gray-900 hover:text-indigo-600")}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                    {session?.user && (
                      <Link href="/profile" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                        Profile & Settings
                      </Link>
                    )}
                  </nav>
                  <div className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
                    {session?.user ? (
                      <button onClick={() => { setIsOpen(false); signOut({ callbackUrl: "/" }); }}
                        className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center text-red-600 border-red-200")}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    ) : (
                      <>
                        <Link href="/auth/signin" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")} onClick={() => setIsOpen(false)}>
                          Sign in
                        </Link>
                        <Link href="/auth/signup" className={cn(buttonVariants({ variant: "default" }), "w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white")} onClick={() => setIsOpen(false)}>
                          Sign up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-md">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-slate-200 overflow-hidden shrink-0">
                <button onClick={() => setSearchTab("jobs")}
                  className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                    searchTab === "jobs" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50")}
                >Jobs</button>
                <button onClick={() => setSearchTab("rooms")}
                  className={cn("px-3 py-1.5 text-xs font-medium transition-colors",
                    searchTab === "rooms" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50")}
                >Rooms</button>
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input ref={inputRef} type="text" value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={searchTab === "jobs" ? "Job title, keyword, or company…" : "Suburb or city…"}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                  autoComplete="off"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button type="button"
                          onMouseDown={(e) => { e.preventDefault(); runSearch(s, searchTab); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition-colors"
                        >
                          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button onClick={handleSearch}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap">
                Search
              </button>
              <button onClick={closeSearch} className="p-2 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close search">
                <X className="h-4 w-4" />
              </button>
            </div>
            {recentSearches.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                  <Clock className="h-3 w-3" />Recent:
                </span>
                {recentSearches.map((r, i) => (
                  <button key={i} onClick={() => runSearch(r.query, r.tab)}
                    className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors"
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${r.tab === "jobs" ? "bg-indigo-500" : "bg-amber-500"}`} />
                    {r.query}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
