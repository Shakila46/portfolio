import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import CursorEffects from '@/components/CursorEffects'
import ParticleCanvas from '@/components/ParticleCanvas'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      <CursorEffects />
      <ParticleCanvas />
      <main className={styles.main}>
        <Navbar />
        <div className="section-wrap"><Hero /></div>
        <div className="section-wrap"><Skills /></div>
        <div className="section-wrap"><Projects /></div>
        <div className="section-wrap"><Contact /></div>
      </main>
    </>
  )
}
