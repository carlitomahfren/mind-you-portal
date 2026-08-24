"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/toast";

export function NetworkStatus() {
  const toast = useToast();
  const offlineToastIdRef = useRef<number | null>(null);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    const goOffline = () => {
      if (offlineToastIdRef.current !== null) return;
      wasOfflineRef.current = true;
      offlineToastIdRef.current = toast.offline("You're offline", {
        description: "Check your connection. Some actions may not work.",
        duration: Infinity,
      });
    };

    const goOnline = () => {
      if (offlineToastIdRef.current !== null) {
        toast.dismiss(offlineToastIdRef.current);
        offlineToastIdRef.current = null;
      }
      if (!wasOfflineRef.current) return;
      wasOfflineRef.current = false;
      toast.success("Back online", {
        description: "Your connection has been restored.",
      });
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [toast]);

  return null;
}
