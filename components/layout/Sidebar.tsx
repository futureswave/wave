"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ComingSoonBadge } from "@/components/ui/TBABadge";

// PRD 6 — primary information architecture.
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/universe", label: "Universe" },
  { href: "/vision", label: "Vision" },
  { href: "/collective", label: "The Collective" },
];

// Secondary links, surfaced only in the expanded drawer.
const SECONDARY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/social", label: "Official Links" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-14 bg-[#0a0a0a] border-r border-white/[0.06] z-50 flex flex-col items-center py-5">
        <button
          onClick={() => setOpen(true)}
          className="p-2 text-white/40 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="mt-4 block hover:opacity-80 transition-opacity">
          <Image
            src="/images/gallery/logo.png"
            alt="VANTH"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
        </Link>

        <nav className="flex-1 flex flex-col items-center justify-center gap-3 mt-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={`w-1 h-1 rounded-full transition-all duration-200 ${
                pathname === link.href
                  ? "bg-white scale-150"
                  : "bg-white/20 hover:bg-white/50"
              }`}
            />
          ))}
        </nav>

        <div className="flex flex-col items-center gap-3 pb-1">
          <Link
            href="/stake"
            title="Stake"
            className="text-[9px] font-mono text-white/25 hover:text-white/50 transition-colors tracking-widest uppercase"
          >
            STK
          </Link>
        </div>
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-0 z-[99] bg-black/50"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 w-72 z-[100] bg-[#0a0a0a] border-r border-white/[0.06] flex flex-col"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-5 right-4 p-2 text-white/40 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>

              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="absolute top-5 left-6 flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Image
                  src="/images/gallery/logo.png"
                  alt="VANTH"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
                <span className="text-sm font-black tracking-[0.3em] text-white/60 font-mono">
                  VANTH
                </span>
              </Link>

              <nav className="flex flex-col justify-center pl-10 gap-1 flex-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block text-4xl font-black tracking-tight leading-tight transition-colors duration-150 ${
                        pathname === link.href
                          ? "text-white"
                          : "text-white/25 hover:text-white/70"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 pr-8">
                  {SECONDARY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`font-mono text-xs tracking-widest uppercase transition-colors ${
                        pathname === link.href
                          ? "text-white/70"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="pb-8 pl-10 flex flex-col gap-3">
                <Link
                  href="/stake"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-mono border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-all rounded w-fit"
                >
                  Stake <ComingSoonBadge />
                </Link>

                <Link
                  href="/whitelist"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 text-sm font-bold bg-white text-black hover:bg-white/90 transition-colors rounded w-fit"
                >
                  Request Access
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}