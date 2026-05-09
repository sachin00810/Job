"use client";

import Link from "next/link";
import { Briefcase, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Find Jobs", href: "/jobs" },
    { name: "Find Rooms", href: "/rooms" },
    { name: "Post a Job", href: "/post/job" },
    { name: "List a Room", href: "/post/room" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl text-indigo-600">appname</span>
            </Link>
          </div>

          {/* CENTER: Desktop Nav Links */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* RIGHT: Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/signin" className={buttonVariants({ variant: "ghost" })}>
              Sign in
            </Link>
            <Link href="/auth/signup" className={cn(buttonVariants({ variant: "default" }), "bg-indigo-600 hover:bg-indigo-700 text-white")}>
              Sign up
            </Link>
          </div>

          {/* RIGHT: Mobile Hamburger Menu */}
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="text-gray-700" />
                }
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col space-y-6 mt-6">
                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
                    <Link href="/auth/signin" className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")} onClick={() => setIsOpen(false)}>
                      Sign in
                    </Link>
                    <Link href="/auth/signup" className={cn(buttonVariants({ variant: "default" }), "w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white")} onClick={() => setIsOpen(false)}>
                      Sign up
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
