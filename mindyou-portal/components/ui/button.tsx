"use client";

import { forwardRef, useRef, useEffect } from "react";
import { motion, useReducedMotion, useAnimationControls, type HTMLMotionProps } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccountType } from "@/lib/brand";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  type_?: AccountType;
  variant?: "solid" | "outline" | "ghost";
  loading?: boolean;
  success?: boolean;
  pulse?: boolean;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      type_ = "personal",
      variant = "solid",
      loading = false,
      success = false,
      pulse = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const buttonControls = useAnimationControls();
    const prevPulse = useRef(pulse);

    useEffect(() => {
      if (pulse && !prevPulse.current && !shouldReduceMotion) {
        buttonControls.start({
          scale: [1, 1.025, 1],
          transition: { duration: 0.35, ease: "easeInOut" },
        });
      }
      prevPulse.current = pulse;
    }, [pulse, buttonControls, shouldReduceMotion]);

    const isPersonal = type_ === "personal";
    const solidClasses = isPersonal
      ? "bg-gradient-to-b from-personal to-personal-dark shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow-personal)] active:shadow-[var(--shadow-button)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2"
      : "bg-gradient-to-b from-enterprise to-enterprise-dark shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-glow-enterprise)] active:shadow-[var(--shadow-button)] focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2";

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading || success}
        animate={buttonControls}
        whileHover={shouldReduceMotion || disabled || loading ? undefined : { scale: 1.015, y: -1 }}
        whileTap={shouldReduceMotion || disabled || loading ? undefined : { scale: 0.975 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={cn(
          "relative flex h-12 sm:h-13 w-full items-center justify-center gap-2 rounded-xl px-6 text-[13px] sm:text-[14px] font-bold tracking-wider text-white transition-[box-shadow,opacity] duration-200 disabled:cursor-not-allowed disabled:opacity-45",
          variant === "solid" && solidClasses,
          variant === "outline" &&
            "border border-ink/15 bg-white/50 backdrop-blur-sm text-ink shadow-none hover:bg-white hover:border-ink/25 active:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2",
          variant === "ghost" && "bg-transparent text-ink shadow-none hover:bg-ink/5 active:bg-ink/10 focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <span className={cn("inline-flex items-center gap-2", (loading || success) && "opacity-0")}>
          {children}
        </span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-4 w-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
          </span>
        )}
        {!loading && success && (
          <motion.span
            initial={shouldReduceMotion ? false : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 500, damping: 30 }
            }
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check size={16} strokeWidth={3} />
          </motion.span>
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
