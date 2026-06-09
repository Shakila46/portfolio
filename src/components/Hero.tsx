"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";

const WORDS = ["Praween", "a Developer", "a Builder", "a Creator"];

export default function Hero() {
  const [display, setDisplay] = useState("Praween");
  const wi = useRef(0);
  const ci = useRef(7);
  const deleting = useRef(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function type() {
      const word = WORDS[wi.current];
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
          wi.current = (wi.current + 1) % WORDS.length;
        }
      }
      timeout = setTimeout(type, deleting.current ? 60 : 100);
    }
    timeout = setTimeout(type, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className={styles.hero} id="about">
      <div className={styles.inner}>
        {/* LEFT */}
        <div className={styles.left}>
          
          <h1 className={styles.h1}>
            Shakila
            <br />
            <span className={styles.accent}>{display}</span>
          </h1>

          {/* Role pills */}
          <div className={styles.roles}>
            <span className={`${styles.role} ${styles.roleFs}`}>⚡ Full-Stack Developer</span>
            <span className={`${styles.role} ${styles.roleFe}`}>🎨 Frontend Developer</span>
            <span className={`${styles.role} ${styles.roleBe}`}>⚙️ Backend Developer</span>
            <span className={`${styles.role} ${styles.roleMob}`}>📱 Mobile Developer</span>
            <span className={`${styles.role} ${styles.roleJava}`}>☕ Java Developer</span>
          </div>

          <p className={styles.desc}>
            Software Engineering undergraduate at{" "}
            <strong>NSBM Green University</strong>. Building fullstack &amp;
            mobile applications with{" "}
            <strong>React, Next.js, Flutter</strong> and{" "}
            <strong>Java&nbsp;EE</strong>. Passionate about clean, scalable code.
          </p>
          <div className={styles.btns}>
            <a
              className={styles.btnP}
              href="/cv.pdf"
              download="Shakila_Praween_CV.pdf"
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
          <div className={styles.photoWrap}>
            <div className={styles.ring}>
              <div className={styles.photoInner}>
                {/* Replace /photo.jpg with your actual photo path in /public */}
                <Image
                  src="/avatar.jpg"
                  alt="Shakila Praween"
                  fill
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                
              </div>
            </div>
            <div className={`${styles.ftag} ${styles.ft1}`}>
              <span className={styles.fdot} style={{ background: "#7b6fff" }} />
              React &amp; Next.js
            </div>
            <div className={`${styles.ftag} ${styles.ft2}`}>
              <span className={styles.fdot} style={{ background: "#00e5a0" }} />
              Flutter Dev
            </div>
            <div className={`${styles.ftag} ${styles.ft3}`}>
              <span className={styles.fdot} style={{ background: "#fb923c" }} />
              Java &amp; Spring Boot
            </div>
            <div className={`${styles.ftag} ${styles.ft4}`}>
              <span className={styles.fdot} style={{ background: "#ff6b9d" }} />
              Figma &amp; UI Design
            </div>
            <div className={`${styles.ftag} ${styles.ft5}`}>
              <span className={styles.fdot} style={{ background: "#ff6b9d" }} />
              Tech Enthusiast
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
