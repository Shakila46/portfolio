"use client";
import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    // Scroll progress bar via CSS variable
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      document.body.style.setProperty("--scroll-progress", pct + "%");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Reveal on scroll
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return null;
}
