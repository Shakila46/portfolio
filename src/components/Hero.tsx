'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './Hero.module.css'

const roles = ['Flutter Developer','React Engineer','Next.js Builder','AI Integrator','Full Stack Dev']

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = roles[roleIdx]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && displayed.length < target.length)
      t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80)
    else if (!deleting && displayed.length === target.length)
      t = setTimeout(() => setDeleting(true), 2200)
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    else { setDeleting(false); setRoleIdx(i => (i + 1) % roles.length) }
    return () => clearTimeout(t)
  }, [displayed, deleting, roleIdx])

  return (
    <section className={styles.hero} id="about">

      {/* ── STATUS BAR ── */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>Available for work</span>
        </div>
        <div className={styles.statusRight}>
          <span className={styles.statusItem}>Sri Lanka</span>
          <span className={styles.statusDiv}>/</span>
          <span className={styles.statusItem}>Full Stack Dev</span>
          <span className={styles.statusDiv}>/</span>
          <span className={styles.statusItem}>2+ Yrs Exp</span>
        </div>
      </div>

      {/* ── GIANT NAME ── */}
      <div className={styles.nameWrap}>
        <h1 className={styles.nameTop}>Shakila</h1>
        <h1 className={styles.nameBot}>
          <span className={styles.nameGrad}>Praween</span>
          <span className={styles.nameDot}>.</span>
        </h1>
      </div>

      {/* ── 3 COLUMN ROW ── */}
      <div className={styles.row}>

        {/* COL 1 — PHOTO */}
        <div className={styles.photoCol}>
          <div className={styles.photoOuter}>
            <div className={styles.photoRing} />
            <div className={styles.photoGlow} />
            <div className={styles.photoCircle}>
              <Image
                src="/avatar.jpg"
                alt="Shakila Praween"
                width={280} height={280}
                style={{ objectFit:'cover', objectPosition:'top center', width:'100%', height:'100%' }}
                priority
              />
            </div>
          </div>
          <div className={styles.photoPill}>
            <span className={styles.pillName}>Shakila Praween</span>
            <span className={styles.pillRole}>Full Stack Developer</span>
          </div>
        </div>

        {/* COL 2 — TEXT */}
        <div className={styles.textCol}>
          <div className={styles.roleRow}>
            <span className={styles.roleSlash}>/</span>
            <span className={styles.roleText}>{displayed}</span>
            <span className={styles.cursor}>_</span>
          </div>
          <p className={styles.bio}>
            Sri Lanka‑based developer crafting pixel‑perfect
            cross‑platform apps with Flutter, React & Next.js.
            Deep focus on performance and clean architecture.
          </p>
          <div className={styles.actions}>
            <a href="#projects" className={styles.btnPrimary} data-hover>
              View Work
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="/cv.pdf" download="Shakila_Praween_CV.pdf" className={styles.btnCV} data-hover>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download CV
            </a>
            <a href="https://linkedin.com/in/shakila-praween" target="_blank" rel="noopener noreferrer" className={styles.btnGhost} data-hover>
              LinkedIn ↗
            </a>
          </div>
          <div className={styles.socials}>
            <a href="https://github.com/Shakila46" target="_blank" rel="noopener noreferrer" className={styles.soc} data-hover aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg>
            </a>
            <a href="https://linkedin.com/in/shakila-praween" target="_blank" rel="noopener noreferrer" className={styles.soc} data-hover aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://mail.google.com/mail/?view=cm&to=shakilapraween46@gmail.com" target="_blank" rel="noopener noreferrer" className={styles.soc} data-hover aria-label="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
            </a>
          </div>
        </div>

        {/* COL 3 — STATS */}
        <div className={styles.statsCol}>
          <div className={styles.statGrid}>
            {[
              { n:'10+', l:'Projects\nCompleted' },
              { n:'2+',  l:'Years of\nExperience' },
              { n:'5★',  l:'Client\nRating' },
              { n:'∞',   l:'Lines of\nCode' },
            ].map(s => (
              <div key={s.l} className={styles.statItem}>
                <span className={styles.statN}>{s.n}</span>
                <span className={styles.statL}>{s.l}</span>
              </div>
            ))}
          </div>
          <div className={styles.techStack}>
            {['Flutter','React','Next.js','Firebase','AI','TypeScript'].map(t => (
              <span key={t} className={styles.techChip}>{t}</span>
            ))}
          </div>
        </div>

      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>scroll</span>
      </div>
    </section>
  )
}
