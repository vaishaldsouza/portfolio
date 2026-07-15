"use client";
import { useState } from "react";
import Draggable from "react-draggable";
import Image from "next/image";
import styles from "./notepad.module.scss";

const DEFAULT_TEXT = `Welcome to Prajwal's Notepad 📝
================================

[Jan 2026]
Started my B.Tech in AI/ML at Alliance University.
Building cool stuff every day. This portfolio is proof.

[Dec 2025]
Completed Deloitte Australia virtual internship.
Learned a ton about EDA and real-world data pipelines.

[Jan-Feb 2026]
Microsoft Elevate × AICTE — 25hrs of Azure goodness.
Cloud is the future and I'm here for it ☁️

[Thoughts]
- AI is not going to replace you.
  A person using AI will.
- Build things. Break things. Learn things.
- Sleep is a myth during hackathons.

[Goals 2026]
☐ Deploy 3 production ML models
☐ Contribute to open source
☐ Land a killer internship
☐ Keep building insane stuff

================================
Made with 💻 and too much coffee.
`;

export default function Notepad({ setShowNotepad }) {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [fileName, setFileName] = useState("Prajwal's Thoughts.txt");
  const [isModified, setIsModified] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [showMenu, setShowMenu] = useState(null);

  const handleSave = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    setIsModified(false);
  };

  const handleNew = () => {
    setText("");
    setFileName("Untitled.txt");
    setIsModified(false);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.split("\n").length;
  const charCount = text.length;

  return (
    <Draggable handle=".notepadHandle" defaultPosition={{ x: 100, y: 50 }} grid={[5, 5]}>
      <div className={styles.window}>
        {/* Title Bar */}
        <div className={`${styles.titlebar} notepadHandle`}>
          <div className={styles.titleLeft}>
            <span>📝</span>
            <span>{isModified ? "● " : ""}{fileName} — Notepad</span>
          </div>
          <div className={styles.buttons}>
            <button className={styles.btn}>
              <Image className={styles.btnIcon} src="/windowsIcons/minimize.svg" alt="min" width={50} height={50} />
            </button>
            <button className={styles.btn} onClick={() => setShowNotepad(false)}>
              <Image className={styles.btnIcon} src="/windowsIcons/close.svg" alt="close" width={50} height={50} />
            </button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className={styles.menubar}>
          {/* File */}
          <div className={styles.menuGroup} onMouseLeave={() => setShowMenu(null)}>
            <span className={styles.menuItem} onMouseEnter={() => setShowMenu("file")}>File</span>
            {showMenu === "file" && (
              <div className={styles.dropdown}>
                <div className={styles.dropItem} onClick={handleNew}>New</div>
                <div className={styles.dropItem} onClick={handleSave}>Save</div>
                <div className={styles.dropDivider} />
                <div className={styles.dropItem} onClick={() => setShowNotepad(false)}>Exit</div>
              </div>
            )}
          </div>

          {/* Edit */}
          <div className={styles.menuGroup} onMouseLeave={() => setShowMenu(null)}>
            <span className={styles.menuItem} onMouseEnter={() => setShowMenu("edit")}>Edit</span>
            {showMenu === "edit" && (
              <div className={styles.dropdown}>
                <div className={styles.dropItem} onClick={() => setText("")}>Clear All</div>
                <div className={styles.dropItem} onClick={() => setText(DEFAULT_TEXT)}>Reset</div>
              </div>
            )}
          </div>

          {/* Format */}
          <div className={styles.menuGroup} onMouseLeave={() => setShowMenu(null)}>
            <span className={styles.menuItem} onMouseEnter={() => setShowMenu("format")}>Format</span>
            {showMenu === "format" && (
              <div className={styles.dropdown}>
                <div className={styles.dropItem} onClick={() => setWordWrap(w => !w)}>
                  {wordWrap ? "✓ " : ""}Word Wrap
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <textarea
          className={styles.editor}
          value={text}
          onChange={e => { setText(e.target.value); setIsModified(true); }}
          spellCheck={false}
          style={{ whiteSpace: wordWrap ? "pre-wrap" : "pre" }}
          placeholder="Start typing..."
        />

        {/* Status Bar */}
        <div className={styles.statusbar}>
          <span>Lines: {lineCount}</span>
          <span>Words: {wordCount}</span>
          <span>Chars: {charCount}</span>
          <span>{wordWrap ? "Wrap: ON" : "Wrap: OFF"}</span>
        </div>
      </div>
    </Draggable>
  );
}