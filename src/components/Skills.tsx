'use client'
import { useEffect, useRef } from 'react'
import styles from './Skills.module.css'

const stacks = [
  {
    label: 'Mobile', icon: '📱',
    color: '#44D9E8',
    items: [
      { name: 'Flutter', level: 92 },
      { name: 'Dart', level: 88 },
      { name: 'React Native', level: 78 },
      { name: 'Firebase', level: 85 },
    ],
  },
  {
    label: 'Frontend', icon: '🖥',
    color: '#7B68EE',
    items: [
      { name: 'Next.js', level: 87 },
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 80 },
      { name: 'Tailwind', level: 85 },
    ],
  },
  {
    label: 'Backend', icon: '⚙️',
    color: '#FF6B9D',
    items: [
      { name: 'Node.js', level: 75 },
      { name: 'REST API', level: 88 },
      { name: 'GraphQL', level: 65 },
      { name: 'Supabase', level: 72 },
    ],
  },
  {
    label: 'AI & Tools', icon: '🤖',
    color: '#39D98A',
    items: [
      { name: 'AI Integration', level: 80 },
      { name: 'Git', level: 92 },
      { name: 'Docker', level: 60 },
      { name: 'CI/CD', level: 65 },
    ],
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section className={styles.section} id="skills" ref={sectionRef}>
      <div className={styles.container}>
        <div className={`${styles.header} reveal`}>
          <p className={styles.num}>02. skills</p>
          <h2 className={styles.title}>Tech Arsenal</h2>
        </div>

        <div className={styles.grid}>
          {stacks.map((stack, si) => (
            <div
              key={stack.label}
              className={`${styles.card} reveal`}
              style={{ animationDelay: `${si * 0.1}s`, '--accent-color': stack.color } as React.CSSProperties}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{stack.icon}</span>
                <h3 className={styles.cardLabel}>{stack.label}</h3>
              </div>
              <div className={styles.bars}>
                {stack.items.map((item, ii) => (
                  <div key={item.name} className={styles.barRow} style={{ '--delay': `${si * 0.15 + ii * 0.07}s` } as React.CSSProperties}>
                    <div className={styles.barMeta}>
                      <span className={styles.barName}>{item.name}</span>
                      <span className={styles.barPct}>{item.level}%</span>
                    </div>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ '--w': `${item.level}%`, '--color': stack.color } as React.CSSProperties} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
