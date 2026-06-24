"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

// Default words fallback
const DEFAULT_WORDS = ["Praween"];

export default function Hero() {
  const [display, setDisplay] = useState("");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [aboutData, setAboutData] = useState<any>(null);
  
  const wi = useRef(0);
  const ci = useRef(0);
  const deleting = useRef(false);
  const wordsRef = useRef<string[]>(DEFAULT_WORDS);

  useEffect(() => {
    fetch("/api/about")
      .then(res => res.json())
      .then(data => {
        setAboutData(data);
        if (data.typingWords && data.typingWords.length > 0) {
          wordsRef.current = data.typingWords;
          setDisplay(data.typingWords[0]);
          ci.current = data.typingWords[0].length;
        }
      })
      .catch(err => console.error("Failed to load about data", err));
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function type() {
      const words = wordsRef.current;
      const word = words[wi.current];
      
      if (!word) {
        timeout = setTimeout(type, 1800);
        return;
      }

      if (!deleting.current) {
        setDisplay(word.slice(0, ci.current + 1));
        ci.current++;
        if (ci.current === word.length) {
          deleting.current = true;
          timeout = setTimeout(type, 1800);
          return;
        }
      } else {
        setDisplay(word.slice(0, ci.current - 1));
        ci.current--;
        if (ci.current === 0) {
          deleting.current = false;
          wi.current = (wi.current + 1) % words.length;
        }
      }
      timeout = setTimeout(type, deleting.current ? 60 : 100);
    }
    
    // Start typing animation after a small delay
    timeout = setTimeout(type, 1200);
    return () => clearTimeout(timeout);
  }, [aboutData]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const y = (clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  if (!aboutData) {
    // Optional: Render a skeleton or nothing while loading
    return <section className={styles.hero} id="about"></section>;
  }

  return (
    <section
      className={styles.hero}
      id="about"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.inner}>
        {/* LEFT */}
        <div className={styles.left}>
          
          <h1 className={styles.h1}>
            {aboutData.name}
            <br />
            <span className={styles.accent}>{display}</span>
          </h1>

          {/* Role pills */}
          <div className={styles.roles}>
            {aboutData.roles.map((role: any, index: number) => (
               <span key={index} className={`${styles.role} ${styles[role.className] || ''}`}>{role.text}</span>
            ))}
          </div>

          <p className={styles.desc} dangerouslySetInnerHTML={{ __html: aboutData.description }}>
          </p>
          <div className={styles.btns}>
            <a
              className={styles.btnP}
              href={aboutData.cvLink}
              download={`${aboutData.name}_CV.pdf`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 15V3m0 12-4-4m4 4 4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
              </svg>
              Download CV
            </a>
            <a className={styles.btnO} href="#projects">
              View Projects
            </a>
          </div>
        </div>

        {/* RIGHT — photo */}
        <div className={styles.right}>
          <div
            className={styles.photoWrap}
            style={{
              transform: `translate3d(${coords.x * 12}px, ${coords.y * 12}px, 0) rotateX(${coords.y * -8}deg) rotateY(${coords.x * 8}deg)`,
              transformStyle: "preserve-3d",
              transition: "transform 0.25s ease-out"
            }}
          >
            <div className={styles.ring}>
              <div className={styles.photoInner}>
                <Image
                  src={aboutData.avatar}
                  alt={aboutData.name}
                  fill
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Float tags */}
            {aboutData.floatingTags.map((tag: any, index: number) => {
               // Map index to fixed positions and classes from CSS
               let posStyles = {};
               let animClass = styles.ft1;
               switch(index % 5) {
                  case 0:
                     posStyles = { top: "10%", right: "-4%", zIndex: 10, transform: `translate3d(${coords.x * -16}px, ${coords.y * -16}px, 20px)` };
                     animClass = styles.ft1;
                     break;
                  case 1:
                     posStyles = { bottom: "15%", left: "-3%", zIndex: 10, transform: `translate3d(${coords.x * 24}px, ${coords.y * 24}px, -10px)` };
                     animClass = styles.ft2;
                     break;
                  case 2:
                     posStyles = { top: "50%", right: "-15%", zIndex: 10, transform: `translate3d(${coords.x * -24}px, ${coords.y * -24}px, 30px)` };
                     animClass = styles.ft3;
                     break;
                  case 3:
                     posStyles = { top: "-5%", left: "5%", zIndex: 10, transform: `translate3d(${coords.x * 14}px, ${coords.y * 14}px, -5px)` };
                     animClass = styles.ft4;
                     break;
                  case 4:
                     posStyles = { top: "110%", left: "50%", zIndex: 10, transform: `translate3d(${coords.x * -32}px, ${coords.y * -32}px, 45px)` };
                     animClass = styles.ft5;
                     break;
               }

               return (
                <div
                  key={index}
                  className={styles.ftagWrapper}
                  style={{
                    position: "absolute",
                    transition: "transform 0.25s ease-out",
                    ...posStyles
                  }}
                >
                  <div className={`${styles.ftag} ${animClass}`}>
                    <span className={styles.fdot} style={{ background: tag.color }} />
                    {tag.text}
                  </div>
                </div>
               );
            })}
            
          </div>
        </div>
      </div>
    </section>
  );
}
