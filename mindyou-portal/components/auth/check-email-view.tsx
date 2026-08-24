"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { maskEmail } from "@/lib/validation";
import type { AccountType } from "@/lib/brand";

const RESEND_COOLDOWN_SECONDS = 60;
const MAIL_LINKS = [
  { label: "Gmail", href: "https://mail.google.com" },
  { label: "Outlook", href: "https://outlook.live.com/mail/" },
];

function CooldownRing({ seconds }: { seconds: number }) {
  const progress = 1 - seconds / RESEND_COOLDOWN_SECONDS;
  const circumference = 2 * Math.PI * 8;

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="-rotate-90">
      <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
      <motion.circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        animate={{ strokeDashoffset: circumference * (1 - progress) }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </svg>
  );
}

export function CheckEmailView({ type }: { type: AccountType }) {
  const toast = useToast();
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("email");
    if (param && param.includes("@")) setEmail(param);
  }, []);

  const counting = cooldown > 0;

  useEffect(() => {
    if (!counting) return;
    const id = setInterval(
      () => setCooldown((s) => Math.max(s - 1, 0)),
      1000
    );
    return () => clearInterval(id);
  }, [counting]);

  const handleResend = async () => {
    if (loading || cooldown > 0) return;
    setLoading(true);
    // DEMO ONLY — swap for the real resend-reset-link API call.
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSuccess(true);
    toast.success("Reset link resent", {
      description: email ? `Sent again to ${maskEmail(email)}.` : undefined,
    });
    setTimeout(() => {
      setSuccess(false);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }, 400);
  };

  return (
    <AuthLayout
      type={type}
      rightImageSrc="/96-396.png"
      rightTitle="Welcome Back to Mind You!"
      rightSubtitle="We hope you've been getting the care you need through us. We strive to make Mind You as convenient and professional as possible, and we're always happy to help if you encounter any problems while using our service."
    >
      <div className="flex w-full flex-col items-center text-center">
        <h2 className={`mb-5 font-display text-[21px] font-semibold tracking-tight sm:text-[23px] ${type === "enterprise" ? "text-enterprise-dark" : "text-personal-dark"}`}>
          Check your email
        </h2>

        <p className="mb-8 max-w-[320px] font-body text-[14px] leading-relaxed text-ink/70 sm:text-[15px]">
          We&rsquo;ve sent a password reset link to
          <br />
          <span className="font-semibold text-ink">
            {email === null ? "the address you provided" : maskEmail(email)}
          </span>
          <br />
          <br />
          Click the link in your email to choose a new password.
        </p>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 h-[170px] w-[230px] sm:h-[210px] sm:w-[280px]"
        >
          <Image src="/96-201.svg" alt="" fill className="object-contain" />
          <Image
            src="/96-345.svg"
            alt=""
            width={32}
            height={32}
            className="absolute left-[36%] top-[24%] h-7 w-7 sm:h-8 sm:w-8"
          />
        </motion.div>

        <p className="mb-3 flex items-center gap-1.5 font-body text-[12.5px] text-ink/60">
          <ShieldAlert size={14} strokeWidth={2} className="text-ink/40" aria-hidden="true" />
          Not there? Check your spam folder.
        </p>

        <div className="mb-5 flex items-center gap-2">
          {MAIL_LINKS.map((mail) => (
            <a
              key={mail.label}
              href={mail.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-white/60 px-4 py-1.5 font-body text-[12px] font-medium text-ink/70 transition-colors hover:border-ink/25 hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20 outline-none"
            >
              Open {mail.label}
              <ExternalLink size={12} strokeWidth={2} aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className="mb-4 font-body text-[13px] text-ink/60">
          Haven&rsquo;t received the email?
        </p>

        <Button
          type_={type}
          className="mb-5"
          loading={loading}
          success={success}
          disabled={cooldown > 0}
          onClick={handleResend}
        >
          <AnimatePresence mode="wait" initial={false}>
            {cooldown > 0 ? (
              <motion.span
                key={cooldown}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="inline-flex items-center gap-2"
              >
                <CooldownRing seconds={cooldown} />
                Resend available in {cooldown}s
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                Resend reset link
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <Link
          href={`/${type}/forgot-password`}
          className="font-body text-[13px] font-medium text-ink/50 transition-colors hover:text-ink"
        >
          Use a different email
        </Link>
      </div>
    </AuthLayout>
  );
}
