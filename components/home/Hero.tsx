"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Particles } from "@/components/ui/particles";
import { ArrowRight } from "lucide-react";

/**
 * PRD 7.01 — the first five seconds. Fullscreen artwork, cinematic parallax,
 * ENTER THE VANTHVERSE, and two ways into the universe.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Artwork drifts slower than the copy — the parallax depth cue.
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-transparent film-grain"
    >
      {/* Character artwork plate */}
      <motion.div
        style={reduceMotion ? undefined : { y: artY }}
        className="absolute inset-0 z-0"
        aria-hidden
      >
        <Image
          src="/images/gallery/1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-40 sm:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/60 to-[#0a0a0a]" />
      </motion.div>

      <Particles
        className="absolute inset-0 z-0"
        quantity={80}
        ease={80}
        color="#ffffff"
        size={0.4}
        staticity={40}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />

      <motion.div
        style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 flex flex-col items-center"
      >
        <Image
          src="/images/gallery/logo.png"
          alt="VANTH"
          width={1024}
          height={1024}
          unoptimized
          className="w-[150px] sm:w-[200px] h-auto mb-8 opacity-90 mix-blend-screen"
          priority
        />

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-display uppercase leading-[1.05]">
          Enter the
          <br />
          Vanthverse
        </h1>

        <p className="text-base sm:text-lg text-white/60 max-w-xl mt-6 leading-relaxed">
          A collectible universe where anime, cyberpunk, and digital identity
          converge.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-10 w-full sm:w-auto">
          <Link
            href="/collection"
            className="flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-widest font-mono bg-white text-black hover:bg-white/90 transition-colors rounded"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/collective"
            className="flex items-center justify-center px-8 py-4 text-sm font-bold uppercase tracking-widest font-mono border border-white/20 text-white/80 hover:border-white/50 hover:text-white transition-colors rounded"
          >
            Join the Collective
          </Link>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/60 to-transparent animate-pulse" />
        <span className="text-[10px] text-white/45 tracking-[0.3em] uppercase font-mono">
          Scroll to enter
        </span>
      </div>
    </section>
  );
}
