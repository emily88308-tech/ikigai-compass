import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'error', text}

  async function google() {
    setMsg(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setMsg({ type: "error", text: error.message });
      setBusy(false);
    }
    // On success the browser redirects to Google, so no need to reset busy.
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100svh", fontFamily: "var(--font-sans)", padding: 20 }}>
      <div style={{ width: "min(400px, 94vw)", background: "var(--color-background-primary)", borderRadius: 20, border: "0.5px solid var(--color-border-tertiary)", padding: "40px 32px", boxSizing: "border-box", textAlign: "center", boxShadow: "0 24px 60px -20px rgba(42, 39, 53, 0.22)" }}>
        <div style={{ width: 60, height: 60, margin: "0 auto 18px", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, background: "linear-gradient(135deg, #EEEDFE, #FBEAF0)", border: "0.5px solid var(--color-border-tertiary)" }}>🧭</div>
        <div style={{ fontWeight: 600, fontSize: 23, color: "var(--color-text-primary)", marginBottom: 8, letterSpacing: "-0.01em" }}>Ikigai Compass</div>
        <div style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
          Bring your ikigai to life — a space to nurture the<br />goals and reflections that let you live with<br />satisfaction, care, and love.
        </div>

        <button onClick={google} disabled={busy}
          style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", cursor: busy ? "default" : "pointer", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "box-shadow .2s, border-color .2s", opacity: busy ? 0.6 : 1 }}>
          <GoogleIcon />
          {busy ? "Redirecting…" : "Continue with Google"}
        </button>

        {msg && (
          <div style={{ fontSize: 12, marginTop: 16, lineHeight: 1.5, color: "#D4537E" }}>{msg.text}</div>
        )}

        <div style={{ marginTop: 26, fontSize: 12, color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
          We'll never post anything. Your goals stay private to you.
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
