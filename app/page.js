"use client";
import styles from "./page.module.scss";
import HomeFooter from "@/components/footers/HomeFooter";
import { useState, useEffect, useRef } from "react";
import StartMenu from "@/components/menu/StartMenu";
import ContextMenu from "@/components/menu/ContextMenu";
import MainInterface from "@/components/interfaces/MainInterface";
import MobileWarning from "@/components/popups/MobileWarning";
import Login from "@/components/login/Login";
import Boot from "@/components/boot/Boot";
import Screensaver from "@/components/screensaver/Screensaver";
import Clippy from "@/components/clippy/Clippy";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [booted, setBooted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showScreensaver, setShowScreensaver] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const idleTimer = useRef(null);

  useEffect(() => {
    const detectMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    detectMobile();
    window.addEventListener("resize", detectMobile);
    return () => window.removeEventListener("resize", detectMobile);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const resetTimer = () => {
      clearTimeout(idleTimer.current);
      setShowScreensaver(false);
      idleTimer.current = setTimeout(() => setShowScreensaver(true), 30000);
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    resetTimer();
    return () => {
      clearTimeout(idleTimer.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [loggedIn]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
    setShowContextMenu(true);
  };

  const handleBackdrop = () => {
    if (showStartMenu) setShowStartMenu(false);
    if (showContextMenu) setShowContextMenu(false);
  };

  if (!booted) return <Boot onDone={() => setBooted(true)} />;
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div>
      <div
        className={styles.backdrop}
        onClick={handleBackdrop}
        onContextMenu={handleContextMenu}
      >
        <MainInterface />
        {showContextMenu && (
          <ContextMenu contextMenuPosition={contextMenuPosition} />
        )}
      </div>
      {isMobile ? <MobileWarning setIsMobile={setIsMobile} /> : null}
      {showStartMenu && <StartMenu setShowStartMenu={setShowStartMenu} />}
      <HomeFooter
        showStartMenu={showStartMenu}
        setShowStartMenu={setShowStartMenu}
      />
      <Clippy />
      {showScreensaver && <Screensaver onWake={() => setShowScreensaver(false)} />}
    </div>
  );
}