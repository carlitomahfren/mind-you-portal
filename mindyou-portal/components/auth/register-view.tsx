"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormErrorBanner } from "@/components/ui/form-error-banner";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { BrandedBridge } from "@/components/ui/branded-bridge";
import { useSubmitGuard, useDesktopAutofocus } from "@/lib/hooks";
import { isValidEmail, maskEmail } from "@/lib/validation";
import { getDemoError, MOCK_LATENCY_MS, sleep } from "@/lib/mock-auth";
import type { AccountType } from "@/lib/brand";

export function RegisterView({ type }: { type: AccountType }) {
  const router = useRouter();
  const toast = useToast();
  const { guard, release } = useSubmitGuard();
  const firstNameRef = useDesktopAutofocus<HTMLInputElement>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [formError, setFormError] = useState<{
    title: string;
    description?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bridging, setBridging] = useState(false);

  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  const accentText =
    type === "enterprise" ? "text-enterprise-dark" : "text-personal-dark";

  const emailValid = isValidEmail(email);
  const confirmMatches =
    confirmEmail.length > 0 && confirmEmail.trim() === email.trim();
  const confirmMismatch =
    confirmTouched &&
    confirmEmail.length > 0 &&
    !confirmMatches &&
    isValidEmail(confirmEmail);
  const confirmError = confirmMismatch
    ? "Email addresses don't match"
    : undefined;

  const validateEmailField = useCallback((): boolean => {
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError(undefined);
    return true;
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;
    if (!guard()) return;

    setFormError(null);

    if (!firstName.trim()) {
      release();
      firstNameRef.current?.focus();
      return;
    }
    if (!lastName.trim()) {
      release();
      lastNameRef.current?.focus();
      return;
    }
    if (!validateEmailField()) {
      release();
      emailRef.current?.focus();
      return;
    }
    setConfirmTouched(true);
    if (!confirmMatches) {
      release();
      confirmRef.current?.focus();
      return;
    }

    setLoading(true);

    // DEMO ONLY — swap this block for the real registration API call.
    await sleep(MOCK_LATENCY_MS);
    const demo = getDemoError({ email });

    if (demo === "account_exists") {
      setLoading(false);
      release();
      setFormError({
        title: "Account already exists",
        description:
          "An account with this email is already registered. Try logging in instead — or reset your password if you've forgotten it.",
      });
      emailRef.current?.focus();
      emailRef.current?.select();
      return;
    }

    setLoading(false);
    setSuccess(true);
    release();
    toast.success("Almost there!", {
      description: `We've sent an activation link to ${maskEmail(email)}.`,
    });
    setBridging(true);
    setTimeout(() => {
      router.push(
        `/${type}/activation-sent?email=${encodeURIComponent(email.trim())}`
      );
    }, 450);
  };

  return (
    <AuthLayout
      type={type}
      rightImageSrc="/72-3607.png"
      rightTitle="Welcome to Mind You!"
      rightSubtitle="Your safe space for mental well-being, giving access to confidential, compassionate care and resources designed to support you on your well-being journey, in a way that works best for you."
      showSignUp
      backHref={`/${type}/login`}
    >
      <div className="flex w-full flex-col">
        <h2 className="mb-7 font-display text-[21px] font-semibold tracking-tight text-ink sm:mb-8 sm:text-[23px]">
          Register an account
        </h2>

        <FormErrorBanner
          open={!!formError}
          title={formError?.title ?? ""}
          description={formError?.description}
          className="mb-4"
        />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="form-field-stagger flex flex-col gap-4"
        >
          <TextField
            ref={firstNameRef}
            label="First Name"
            type="text"
            type_={type}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            valid={firstName.trim().length > 0}
            autoComplete="given-name"
          />
          <TextField
            ref={(node) => {
              lastNameRef.current = node;
            }}
            label="Last Name"
            type="text"
            type_={type}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            valid={lastName.trim().length > 0}
            autoComplete="family-name"
          />
          <TextField
            ref={(node) => {
              emailRef.current = node;
            }}
            label="Email Address"
            type="email"
            type_={type}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(undefined);
            }}
            onBlur={validateEmailField}
            error={emailError}
            valid={emailValid}
            autoComplete="email"
          />
          <TextField
            ref={(node) => {
              confirmRef.current = node;
            }}
            label="Confirm Email Address"
            type="email"
            type_={type}
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            onBlur={() => setConfirmTouched(true)}
            error={confirmError}
            valid={confirmMatches}
            hint={
              confirmTouched && confirmMatches ? undefined : "Re-enter your email to confirm it"
            }
            autoComplete="off"
          />

          <Button
            type="submit"
            type_={type}
            loading={loading}
            success={success}
          >
            Sign up
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-1">
          <p className="text-center font-body text-[13px] text-ink/60">
            Already have a Mind You account?
          </p>
          <Link
            href={`/${type}/login`}
            className={`text-center font-body text-[13px] font-bold tracking-wide ${accentText} transition-colors hover:text-ink`}
          >
            LOG IN
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
