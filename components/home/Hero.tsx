"use client";

import Link from "next/link";
import Image from "next/image";
import { Particles } from "@/components/ui/particles";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-transparent">
      {/* Particles background */}
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
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-24 flex flex-col items-center">

        {/* Logo */}
        <div className="mb-10 select-none">
          <Image
            src="/images/gallery/logo.png"
            alt="VANTH"
            width={1024}
            height={1024}
            unoptimized
            className="w-[200px] sm:w-[280px] md:w-[320px] h-auto mx-auto opacity-90 mix-blend-screen"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed font-mono">
          Vanth is a web3 focused project inspired by the best with an innovative and dynamic style.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Primary */}
          <Link
            href="/whitelist"
            className="flex items-center gap-2 px-8 py-4 text-base font-bold bg-white text-black hover:bg-white/90 transition-colors rounded"
          >
            Request Access
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Secondary */}
          <Link
            href="/gallery"
            className="group flex items-center gap-2 px-8 py-4 rounded border border-white/12 text-white/60 font-medium text-base hover:border-white/25 hover:text-white transition-all duration-200"
          >
            View Gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

        </div>

        {/* Scroll hint */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" />
          <span className="text-xs text-white/40 tracking-widest uppercase font-mono">Scroll</span>
        </div>
      </div>
    </section>
  );
}
