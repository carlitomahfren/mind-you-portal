"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormErrorBanner } from "@/components/ui/form-error-banner";
import { TextField } from "@/components/ui/text-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { BrandedBridge } from "@/components/ui/branded-bridge";
import { useSubmitGuard, useDesktopAutofocus } from "@/lib/hooks";
import { isValidEmail } from "@/lib/validation";
import { getDemoError, MOCK_LATENCY_MS, sleep } from "@/lib/mock-auth";
import type { AccountType } from "@/lib/brand";

const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 30;

const rightCopy: Record<
  AccountType,
  { image: string; title: string; subtitle: string }
> = {
  personal: {
    image: "/72-3961.png",
    title: "Welcome back to Mind You!",
    subtitle:
      "Your safe space for mental well-being. Whether you need support, guidance, or simply someone to talk to, we're here to provide confidential, compassionate care in a way that works best for you.",
  },
  enterprise: {
    image: "/72-3961.png",
    title: "Welcome back to Mind You!",
    subtitle:
      "Your safe space for well-being at work. Whether you're looking for support, guidance, or simply someone to talk to, we're here to provide confidential, compassionate care that fits your needs, wherever you are in your journey.",
  },
};

export function LoginView({ type }: { type: AccountType }) {
  const router = useRouter();
  const toast = useToast();
  const { guard, release } = useSubmitGuard();
  const emailRef = useDesktopAutofocus<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bridging, setBridging] = useState(false);

  const [formError, setFormError] = useState<{
    title: string;
    description?: string;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);
  const locked = lockLeft > 0;

  useEffect(() => {
    if (lockLeft <= 0) return;
    const id = setTimeout(() => setLockLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [lockLeft]);

  const copy = rightCopy[type];
  const accentText =
    type === "enterprise" ? "text-enterprise-dark" : "text-personal-dark";

  const validateEmail = useCallback((): boolean => {
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError(undefined);
    return true;
  }, [email]);

  // Quiet on blur while the field is still empty — errors surface via submit
  // or once real input exists. Never steals focus back mid-form.
  const handleEmailBlur = useCallback(() => {
    if (!email.trim()) {
      setEmailError(undefined);
      return;
    }
    if (!isValidEmail(email)) setEmailError("Enter a valid email address");
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked || loading || success) return;
    if (!guard()) return;

    setFormError(null);

    if (!validateEmail()) {
      release();
      emailRef.current?.focus();
      return;
    }

    setLoading(true);

    // DEMO ONLY — swap this block for the real sign-in API call.
    await sleep(MOCK_LATENCY_MS);
    const demo = getDemoError({ email, password });

    if (demo === "invalid_credentials") {
      setLoading(false);
      release();
      const nextAttempt = attempts + 1;
      if (nextAttempt >= MAX_ATTEMPTS) {
        setAttempts(nextAttempt);
        setLockLeft(LOCK_SECONDS);
        setFormError({
          title: "Too many failed attempts",
          description:
            "For your security, sign-in is temporarily locked. Wait for the countdown, then try again.",
        });
      } else {
        setAttempts(nextAttempt);
        const remaining = MAX_ATTEMPTS - nextAttempt;
        setFormError({
          title: "Incorrect email or password",
          description: `Please try again — ${remaining} attempt${remaining > 1 ? "s" : ""} remaining before a short lock.`,
        });
      }
      passwordRef.current?.focus();
      passwordRef.current?.select();
      return;
    }

    setLoading(false);
    setSuccess(true);
    release();
    toast.success("Welcome back!", {
      description: "Taking you to your portal…",
    });
    setBridging(true);
    setTimeout(() => {
      router.push(`/${type}`);
    }, 450);
  };

  return (
    <AuthLayout
      type={type}
      rightImageSrc={copy.image}
      rightTitle={copy.title}
      rightSubtitle={copy.subtitle}
      showSignUp={type === "personal"}
    >
      <BrandedBridge show={bridging} />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="form-field-stagger flex w-full flex-col"
      >
        <h2 className="mb-7 font-display text-[21px] font-semibold tracking-tight text-ink sm:mb-8 sm:text-[23px]">
          Log in
        </h2>

        <FormErrorBanner
          open={!!formError}
          title={formError?.title ?? ""}
          description={formError?.description}
          className="mb-4"
        />

        <div className="mb-6 flex flex-col gap-4">
          <TextField
            ref={emailRef}
            label="Email Address"
            type="email"
            type_={type}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(undefined);
            }}
            onBlur={handleEmailBlur}
            error={emailError}
            valid={isValidEmail(email)}
            autoComplete="email"
          />
          <TextField
            ref={(node) => {
              passwordRef.current = node;
            }}
            label="Password"
            type="password"
            type_={type}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Checkbox
            checked={keepLoggedIn}
            onChange={setKeepLoggedIn}
            label="Keep me logged in"
            type_={type}
          />
          <Link
            href={`/${type}/forgot-password`}
            className="font-body text-[13px] font-medium text-ink/50 transition-colors hover:text-ink"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" type_={type} loading={loading} success={success} disabled={locked} className="mb-5">
          {locked ? `Locked · try again in ${lockLeft}s` : "Log in"}
        </Button>

        {type === "personal" ? (
          <div className="flex flex-col items-center gap-3">
            <span className="font-body text-[13px] text-ink/60">
              Don&rsquo;t have a Mind You account?
            </span>
            <Button
              type="button"
              type_={type}
              variant="outline"
              onClick={() => router.push(`/${type}/register`)}
            >
              Sign up
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="text-center font-body text-[13px] text-ink/60">
              Haven&rsquo;t activated your account?
            </p>
            <Link
              href={`/${type}/activate`}
              className={`text-center font-body text-[13px] font-bold tracking-wide ${accentText} transition-colors hover:text-ink`}
            >
              ACTIVATE
            </Link>
          </div>
        )}
      </form>
    </AuthLayout>
  );
}
