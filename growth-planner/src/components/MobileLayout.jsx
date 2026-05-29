import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { useWindowSize } from "../hooks/useWindowSize";
import CategoryPills from "./CategoryPills";
import BottomTabBar from "./BottomTabBar";

// Mobile shell: brand/sign-out header, optional category pills (Goals tab),
// full-width scrolling content, and a bottom tab bar. The page content itself
// is passed in so desktop and mobile share the same view components.
export default function MobileLayout({ children }) {
  const page = useUiStore((s) => s.page);
  const signOut = useAuthStore((s) => s.signOut);
  const email = useAuthStore((s) => s.user?.email);
  // iOS standalone mode miscomputes svh/vh and even position:fixed bottom:0
  // leaves a gap. window.innerHeight reports the true window height there, so
  // we size the shell explicitly from it (updates on rotation via the hook).
  const { height } = useWindowSize();

  const showPills =
    page === "active" || page.startsWith("cat:") || page === "someday" || page === "achieved";

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: height ? `${height}px` : "100svh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background: "var(--color-background-primary)",
      fontFamily: "var(--font-sans)",
    }}>
      <header style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "calc(env(safe-area-inset-top) + 12px) 16px 11px",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        background: "var(--color-background-secondary)",
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>
            Growth planner
          </div>
          {email && (
            <div style={{
              fontSize: 11, color: "var(--color-text-tertiary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200,
            }}>{email}</div>
          )}
        </div>
        <button onClick={signOut} style={{
          flexShrink: 0,
          fontSize: 12,
          color: "var(--color-text-secondary)",
          background: "none",
          border: "0.5px solid var(--color-border-secondary)",
          borderRadius: 8,
          padding: "5px 12px",
          cursor: "pointer",
        }}>Sign out</button>
      </header>

      {showPills && <CategoryPills />}

      <main style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "14px 14px 0",
      }}>
        {children}
      </main>

      <BottomTabBar />
    </div>
  );
}
