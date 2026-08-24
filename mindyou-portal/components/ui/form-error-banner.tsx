"use client";

import { useEffect, forwardRef, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorBannerProps {
  title: string;
  description?: string;
  /** Render the banner. When it flips to false the collapse animates out. */
  open?: boolean;
  className?: string;
}

export const FormErrorBanner = forwardRef<HTMLDivElement, FormErrorBannerProps>(
  ({ title, description, open = true, className }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    const innerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (open && innerRef.current) {
        innerRef.current.focus({ preventScroll: false });
      }
    }, [open]);

    return (
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn("overflow-hidden", className)}
          >
            <div
              ref={(node) => {
                innerRef.current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) ref.current = node;
              }}
              role="alert"
              tabIndex={-1}
              className="flex items-start gap-2.5 rounded-xl border border-error/25 bg-error/8 px-3.5 py-3 outline-none"
            >
              <AlertCircle
                size={17}
                strokeWidth={2.25}
                className="mt-0.5 shrink-0 text-error"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="font-body text-[13px] font-semibold leading-snug text-error">
                  {title}
                </p>
                {description && (
                  <p className="mt-0.5 font-body text-[12.5px] leading-snug text-ink/70">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

FormErrorBanner.displayName = "FormErrorBanner";
