'use client'
import { useEffect } from 'react'

export default function BgCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = window.innerWidth, H = window.innerHeight
    canvas.width = W; canvas.height = H

    const pts = Array.from({length:60}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
      r: Math.random()*1.2+.3,
      c: ['#0FF4C6','#6C63FF','#FF4D8F'][Math.floor(Math.random()*3)]
    }))

    let mouse = {x:-999,y:-999}
    window.addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; })

    const draw = () => {
      ctx.clearRect(0,0,W,H)
      pts.forEach((p,i) => {
        const dx=mouse.x-p.x, dy=mouse.y-p.y, d=Math.sqrt(dx*dx+dy*dy)
        if(d<100){ p.vx-=dx/d*.012; p.vy-=dy/d*.012; }
        p.x+=p.vx; p.y+=p.vy; p.vx*=.99; p.vy*=.99
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=p.c; ctx.globalAlpha=0.6; ctx.fill()
        for(let j=i+1;j<pts.length;j++){
          const q=pts[j], dd=Math.sqrt((p.x-q.x)**2+(p.y-q.y)**2)
          if(dd<90){ ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y)
            ctx.strokeStyle='#0FF4C6'; ctx.globalAlpha=(1-dd/90)*.08; ctx.lineWidth=.5; ctx.stroke() }
        }
        ctx.globalAlpha=1
      })
      requestAnimationFrame(draw)
    }
    draw()
    const resize = () => { W=window.innerWidth; H=window.innerHeight; canvas.width=W; canvas.height=H; }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])
  return <canvas id="bg-canvas" aria-hidden="true" />
}
