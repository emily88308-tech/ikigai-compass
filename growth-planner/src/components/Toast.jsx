import { useEffect } from "react";
import { useUiStore } from "../store/uiStore";

// Global, fixed banner for surfacing problems the user must know about —
// chiefly failed saves/loads, which would otherwise silently lose data.
export default function Toast() {
  const toast = useUiStore((s) => s.toast);
  const dismissToast = useUiStore((s) => s.dismissToast);

  // Auto-dismiss after a while so it doesn't linger forever; errors get longer.
  useEffect(() => {
    if (!toast) return;
    const ms = toast.type === "error" ? 12000 : 5000;
    const t = setTimeout(dismissToast, ms);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);

  if (!toast) return null;

  const isError = toast.type === "error";
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "max(16px, env(safe-area-inset-top))",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        maxWidth: "min(560px, 92vw)",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 12,
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        lineHeight: 1.5,
        color: isError ? "#7A2540" : "var(--color-text-primary)",
        background: isError ? "#FDEBF1" : "var(--color-background-primary)",
        border: `0.5px solid ${isError ? "#F3B6CC" : "var(--color-border-secondary)"}`,
        boxShadow: "0 16px 40px -16px rgba(42, 39, 53, 0.3)",
      }}
    >
      <span style={{ flexShrink: 0, fontSize: 14 }}>{isError ? "⚠️" : "ℹ️"}</span>
      <span style={{ flex: 1, minWidth: 0 }}>{toast.text}</span>
      <button
        onClick={dismissToast}
        aria-label="Dismiss"
        style={{
          flexShrink: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "inherit",
          opacity: 0.6,
          fontSize: 16,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
