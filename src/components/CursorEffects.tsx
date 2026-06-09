"use client";
import { useEffect, useRef } from "react";

export default function CursorEffects() {
  const curRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current!;
    const trail = trailRef.current!;
    let mx = 0, my = 0, tx = 0, ty = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";
    };

    function animTrail() {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      trail.style.left = tx + "px";
      trail.style.top = ty + "px";
      requestAnimationFrame(animTrail);
    }
    animTrail();

    const grow = () => {
      cur.style.transform = "translate(-50%,-50%) scale(2.5)";
      cur.style.background = "#00e5a0";
    };
    const shrink = () => {
      cur.style.transform = "translate(-50%,-50%) scale(1)";
      cur.style.background = "#7b6fff";
    };

    document.querySelectorAll("a,button").forEach((el) => {
      (el as HTMLElement).style.cursor = "pointer";
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div
        ref={curRef}
        style={{
          position: "fixed", width: 12, height: 12, background: "#7b6fff",
          borderRadius: "50%", pointerEvents: "none", zIndex: 9999,
          transform: "translate(-50%,-50%)", transition: "transform .1s, background .2s",
          mixBlendMode: "screen", top: 0, left: 0,
        }}
      />
      <div
        ref={trailRef}
        style={{
          position: "fixed", width: 32, height: 32,
          border: "1px solid rgba(123,111,255,.4)", borderRadius: "50%",
          pointerEvents: "none", zIndex: 9998, transform: "translate(-50%,-50%)",
          transition: "transform .35s cubic-bezier(.25,.46,.45,.94)", top: 0, left: 0,
        }}
      />
    </>
  );
}
