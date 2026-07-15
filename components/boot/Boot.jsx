"use client";
import { useState, useEffect } from "react";
import styles from "./boot.module.scss";

const BOOT_LINES = [
  "Starting Windows 95...",
  "HIMEM is testing extended memory... done.",
  "Loading MS-DOS...",
  "Initializing device drivers...",
  "Loading SMARTDRV.EXE...",
  "WIN.COM is starting Windows 95...",
  "Loading system registry...",
  "Initializing Plug and Play devices...",
  "Loading network components...",
  "Checking disk integrity...",
  "Loading user profile for PRAJWAL...",
  "Starting graphical interface...",
];

export default function Boot({ onDone }) {
  const [lines, setLines] = useState([]);
  const [barWidth, setBarWidth] = useState(0);
  const [phase, setPhase] = useState("text"); // text → bar → done

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase("bar"), 300);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase !== "bar") return;
    let w = 0;
    const interval = setInterval(() => {
      w += 2;
      setBarWidth(w);
      if (w >= 100) {
        clearInterval(interval);
        setTimeout(() => onDone(), 400);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className={styles.screen}>
      {phase === "text" && (
        <div className={styles.textPhase}>
          <div className={styles.dosText}>
            {lines.map((line, i) => (
              <div key={i} className={styles.dosLine}>{line}</div>
            ))}
            <span className={styles.cursor}>_</span>
          </div>
        </div>
      )}
      {phase === "bar" && (
        <div className={styles.barPhase}>
          <div className={styles.win95logo}>
            <img
              src="/windows95-bg.png"
              alt="Windows 95"
              style={{ width: "20rem", imageRendering: "pixelated" }}
            />
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressLabel}>Loading Prajwal's Portfolio...</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{width: `${barWidth}%`}}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}