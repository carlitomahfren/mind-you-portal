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
import { isValidEmail } from "@/lib/validation";
import { getDemoError, MOCK_LATENCY_MS, sleep } from "@/lib/mock-auth";
import type { AccountType } from "@/lib/brand";

export function ActivateView({ type }: { type: AccountType }) {
  const router = useRouter();
  const toast = useToast();
  const { guard, release } = useSubmitGuard();
  const emailRef = useDesktopAutofocus<HTMLInputElement>();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [formError, setFormError] = useState<{
    title: string;
    description?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bridging, setBridging] = useState(false);

  const accentText =
    type === "enterprise" ? "text-enterprise-dark" : "text-personal-dark";

  const notFoundCopy: Record<AccountType, string> = {
    personal: "We couldn't find a Mind You account with that email. Double-check the address, or sign up to create one.",
    enterprise:
      "We couldn't find an account for that company email. Double-check the address with your HR or people team, or contact your program administrator.",
  };

  const validateEmailField = useCallback((): boolean => {
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      return false;
    }
    setEmailError(undefined);
    return true;
  }, [email]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;
    if (!guard()) return;

    setFormError(null);

    if (!validateEmailField()) {
      release();
      emailRef.current?.focus();
      return;
    }

    setLoading(true);

    // DEMO ONLY — swap this block for the real activation-request API call.
    await sleep(MOCK_LATENCY_MS);
    const demo = getDemoError({ email });

    if (demo === "account_not_found") {
      setLoading(false);
      release();
      setFormError({
        title: "No account found",
        description: notFoundCopy[type],
      });
      emailRef.current?.focus();
      emailRef.current?.select();
      return;
    }

    setLoading(false);
    setSuccess(true);
    release();
    toast.success("Activation email sent", {
      description: "Follow the link inside to activate your account.",
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
      rightSubtitle={
        type === "enterprise"
          ? "Your safe space for well-being at work. As part of your organization's commitment to employee well-being, you have access to confidential, compassionate care whenever you need support, guidance, or simply someone to talk to."
          : "Your safe space for mental well-being. Whether you need support, guidance, or simply someone to talk to, we're here to provide confidential, compassionate care in a way that works best for you."
      }
    >
      <div className="flex w-full flex-col">
        <BrandedBridge show={bridging} />
        <h2 className="mb-8 font-display text-[21px] font-semibold tracking-tight text-ink sm:mb-9 sm:text-[23px]">
          Activate your account
        </h2>

        <FormErrorBanner
          open={!!formError}
          title={formError?.title ?? ""}
          description={formError?.description}
          className="mb-4"
        />

        <form
          onSubmit={handleActivate}
          noValidate
          className="form-field-stagger flex flex-col gap-5"
        >
          <TextField
            ref={(node) => {
              emailRef.current = node;
            }}
            label={
              type === "enterprise" ? "Company Email Address" : "Email Address"
            }
            type="email"
            type_={type}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(undefined);
            }}
            onBlur={validateEmailField}
            error={emailError}
            valid={isValidEmail(email)}
            autoComplete="email"
          />

          <Button
            type="submit"
            type_={type}
            loading={loading}
            success={success}
          >
            Send activation email
          </Button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-1">
          <p className="text-center font-body text-[13px] text-ink/60">
            Already have an account?
          </p>
          <Link
            href={`/${type}/login`}
            className={`text-center font-body text-[13px] font-bold tracking-wide ${accentText} transition-colors hover:text-ink`}
          >
            SIGN IN
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
