'use client'
import { useEffect } from 'react'

export default function ParticleCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('particles') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    const COLORS = ['#7B68EE','#00D9FF','#FF6B9D','#39D98A']
    const particles: { x:number; y:number; vx:number; vy:number; r:number; color:string; alpha:number }[] = []

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.6 + 0.2,
      })
    }

    let mouse = { x: -999, y: -999 }
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY })

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach((p, i) => {
        const dx = mouse.x - p.x, dy = mouse.y - p.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < 120) {
          p.vx -= dx / dist * 0.015
          p.vy -= dy / dist * 0.015
        }
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.99; p.vy *= 0.99
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.sqrt((p.x-q.x)**2 + (p.y-q.y)**2)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = '#7B68EE'
            ctx.globalAlpha = (1 - d/100) * 0.15
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
        ctx.globalAlpha = 1
      })
      requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <canvas id="particles" aria-hidden="true" />
}
