"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="show-cursor" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#07070e", position: "relative", overflow: "hidden", fontFamily: "var(--font-dm), sans-serif",
      padding: "1.5rem"
    }}>
      {/* Ambient background glows */}
      <div style={{ position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, width: 450, height: 450, left: "20%", top: "20%", background: "radial-gradient(circle,rgba(123,111,255,.1) 0%,transparent 70%)" }} />
      <div style={{ position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, width: 450, height: 450, right: "20%", bottom: "20%", background: "radial-gradient(circle,rgba(0,229,160,.06) 0%,transparent 70%)" }} />

      <div style={{
        width: "100%", maxWidth: "420px", background: "rgba(15, 15, 26, 0.65)",
        border: "1px solid rgba(255, 255, 255, 0.04)", borderRadius: "20px",
        padding: "2.5rem", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        position: "relative", zIndex: 1, boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)"
      }}>
        {/* Title */}
        <h2 style={{
          fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.8rem",
          color: "#eeeef8", marginBottom: "0.5rem", letterSpacing: "-0.02em"
        }}>
          Admin Login
        </h2>
        <p style={{ color: "#7a7a9a", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Log in to manage your portfolio projects
        </p>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#ef4444", borderRadius: "10px", padding: "0.8rem 1rem", fontSize: "0.85rem",
            marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem"
          }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", color: "#eeeef8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.5rem" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{
                width: "100%", background: "rgba(7, 7, 14, 0.6)", border: "1px solid #252538",
                borderRadius: "10px", padding: "0.8rem 1rem", fontSize: "0.88rem", color: "#eeeef8",
                outline: "none", transition: "border-color 0.25s, box-shadow 0.25s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7b6fff";
                e.target.style.boxShadow = "0 0 10px rgba(123, 111, 255, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#252538";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#eeeef8", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.5rem" }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%", background: "rgba(7, 7, 14, 0.6)", border: "1px solid #252538",
                borderRadius: "10px", padding: "0.8rem 1rem", fontSize: "0.88rem", color: "#eeeef8",
                outline: "none", transition: "border-color 0.25s, box-shadow 0.25s"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7b6fff";
                e.target.style.boxShadow = "0 0 10px rgba(123, 111, 255, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#252538";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "0.85rem", background: "#7b6fff", color: "#fff",
              border: "none", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 600,
              cursor: "pointer", transition: "background 0.2s, transform 0.1s", marginTop: "0.5rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#6559f5"}
            onMouseOut={(e) => e.currentTarget.style.background = "#7b6fff"}
          >
            {loading ? (
              <span style={{
                display: "inline-block", width: "16px", height: "16px",
                border: "2px solid rgba(255, 255, 255, 0.3)", borderTopColor: "#fff",
                borderRadius: "50%", animation: "spin 0.8s linear infinite"
              }} />
            ) : "Log In"}
          </button>
        </form>
        
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <a href="/" style={{ color: "#7a7a9a", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }}
             onMouseOver={(e) => e.currentTarget.style.color = "#eeeef8"}
             onMouseOut={(e) => e.currentTarget.style.color = "#7a7a9a"}>
            ← Back to Home
          </a>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
