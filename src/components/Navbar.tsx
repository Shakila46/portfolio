"use client";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLink = () => setOpen(false);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.logo}>
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Portfolio logo"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
          <path d="M19 2L36 19L19 36L2 19Z" stroke="url(#logoGrad)" strokeWidth="2" fill="none" />
          <path d="M14 14L9 19L14 24" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M24 14L29 19L24 24" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="19" cy="19" r="2" fill="url(#logoGrad)" />
        </svg>
      </div>

      {/* Desktop links */}
      <div className={styles.links}>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#designs">UI/UX</a>
        <a href="#contact">Contact</a>
      </div>

      {/* Right side: theme toggle + hamburger */}
      <div className={styles.rightControls}>
        {/* Theme toggle button */}
        <button
          className={styles.themeToggle}
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          <span className={styles.themeToggleTrack}>
            <span className={`${styles.themeToggleThumb} ${theme === "light" ? styles.themeToggleThumbLight : ""}`} />
          </span>
          {/* Moon icon */}
          <svg
            className={`${styles.themeIcon} ${theme === "dark" ? styles.themeIconVisible : styles.themeIconHidden}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          {/* Sun icon */}
          <svg
            className={`${styles.themeIcon} ${theme === "light" ? styles.themeIconVisible : styles.themeIconHidden}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>

        {/* Hamburger button */}
        <button
          className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ""}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}>
        <a href="#about" onClick={handleLink}>About</a>
        <a href="#skills" onClick={handleLink}>Skills</a>
        <a href="#projects" onClick={handleLink}>Projects</a>
        <a href="#designs" onClick={handleLink}>UI/UX</a>
        <a href="#contact" onClick={handleLink}>Contact</a>

        {/* Theme toggle in mobile menu too */}
        <button
          className={styles.mobileThemeBtn}
          onClick={() => { toggle(); handleLink(); }}
        >
          {theme === "dark" ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              Switch to Light Mode
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Switch to Dark Mode
            </>
          )}
        </button>
      </div>

      {/* Backdrop */}
      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} />
      )}
    </nav>
  );
}
