"use client";
// ============================================================
// STAR — App Shell (Client Component)
// Wraps the app layout with global hooks that must persist
// across page navigations (WebSocket, streaming, etc.)
// ============================================================
import { useWebSocketSim } from "@/hooks/useWebSocketSim";

export function AppShell({ children }: { children: React.ReactNode }) {
  // Global WebSocket connection — stays alive across all page navigations
  useWebSocketSim();

  return <>{children}</>;
}
