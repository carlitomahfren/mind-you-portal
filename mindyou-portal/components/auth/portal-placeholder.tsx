"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { LogOut, RefreshCcw } from "lucide-react";
import { LogoMark } from "@/components/loading/loading-screen";
import { Button } from "@/components/ui/button";
import type { AccountType } from "@/lib/brand";
import { brand } from "@/lib/brand";

const COPY: Record<AccountType, { blurb: string; switchLabel: string }> = {
  personal: {
    blurb:
      "You're signed in. Your well-being dashboard is on its way — for now, this space is a placeholder while we put the finishing touches on your personal portal.",
    switchLabel: "Switch account type",
  },
  enterprise: {
    blurb:
      "You're signed in. Your organization's dashboard is on its way — for now, this space is a placeholder while we put the finishing touches on your enterprise portal.",
    switchLabel: "Switch account type",
  },
};

export function PortalPlaceholder({ type }: { type: AccountType }) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const b = brand[type];
  const copy = COPY[type];

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-3xl animate-float ${
            type === "personal" ? "bg-personal/8" : "bg-enterprise/8"
          }`}
        />
        <div
          className={`absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full blur-3xl animate-float-1 ${
            type === "personal" ? "bg-enterprise/5" : "bg-personal/5"
          }`}
        />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <LogoMark animated={false} className="mb-6 h-9 w-auto sm:h-10" />

          <div
            className={`mb-8 rounded-full px-5 py-1.5 text-[11px] font-bold tracking-widest text-white shadow-[var(--shadow-button-strong)] sm:text-[12px] ${b.accent}`}
          >
            {b.label}
          </div>

          <h1 className="text-balance font-display text-[26px] font-semibold leading-[1.15] tracking-tight text-ink sm:text-[32px]">
            Welcome to your Mind You portal
          </h1>
          <p className="mt-4 max-w-[420px] font-body text-[14px] leading-relaxed text-ink/70 sm:text-[15px]">
            {copy.blurb}
          </p>

          <div className="mt-10 flex w-full max-w-[300px] flex-col gap-3">
            <Button
              type_={type}
              onClick={() => router.push(`/${type}/login`)}
            >
              <span className="inline-flex items-center gap-2">
                Sign out
                <LogOut size={15} strokeWidth={2.5} />
              </span>
            </Button>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl font-body text-[13px] font-medium text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <RefreshCcw size={13} strokeWidth={2.25} />
              {copy.switchLabel}
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 px-6 pb-6 text-center sm:pb-8">
        <p className="font-body text-[11px] leading-relaxed text-ink-50">
          National Privacy Commission No. PIC-007-095-2026 | SEC Registration
          No. CS202006851
          <br />
          &copy; 2026 Mind You Mental Health Systems, Inc. | All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
