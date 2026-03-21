"use client";
// ─── components/auth/AccountModal.tsx ────────────────────────────────────────
//
// Login / Sign Up modal for Kaava MVP.
// UI-only — no real authentication. Shows a "Coming soon" alert on submit.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useAuthModal } from "@/context/AuthModalContext";

// ── Tab type ─────────────────────────────────────────────────────────────────
type Tab = "login" | "signup";

// ── Password strength helper ─────────────────────────────────────────────────
function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "", color: "transparent", width: "0%" };
  if (pw.length < 6) return { label: "Weak", color: "#E53E3E", width: "33%" };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [pw.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score >= 3) return { label: "Strong", color: "#2D6A4F", width: "100%" };
  return { label: "Medium", color: "#E85D04", width: "66%" };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function AccountModal() {
  const { isOpen, closeAuthModal } = useAuthModal();
  const [tab, setTab] = useState<Tab>("login");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthModal();
    },
    [closeAuthModal]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Reset fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      setLoginEmail("");
      setLoginPassword("");
      setSignupName("");
      setSignupEmail("");
      setSignupPhone("");
      setSignupPassword("");
      setShowLoginPassword(false);
      setShowSignupPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Coming soon — MVP demo only");
  };

  if (!isOpen) return null;

  const strength = getPasswordStrength(signupPassword);

  // ── Shared input styles ──────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    borderRadius: 12,
    border: "1px solid #F0F0F0",
    padding: "14px 16px",
    fontSize: 14,
    fontFamily: "var(--font-inter), Inter, sans-serif",
    outline: "none",
    transition: "border-color 150ms ease",
    color: "#1B1B1B",
  };

  return (
    /* ── Overlay ────────────────────────────────────────────────────────── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
      onClick={closeAuthModal}
    >
      {/* ── Modal ──────────────────────────────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          maxWidth: "calc(100vw - 32px)",
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          background: "#FFFFFF",
          borderRadius: 20,
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.125)",
          padding: "32px 28px 28px",
          position: "relative",
          animation: "authModalIn 200ms ease forwards",
        }}
      >
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 9999,
            border: "none",
            background: "#F5F5F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 150ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#E0E0E0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#F5F5F5")}
        >
          <X size={16} color="#555555" />
        </button>

        {/* ── Tab Bar ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 32, marginBottom: 28 }}>
          {(["login", "signup"] as Tab[]).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid #2D6A4F" : "2px solid transparent",
                  paddingBottom: 8,
                  fontFamily: "var(--font-outfit), Outfit, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: isActive ? "#2D6A4F" : "#888888",
                  cursor: "pointer",
                  transition: "color 150ms ease, border-color 150ms ease",
                }}
              >
                {t === "login" ? "Login" : "Create Account"}
              </button>
            );
          })}
        </div>

        {/* ── Login Tab ───────────────────────────────────────────────── */}
        {tab === "login" && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="email"
              placeholder="Email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#F0F0F0")}
            />

            {/* Password with eye toggle */}
            <div style={{ position: "relative" }}>
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 48 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#F0F0F0")}
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                aria-label={showLoginPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showLoginPassword ? (
                  <EyeOff size={18} color="#888888" />
                ) : (
                  <Eye size={18} color="#888888" />
                )}
              </button>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: "right", marginTop: -4 }}>
              <button
                type="button"
                onClick={() => alert("Coming soon — MVP demo only")}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 13,
                  color: "#2D6A4F",
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                background: "#2D6A4F",
                color: "#FFFFFF",
                border: "none",
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 150ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#245c44")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2D6A4F")}
            >
              Login
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#E0E0E0" }} />
              <span
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 12,
                  color: "#888888",
                  whiteSpace: "nowrap",
                }}
              >
                or continue with
              </span>
              <div style={{ flex: 1, height: 1, background: "#E0E0E0" }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                onClick={() => alert("Coming soon — MVP demo only")}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  border: "1px solid #E0E0E0",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1B1B1B",
                  transition: "border-color 150ms ease, background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FAFAFA";
                  e.currentTarget.style.borderColor = "#CCCCCC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#E0E0E0";
                }}
              >
                {/* Google icon (inline SVG) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => alert("Coming soon — MVP demo only")}
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 12,
                  border: "1px solid #E0E0E0",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1B1B1B",
                  transition: "border-color 150ms ease, background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#FAFAFA";
                  e.currentTarget.style.borderColor = "#CCCCCC";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#E0E0E0";
                }}
              >
                {/* Apple icon (inline SVG) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1B1B1B">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Apple
              </button>
            </div>
          </form>
        )}

        {/* ── Sign Up Tab ─────────────────────────────────────────────── */}
        {tab === "signup" && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="text"
              placeholder="Full name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#F0F0F0")}
            />

            <input
              type="email"
              placeholder="Email address"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#F0F0F0")}
            />

            <input
              type="tel"
              placeholder="Phone number"
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#F0F0F0")}
            />

            {/* Password with eye toggle */}
            <div style={{ position: "relative" }}>
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Create password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 48 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#2D6A4F")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#F0F0F0")}
              />
              <button
                type="button"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                aria-label={showSignupPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showSignupPassword ? (
                  <EyeOff size={18} color="#888888" />
                ) : (
                  <Eye size={18} color="#888888" />
                )}
              </button>
            </div>

            {/* Password strength indicator */}
            {signupPassword.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: -8 }}>
                <div style={{ height: 4, borderRadius: 2, background: "#F0F0F0", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: strength.width,
                      background: strength.color,
                      borderRadius: 2,
                      transition: "width 200ms ease, background 200ms ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 12,
                    color: strength.color,
                  }}
                >
                  {strength.label}
                </span>
              </div>
            )}

            {/* Create Account button */}
            <button
              type="submit"
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                background: "#2D6A4F",
                color: "#FFFFFF",
                border: "none",
                fontFamily: "var(--font-outfit), Outfit, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 150ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#245c44")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2D6A4F")}
            >
              Create Account
            </button>

            {/* Terms text */}
            <p
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 12,
                color: "#888888",
                textAlign: "center",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              By creating an account, you agree to our{" "}
              <span style={{ color: "#2D6A4F", cursor: "pointer" }}>Terms</span> &{" "}
              <span style={{ color: "#2D6A4F", cursor: "pointer" }}>Privacy Policy</span>
            </p>
          </form>
        )}
      </div>

      {/* ── Animation keyframes ──────────────────────────────────────── */}
      <style>{`
        @keyframes authModalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
