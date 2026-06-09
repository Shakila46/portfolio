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
  return (
    <section className={styles.section} id="skills">
      <p className={styles.label}>Capabilities</p>
      <h2 className={styles.title}>Technical Skills</h2>
      <p className={styles.sub}>What I bring to the table</p>
      <div className={styles.grid}>
        {SKILLS.map((s) => (
          <div key={s.cat} className={styles.card}>
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
