'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './Hero.module.css'
import Image from 'next/image'

const roles = ['Flutter Developer', 'React Engineer', 'Next.js Builder', 'AI Integrator', 'Full Stack Dev']

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = roles[roleIdx]
    let timeout: ReturnType<typeof setTimeout>
    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIdx((i) => (i + 1) % roles.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIdx])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`
  }

  const onMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <section className={styles.hero} id="about">
      <div className={styles.left}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Available for work
        </div>
        <h1 className={styles.name}>
          Shakila<br />
          <span className="glow-text">Praween.</span>
        </h1>
        <div className={styles.roleWrap}>
          <span className={styles.rolePrefix}>I build </span>
          <span className={styles.role}>{displayed}<span className={styles.cursor}>|</span></span>
        </div>
        <p className={styles.bio}>
          Sri Lanka-based full-stack developer specializing in Flutter,
          React & Next.js. I craft pixel-perfect cross-platform apps
          with a deep focus on performance and clean architecture.
        </p>
        <div className={styles.actions}>
          <a href="#projects" className={styles.btnPrimary} data-hover>
            <span>View Work</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/shakila-praween" target="_blank" rel="noopener noreferrer"
            className={styles.btnSecondary} data-hover>
            LinkedIn ↗
          </a>
        </div>
        <div className={styles.socials}>
          <a href="https://github.com/Shakila46" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} data-hover>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
            </svg>
          </a>
          <a href="https://linkedin.com/in/shakila-praween" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} data-hover>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a href="https://mail.google.com/mail/?view=cm&to=shakilapraween46@gmail.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} data-hover>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
            </svg>
          </a>
        </div>
      </div>

      <div className={styles.right}>
        {/* Floating photo — completely outside card */}
        <div className={styles.floatingPhoto}>
          <div className={styles.floatingRing} />
          <div className={styles.floatingGlow} />
          <div className={styles.floatingImg}>
            <Image
              src="/avatar.jpg"
              alt="Shakila Praween"
              width={140}
              height={140}
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
                width: '100%',
                height: '100%',
              }}
              priority
            />
          </div>
          <div className={styles.floatingLabel}>@shakila46</div>
        </div>

        <div className={styles.orbitWrap}>
          <div className={styles.orbit1} />
          <div className={styles.orbit2} />

          {/* Card with cartoon inside */}
          <div
            ref={cardRef}
            className={styles.card}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            data-hover
          >
            <div className={styles.cardGlow} />
            <div className={styles.cardInner}>

              {/* SVG Cartoon Animation */}
              <div className={styles.cartoonWrap}>
                <svg className={styles.cartoon} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  {/* Desk */}
                  <rect x="20" y="155" width="160" height="8" rx="4" fill="rgba(123,104,238,0.2)" stroke="rgba(123,104,238,0.4)" strokeWidth="0.5" />
                  {/* Monitor body */}
                  <rect x="45" y="70" width="110" height="78" rx="8" fill="rgba(8,12,20,0.9)" stroke="rgba(123,104,238,0.5)" strokeWidth="1.2" />
                  {/* Screen */}
                  <rect x="53" y="78" width="94" height="58" rx="4" fill="rgba(0,217,255,0.05)" stroke="rgba(0,217,255,0.15)" strokeWidth="0.5" />
                  {/* Code lines */}
                  <rect x="62" y="88" width="36" height="2.5" rx="1.2" fill="#7B68EE" opacity="0.85" />
                  <rect x="62" y="95" width="55" height="2.5" rx="1.2" fill="#00D9FF" opacity="0.8" />
                  <rect x="68" y="102" width="28" height="2.5" rx="1.2" fill="#FF6B9D" opacity="0.75" />
                  <rect x="68" y="109" width="42" height="2.5" rx="1.2" fill="#39D98A" opacity="0.8" />
                  <rect x="62" y="116" width="50" height="2.5" rx="1.2" fill="#7B68EE" opacity="0.6" />
                  <rect x="68" y="123" width="32" height="2.5" rx="1.2" fill="#00D9FF" opacity="0.7" />
                  {/* Blinking cursor */}
                  <rect x="62" y="130" width="7" height="2.5" rx="1" fill="#00D9FF">
                    <animate attributeName="opacity" values="1;0;1" dur="0.9s" repeatCount="indefinite" />
                  </rect>
                  {/* Monitor stand */}
                  <rect x="93" y="148" width="14" height="8" rx="2" fill="rgba(123,104,238,0.25)" stroke="rgba(123,104,238,0.35)" strokeWidth="0.8" />
                  <rect x="82" y="155" width="36" height="5" rx="2.5" fill="rgba(123,104,238,0.2)" stroke="rgba(123,104,238,0.3)" strokeWidth="0.8" />
                  {/* Keyboard */}
                  <rect x="55" y="162" width="90" height="12" rx="3" fill="rgba(123,104,238,0.08)" stroke="rgba(123,104,238,0.25)" strokeWidth="0.8" />
                  {Array.from({ length: 9 }).map((_, i) => (
                    <rect key={i} x={60 + i * 9.5} y="165" width="6.5" height="5" rx="1.5"
                      fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
                  ))}
                  {/* Floating symbols */}
                  <text x="148" y="90" fontSize="11" fill="#00D9FF" fontFamily="monospace" fontWeight="500">
                    {'</>'}
                    <animate attributeName="y" values="90;84;90" dur="2.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="2.8s" repeatCount="indefinite" />
                  </text>
                  <text x="18" y="108" fontSize="10" fill="#7B68EE" fontFamily="monospace">
                    {'{ }'}
                    <animate attributeName="y" values="108;102;108" dur="3.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" repeatCount="indefinite" />
                  </text>
                  <text x="155" y="130" fontSize="9" fill="#39D98A" fontFamily="monospace">
                    {'()=>'}
                    <animate attributeName="y" values="130;124;130" dur="2.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite" />
                  </text>
                  <text x="24" y="145" fontSize="9" fill="#FF6B9D" fontFamily="monospace">
                    {'npm'}
                    <animate attributeName="y" values="145;140;145" dur="3.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.85;0.5" dur="3.5s" repeatCount="indefinite" />
                  </text>
                  {/* Coffee cup */}
                  <rect x="155" y="148" width="18" height="14" rx="3" fill="rgba(255,107,157,0.1)" stroke="rgba(255,107,157,0.3)" strokeWidth="0.8" />
                  <path d="M173 152 Q179 152 179 156 Q179 160 173 160" fill="none" stroke="rgba(255,107,157,0.3)" strokeWidth="0.8" />
                  <rect x="158" y="150" width="12" height="6" rx="1" fill="rgba(255,107,157,0.08)" />
                  <path d="M161 147 Q162 144 161 141" fill="none" stroke="rgba(255,107,157,0.3)" strokeWidth="0.8" strokeLinecap="round">
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
                  </path>
                  <path d="M165 146 Q166 143 165 140" fill="none" stroke="rgba(255,107,157,0.3)" strokeWidth="0.8" strokeLinecap="round">
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.8s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>

              <div className={styles.cardName}>Shakila Praween</div>
              <div className={styles.cardTitle}>Full Stack Developer</div>
              <div className={styles.cardDivider} />
              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>10+</span>
                  <span className={styles.statLbl}>Projects</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>2+</span>
                  <span className={styles.statLbl}>Years</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>∞</span>
                  <span className={styles.statLbl}>Passion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orbit tags */}
          {[
            { label: 'Flutter', color: '#44D9E8', angle: 0 },
            { label: 'Next.js', color: '#7B68EE', angle: 90 },
            { label: 'Firebase', color: '#FF6B9D', angle: 180 },
            { label: 'AI', color: '#39D98A', angle: 270 },
          ].map(tag => (
            <div key={tag.label} className={styles.orbitTag} style={{
              '--angle': `${tag.angle}deg`,
              '--color': tag.color,
            } as React.CSSProperties}>
              {tag.label}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.scrollLine} />
        <span className={styles.scrollText}>scroll down</span>
      </div>
    </section>
  )
}
