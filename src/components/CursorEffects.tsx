'use client'
import { useEffect } from 'react'

export default function CursorEffects() {
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const trail = document.getElementById('cursor-trail')
    if (!cursor || !trail) return
    let mx = 0, my = 0, tx = 0, ty = 0

    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; }
    const tick = () => { tx += (mx-tx)*0.1; ty += (my-ty)*0.1; trail.style.left = tx+'px'; trail.style.top = ty+'px'; requestAnimationFrame(tick); }
    tick()

    const over = () => trail.classList.add('hover')
    const out = () => trail.classList.remove('hover')
    document.querySelectorAll('a,button,[data-hover]').forEach(el => { el.addEventListener('mouseenter', over); el.addEventListener('mouseleave', out); })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return null
}
