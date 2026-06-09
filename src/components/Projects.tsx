import styles from "./Projects.module.css";

const PROJECTS = [
  {
    icon: "🌱", title: "GoviMaga", gh: "https://github.com/Shakila46/GoviMaga-Mobile-App-Flutter.git",
    figma: "https://www.figma.com/design/4C435S82PK6qgJ9EnBFAbD/GoviMaga-App-UI?node-id=0-1",
    desc: "Cross-platform Flutter app for Sri Lankan farmers with real-time GPS weather, FCM push notifications, and 60fps performance on low-end devices.",
    stack: ["Flutter", "Dart", "Firebase", "BLoC", "REST API"],
  },
  {
    icon: "🚚", title: "Bidzy", gh: "https://github.com/Shakila46/Bidzy.git",
    figma: "https://www.figma.com/design/3yez3sLhEi4WFjQq35wBcE/BidzyUI?node-id=411-2516",
    desc: "Real-time logistics bidding platform. Live bid updates via WebSockets. .NET C# REST APIs with Next.js SSR frontend.",
    stack: ["Next.js", ".NET C#", "WebSockets", "TailwindCSS"],
  },
  {
    icon: "☕", title: "LatteLane", gh: "https://github.com/Shakila46/lattelane.git",
    figma: "https://www.figma.com/design/xFo7vpLCLd4jELmtkcwAWa/LatteLane?node-id=0-1",
    desc: "Full-stack café web app — product catalogue, menu browsing, order management. PHP REST APIs with accessible React UI.",
    stack: ["React.js", "Next.js", "PHP", "TailwindCSS"],
  },
  {
    icon: "🛒", title: "HyperPOS", gh: "https://github.com/Shakila46/HyperPOS-Frontend-.git",
    figma: null,
    desc: "Pixel-perfect POS frontend from Figma to code. Spring Boot backend integration for product and inventory management.",
    stack: ["React.js", "Next.js", "Spring Boot", "Figma"],
  },
  {
    icon: "🤖", title: "AI Assignment Helper", gh: "https://github.com/Shakila46/MY_Assignment_Ai.git",
    figma: null,
    desc: "Lightweight AI tool using Python, Streamlit and Groq API for context-aware structured academic content generation.",
    stack: ["Python", "Streamlit", "Groq API"],
  },
  {
    icon: "⚙️", title: "CI/CD Pipeline", gh: "https://github.com/Shakila46/github-actions-learning.git",
    figma: null,
    desc: "Automated GitHub Actions workflows for build, test, deployment. YAML-defined quality checks on every push and pull request.",
    stack: ["GitHub Actions", "YAML", "DevOps"],
  },
];

