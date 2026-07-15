"use client";
import { useEffect, useRef } from "react";
import styles from "./screensaver.module.scss";

export default function Screensaver({ onWake }) {
  const logoRef = useRef(null);
  const posRef = useRef({ x: 100, y: 100 });
  const velRef = useRef({ x: 2.5, y: 2 });
  const colorIdx = useRef(0);
  const animRef = useRef(null);

  const COLORS = ["#ff0080", "#00ffff", "#ffff00", "#00ff00", "#ff6600", "#ffffff", "#8000ff"];
  const logoW = 180, logoH = 60;

  useEffect(() => {
    const animate = () => {
      const maxX = window.innerWidth - logoW;
      const maxY = window.innerHeight - logoH;

      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;

      if (posRef.current.x <= 0 || posRef.current.x >= maxX) {
        velRef.current.x = -velRef.current.x;
        posRef.current.x = Math.max(0, Math.min(posRef.current.x, maxX));
        colorIdx.current = (colorIdx.current + 1) % COLORS.length;
        if (logoRef.current) logoRef.current.style.color = COLORS[colorIdx.current];
      }
      if (posRef.current.y <= 0 || posRef.current.y >= maxY) {
        velRef.current.y = -velRef.current.y;
        posRef.current.y = Math.max(0, Math.min(posRef.current.y, maxY));
        colorIdx.current = (colorIdx.current + 1) % COLORS.length;
        if (logoRef.current) logoRef.current.style.color = COLORS[colorIdx.current];
      }

      if (logoRef.current) {
        logoRef.current.style.left = posRef.current.x + "px";
        logoRef.current.style.top = posRef.current.y + "px";
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className={styles.screen} onClick={onWake} onMouseMove={onWake}>
      <div className={styles.hint}>Click or move mouse to wake</div>
      <div ref={logoRef} className={styles.logo} style={{ color: "#ffffff" }}>
        <div className={styles.logoFlag}>
          <div className={styles.flagRed} />
          <div className={styles.flagGreen} />
          <div className={styles.flagBlue} />
          <div className={styles.flagYellow} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.win}>Windows</span>
          <span className={styles.n95}>95</span>
        </div>
      </div>
    </div>
  );
}