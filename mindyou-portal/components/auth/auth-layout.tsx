"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { AccountType } from "@/lib/brand";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
  rightImageSrc: string;
  rightTitle?: string;
  rightSubtitle: string;
  showContactUs?: boolean;
  showSignUp?: boolean;
  type: AccountType;
  backHref?: string;
}

function MeshGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-personal/8 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-personal/5 blur-3xl animate-float-1" />
      <div className="absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-enterprise/5 blur-3xl animate-float-2" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.03]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

const HERO_IMAGES = [
  "/72-3961.png",
  "/72-3607.png",
  "/72-3253.png",
  "/72-4315.png",
  "/96-396.png",
  "/70-3240.png",
];

export function AuthLayout({
  children,
  rightImageSrc,
  rightTitle,
  rightSubtitle,
  showContactUs = true,
  showSignUp = false,
  type,
  backHref = "/",
}: AuthLayoutProps) {
  const shouldReduceMotion = useReducedMotion();
  const [heroIndex, setHeroIndex] = useState(() => {
    const idx = HERO_IMAGES.indexOf(rightImageSrc);
    return idx !== -1 ? idx : 0;
  });
  const [heroPaused, setHeroPaused] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion || heroPaused) return;
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 12000);
    return () => clearInterval(id);
  }, [shouldReduceMotion, heroPaused]);

  const b = brand[type];
  const accentGlow =
    type === "enterprise" ? "shadow-glow-enterprise" : "shadow-glow-personal";

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-paper">
      <MeshGradient />

      <div className="relative z-10 flex w-full shrink-0 flex-col lg:w-[560px] xl:w-[644px]">
        <div className="flex-none px-6 pt-6 sm:px-10 sm:pt-9">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={backHref}
              className="group inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 -ml-2 transition-colors hover:bg-ink/5"
            >
              <ChevronLeft
                className="h-4 w-4 text-ink/60 transition-transform duration-200 group-hover:-translate-x-0.5"
                strokeWidth={2.5}
              />
              <span className="font-body text-[13px] font-medium text-ink/60 transition-colors group-hover:text-ink">
                Back to Homepage
              </span>
            </Link>
          </motion.div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="my-auto flex w-full flex-col items-center px-6 py-10 sm:px-12">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 flex flex-col items-center sm:mb-10"
            >
              <Image
                src="/72-3966.svg"
                alt="Mind You"
                width={226}
                height={48}
                className="mb-5 h-8 w-auto sm:h-10"
                priority
              />
              <div
                className={`rounded-full px-5 py-1.5 text-[11px] font-bold tracking-widest text-white shadow-[var(--shadow-button-strong)] sm:px-6 sm:text-[12px] ${b.accent}`}
              >
                {b.label}
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full max-w-[380px] rounded-2xl bg-white/75 backdrop-blur-2xl border border-white/60 p-9 sm:p-11"
              style={{
                boxShadow: `0 8px 40px rgba(2, 44, 49, 0.07), inset 0 1px 0 rgba(255,255,255,0.8)`,
              }}
            >
              {children}
            </motion.div>
          </div>
        </div>

        <div className="flex-none border-t border-hairline/40 px-6 pb-6 pt-4 sm:px-12 sm:pb-8 sm:pt-5">
          <p className="font-body text-[10px] leading-relaxed text-ink-50 sm:text-[11px]">
            National Privacy Commission No. PIC-007-095-2026 | SEC Registration
            No. CS202006851
            <br />
            &copy; 2026 Mind You Mental Health Systems, Inc. | All Rights
            Reserved
          </p>
        </div>
      </div>

      <div className="relative hidden flex-1 bg-abyss lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-abyss-light/40 via-transparent to-abyss/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#0a424f40,_transparent_50%)]" />
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${shouldReduceMotion ? "opacity-30" : "opacity-60"}`}
          style={{
            backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(10, 66, 79, 0.6), transparent 40%), radial-gradient(ellipse at 70% 80%, rgba(2, 46, 57, 0.8), transparent 50%)`,
          }}
        />
        <div
          className={`absolute inset-0 ${shouldReduceMotion ? "hidden" : ""}`}
          style={{
            background: `radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(34, 176, 181, 0.04), transparent 50%)`,
          }}
        />
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="relative h-full w-full">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 animate-pulse bg-gradient-to-br from-abyss-light/40 via-abyss/50 to-abyss/70"
                />
                <Image
                  src={HERO_IMAGES[heroIndex]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 0vw"
                  className="object-cover object-top"
                  priority={heroIndex === 0}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-abyss/10" />

        <div
          className={`absolute inset-0 opacity-20 ${shouldReduceMotion ? "hidden" : "animate-[gradient-orbit_30s_ease-in-out_infinite]"}`}
          style={{
            background: `radial-gradient(500px circle at 50% 50%, rgba(255,255,255,0.03), transparent 50%)`,
          }}
        />

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-16 left-10 right-10 flex flex-col items-start xl:bottom-20 xl:left-14"
        >
          {rightTitle && (
            <h1 className="mb-4 font-display text-[30px] font-semibold leading-[1.12] text-white xl:mb-5 xl:text-[40px]">
              {rightTitle}
            </h1>
          )}
          <p className="mb-6 max-w-[440px] font-body text-[14px] font-medium leading-[1.65] text-white/80 xl:mb-8 xl:text-[15px]">
            {rightSubtitle}
          </p>

          <div className="flex flex-wrap gap-3">
            {showSignUp && (
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="group rounded-full bg-white px-7 py-3 font-display text-[12px] font-bold tracking-wider text-abyss shadow-lg transition-all hover:bg-white hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)] focus-visible:ring-2 focus-visible:ring-abyss/40 focus-visible:ring-offset-2 focus-visible:ring-offset-abyss xl:px-8 xl:py-3.5 xl:text-[13px]"
              >
                <span className="inline-flex items-center gap-2">
                  SIGN UP
                  <ArrowRight
                    size={14}
                    strokeWidth={2.5}
                    className="transition-all duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </motion.button>
            )}
            {showContactUs && (
              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                className="group rounded-full bg-white/10 backdrop-blur-md px-7 py-3 font-display text-[12px] font-bold tracking-wider text-white border border-white/20 shadow-lg transition-all hover:bg-white/20 hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-abyss xl:px-8 xl:py-3.5 xl:text-[13px]"
              >
                <span className="inline-flex items-center gap-2">
                  CONTACT US
                  <ArrowRight
                    size={14}
                    strokeWidth={2.5}
                    className="transition-all duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {!shouldReduceMotion && (
          <div
            className="absolute bottom-7 right-10 z-10 flex items-center gap-2 xl:right-14"
            role="group"
            aria-label="Featured images"
          >
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show image ${i + 1} of ${HERO_IMAGES.length}`}
                aria-pressed={i === heroIndex}
                onClick={() => setHeroIndex(i)}
                onMouseEnter={() => setHeroPaused(true)}
                onMouseLeave={() => setHeroPaused(false)}
                className={cn(
                  "h-1.5 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/50",
                  i === heroIndex
                    ? "w-5 bg-white/80"
                    : "w-1.5 bg-white/35 hover:bg-white/55"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
