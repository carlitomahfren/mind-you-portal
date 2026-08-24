"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/loading/loading-screen";

/**
 * Full-screen branded overlay shown for a beat while a successful action
 * navigates to its destination, so the hand-off never flashes white.
 */
export function BrandedBridge({ show }: { show: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.15 : 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6"
          style={{
            background:
              "radial-gradient(120% 100% at 18% 8%, #FBFEFE 0%, transparent 55%), radial-gradient(140% 120% at 85% 95%, #E8F6F6 0%, transparent 60%), #FBFEFE",
          }}
        >
          <motion.div
            animate={
              shouldReduceMotion ? undefined : { scale: [1, 1.045, 1] }
            }
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <LogoMark animated={false} className="h-12 w-auto" />
          </motion.div>
          <motion.p
            aria-hidden="true"
            animate={
              shouldReduceMotion ? undefined : { opacity: [0.35, 0.7, 0.35] }
            }
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="font-body text-[13px] font-medium tracking-wide text-ink/60"
          >
            Taking you there…
          </motion.p>
          <span className="sr-only" role="status">
            Loading your portal
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
