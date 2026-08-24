"use client";

import { useId } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AccountType } from "@/lib/brand";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  className?: string;
  type_?: AccountType;
  /** Forwards a ref to the underlying input element. */
  inputRef?: React.Ref<HTMLInputElement>;
}

export function Checkbox({ checked, onChange, label, className, type_ = "personal", inputRef }: CheckboxProps) {
  const id = useId();
  const isPersonal = type_ === "personal";
  const accent = isPersonal ? "#22b0b5" : "#d69d1a";
  const borderColor = checked ? accent : "#d9e0e3";

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-lg px-3 -mx-3 transition-colors hover:bg-ink/5",
        className
      )}
    >
      <motion.span
        className="relative flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors focus-within:ring-2 focus-within:ring-ink/20 focus-within:ring-offset-2 focus-within:rounded-[6px]"
        style={{ borderColor }}
        animate={{ borderColor }}
        transition={{ duration: 0.2 }}
      >
        <input
          id={id}
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute h-full w-full cursor-pointer opacity-0"
        />
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center rounded-[4px]"
              style={{ backgroundColor: accent }}
            >
              <motion.span
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <Check size={12} strokeWidth={3.5} className="text-white" />
              </motion.span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
      <span className="font-body text-[13px] text-ink">{label}</span>
    </label>
  );
}
