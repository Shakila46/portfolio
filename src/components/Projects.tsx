"use client";
import React, { useEffect, useState } from "react";
import styles from "./Projects.module.css";
import ProjectModal from "./ProjectModal";

interface Project {
  icon: string;
  title: string;
  gh: string;
  figma: string | null;
  desc: string;
  stack: string[];
  screenshots: string[];
}

interface Design {
  title: string;
  figma: string;
  thumb?: string;
  desc: string;
  tags: string[];
  color: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.authenticated === true))
      .catch(() => setIsAdmin(false));
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error loading projects:", err));

    fetch("/api/designs")
      .then((res) => res.json())
      .then((data) => setDesigns(data))
      .catch((err) => console.error("Error loading designs:", err));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, project: Project) => {
    // Don't open modal if clicking a link (GitHub/Figma buttons)
    if ((e.target as HTMLElement).closest("a")) return;
    setSelectedProject(project);
  };

  return (
    <>
      {/* DEV PROJECTS */}
      <section className={`${styles.section} reveal`} id="projects">
        <p className={styles.label}>Work</p>
        <h2 className={styles.title}>Projects</h2>
        <p className={styles.sub}>Things I&apos;ve built from scratch — click any card to explore</p>
        <div className={`${styles.grid} reveal-stagger`}>
          {projects.map((p) => (
            <div
              key={p.title}
              className={`${styles.card} ${styles.cardClickable}`}
              onMouseMove={handleMouseMove}
              onClick={(e) => handleCardClick(e, p)}
              role="button"
              tabIndex={0}
              aria-label={`View ${p.title} details`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelectedProject(p);
              }}
            >
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
              {/* Screenshots count badge - admin only */}
              {isAdmin && p.screenshots && p.screenshots.length > 0 && (
                <div className={styles.screenshotBadge}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {p.screenshots.length} screenshot{p.screenshots.length !== 1 ? "s" : ""}
                </div>
              )}
              {/* Click hint */}
              <div className={styles.clickHint}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                View details
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FIGMA DESIGNS */}
      <section className={`${styles.section} reveal`} id="designs">
        <p className={styles.label}>Design</p>
        <h2 className={styles.title}>UI / UX Designs</h2>
        <p className={styles.sub}>Wireframes to high-fidelity prototypes — crafted in Figma</p>
        <div className={`${styles.designGrid} reveal-stagger`}>
          {designs.map((d) => (
            <a
              key={d.title}
              href={d.figma}
              target="_blank"
              rel="noreferrer"
              className={styles.designCard}
              onMouseMove={handleMouseMove}
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

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
