"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { AlertCircle, CheckCircle2, Info, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info" | "offline";

interface ToastOptions {
  description?: string;
  /** ms until auto-dismiss; pass Infinity to persist until dismissed */
  duration?: number;
}

interface ToastItem {
  id: number;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration: number;
}

interface ToastApi {
  show: (variant: ToastVariant, title: string, options?: ToastOptions) => number;
  success: (title: string, options?: ToastOptions) => number;
  error: (title: string, options?: ToastOptions) => number;
  info: (title: string, options?: ToastOptions) => number;
  offline: (title: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const DEFAULT_DURATION_MS = 4000;
const ERROR_DURATION_MS = 5500;
const MAX_VISIBLE = 3;
const SWIPE_DISMISS_PX = 80;

function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { Icon: typeof Info; tone: string; bar: string }
> = {
  success: { Icon: CheckCircle2, tone: "text-success", bar: "bg-success" },
  error: { Icon: AlertCircle, tone: "text-error", bar: "bg-error" },
  info: { Icon: Info, tone: "text-personal-dark", bar: "bg-personal" },
  offline: { Icon: WifiOff, tone: "text-enterprise-dark", bar: "bg-enterprise" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timersRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobileViewport();

  const clearTimer = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [clearTimer]
  );

  const show = useCallback<ToastApi["show"]>(
    (variant, title, options) => {
      const id = ++idRef.current;
      const duration =
        options?.duration ??
        (variant === "error" ? ERROR_DURATION_MS : DEFAULT_DURATION_MS);

      setToasts((prev) => {
        const next =
          prev.length >= MAX_VISIBLE
            ? [...prev.slice(prev.length - MAX_VISIBLE + 1)]
            : [...prev];
        if (prev.length >= MAX_VISIBLE) {
          clearTimer(prev[0].id);
        }
        return [
          ...next,
          {
            id,
            variant,
            title,
            description: options?.description,
            duration,
          },
        ];
      });

      if (Number.isFinite(duration)) {
        timersRef.current.set(
          id,
          setTimeout(() => dismiss(id), duration)
        );
      }

      return id;
    },
    [clearTimer, dismiss]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (title, options) => show("success", title, options),
      error: (title, options) => show("error", title, options),
      info: (title, options) => show("info", title, options),
      offline: (title, options) => show("offline", title, options),
      dismiss,
    }),
    [show, dismiss]
  );

  const handleDragEnd =
    (id: number) =>
    (_event: unknown, info: PanInfo) => {
      if (Math.abs(info.offset.x) > SWIPE_DISMISS_PX) {
        dismiss(id);
      }
    };

  const enterAxis = shouldReduceMotion
    ? {}
    : isMobile
      ? { initial: { opacity: 0, y: 28 }, exit: { opacity: 0, y: 28 } }
      : { initial: { opacity: 0, x: 36 }, exit: { opacity: 0, x: 36 } };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className={cn(
          "pointer-events-none fixed z-[100] flex flex-col gap-2.5",
          "max-lg:inset-x-0 max-lg:bottom-0 max-lg:max-w-full max-lg:flex-col-reverse max-lg:px-4",
          "max-lg:[padding-bottom:calc(1rem+env(safe-area-inset-bottom))]",
          "lg:right-6 lg:top-6 lg:w-[380px] lg:items-end"
        )}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const { Icon, tone, bar } = VARIANT_STYLES[toast.variant];
            return (
              <motion.div
                key={toast.id}
                layout
                role={toast.variant === "error" ? "alert" : "status"}
                initial={
                  shouldReduceMotion ? { opacity: 0 } : enterAxis.initial
                }
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : enterAxis.exit}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={handleDragEnd(toast.id)}
                whileDrag={{ cursor: "grabbing" }}
                className="pointer-events-auto relative w-full overflow-hidden rounded-xl border border-white/60 bg-white/90 shadow-[var(--shadow-lg)] backdrop-blur-xl lg:w-full"
              >
                <div className="flex items-start gap-3 px-4 py-3.5 pr-10">
                  <Icon
                    size={19}
                    strokeWidth={2.25}
                    className={cn("mt-0.5 shrink-0", tone)}
                  />
                  <div className="min-w-0">
                    <p className="font-body text-[13.5px] font-semibold leading-snug text-ink">
                      {toast.title}
                    </p>
                    {toast.description && (
                      <p className="mt-0.5 font-body text-[12.5px] leading-snug text-ink/70">
                        {toast.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg text-ink/35 outline-none transition-colors hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2 2l8 8M10 2l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {Number.isFinite(toast.duration) && !shouldReduceMotion && (
                  <motion.div
                    aria-hidden="true"
                    className={cn("absolute bottom-0 left-0 h-[3px] w-full origin-left opacity-30", bar)}
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{
                      duration: toast.duration / 1000,
                      ease: "linear",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
