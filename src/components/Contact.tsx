'use client'
import { useEffect, useRef } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible') }), {threshold:0.1})
    ref.current?.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className={styles.section} id="contact" ref={ref}>
      <div className={styles.bgNum} aria-hidden>04</div>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <p className={styles.num}>04. contact</p>
          <h2 className={styles.title}>Let&apos;s Build<br/><span className="glow-text">Together.</span></h2>
          <p className={styles.sub}>Open to new opportunities, freelance projects,<br/>and interesting collaborations.</p>
          <a href="mailto:shakilapraween46@gmail.com" className={styles.emailBtn} data-hover>
            <span>shakilapraween46@gmail.com</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>

        <div className={styles.cards}>
          {[
            { name:'GitHub', handle:'@Shakila46', href:'https://github.com/Shakila46', desc:'Code & projects', color:'#6C63FF',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/></svg> },
            { name:'LinkedIn', handle:'shakila-praween', href:'https://linkedin.com/in/shakila-praween', desc:'Professional profile', color:'#0FF4C6',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
            { name:'Gmail', handle:'shakilapraween46', href:'https://mail.google.com/mail/?view=cm&to=shakilapraween46@gmail.com', desc:'Direct message', color:'#FF4D8F',
              icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg> },
          ].map((s, i) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
              className={`${styles.card} reveal`}
              style={{'--c':s.color, transitionDelay:`${i*0.1}s`} as React.CSSProperties}
              data-hover>
              <div className={styles.cardIcon} style={{color:s.color}}>{s.icon}</div>
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{s.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.cardArrow}><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </div>
              <div className={styles.cardHandle}>{s.handle}</div>
              <div className={styles.cardDesc}>{s.desc}</div>
            </a>
          ))}
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerL}>
          Built by <a href="https://github.com/Shakila46" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Shakila Praween</a> · Next.js + Vercel
        </span>
        <div className={styles.footerStatus}>
          <span className={styles.statusDot}/>
          Available for work
        </div>
      </footer>
    </section>
  )
}