const DESIGNS = [
  {
    title: "GoviMaga App UI",
    figma: "https://www.figma.com/design/4C435S82PK6qgJ9EnBFAbD/GoviMaga-App-UI?node-id=0-1",
    thumb: "https://www.figma.com/file/4C435S82PK6qgJ9EnBFAbD/thumbnail?node-id=0-1&in-better-link-exp=true",
    desc: "Mobile UI design for the GoviMaga agricultural app — screens for weather, crop advisory, and farmer dashboard.",
    tags: ["Mobile UI", "Flutter", "Figma"],
    color: "#00e5a0",
  },
  {
    title: "HCI Redesign",
    figma: "https://www.figma.com/design/bC0oMk4Zn4nwUd4RTEG6Ij/HCI-redesign?node-id=0-1",
    thumb: "https://www.figma.com/file/bC0oMk4Zn4nwUd4RTEG6Ij/thumbnail?node-id=0-1&in-better-link-exp=true",
    desc: "Human-Computer Interaction redesign project — focused on usability, accessibility, and modern design principles.",
    tags: ["HCI", "UX Research", "Redesign"],
    color: "#7b6fff",
  },
  {
    title: "IslandWise",
    figma: "https://www.figma.com/design/bHlffstDCcuVra5B0SOdcK/IslandWise?node-id=598-1044",
    thumb: "https://www.figma.com/file/bHlffstDCcuVra5B0SOdcK/thumbnail?node-id=598-1044&in-better-link-exp=true",
    desc: "Travel & tourism platform UI for Sri Lanka — destination discovery, itinerary planning, and local guides.",
    tags: ["Web UI", "Tourism", "Figma"],
    color: "#38bdf8",
  },
  {
    title: "CeyGoTest",
    figma: "https://www.figma.com/design/v8I4UcNyqJMFxa1dN5RZYH/CeyGoTest?node-id=0-1",
    thumb: "https://www.figma.com/file/v8I4UcNyqJMFxa1dN5RZYH/thumbnail?node-id=0-1&in-better-link-exp=true",
    desc: "UI design for a testing and QA platform — test management, reporting, and team collaboration flows.",
    tags: ["Dashboard UI", "QA Tool", "Figma"],
    color: "#ff6b9d",
  },
  {
    title: "LatteLane",
    figma: "https://www.figma.com/design/xFo7vpLCLd4jELmtkcwAWa/LatteLane?node-id=0-1",
    thumb: "https://www.figma.com/file/xFo7vpLCLd4jELmtkcwAWa/thumbnail?node-id=0-1&in-better-link-exp=true",
    desc: "End-to-end café web app design — wireframes to high-fidelity prototypes with a consistent design system.",
    tags: ["Web UI", "Cafe App", "Design System"],
    color: "#fb923c",
  },
  {
    title: "BP — ERP Group 15",
    figma: "https://www.figma.com/design/REIchLjAAjONt7typlN1rw/BP---ERP-Group-15?node-id=0-1",
    thumb: "https://www.figma.com/file/REIchLjAAjONt7typlN1rw/thumbnail?node-id=0-1&in-better-link-exp=true",
    desc: "Enterprise Resource Planning system UI — modules for inventory, HR, finance, and reporting dashboards.",
    tags: ["ERP", "Enterprise UI", "Figma"],
    color: "#a78bfa",
  },
  {
    title: "Bidzy UI",
    figma: "https://www.figma.com/design/3yez3sLhEi4WFjQq35wBcE/BidzyUI?node-id=411-2516",
    thumb: "https://www.figma.com/file/3yez3sLhEi4WFjQq35wBcE/thumbnail?node-id=411-2516&in-better-link-exp=true",
    desc: "Logistics bidding platform UI — real-time bid dashboard, shipper and carrier flows, competitive bidding interface.",
    tags: ["Web UI", "Logistics", "Real-time"],
    color: "#00e5a0",
  },
];

export default function Projects() {
  return (
    <>
      {/* DEV PROJECTS */}
      <section className={styles.section} id="projects">
        <p className={styles.label}>Work</p>
        <h2 className={styles.title}>Projects</h2>
        <p className={styles.sub}>Things I&apos;ve built from scratch</p>
        <div className={styles.grid}>
          {PROJECTS.map((p) => (
            <div key={p.title} className={styles.card}>
              <div className={styles.head}>
                <div className={styles.ico}>{p.icon}</div>
                <div className={styles.linkRow}>
                  {p.figma && (
                    <a href={p.figma} target="_blank" rel="noreferrer" className={styles.figmaBtn}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z"/><path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z"/><path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z"/><path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z"/><path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z"/></svg>
                      Figma
                    </a>
                  )}
                  <a href={p.gh} target="_blank" rel="noreferrer" className={styles.gh}>
                    GitHub ↗
                  </a>
                </div>
              </div>
              <div className={styles.ptitle}>{p.title}</div>
              <p className={styles.desc}>{p.desc}</p>
              <div className={styles.stack}>
                {p.stack.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FIGMA DESIGNS */}
      <section className={styles.section} id="designs">
        <p className={styles.label}>Design</p>
        <h2 className={styles.title}>UI / UX Designs</h2>
        <p className={styles.sub}>Wireframes to high-fidelity prototypes — crafted in Figma</p>
        <div className={styles.designGrid}>
          {DESIGNS.map((d) => (
            <a
              key={d.title}
              href={d.figma}
              target="_blank"
              rel="noreferrer"
              className={styles.designCard}
            >
              {/* Preview thumbnail placeholder */}
              <div className={styles.thumb} style={{ "--accent-color": d.color } as React.CSSProperties}>
                <div className={styles.thumbInner}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={d.color} opacity="0.9">
                    <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z"/>
                    <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z"/>
                    <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z"/>
                    <path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z"/>
                    <path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z"/>
                  </svg>
                  <span className={styles.thumbLabel}>Open in Figma ↗</span>
                </div>
                <div className={styles.thumbGlow} style={{ background: d.color }} />
              </div>
              <div className={styles.designInfo}>
                <div className={styles.designTitle}>{d.title}</div>
                <p className={styles.designDesc}>{d.desc}</p>
                <div className={styles.stack}>
                  {d.tags.map((t) => (
                    <span key={t} className={styles.designTag}>{t}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
