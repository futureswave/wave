"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function IntroScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show once per session
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("vanth_intro_seen")) {
      return;
    }
    setVisible(true);

    const duration = 2200;
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
        }, 450);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center select-none"
        >

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="relative flex flex-col items-center gap-10"
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

            {/* Progress bar area */}
            <div className="w-56 sm:w-72 space-y-2">
              <div className="h-px bg-white/8 w-full overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-white/60 to-white/20"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/25 tracking-[0.2em] uppercase">
                  Initializing
                </span>
                <span className="text-[10px] font-mono text-white/25 tabular-nums">
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
