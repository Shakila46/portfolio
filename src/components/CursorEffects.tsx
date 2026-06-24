"use client";
import { useEffect, useRef } from "react";

export default function CursorEffects() {
  const curRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current!;
    const trail = trailRef.current!;
    let mx = 0, my = 0, tx = 0, ty = 0;
    let currentMagnetic: HTMLElement | null = null;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";

      // Magnetic selection check: find interactive elements
      const target = (e.target as HTMLElement).closest("a, button, [data-magnetic]") as HTMLElement | null;

      if (target) {
        if (currentMagnetic !== target) {
          if (currentMagnetic) {
            resetMagnetic(currentMagnetic);
          }
          currentMagnetic = target;
          enterMagnetic(target);
        }

        // Apply magnetic pull physics
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        target.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
      } else {
        if (currentMagnetic) {
          resetMagnetic(currentMagnetic);
          currentMagnetic = null;
        }
      }
    };

    const enterMagnetic = (el: HTMLElement) => {
      el.style.transition = "none";
      cur.style.transform = "translate(-50%,-50%) scale(0)";
      trail.style.transform = "translate(-50%,-50%) scale(1.6)";
      trail.style.background = "rgba(123, 111, 255, 0.12)";
      trail.style.borderColor = "#00e5a0"; // Teal glow
    };

    const resetMagnetic = (el: HTMLElement) => {
      el.style.transition = "transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      el.style.transform = "";
      cur.style.transform = "translate(-50%,-50%) scale(1)";
      trail.style.transform = "translate(-50%,-50%) scale(1)";
      trail.style.background = "transparent";
      trail.style.borderColor = "rgba(123, 111, 255, 0.4)";
    };

    const onMouseDown = () => {
      cur.style.transform = "translate(-50%,-50%) scale(0.6)";
      trail.style.transform = "translate(-50%,-50%) scale(0.7)";
    };

    const onMouseUp = () => {
      if (currentMagnetic) {
        cur.style.transform = "translate(-50%,-50%) scale(0)";
        trail.style.transform = "translate(-50%,-50%) scale(1.6)";
      } else {
        cur.style.transform = "translate(-50%,-50%) scale(1)";
        trail.style.transform = "translate(-50%,-50%) scale(1)";
      }

      // Animate click ripple wave on outer cursor
      trail.animate(
        [
          { transform: `translate(-50%,-50%) scale(${currentMagnetic ? 1.6 : 1})`, opacity: 1 },
          { transform: `translate(-50%,-50%) scale(${currentMagnetic ? 2.6 : 2.2})`, opacity: 0 }
        ],
        {
          duration: 350,
          easing: "ease-out"
        }
      );
    };

    function animTrail() {
      // Direct physics interpolation for lag-free visual follow
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      trail.style.left = tx + "px";
      trail.style.top = ty + "px";
      requestAnimationFrame(animTrail);
    }
    
    animTrail();

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      if (currentMagnetic) {
        resetMagnetic(currentMagnetic);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={curRef}
        style={{
          position: "fixed", width: 10, height: 10, background: "#7b6fff",
          borderRadius: "50%", pointerEvents: "none", zIndex: 9999,
          transform: "translate(-50%,-50%)", transition: "transform .15s, background .2s",
          mixBlendMode: "screen", top: 0, left: 0,
        }}
      />
      <div
        ref={trailRef}
        style={{
          position: "fixed", width: 34, height: 34,
          border: "1.5px solid rgba(123,111,255,.45)", borderRadius: "50%",
          pointerEvents: "none", zIndex: 9998, transform: "translate(-50%,-50%)",
          transition: "transform .3s cubic-bezier(.25,.46,.45,.94), border-color .3s, background .3s", top: 0, left: 0,
        }}
      />
    </>
  );
}

