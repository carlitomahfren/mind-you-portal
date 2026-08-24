"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { HeartHandshake, Building2, Sparkles, ArrowRight } from "lucide-react";
import { LoadingScreen, LogoMark } from "@/components/loading/loading-screen";

function MeshGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-personal/8 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-enterprise/5 blur-3xl animate-float-1" />
      <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-personal/5 blur-3xl animate-float-2" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.02]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
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

// Module-scope flag: persists across client-side route navigation in a single
// page session, but is reset on a full page load (first visit or refresh).
let loadingPlayed = false;

export function AccountTypeView() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [ready, setReady] = useState(loadingPlayed);

  const completeLoading = () => {
    loadingPlayed = true;
    setReady(true);
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full bg-paper">
      <LoadingScreen play={!loadingPlayed} onComplete={completeLoading} />
      <MeshGradient />

      <div className="relative z-10 flex w-full shrink-0 flex-col lg:w-[644px]">
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10">
          {ready && (
            <div className="mb-10 flex flex-col items-center">
              <LogoMark animated={false} className="h-8 w-auto sm:h-10" />
            </div>
          )}

          <div className="flex w-full max-w-[560px] flex-col items-center">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={
                ready || shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{
                duration: 0.3,
                delay: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-personal/10 px-4 py-1.5 text-[11px] font-semibold tracking-wider text-personal-dark"
            >
              <Sparkles size={12} />
              WELCOME
            </motion.div>
            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={
                ready || shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{
                duration: 0.3,
                delay: 0.49,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-2 text-balance text-center font-display text-[34px] font-semibold leading-[1.08] text-ink sm:mb-3 sm:text-[42px] lg:text-[50px]"
            >
              Welcome to Mind You!
            </motion.h1>
            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={
                ready || shouldReduceMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{
                duration: 0.3,
                delay: 0.53,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-10 text-balance text-center font-body text-[16px] font-medium leading-relaxed text-ink/70 sm:mb-11 sm:text-[18px]"
            >
              Please choose your account type
            </motion.p>

            <div className="flex w-full flex-col justify-center gap-5 sm:flex-row sm:gap-6">
              <motion.button
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 12, scale: 0.98 }
                }
                animate={
                  ready || shouldReduceMotion
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 12, scale: 0.98 }
                }
                transition={{
                  duration: 0.35,
                  delay: 0.62,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.02,
                        y: -3,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 26,
                        },
                      }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => router.push("/personal/login")}
                aria-label="Continue to Personal login"
                className="group relative flex-1 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-glow-personal)] focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-personal-dark outline-none"
                style={{ minHeight: 190 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-personal via-personal-dark to-personal-deeper" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),_transparent_50%)]" />
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />

                <div className="relative flex h-full flex-col items-center justify-center gap-3 py-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/20">
                    <HeartHandshake
                      size={22}
                      className="text-white"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="font-display text-[28px] font-semibold leading-none text-white sm:text-[36px]">
                    Personal
                  </span>
                  <span className="font-body text-[12px] font-medium tracking-wide text-white/65 sm:text-[13px]">
                    For individual users
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 flex h-9 w-9 translate-x-2 items-center justify-center rounded-full bg-white/15 opacity-0 ring-1 ring-white/30 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <ArrowRight
                    size={16}
                    strokeWidth={2.5}
                    className="text-white"
                  />
                </span>

                <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white/0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:via-white/5 group-hover:to-white/10" />
              </motion.button>

              <motion.button
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 12, scale: 0.98 }
                }
                animate={
                  ready || shouldReduceMotion
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 12, scale: 0.98 }
                }
                transition={{
                  duration: 0.35,
                  delay: 0.68,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        scale: 1.02,
                        y: -3,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 26,
                        },
                      }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => router.push("/enterprise/login")}
                aria-label="Continue to Enterprise login"
                className="group relative flex-1 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-glow-enterprise)] focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-enterprise-dark outline-none"
                style={{ minHeight: 190 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-enterprise via-enterprise-dark to-enterprise-deeper" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),_transparent_50%)]" />
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-xl" />

                <div className="relative flex h-full flex-col items-center justify-center gap-3 py-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/20">
                    <Building2
                      size={22}
                      className="text-white"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="font-display text-[28px] font-semibold leading-none text-white sm:text-[36px]">
                    Enterprise
                  </span>
                  <span className="font-body text-[12px] font-medium tracking-wide text-white/65 sm:text-[13px]">
                    For organizations
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 flex h-9 w-9 translate-x-2 items-center justify-center rounded-full bg-white/15 opacity-0 ring-1 ring-white/30 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  <ArrowRight
                    size={16}
                    strokeWidth={2.5}
                    className="text-white"
                  />
                </span>

                <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white/0 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:via-white/5 group-hover:to-white/10" />
              </motion.button>
            </div>
          </div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={
            ready || shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }
          }
          transition={{ duration: 0.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="px-6 pb-6 sm:px-12 sm:pb-8"
        >
          <p className="font-body text-[10px] leading-relaxed text-ink-50 sm:text-[11px]">
            National Privacy Commission No. PIC-007-095-2026
            <br />
            SEC Registration No. CS202006851
            <br />
            &copy; 2026 Mind You Mental Health Systems, Inc. | All Rights
            Reserved
          </p>
        </motion.div>
      </div>

      <div className="relative hidden flex-1 bg-abyss lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-abyss-light/40 via-transparent to-abyss/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#0a424f40,_transparent_50%)]" />
        <div className="h-full w-full">
          <Image
            src="/73-5048.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 0vw"
            className="object-cover object-top"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-abyss to-transparent" />
      </div>
    </div>
  );
}
