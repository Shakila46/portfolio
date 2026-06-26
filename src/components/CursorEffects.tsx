"use client";
import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   Particle trail canvas (separate from cursor)
───────────────────────────────────────────── */
function useParticleTrail(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    let raf: number;

    // Palette — cycles through portfolio accent colors
    const PALETTE = [
      [123, 111, 255],  // violet  #7b6fff
      [0,   212, 255],  // cyan    #00d4ff
      [0,   229, 160],  // teal    #00e5a0
      [255, 107, 157],  // pink    #ff6b9d
      [168, 139, 250],  // lavender
    ];
    let colorIdx = 0;
    let colorTimer = 0;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      r: number;
      color: number[];
      angle: number;
    }

    const particles: Particle[] = [];
    let mx = -1000, my = -1000;
    let prevMx = -1000, prevMy = -1000;
    let moving = false;
    let moveTimer = 0;

    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      prevMx = mx; prevMy = my;
      mx = e.clientX;
      my = e.clientY;
      moving = true;
      moveTimer = 0;

      // Speed-based spawn count
      const dx = mx - prevMx, dy = my - prevMy;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const count = Math.min(Math.floor(speed * 0.35) + 1, 8);

      for (let i = 0; i < count; i++) {
        const col = PALETTE[colorIdx % PALETTE.length];
        const life = 38 + Math.random() * 22;
        particles.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.4,
          life,
          maxLife: life,
          r: Math.random() * 3.5 + 1.5,
          color: col,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      // Color cycle
      colorTimer++;
      if (colorTimer > 18) { colorTimer = 0; colorIdx++; }

      // Move timeout
      moveTimer++;
      if (moveTimer > 6) moving = false;

      // Update + draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife; // 1 → 0 as dying

        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.035;          // gravity
        p.vx *= 0.97;           // air friction
        p.vy *= 0.97;
        p.angle += 0.08;
        p.r  *= 0.975;           // shrink

        // Draw glowing orb
        const alpha = progress * 0.85;
        const [r, g, b] = p.color;

        // Outer glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
        grd.addColorStop(0,   `rgba(${r},${g},${b},${alpha * 0.9})`);
        grd.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.4})`);
        grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
}

/* ─────────────────────────────────────────────
   Cursor dot + ring (unchanged from before)
───────────────────────────────────────────── */
export default function CursorEffects() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useParticleTrail(canvasRef);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    dot.style.opacity  = "0";
    ring.style.opacity = "0";

    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let raf: number;
    let isHoveringLink = false;
    let isHoveringText = false;
    let currentMagnetic: HTMLElement | null = null;

    const moveDot = (x: number, y: number) => {
      dot.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
    };

    const animateRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      raf = requestAnimationFrame(animateRing);
    };
    raf = requestAnimationFrame(animateRing);

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      moveDot(mx, my);
      dot.style.opacity  = "1";
      ring.style.opacity = "1";

      const target = e.target as HTMLElement;
      const magnetic = target.closest("a, button, [data-magnetic]") as HTMLElement | null;

      if (magnetic) {
        if (currentMagnetic !== magnetic) {
          if (currentMagnetic) resetMagnetic(currentMagnetic);
          currentMagnetic = magnetic;
          enterMagnetic(magnetic);
        }
        const rect = magnetic.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width  / 2);
        const dy = e.clientY - (rect.top  + rect.height / 2);
        magnetic.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
      } else {
        if (currentMagnetic) { resetMagnetic(currentMagnetic); currentMagnetic = null; }
      }

      const tag = target.tagName.toLowerCase();
      const isText = ["p","h1","h2","h3","h4","h5","h6","span","li","label"].includes(tag)
        || window.getComputedStyle(target).cursor === "text";
      if (isText && !isHoveringLink) {
        isHoveringText = true;
        dot.style.width = "2px"; dot.style.height = "18px";
        dot.style.borderRadius = "2px"; dot.style.opacity = "0.7";
        ring.style.opacity = "0";
      } else if (!isHoveringLink && isHoveringText) {
        isHoveringText = false;
        dot.style.width = "10px"; dot.style.height = "10px";
        dot.style.borderRadius = "50%"; dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const enterMagnetic = (el: HTMLElement) => {
      isHoveringLink = true;
      el.style.transition = "none";
      dot.style.opacity = "0";
      ring.style.width = "52px"; ring.style.height = "52px";
      ring.style.marginLeft = "-6px"; ring.style.marginTop = "-6px";
      ring.style.borderColor = "rgba(0,212,255,0.8)";
      ring.style.boxShadow = "0 0 18px rgba(0,212,255,0.35), 0 0 40px rgba(123,111,255,0.2)";
      ring.style.background = "rgba(123,111,255,0.07)";
    };

    const resetMagnetic = (el: HTMLElement) => {
      isHoveringLink = false;
      el.style.transition = "transform 0.45s cubic-bezier(0.175,0.885,0.32,1.275)";
      el.style.transform  = "";
      dot.style.opacity = "1";
      ring.style.width = "40px"; ring.style.height = "40px";
      ring.style.marginLeft = "0px"; ring.style.marginTop = "0px";
      ring.style.borderColor = "rgba(123,111,255,0.5)";
      ring.style.boxShadow = "0 0 0px transparent";
      ring.style.background = "transparent";
    };

    const onMouseDown = () => {
      dot.style.transform  = dot.style.transform.replace(/\s*scale\([^)]*\)/, "") + " scale(0.5)";
      ring.style.transform = ring.style.transform + " scale(0.75)";
    };

    const onMouseUp = () => {
      dot.style.transform  = dot.style.transform.replace(/\s*scale\([^)]*\)/, "");
      ring.style.transform = ring.style.transform.replace(/\s*scale\([^)]*\)/, "");
      ring.animate(
        [
          { transform: ring.style.transform + " scale(1)",   opacity: "1" },
          { transform: ring.style.transform + " scale(1.8)", opacity: "0" },
        ],
        { duration: 400, easing: "ease-out" }
      );
    };

    const onMouseLeave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; };
    const onMouseEnter = () => { dot.style.opacity = "1"; ring.style.opacity = "1"; };

    document.addEventListener("mousemove",  onMouseMove);
    document.addEventListener("mousedown",  onMouseDown);
    document.addEventListener("mouseup",    onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove",  onMouseMove);
      document.removeEventListener("mousedown",  onMouseDown);
      document.removeEventListener("mouseup",    onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (currentMagnetic) resetMagnetic(currentMagnetic);
    };
  }, []);

  return (
    <>
      {/* Particle trail canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
          zIndex: 9990,
          mixBlendMode: "screen",
        }}
      />

      {/* Inner gradient dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: "10px", height: "10px",
          borderRadius: "50%",
          background: "linear-gradient(135deg,#7b6fff 0%,#00d4ff 100%)",
          pointerEvents: "none", zIndex: 9999, opacity: 0,
          willChange: "transform,opacity",
          transition: "opacity .2s, width .2s, height .2s, border-radius .2s",
          mixBlendMode: "screen",
        }}
      />

      {/* Outer trailing ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0,
          width: "40px", height: "40px",
          borderRadius: "50%",
          border: "1.5px solid rgba(123,111,255,0.5)",
          pointerEvents: "none", zIndex: 9998, opacity: 0,
          willChange: "transform,opacity",
          transition: "opacity .2s, width .25s cubic-bezier(.25,.46,.45,.94), height .25s cubic-bezier(.25,.46,.45,.94), border-color .25s, box-shadow .25s, background .25s, margin .25s",
        }}
      />
    </>
  );
}
