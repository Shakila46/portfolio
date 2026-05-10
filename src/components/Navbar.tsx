'use client'
import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const links = [
  { label: 'about', href: '#about' },
  { label: 'skills', href: '#skills' },
  { label: 'projects', href: '#projects' },
  { label: 'contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logo} data-hover>
        
        <span className={styles.logoText}></span>
        
      </a>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        {links.map((l, i) => (
          <li key={l.label} className={styles.li} style={{ animationDelay: `${i * 0.05}s` }}>
            <a href={l.href} className={styles.link} onClick={() => setOpen(false)} data-hover>
              <span className={styles.idx}>0{i+1}</span>{l.label}
            </a>
          </li>
        ))}
        <li>
          <a href="https://github.com/Shakila46" target="_blank" rel="noopener noreferrer"
            className={styles.cta} data-hover>
            GitHub
          </a>
        </li>
      </ul>

      <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="menu" data-hover>
        <span className={`${styles.b} ${open ? styles.b1o : ''}`} />
        <span className={`${styles.b} ${open ? styles.b2o : ''}`} />
        <span className={`${styles.b} ${open ? styles.b3o : ''}`} />
      </button>
    </nav>
  )
}
