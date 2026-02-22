import React, { useState } from "react";
import T from "./theme";

// Admin credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        onLogin("owner");
      } else if (username.trim() && password.trim()) {
        onLogin("customer");
      } else {
        setError("Please enter your username and password.");
      }
      setLoading(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: T.fontText,
      padding: 20,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 380,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{
            fontSize: 42,
            fontWeight: 800,
            color: T.accent,
            fontFamily: T.font,
            letterSpacing: "-0.04em",
            margin: 0,
          }}>boolen</h1>
          <p style={{
            fontSize: 15,
            color: T.sub,
            marginTop: 8,
            fontFamily: T.fontText,
          }}>Sign in to continue</p>
        </div>

        {/* Card */}
        <div style={{
          background: T.card,
          borderRadius: 20,
          padding: 32,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: `1px solid ${T.border}`,
        }}>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: T.sub,
              marginBottom: 6,
            }}>Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter username"
              autoComplete="username"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: `1.5px solid ${T.border}`,
                fontSize: 15,
                fontFamily: T.fontText,
                outline: "none",
                boxSizing: "border-box",
                background: T.bg,
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={e => {
                e.target.style.borderColor = T.accent;
                e.target.style.boxShadow = `0 0 0 3px ${T.accent}20`;
              }}
              onBlur={e => {
                e.target.style.borderColor = T.border;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: T.sub,
              marginBottom: 6,
            }}>Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: `1.5px solid ${T.border}`,
                fontSize: 15,
                fontFamily: T.fontText,
                outline: "none",
                boxSizing: "border-box",
                background: T.bg,
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={e => {
                e.target.style.borderColor = T.accent;
                e.target.style.boxShadow = `0 0 0 3px ${T.accent}20`;
              }}
              onBlur={e => {
                e.target.style.borderColor = T.border;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#FFF2F2",
              border: `1px solid ${T.red}30`,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 16,
              color: T.red,
              fontSize: 13,
              fontWeight: 500,
            }}>{error}</div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              border: "none",
              background: T.accent,
              color: "#FFF",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: T.fontText,
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
