import BgCanvas from "@/components/BgCanvas";
import CursorEffects from "@/components/CursorEffects";
import ScrollEffects from "@/components/ScrollEffects";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";


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
      <Hero />
      <hr style={{ border: "none", borderTop: "1px solid #252538", position: "relative", zIndex: 1 }} />
      <Skills />
      <hr style={{ border: "none", borderTop: "1px solid #252538", position: "relative", zIndex: 1 }} />
      <Projects />
      <hr style={{ border: "none", borderTop: "1px solid #252538", position: "relative", zIndex: 1 }} />
      <Contact />
      <footer style={{ borderTop: "1px solid #252538", padding: "2rem 3rem", textAlign: "center", color: "#7a7a9a", fontSize: ".78rem", position: "relative", zIndex: 1 }}>
        Designed &amp; built by Shakila Praween &nbsp;·&nbsp; Western Province, Sri Lanka
      </footer>
    </>
  );
}
