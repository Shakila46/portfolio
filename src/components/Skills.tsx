"use client";
import styles from "./Skills.module.css";

const SKILLS = [
  { cat: "Frontend", tags: ["React.js", "Next.js", "HTML5", "CSS3", "TailwindCSS", "UI/UX"] },
  { cat: "Mobile", tags: ["Flutter", "Dart", "BLoC", "Provider", "iOS & Android"] },
  { cat: "Backend", tags: ["Java EE", "Spring Boot", "Node.js", ".NET C#", "PHP", "Express.js"] },
  { cat: "Databases & Tools", tags: ["MongoDB", "Firebase", "SQL Server", "Git", "Figma", "Streamlit"] },
  { cat: "Languages", tags: ["Java", "Python", "JavaScript", "Dart", "SQL"] },
  { cat: "Practices", tags: ["REST API", "Agile/Scrum", "CI/CD", "OOP", "Manual Testing"] },
];

export default function Skills() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className={`${styles.section} reveal`} id="skills">
      <p className={styles.label}>Capabilities</p>
      <h2 className={styles.title}>Technical Skills</h2>
      <p className={styles.sub}>What I bring to the table</p>
      <div className={`${styles.grid} reveal-stagger`}>
        {SKILLS.map((s) => (
          <div key={s.cat} className={styles.card} onMouseMove={handleMouseMove}>
            <div className={styles.cat}>{s.cat}</div>
            <div className={styles.tags}>
              {s.tags.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
