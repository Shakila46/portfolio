"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.authenticated === true))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setIsAdmin(false);
    setLoggingOut(false);
    router.refresh();
  };

  if (!isAdmin) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "1.5rem",
      right: "1.5rem",
      zIndex: 9999,
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
    }}>
      {/* Admin Dashboard button */}
      <a
        href="/admin"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.55rem 1rem",
          borderRadius: "10px",
          background: "rgba(123, 111, 255, 0.15)",
          border: "1px solid rgba(123, 111, 255, 0.4)",
          color: "#a99fff",
          fontSize: "0.78rem",
          fontWeight: 600,
          textDecoration: "none",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "background 0.2s, transform 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(123,111,255,0.25)";
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(123,111,255,0.15)";
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Dashboard
      </a>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "0.55rem 1rem",
          borderRadius: "10px",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          color: "#ff6b6b",
          fontSize: "0.78rem",
          fontWeight: 600,
          cursor: loggingOut ? "not-allowed" : "pointer",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          opacity: loggingOut ? 0.6 : 1,
          transition: "background 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!loggingOut) {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.22)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.12)";
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
        }}
      >
        {loggingOut ? (
          <>
            <span style={{
              width: 11, height: 11, borderRadius: "50%",
              border: "2px solid rgba(255,107,107,0.3)",
              borderTop: "2px solid #ff6b6b",
              display: "inline-block",
              animation: "spin 0.7s linear infinite",
            }} />
            Logging out…
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </>
        )}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
