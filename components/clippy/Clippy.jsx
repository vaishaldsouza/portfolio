"use client";
import { useState, useEffect } from "react";
import styles from "./clippy.module.scss";

const TIPS = [
  "It looks like you're building a portfolio! Need help? 😄",
  "Did you know? You can drag any window around the screen!",
  "Try typing 'hack' in the Run dialog for a surprise 😈",
  "Tip: Double-click any desktop icon to open it!",
  "Have you checked out the Meme Vault yet? 🗿",
  "You can play Chess against the CPU! ♟️",
  "Try MS Paint — draw something cool! 🎨",
  "Shut Down from the Start Menu for a spooky surprise 💀",
  "Prajwal is available for hire! Check his Resume 👀",
  "It looks like you're visiting a portfolio. Want me to help you hire Prajwal? 😂",
  "Pro tip: Stay idle for 30 seconds to see the screensaver!",
  "Try the Python IDE — run real Python in your browser! 🐍",
];

const CLIPPY_FRAMES = ["📎", "🖇️"];

export default function Clippy() {
  const [visible, setVisible] = useState(false);
  const [tip, setTip] = useState("");
  const [frame, setFrame] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  // Show Clippy after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Show a new tip every 20 seconds
  useEffect(() => {
    if (!visible) return;
    setTip(TIPS[tipIndex % TIPS.length]);
    const interval = setInterval(() => {
      setTipIndex(prev => {
        const next = (prev + 1) % TIPS.length;
        setTip(TIPS[next]);
        return next;
      });
    }, 20000);
    return () => clearInterval(interval);
  }, [visible]);

  // Animate clippy
  useEffect(() => {
    const interval = setInterval(() => setFrame(f => (f + 1) % 2), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.container}>
      {!minimized && tip && (
        <div className={styles.bubble}>
          <button className={styles.closeBtn} onClick={() => setTip("")}>✕</button>
          <p className={styles.tipText}>{tip}</p>
          <div className={styles.bubbleActions}>
            <button className={styles.actionBtn} onClick={() => {
              setTipIndex(prev => (prev + 1) % TIPS.length);
              setTip(TIPS[(tipIndex + 1) % TIPS.length]);
            }}>Next Tip</button>
            <button className={styles.actionBtn} onClick={() => setTip("")}>Dismiss</button>
          </div>
        </div>
      )}
      <div className={styles.clippyBody} onClick={() => {
        if (!tip) setTip(TIPS[tipIndex % TIPS.length]);
        setMinimized(false);
      }}>
        <div className={styles.clippyIcon}>{CLIPPY_FRAMES[frame]}</div>
        <div className={styles.clippyLabel}>Clippy</div>
        <button
          className={styles.minimizeBtn}
          onClick={e => { e.stopPropagation(); setMinimized(m => !m); }}
        >
          {minimized ? "▲" : "▼"}
        </button>
      </div>
    </div>
  );
}