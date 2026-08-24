"use client";

import {
  forwardRef,
  useId,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AccountType } from "@/lib/brand";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type_?: AccountType;
  hint?: string;
  error?: string;
  /** Shows a green checkmark inside the field once it validates. */
  valid?: boolean;
}

type KeyEvent = React.KeyboardEvent<HTMLInputElement>;

function isCapsLockActive(e: KeyEvent): boolean {
  return typeof e.getModifierState === "function"
    ? e.getModifierState("CapsLock")
    : false;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      type_ = "personal",
      hint,
      error,
      valid = false,
      className,
      id,
      type,
      onChange,
      onFocus,
      onBlur,
      onKeyDown,
      onKeyUp,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [show, setShow] = useState(false);
    const [focused, setFocused] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [hasInternalValue, setHasInternalValue] = useState(
      !!(props.defaultValue ?? false)
    );
    const hadErrorRef = useRef(false);
    const isPassword = type === "password";
    const hasValue = props.value !== undefined ? props.value !== "" : hasInternalValue;
    const isFloating = focused || hasValue;
    const showValidMark = valid && hasValue && !error;
    const accentClasses =
      type_ === "enterprise"
        ? "focus:border-enterprise/60 focus:ring-enterprise/10"
        : "focus:border-personal/60 focus:ring-personal/10";

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasInternalValue(e.target.value !== "");
        onChange?.(e);
      },
      [onChange]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        setHasInternalValue(e.target.value !== "");
        onBlur?.(e);
      },
      [onBlur]
    );

    const handleKeyDown = useCallback(
      (e: KeyEvent) => {
        if (isPassword) setCapsLockOn(isCapsLockActive(e));
        onKeyDown?.(e);
      },
      [isPassword, onKeyDown]
    );

    const handleKeyUp = useCallback(
      (e: KeyEvent) => {
        if (isPassword) setCapsLockOn(isCapsLockActive(e));
        onKeyUp?.(e);
      },
      [isPassword, onKeyUp]
    );

    // Haptic tick the first time an error lands, paired with the shake.
    useEffect(() => {
      if (error && !hadErrorRef.current) {
        try {
          navigator.vibrate?.(30);
        } catch {
          // Unsupported — silently skip.
        }
      }
      hadErrorRef.current = !!error;
    }, [error]);

    const controls = useAnimationControls();

    useEffect(() => {
      if (error) {
        controls.start({
          x: [0, -6, 6, -4, 4, 0],
          transition: { duration: 0.3, ease: "easeInOut" },
        });
      } else {
        controls.set({ x: 0 });
      }
    }, [error, controls]);

    const message = error ?? undefined;
    const messageKey = message
      ? `error:${message}`
      : capsLockOn
        ? "caps"
        : hint
          ? `hint:${hint}`
          : "none";

    return (
      <div className="flex flex-col gap-1">
        <motion.div animate={controls} className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (show ? "text" : "password") : type}
            aria-invalid={!!error}
            aria-describedby={
              message || capsLockOn || hint
                ? `${inputId}-message`
                : undefined
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={label}
            className={cn(
              "peer h-12 w-full rounded-xl border bg-white/80 backdrop-blur-sm px-3.5 pt-3.5 pb-1 text-[16px] sm:text-[14px] text-ink placeholder-transparent outline-none transition-all duration-150 hover:bg-white",
              accentClasses,
              "focus:bg-white",
              isPassword && "pr-11",
              showValidMark && !isPassword && "pr-10",
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                : "border-hairline",
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] text-ink-50 transition-all duration-200 ease-out",
              isFloating && "top-1.5 translate-y-0 text-[11px] font-medium"
            )}
          >
            {label}
          </label>
          {showValidMark && (
            <AnimatePresence>
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 26 }}
                className={cn(
                  "pointer-events-none absolute top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-success",
                  isPassword ? "right-10" : "right-3"
                )}
                aria-hidden="true"
              >
                <Check size={12} strokeWidth={3.5} className="text-white" />
              </motion.span>
            </AnimatePresence>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink/40 transition-colors hover:text-ink hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2 outline-none"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={show ? "off" : "on"}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="flex"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </motion.span>
              </AnimatePresence>
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          {messageKey !== "none" && (
            <motion.p
              key={messageKey}
              id={`${inputId}-message`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              role={error ? "alert" : undefined}
              className={cn(
                "px-1 font-body text-[12px] leading-snug",
                message
                  ? "font-medium text-red-500"
                  : capsLockOn
                    ? "font-medium text-enterprise-dark"
                    : "text-ink-50"
              )}
            >
              {message ?? (capsLockOn ? "Caps Lock is on" : hint)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
TextField.displayName = "TextField";
