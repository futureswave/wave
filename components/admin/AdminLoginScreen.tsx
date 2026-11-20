"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; message: string }
  | { kind: "locked"; message: string };

/**
 * Full-screen admin sign-in. Covers the public site shell (footer, gutter) so
 * the restricted area reads as its own surface.
 */
export function AdminLoginScreen({ next }: { next: string }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const shake = useAnimationControls();
  const inputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const busy = status.kind === "loading" || status.kind === "success";
  const locked = status.kind === "locked";

  // Keep the page behind from scrolling while this screen is up.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  function fail(next: Status) {
    setStatus(next);
    setPassword("");
    requestAnimationFrame(() => inputRef.current?.focus());
    if (!reduceMotion) {
      void shake.start({ x: [0, -10, 9, -6, 4, 0], transition: { duration: 0.42 } });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || busy || locked) return;
    setStatus({ kind: "loading" });

    let res: Response;
    try {
      res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
    } catch {
      fail({ kind: "error", message: "Network error. Check your connection and try again." });
      return;
    }

    if (res.ok) {
      setStatus({ kind: "success" });
      router.replace(next);
      router.refresh();
      return;
    }

    if (res.status === 429) {
      fail({
        kind: "locked",
        message: "Too many attempts. Sign-in is paused for this device — try again in about 10 minutes.",
      });
      return;
    }

    fail({ kind: "error", message: "Incorrect password." });
  }

  function trackCapsLock(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLock(e.getModifierState?.("CapsLock") ?? false);
  }

  const hasError = status.kind === "error" || status.kind === "locked";

  return (
    <div className="fixed inset-0 z-[60] grid overflow-y-auto bg-[#080808] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* ---------- Brand panel (desktop) ---------- */}
      <aside className="relative hidden overflow-hidden border-r border-white/[0.06] lg:block">
        <Image
          src="/images/optimized/background.webp"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover object-center opacity-55 saturate-[0.85]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/55 to-[#080808]/30" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080808]/70" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-[#7c3aed]/[0.07] to-transparent motion-reduce:hidden"
        />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Link href="/" className="flex w-fit items-center gap-3 text-white/80 transition-colors hover:text-white">
            <Image src="/images/gallery/logo.png" width={28} height={28} alt="" />
            <span className="font-mono text-sm font-bold tracking-[0.3em]">VANTH</span>
          </Link>

          <div className="max-w-md">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[#a78bfa]">
              Restricted · Committee only
            </p>
            <h2 className="text-4xl font-bold uppercase leading-[1.05] tracking-tight text-white xl:text-5xl">
              Control room
              <br />
              <span className="text-white/35">of the Vanthverse.</span>
            </h2>
            <ul className="mt-8 space-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                Whitelist applications
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
                Character Lab
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main className="relative flex min-h-full flex-col px-5 py-8 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7c3aed]/15 blur-[120px]" />

        <header className="relative flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-white/80 lg:invisible">
            <Image src="/images/gallery/logo.png" width={22} height={22} alt="" />
            <span className="font-mono text-xs font-bold tracking-[0.3em]">VANTH</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35 transition-colors hover:text-white/70"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </header>

        <div className="relative flex flex-1 items-center justify-center py-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-[380px]"
          >
            <div className="mb-8">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                <KeyRound className="h-5 w-5 text-[#a78bfa]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">Sign in to Admin</h1>
              <p className="mt-2 text-sm leading-relaxed text-white/45">
                Enter the committee password to continue.
              </p>
            </div>

            <motion.form animate={shake} onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Lets password managers file the credential under a stable name. */}
              <input
                type="text"
                name="username"
                autoComplete="username"
                value="vanth-admin"
                readOnly
                hidden
              />

              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <label htmlFor="admin-password" className="text-[13px] font-medium text-white/75">
                    Password
                  </label>
                  {capsLock && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300/90">
                      Caps Lock on
                    </span>
                  )}
                </div>

                <div
                  className={`group flex items-center rounded-md border bg-white/[0.03] transition-colors focus-within:bg-white/[0.05] ${
                    hasError
                      ? "border-red-500/50 focus-within:border-red-400/70"
                      : "border-white/10 hover:border-white/20 focus-within:border-[#7c3aed]/70"
                  } focus-within:ring-4 ${hasError ? "focus-within:ring-red-500/10" : "focus-within:ring-[#7c3aed]/15"}`}
                >
                  <input
                    ref={inputRef}
                    id="admin-password"
                    name="password"
                    type={reveal ? "text" : "password"}
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    autoFocus
                    disabled={busy || locked}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (status.kind === "error") setStatus({ kind: "idle" });
                    }}
                    onKeyDown={trackCapsLock}
                    onKeyUp={trackCapsLock}
                    aria-invalid={hasError}
                    aria-describedby={hasError ? "admin-login-error" : undefined}
                    placeholder="••••••••••••"
                    className="h-12 min-w-0 flex-1 bg-transparent px-4 font-mono text-[15px] tracking-wide text-white placeholder:text-white/20 outline-none! disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setReveal((v) => !v)}
                    aria-label={reveal ? "Hide password" : "Show password"}
                    aria-pressed={reveal}
                    className="mr-1.5 flex h-9 w-9 items-center justify-center rounded text-white/35 transition-colors hover:bg-white/5 hover:text-white/80 outline-none! focus-visible:ring-2 focus-visible:ring-[#7c3aed]/60"
                  >
                    {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div aria-live="polite" className="min-h-[1.25rem]">
                  {hasError && (
                    <p
                      id="admin-login-error"
                      className={`mt-2.5 flex items-start gap-2 text-[13px] leading-snug ${
                        locked ? "text-amber-300/90" : "text-red-400"
                      }`}
                    >
                      <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
                      {status.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!password || busy || locked}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#7c3aed] text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(124,58,237,0.6)] transition-all hover:bg-[#8b4cf6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7c3aed]/30 outline-none! active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-white/30 disabled:shadow-none"
              >
                {status.kind === "loading" && (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying…
                  </>
                )}
                {status.kind === "success" && (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Access granted
                  </>
                )}
                {!busy && (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform group-enabled:group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </motion.form>

            <div className="mt-10 flex items-start gap-3 border-t border-white/[0.06] pt-6">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-white/25" />
              <p className="text-xs leading-relaxed text-white/35">
                Sessions are encrypted and expire after 12 hours. Repeated failed attempts are
                temporarily blocked.
              </p>
            </div>
          </motion.div>
        </div>

        <footer className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-white/20">
          © VANTH · Internal use only
        </footer>
      </main>
    </div>
  );
}
