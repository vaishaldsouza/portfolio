"use client";
import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import Image from "next/image";
import styles from "./musicplayer.module.scss";

const TRACKS = [
  { name: "Windows 95 Startup", bpm: 120 },
  { name: "Chiptune Groove", bpm: 140 },
  { name: "Retro Vibes", bpm: 100 },
  { name: "8-Bit Adventure", bpm: 160 },
];

// Chiptune note sequences for each track
const SEQUENCES = [
  [523, 659, 784, 1047, 784, 659, 523, 440, 523, 659, 784, 880],
  [440, 554, 659, 880, 659, 554, 440, 370, 440, 554, 659, 740],
  [349, 440, 523, 698, 523, 440, 349, 294, 349, 440, 523, 587],
  [262, 330, 392, 523, 392, 330, 262, 220, 262, 330, 392, 440],
];

export default function MusicPlayer({ setShowMusic }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [currentNote, setCurrentNote] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const ctxRef = useRef(null);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const playNote = (freq, vol, bpm) => {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol * 0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  };

  const startPlaying = () => {
    const seq = SEQUENCES[currentTrack];
    const bpm = TRACKS[currentTrack].bpm;
    const interval = (60 / bpm) * 500;
    let noteIdx = currentNote;

    intervalRef.current = setInterval(() => {
      playNote(seq[noteIdx % seq.length], volume, bpm);
      noteIdx++;
      setCurrentNote(noteIdx % seq.length);
    }, interval);

    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
  };

  const stopPlaying = () => {
    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (isPlaying) startPlaying();
    else stopPlaying();
    return () => stopPlaying();
  }, [isPlaying, currentTrack, volume]);

  const handleTrack = (dir) => {
    stopPlaying();
    setCurrentNote(0);
    setElapsed(0);
    setCurrentTrack(prev => (prev + dir + TRACKS.length) % TRACKS.length);
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <Draggable handle=".musicHandle" defaultPosition={{ x: 80, y: 80 }} grid={[5, 5]}>
      <div className={styles.window}>
        {/* Title Bar */}
        <div className={`${styles.titlebar} musicHandle`}>
          <div className={styles.titleLeft}>
            <span>🎵</span>
            <span>Windows Media Player</span>
          </div>
          <div className={styles.buttons}>
            <button className={styles.btn}>
              <Image className={styles.btnIcon} src="/windowsIcons/minimize.svg" alt="min" width={50} height={50} />
            </button>
            <button className={styles.btn} onClick={() => { stopPlaying(); setShowMusic(false); }}>
              <Image className={styles.btnIcon} src="/windowsIcons/close.svg" alt="close" width={50} height={50} />
            </button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className={styles.menubar}>
          <span className={styles.menuItem}>File</span>
          <span className={styles.menuItem}>Play</span>
          <span className={styles.menuItem}>View</span>
          <span className={styles.menuItem}>Help</span>
        </div>

        {/* Visualizer */}
        <div className={styles.visualizer}>
          {Array.from({length: 16}).map((_, i) => (
            <div
              key={i}
              className={styles.bar}
              style={{
                height: isPlaying ? `${Math.random() * 60 + 10}%` : "5%",
                animationDelay: `${i * 0.05}s`,
                background: isPlaying
                  ? `hsl(${200 + i * 8}, 100%, 60%)`
                  : "#004080"
              }}
            />
          ))}
        </div>

        {/* Track Info */}
        <div className={styles.trackInfo}>
          <div className={styles.trackName}>🎵 {TRACKS[currentTrack].name}</div>
          <div className={styles.trackMeta}>
            {TRACKS[currentTrack].bpm} BPM • Chiptune • {formatTime(elapsed)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{
            width: `${(currentNote / SEQUENCES[currentTrack].length) * 100}%`
          }}/>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button className={styles.ctrlBtn} onClick={() => handleTrack(-1)} title="Previous">⏮</button>
          <button className={styles.ctrlBtn} onClick={() => { setCurrentNote(0); setElapsed(0); }} title="Stop">⏹</button>
          <button
            className={`${styles.ctrlBtn} ${styles.playBtn}`}
            onClick={() => setIsPlaying(p => !p)}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className={styles.ctrlBtn} onClick={() => handleTrack(1)} title="Next">⏭</button>
        </div>

        {/* Volume */}
        <div className={styles.volumeRow}>
          <span className={styles.volLabel}>🔈</span>
          <input
            type="range" min="0" max="1" step="0.05"
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className={styles.volumeSlider}
          />
          <span className={styles.volLabel}>🔊</span>
          <span className={styles.volValue}>{Math.round(volume * 100)}%</span>
        </div>

        {/* Playlist */}
        <div className={styles.playlist}>
          {TRACKS.map((t, i) => (
            <div
              key={i}
              className={`${styles.playlistItem} ${currentTrack === i ? styles.activeTrack : ""}`}
              onClick={() => { stopPlaying(); setCurrentTrack(i); setCurrentNote(0); setElapsed(0); }}
            >
              <span>{i + 1}.</span>
              <span>{t.name}</span>
              <span className={styles.trackBpm}>{t.bpm} BPM</span>
            </div>
          ))}
        </div>

        <div className={styles.statusbar}>
          <span>{isPlaying ? "▶ Playing..." : "⏹ Stopped"}</span>
          <span>4 tracks • Chiptune</span>
        </div>
      </div>
    </Draggable>
  );
}