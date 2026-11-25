import type { Metadata } from "next";
import { PassportView } from "@/components/verse/PassportView";

export const metadata: Metadata = {
  title: "Vanth Passport — VANTH Verse",
  robots: { index: false, follow: true },
};

export default function PassportPage() {
  return <PassportView />;
}
