"use client";

import { useEffect, useState } from "react";
import { useAMLStore } from "@/store/useAMLStore";
import { BASE_URL, starApi } from "@/lib/api";
import { CloudLightning, CheckCircle2, RefreshCw, X, AlertCircle } from "lucide-react";

export function BackendWarmupBanner() {
  const { backendConnected, isWakingUp, setBackendStatus } = useAMLStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [showConnectedToast, setShowConnectedToast] = useState(false);
  const [pingCount, setPingCount] = useState(0);

  // Active health check polling when disconnected
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isMounted = true;

    const checkHealth = async () => {
      try {
        setIsPinging(true);
        const isHealthy = await starApi.pingBackend();
        if (!isMounted) return;

        if (isHealthy) {
          setBackendStatus(true, false);
          setShowConnectedToast(true);
          // Auto-hide the success toast after 4 seconds
          setTimeout(() => {
            if (isMounted) setShowConnectedToast(false);
          }, 4000);
        } else {
          setBackendStatus(false, true);
        }
      } catch {
        if (isMounted) {
          setBackendStatus(false, false);
        }
      } finally {
        if (isMounted) {
          setIsPinging(false);
          setPingCount((c) => c + 1);
        }
      }
    };

    // Initial check
    checkHealth();

    // Poll every 5s while offline/waking up, every 30s while connected
    const pollInterval = backendConnected ? 30000 : 5000;
    interval = setInterval(checkHealth, pollInterval);

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [backendConnected, setBackendStatus]);

  // If user connected, hide after the toast duration
  if (backendConnected && !showConnectedToast) {
    return null;
  }

  // If user manually dismissed the offline warning, don't show unless state changed
  if (isDismissed && !showConnectedToast) {
    return null;
  }

  // ── Connected Success State ──
  if (backendConnected && showConnectedToast) {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
            <span className="font-semibold">Cloud Backend Live:</span>
            <span className="text-emerald-700 hidden sm:inline">
              FastAPI intelligence pipeline, GATe TGNN, and Isolation Forest online.
            </span>
            <span className="text-emerald-700 sm:hidden">AI pipeline connected.</span>
          </div>
          <button
            onClick={() => setShowConnectedToast(false)}
            className="text-emerald-600 hover:text-emerald-800 transition-colors p-1"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Disconnected / Waking Up State ──
  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs sm:text-sm">
        <div className="flex items-start sm:items-center gap-2.5 text-amber-900">
          <div className="mt-0.5 sm:mt-0 p-1 rounded-md bg-amber-100/80 text-amber-700 flex-shrink-0">
            <CloudLightning className="w-4 h-4 animate-pulse text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-amber-950">
                Cloud Backend Waking Up...
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-200/70 text-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                Free Tier Cold Start
              </span>
            </div>
            <p className="text-amber-800/90 text-xs mt-0.5">
              Free cloud containers sleep during inactivity. Waking up takes ~30–50s. The dashboard is running in 
              <span className="font-semibold text-amber-900"> interactive simulation mode </span> 
              while auto-reconnecting.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          <button
            onClick={async () => {
              setIsPinging(true);
              const ok = await starApi.pingBackend();
              if (ok) {
                setBackendStatus(true, false);
                setShowConnectedToast(true);
              }
              setIsPinging(false);
            }}
            disabled={isPinging}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isPinging ? "animate-spin" : ""}`} />
            <span>{isPinging ? "Pinging..." : "Check Status"}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-amber-700 hover:text-amber-900 transition-colors p-1"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
