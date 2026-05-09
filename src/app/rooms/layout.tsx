import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Rooms for Rent in Australia | appname",
  description:
    "Find rooms, studios, and shared accommodation across Australia. Affordable, verified listings updated daily.",
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
