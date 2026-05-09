import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Jobs in Australia | appname",
  description:
    "Find full-time, part-time, casual and remote jobs across Australia. New listings added daily.",
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
