import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/post/job", "/post/room"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected && !req.auth) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/post/:path*"],
};
