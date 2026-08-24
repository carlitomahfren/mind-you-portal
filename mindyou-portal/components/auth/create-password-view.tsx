"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Link2Off } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormErrorBanner } from "@/components/ui/form-error-banner";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { PasswordStrength } from "@/components/ui/password-strength";
import { useToast } from "@/components/ui/toast";
import { BrandedBridge } from "@/components/ui/branded-bridge";
import { useSubmitGuard, useDesktopAutofocus } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { AccountType } from "@/lib/brand";

const RULES = [
  { key: "length", label: "Minimum 8 characters", test: (v: string) => v.length >= 8 },
  { key: "upper", label: "At least one uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { key: "lower", label: "At least one lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { key: "number", label: "At least one number", test: (v: string) => /[0-9]/.test(v) },
];

type TokenState = "pending" | "valid" | "expired";

export function CreatePasswordView({ type }: { type: AccountType }) {
  const router = useRouter();
  const toast = useToast();
  const { guard, release } = useSubmitGuard();
  const passwordRef = useDesktopAutofocus<HTMLInputElement>();

  const [tokenState, setTokenState] = useState<TokenState>("pending");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bridging, setBridging] = useState(false);
  const [touched, setTouched] = useState(false);
  const [formError, setFormError] = useState<{
    title: string;
    description?: string;
  } | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  // DEMO ONLY — a real integration validates the token server-side.
  // Links without a token, or with ?token=expired, show the expired state.
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token || token === "expired") {
      setTokenState("expired");
    } else {
      setTokenState("valid");
    }
  }, []);

  const allValid = useMemo(() => RULES.every((r) => r.test(password)), [password]);
  const matches = confirm.length > 0 && confirm === password;
  const confirmError = touched && confirm.length > 0 && !matches ? "Passwords don't match" : undefined;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;
    if (!guard()) return;

    if (!navigator.onLine) {
      setFormError({
        title: "You're offline",
        description: "Please reconnect to submit your request."
      });
      release();
      return;
    }

    setTouched(true);
    if (!allValid || !matches) {
      release();
      if (!allValid) {
        passwordRef.current?.focus();
      } else {
        confirmRef.current?.focus();
      }
      return;
    }

    setLoading(true);
    // DEMO ONLY — swap this block for the real create-password API call.
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSuccess(true);
    release();
    toast.success("Password created!", {
      description: "You're all set — taking you to your portal.",
    });
    setBridging(true);
    setTimeout(() => {
      router.push(`/${type}`);
    }, 450);
  };

  const handleRequestNewLink = () => {
    router.push(`/${type}/forgot-password`);
  };

  return (
    <AuthLayout
      type={type}
      rightImageSrc="/70-3240.png"
      rightTitle="Welcome Back to Mind You!"
      rightSubtitle="We hope you've been getting the care you need through us. We strive to make Mind You as convenient and professional as possible, and we're always happy to help if you encounter any problems while using our service."
    >
      <div className="flex w-full flex-col">
        <BrandedBridge show={bridging} />
        <h2 className="mb-7 font-display text-[21px] font-semibold tracking-tight text-ink sm:mb-8 sm:text-[23px]">
          Create password
        </h2>

        <FormErrorBanner
          open={!!formError}
          title={formError?.title ?? ""}
          description={formError?.description}
          className="mb-4"
        />

        {tokenState === "pending" && (
          <div className="flex flex-col gap-4" aria-busy="true" aria-label="Checking your link">
            <div className="h-12 animate-pulse rounded-xl bg-ink/5" />
            <div className="h-12 animate-pulse rounded-xl bg-ink/5" />
          </div>
        )}

        {tokenState === "expired" && (
          <div className="flex flex-col items-center py-2 text-center">
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
              <Link2Off size={24} strokeWidth={1.75} className="text-error" aria-hidden="true" />
            </span>
            <h3 className="font-display text-[17px] font-semibold text-ink">
              This link has expired
            </h3>
            <p className="mt-2 max-w-[300px] font-body text-[13.5px] leading-relaxed text-ink/70">
              For your security, password links only work once and expire after
              a short time. Request a fresh one and you&rsquo;ll be set in no time.
            </p>
            <Button
              type_={type}
              onClick={handleRequestNewLink}
              className="mt-7"
            >
              Request a new link
            </Button>
          </div>
        )}

        {tokenState === "valid" && (
          <form onSubmit={handleCreate} noValidate className="form-field-stagger flex flex-col gap-4">
            <TextField
              ref={passwordRef}
              label="Password"
              type="password"
              type_={type}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              valid={allValid}
              autoComplete="new-password"
            />

            <PasswordStrength password={password} />

            <TextField
              ref={(node) => {
                confirmRef.current = node;
              }}
              label="Confirm Password"
              type="password"
              type_={type}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched(true)}
              error={confirmError}
              valid={matches}
              autoComplete="new-password"
            />

            <ul className="flex flex-col gap-2 pt-1" aria-label="Password requirements">
              {RULES.map((rule) => {
                const valid = rule.test(password);
                return (
                  <li key={rule.key} className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                        valid ? "border-success bg-success" : "border-ink/15 bg-transparent"
                      )}
                    >
                      <Check
                        size={11}
                        strokeWidth={3.5}
                        className={cn(
                          "text-white transition-all duration-200",
                          valid ? "scale-100 opacity-100" : "scale-75 opacity-0"
                        )}
                      />
                    </span>
                    <motion.span
                      className={cn(
                        "font-body text-[13px] transition-colors duration-200",
                        valid ? "text-success" : "text-ink/50"
                      )}
                    >
                      {rule.label}
                    </motion.span>
                  </li>
                );
              })}
            </ul>

            <Button
              type="submit"
              type_={type}
              loading={loading}
              success={success}
              pulse={allValid && matches}
              disabled={!allValid || !matches}
            >
              Create password
            </Button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
