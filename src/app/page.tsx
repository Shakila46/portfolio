import BgCanvas from "@/components/BgCanvas";
import CursorEffects from "@/components/CursorEffects";
import ScrollEffects from "@/components/ScrollEffects";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import AdminBar from "@/components/AdminBar";


export default function Home() {
  return (
    <>
      <CursorEffects />
      <ScrollEffects />
      <BgCanvas />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, width: 600, height: 600, left: -200, top: -100, background: "radial-gradient(circle,rgba(123,111,255,.12) 0%,transparent 70%)" }} />
      <div style={{ position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, width: 500, height: 500, right: -150, top: "30%", background: "radial-gradient(circle,rgba(0,229,160,.08) 0%,transparent 70%)" }} />
      <div style={{ position: "fixed", borderRadius: "50%", pointerEvents: "none", zIndex: 0, width: 400, height: 400, left: "30%", bottom: -100, background: "radial-gradient(circle,rgba(255,107,157,.07) 0%,transparent 70%)" }} />

      <Navbar />
      <AdminBar />
      <Hero />
      <hr style={{ border: "none", borderTop: "1px solid #252538", position: "relative", zIndex: 1 }} />
      <Skills />
      <hr style={{ border: "none", borderTop: "1px solid #252538", position: "relative", zIndex: 1 }} />
      <Projects />
      <hr style={{ border: "none", borderTop: "1px solid #252538", position: "relative", zIndex: 1 }} />
      <Contact />
      <footer style={{ borderTop: "1px solid #252538", padding: "2rem 3rem", color: "#7a7a9a", fontSize: ".78rem", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <span>Designed &amp; built by Shakila Praween &nbsp;·&nbsp; Western Province, Sri Lanka</span>
        <a href="/login" className="footer-link">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Admin Portal
        </a>
      </footer>
    </>
  );
}
