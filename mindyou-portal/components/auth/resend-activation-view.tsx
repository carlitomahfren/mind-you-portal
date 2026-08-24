"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { FormErrorBanner } from "@/components/ui/form-error-banner";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { BrandedBridge } from "@/components/ui/branded-bridge";
import { useSubmitGuard, useDesktopAutofocus } from "@/lib/hooks";
import { isValidEmail } from "@/lib/validation";
import type { AccountType } from "@/lib/brand";

export function ResendActivationView({ type }: { type: AccountType }) {
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

  const validateEmailField = useCallback((): boolean => {
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

  const handleResend = async (e: React.FormEvent) => {
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

    if (!validateEmailField()) {
      release();
      emailRef.current?.focus();
      return;
    }

    setLoading(true);
    // DEMO ONLY — swap this block for the real resend-activation API call.
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSuccess(true);
    release();
    toast.success("Activation email resent", {
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
      rightImageSrc="/72-4315.png"
      rightTitle="Welcome Back to Mind You!"
      rightSubtitle="We hope you've been getting the care you need through us. We strive to make Mind You as convenient and professional as possible, and we're always happy to help if you encounter any problems while using our service."
    >
      <div className="flex w-full flex-col">
        <BrandedBridge show={bridging} />
        <h2 className="mb-8 font-display text-[21px] font-semibold tracking-tight text-ink sm:mb-9 sm:text-[23px]">
          Resend activation email
        </h2>

        <FormErrorBanner
          open={!!formError}
          title={formError?.title ?? ""}
          description={formError?.description}
          className="mb-4"
        />

        <form onSubmit={handleResend} noValidate className="form-field-stagger flex flex-col gap-5">
          <TextField
            ref={emailRef}
            label={type === "enterprise" ? "Company Email Address" : "Email Address"}
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
            hint="We'll resend the activation link to this address"
            autoComplete="email"
          />

          <Button type="submit" type_={type} loading={loading} success={success}>
            Resend activation email
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
