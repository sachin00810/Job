import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const PROTECTED = ["/dashboard", "/post/job", "/post/room"];
      const isProtected = PROTECTED.some((p) => nextUrl.pathname.startsWith(p));
      if (isProtected && !isLoggedIn) return false;
      return true;
    },
  },
} satisfies NextAuthConfig;
