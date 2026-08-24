"use client";

import { useCallback, useRef, useState } from "react";
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

export function ForgotPasswordView({ type }: { type: AccountType }) {
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
      emailRef.current?.focus();
      return false;
    }
    setEmailError(undefined);
    return true;
  }, [email, emailRef]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;
    if (!guard()) return;

    setFormError(null);

    if (!validateEmailField()) {
      release();
      return;
    }

    setLoading(true);

    // DEMO ONLY — swap this block for the real reset-request API call.
    await sleep(MOCK_LATENCY_MS);
    const demo = getDemoError({ email });

    if (demo === "server_error") {
      setLoading(false);
      release();
      setFormError({
        title: "Something went wrong",
        description:
          "We couldn't process your request right now. Please try again in a moment.",
      });
      emailRef.current?.focus();
      return;
    }

    setLoading(false);
    setSuccess(true);
    release();
    toast.success("Reset link sent", {
      description: "Check your inbox for the secure link.",
    });
    setBridging(true);
    setTimeout(() => {
      router.push(
        `/${type}/check-email?email=${encodeURIComponent(email.trim())}`
      );
    }, 450);
  };

  return (
    <AuthLayout
      type={type}
      rightImageSrc="/96-396.png"
      rightTitle="Welcome Back to Mind You!"
      rightSubtitle="We hope you've been getting the care you need through us. We strive to make Mind You as convenient and professional as possible, and we're always happy to help if you encounter any problems while using our service."
    >
      <div className="flex w-full flex-col">
        <BrandedBridge show={bridging} />
        <h2 className="mb-8 font-display text-[21px] font-semibold tracking-tight text-ink sm:mb-9 sm:text-[23px]">
          Forgot password
        </h2>

        <FormErrorBanner
          open={!!formError}
          title={formError?.title ?? ""}
          description={formError?.description}
          className="mb-4"
        />

        <form onSubmit={handleReset} noValidate className="form-field-stagger flex flex-col gap-5">
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
            onBlur={validateEmailField}
            error={emailError}
            valid={isValidEmail(email)}
            hint="We'll email you a secure link to reset your password."
            autoComplete="email"
          />
          <Button type="submit" type_={type} loading={loading} success={success}>
            Reset password
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
