"use client";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when clicking a link
  const handleLink = () => setOpen(false);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.logo}>
        shakila<em>.</em>
      </div>

      {/* Desktop links */}
      <div className={styles.links}>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#designs">UI/UX</a>
        <a href="#contact">Contact</a>
      </div>

      {/* Hamburger button */}
      <button
        type="button"
        className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open ? "true" : "false"}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu overlay */}
      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}>
        <a href="#about" onClick={handleLink}>About</a>
        <a href="#skills" onClick={handleLink}>Skills</a>
        <a href="#projects" onClick={handleLink}>Projects</a>
        <a href="#designs" onClick={handleLink}>UI/UX</a>
        <a href="#contact" onClick={handleLink}>Contact</a>
      </div>

      {/* Backdrop */}
      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} />
      )}
    </nav>
  );
}
