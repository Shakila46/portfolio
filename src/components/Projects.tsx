'use client'
import { useEffect, useRef } from 'react'
import styles from './Projects.module.css'

const projects = [
  { num:'01', title:'Cross-Platform Mobile App', desc:'Flutter app with BLoC state management, Firebase backend, real-time sync and offline-first architecture.', tags:['Flutter','Dart','Firebase','BLoC'], color:'#0FF4C6', github:'https://github.com/Shakila46', year:'2024' },
  { num:'02', title:'AI-Powered Web Solution', desc:'Next.js application with AI chat integration, streaming responses, TypeScript, and modern design system.', tags:['Next.js','TypeScript','AI','Tailwind'], color:'#6C63FF', github:'https://github.com/Shakila46', year:'2024' },
  { num:'03', title:'React Native App', desc:'Cross-platform iOS & Android app with shared codebase, native performance, and Expo managed workflow.', tags:['React Native','Expo','Redux','JS'], color:'#FF4D8F', github:'https://github.com/Shakila46', year:'2023' },
  { num:'04', title:'Full Stack Platform', desc:'End-to-end web platform with React frontend, Node.js API, PostgreSQL database and JWT auth system.', tags:['React','Node.js','PostgreSQL','REST'], color:'#FFB347', github:'https://github.com/Shakila46', year:'2023' },
]

export default function Projects() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible') }), {threshold:0.1})
    ref.current?.querySelectorAll('.reveal,.reveal-left').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className={styles.section} id="projects" ref={ref}>
      <div className={styles.bgNum} aria-hidden>03</div>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <p className={styles.num}>03. work</p>
          <h2 className={styles.title}>Featured Projects</h2>
        </div>
        <div className={styles.list}>
          {projects.map((p, i) => (
            <div key={p.num} className={`${styles.item} reveal`}
              style={{'--c':p.color, transitionDelay:`${i*0.1}s`} as React.CSSProperties}>
              <div className={styles.itemLeft}>
                <span className={styles.itemNum}>{p.num}</span>
                <div className={styles.itemBody}>
                  <span className={styles.itemYear}>{p.year}</span>
                  <h3 className={styles.itemTitle}>{p.title}</h3>
                  <p className={styles.itemDesc}>{p.desc}</p>
                  <div className={styles.tags}>
                    {p.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                  </div>
                </div>
              </div>
              <a href={p.github} target="_blank" rel="noopener noreferrer" className={styles.itemLink} data-hover aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"/>
                </svg>
              </a>
              <div className={styles.itemLine}/>
            </div>
          ))}
        </div>
        <div className={`${styles.more} reveal`}>
          <a href="https://github.com/Shakila46" target="_blank" rel="noopener noreferrer" className={styles.moreBtn} data-hover>
            View all on GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
          </a>
        </div>
      </div>
    </section>
  )
}
