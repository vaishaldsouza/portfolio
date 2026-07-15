"use client";
import { useState, useEffect } from "react";
import styles from "./login.module.scss";
import Image from "next/image";

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState("");

  const playStartupSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [
        { freq: 523, start: 0, dur: 0.15 },
        { freq: 659, start: 0.15, dur: 0.15 },
        { freq: 784, start: 0.3, dur: 0.15 },
        { freq: 1047, start: 0.45, dur: 0.3 },
        { freq: 784, start: 0.75, dur: 0.15 },
        { freq: 1047, start: 0.9, dur: 0.5 },
      ];
      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur + 0.05);
      });
    } catch (e) {}
  };

  const handleLogin = () => {
    if (password === "" || password.toLowerCase() === "prajwal" || password === "admin") {
      playStartupSound();
      setTimeout(() => onLogin(), 300);
    } else {
      setShake(true);
      setHint("Hint: just press OK or type your name 😄");
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.dialog} ${shake ? styles.shake : ""}`}>
        <div className={styles.titlebar}>
          <div className={styles.titleLeft}>
            <Image src="/windowsIcons/windows-small.svg" alt="Windows" width={16} height={16} />
            <span>Welcome to Windows</span>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.iconRow}>
            <div className={styles.userIcon}>👤</div>
            <div className={styles.userInfo}>
              <div className={styles.welcomeText}>Welcome!</div>
              <div className={styles.subText}>Type your password to begin, or just press OK.</div>
            </div>
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>User name:</label>
            <input className={styles.input} type="text" defaultValue="Prajwal" readOnly />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>Password:</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="(leave blank)"
            />
          </div>
          {hint && <div className={styles.hint}>{hint}</div>}
        </div>
        <div className={styles.footer}>
          <button className={styles.btn} onClick={handleLogin}>OK</button>
          <button className={styles.btn} onClick={handleLogin}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Login;