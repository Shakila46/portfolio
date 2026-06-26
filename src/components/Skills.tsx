"use client";
import { useRef, useEffect, useState } from "react";
import styles from "./Skills.module.css";

const SKILLS = [
  {
    cat: "Frontend",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    color: "#7b6fff",
    tags: ["React.js", "Next.js", "HTML5", "CSS3", "TailwindCSS", "UI/UX"],
  },
  {
    cat: "Mobile",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
      </svg>
    ),
    color: "#38bdf8",
    tags: ["Flutter", "Dart", "BLoC", "Provider", "iOS & Android"],
  },
  {
    cat: "Backend",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    color: "#ff6b9d",
    tags: ["Java EE", "Spring Boot", "Node.js", ".NET C#", "PHP", "Express.js"],
  },
  {
    cat: "Databases & Tools",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
    color: "#00e5a0",
    tags: ["MongoDB", "Firebase", "SQL Server", "Git", "Figma", "Streamlit"],
  },
  {
    cat: "Languages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />
      </svg>
    ),
    color: "#fb923c",
    tags: ["Java", "Python", "JavaScript", "Dart", "SQL"],
  },
  {
    cat: "Practices",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: "#a78bfa",
    tags: ["REST API", "Agile/Scrum", "CI/CD", "OOP", "Manual Testing"],
  },
];

function SkillCard({ s, index }: { s: (typeof SKILLS)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${visible ? styles.cardVisible : ""}`}
      style={{ "--card-color": s.color, "--delay": `${index * 0.08}s` } as React.CSSProperties}
      onMouseMove={handleMouseMove}
    >
      {/* Icon header */}
      <div className={styles.cardTop}>
        <div className={styles.iconWrap} style={{ color: s.color }}>
          {s.icon}
        </div>
        <div className={styles.catInfo}>
          <div className={styles.cat}>{s.cat}</div>
          <div className={styles.tagCount}>{s.tags.length} skills</div>
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider} style={{ background: `linear-gradient(90deg, ${s.color}55, transparent)` }} />

      {/* Tags */}
      <div className={styles.tags}>
        {s.tags.map((t, i) => (
          <span
            key={t}
            className={styles.tag}
            style={{ "--tag-delay": `${index * 0.08 + i * 0.04}s` } as React.CSSProperties}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section className={`${styles.section} reveal`} id="skills">
      <p className={styles.label}>Capabilities</p>
      <h2 className={styles.title}>Technical Skills</h2>
      <p className={styles.sub}>What I bring to the table</p>
      <div className={styles.grid}>
        {SKILLS.map((s, i) => (
          <SkillCard key={s.cat} s={s} index={i} />
        ))}
      </div>
    </section>
  );
}
