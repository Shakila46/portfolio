import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        shakila<em>.</em>
      </div>
      <div className={styles.links}>
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#projects">Projects</a>
        <a href="#designs">UI/UX</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}
