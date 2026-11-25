import type { ReactNode } from "react";
import { VerseShell } from "@/components/verse/VerseShell";

export default function VerseLayout({ children }: { children: ReactNode }) {
  return <VerseShell>{children}</VerseShell>;
}
