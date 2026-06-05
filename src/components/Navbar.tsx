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
  const [active, setActive] = useState('about')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logo} data-hover>
        <span className={styles.logoBracket}>[</span>Shakila Praween<span className={styles.logoBracket}>]</span>
      </a>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        {links.map((l, i) => (
          <li key={l.label}>
            <a href={l.href} className={`${styles.link} ${active===l.label ? styles.active : ''}`}
              onClick={() => { setOpen(false); setActive(l.label); }} data-hover>
              <span className={styles.num}>0{i+1}.</span>{l.label}
            </a>
          </li>
        ))}
        <li>
          <a href="https://github.com/Shakila46" target="_blank" rel="noopener noreferrer"
            className={styles.cta} data-hover>GitHub</a>
        </li>
      </ul>

      <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="menu" data-hover>
        <span className={`${styles.b} ${open ? styles.bo1 : ''}`}/>
        <span className={`${styles.b} ${open ? styles.bo2 : ''}`}/>
        <span className={`${styles.b} ${open ? styles.bo3 : ''}`}/>
      </button>
    </nav>
  )
}
