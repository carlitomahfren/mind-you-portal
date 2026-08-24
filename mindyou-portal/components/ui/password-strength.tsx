"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STRENGTH_LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label } = useMemo(() => {
    if (!password) return { score: -1, label: "" };

    const rulesMet =
      (password.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(password) ? 1 : 0) +
      (/[a-z]/.test(password) ? 1 : 0) +
      (/[0-9]/.test(password) ? 1 : 0);

    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const hasExtraLength = password.length >= 12;
    const bonus = rulesMet === 4 && (hasSymbol || hasExtraLength) ? 1 : 0;

    const s = Math.min(rulesMet - 1 + bonus, 4);
    return { score: Math.max(s, 0), label: STRENGTH_LABELS[Math.max(s, 0)] };
  }, [password]);

  const tone =
    score <= 1
      ? "bg-error"
      : score <= 3
        ? "bg-enterprise"
        : "bg-success";
  const textTone =
    score <= 1
      ? "text-error"
      : score <= 3
        ? "text-enterprise-dark"
        : "text-success";

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5" role="presentation">
          {[0, 1, 2, 3].map((segment) => (
            <div
              key={segment}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/8"
            >
              <motion.div
                className={cn("h-full origin-left rounded-full", tone)}
                initial={false}
                animate={{
                  scaleX: segment < score ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              />
            </div>
          ))}
        </div>
        <span
          className={cn(
            "w-[62px] text-right font-body text-[11.5px] font-semibold transition-colors duration-200",
            textTone
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
