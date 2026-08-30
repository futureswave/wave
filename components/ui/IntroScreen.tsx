"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// PRD 7.01 / 11 — the boot sequence. Each line unlocks at a progress threshold
// so the log and the counter stay in step.
const BOOT_LINES = [
  { at: 0, text: "SYSTEM INITIALIZING..." },
  { at: 35, text: "CONNECTING..." },
  { at: 78, text: "ACCESS GRANTED." },
  { at: 100, text: "WELCOME TO VANTHVERSE." },
];

export function IntroScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show once per session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("vanth_intro_seen")) {
      return;
    }
    setVisible(true);

    const duration = 2600;
    const interval = 16;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const raw = current / steps;
      // Ease-out curve: fast start, slow finish
      setProgress(Math.min((1 - Math.pow(1 - raw, 2)) * 100, 100));

      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("vanth_intro_seen", "1");
        }, 700);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const revealed = BOOT_LINES.filter((line) => progress >= line.at);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center select-none overflow-hidden scan-sweep"
          role="status"
          aria-label="Entering the VANTHVERSE"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-10 px-6"
          >
            {/* Logo */}
            <Image
              src="/images/gallery/logo.png"
              alt="VANTH"
              width={280}
              height={100}
              className="w-auto h-14 sm:h-16"
              priority
            />

            {/* Boot log */}
            <div className="h-24 w-56 sm:w-72 flex flex-col justify-end gap-1">
              {revealed.map((line) => (
                <motion.p
                  key={line.text}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-white/50"
                >
                  {line.text}
                </motion.p>
              ))}
            </div>

            {/* Progress bar area */}
            <div className="w-56 sm:w-72 space-y-2">
              <div className="h-px bg-white/8 w-full overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-white/60 to-white/20"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase">
                  Initializing Vanthverse
                </span>
                <span className="text-[10px] font-mono text-white/35 tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
