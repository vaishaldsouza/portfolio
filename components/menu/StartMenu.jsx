"use client";
import styles from "./startmenu.module.scss";
import Image from "next/image";
import { useState } from "react";
import BlueScreen from "../misc/BlueScreen";

const PROGRAMS_MAP = {
  "About Me": "aboutMe",
  "Projects": "projects",
  "Experience": "experience",
  "Education": "education",
  "Talk to Me": "mail",
  "Chess": "chess",
  "Meme Vault": "memes",
};

const DOCUMENTS_MAP = {
  "Download Résumé": "resume",
  "Projects": "projects",
  "Network Neighbourhood": "networkNeighbourhood",
};

const StartMenu = ({ setShowStartMenu }) => {
  const [showBlueScreen, setShowBlueScreen] = useState(false);
  const [submenu, setSubmenu] = useState(null);
  const [showFind, setShowFind] = useState(false);
  const [showRun, setShowRun] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [findQuery, setFindQuery] = useState("");
  const [runInput, setRunInput] = useState("");
  const [runResult, setRunResult] = useState(null);
  const [findResults, setFindResults] = useState(null);

  const close = () => setShowStartMenu && setShowStartMenu(false);

  const openApp = (id) => {
    window.dispatchEvent(new CustomEvent("openApp", { detail: { id } }));
    close();
  };

  const programsSubmenu = [
    { name: "About Me", icon: "/windowsIcons/builder.png" },
    { name: "Projects", icon: "/windowsIcons/joystick.png" },
    { name: "Experience", icon: "/windowsIcons/documents.svg" },
    { name: "Education", icon: "/windowsIcons/folder.svg" },
    { name: "Talk to Me", icon: "/windowsIcons/chat.png" },
    { name: "Chess", icon: "/windowsIcons/programs.png" },
    { name: "Meme Vault", icon: "/windowsIcons/troll-face.png" },
  ];

  const documentsSubmenu = [
    { name: "Download Résumé", icon: "/windowsIcons/resume.png" },
    { name: "Projects", icon: "/windowsIcons/joystick.png" },
    { name: "Network Neighbourhood", icon: "/windowsIcons/network-neighbourhood.svg" },
  ];

  const searchIndex = [
    { name: "About Me", keywords: ["about", "bio", "prajwal", "me", "who"], icon: "/windowsIcons/builder.png", id: "aboutMe" },
    { name: "Projects", keywords: ["project", "work", "build", "dataforge", "code"], icon: "/windowsIcons/joystick.png", id: "projects" },
    { name: "Experience", keywords: ["experience", "intern", "microsoft", "deloitte", "job"], icon: "/windowsIcons/documents.svg", id: "experience" },
    { name: "Education", keywords: ["education", "college", "university", "alliance", "btech"], icon: "/windowsIcons/folder.svg", id: "education" },
    { name: "Contact", keywords: ["contact", "email", "mail", "reach", "talk", "connect"], icon: "/windowsIcons/chat.png", id: "mail" },
    { name: "Resume", keywords: ["resume", "cv", "download", "hire"], icon: "/windowsIcons/resume.png", id: "resume" },
    { name: "Chess", keywords: ["chess", "game", "play"], icon: "/windowsIcons/programs.png", id: "chess" },
    { name: "Meme Vault", keywords: ["meme", "funny", "vault", "laugh"], icon: "/windowsIcons/troll-face.png", id: "memes" },
  ];

  const runCommands = {
    "notepad": "📝 Opening Notepad... just kidding, try double-clicking About Me!",
    "cmd": "💀 Access denied. Nice try though.",
    "calc": "🧮 Calculator: 1 + 1 = 2. You're welcome.",
    "mspaint": "🎨 MS Paint is on the desktop!",
    "explorer": "📁 Try the desktop icons instead!",
    "chrome": "🌐 Chrome is too modern for Windows 95.",
    "hello": "👋 Hello, World!",
    "hire prajwal": "✅ Excellent choice! Email: prajwala27112005@gmail.com",
    "sudo hire prajwal": "✅✅ SUPER HIRED! Email: prajwala27112005@gmail.com",
    "python": "🐍 Python 3.x is running... somewhere in Prajwal's brain.",
    "matrix": "🟩 Wake up, Neo...",
    "help": "📖 Try: notepad, cmd, calc, python, matrix, hire prajwal",
    "hack": "💚 Initializing hack sequence...\n> ACCESS GRANTED\n> Welcome, Prajwal.\n> All your base are belong to us. 😈",
    "crash": "💀 Triggering BSOD...",
  };

  const handleFind = () => {
    if (!findQuery.trim()) { setFindResults([]); return; }
    const q = findQuery.toLowerCase();
    const results = searchIndex.filter(item =>
      item.name.toLowerCase().includes(q) || item.keywords.some(k => k.includes(q))
    );
    setFindResults(results);
  };

  const handleRun = () => {
    const cmd = runInput.trim().toLowerCase();
    if (cmd === "crash") {
      setShowRun(false);
      setShowBlueScreen(true);
      return;
    }
    const result = runCommands[cmd] || `❌ '${runInput}' is not recognized. Try 'help'.`;
    setRunResult(result);
  };

  return (
    <>
      <div className={styles.menu_card}>

        {/* PROGRAMS */}
        <div
          className={styles.menu_item}
          onMouseEnter={() => setSubmenu("programs")}
          onMouseLeave={() => setSubmenu(null)}
        >
          <span>
            <Image className={styles.item_img} src="/windowsIcons/programs.png" alt="Programs" height={50} width={50} />
            <span className={styles.item_name}><span className={styles.first_letter}>P</span>rograms</span>
          </span>
          <Image className={styles.right_icon} src="/windowsIcons/right-icon.svg" alt="▶" height={32} width={32} />
          {submenu === "programs" && (
            <div className={styles.submenu}>
              {programsSubmenu.map(p => (
                <div key={p.name} className={styles.submenu_item} onClick={() => openApp(PROGRAMS_MAP[p.name])}>
                  <Image src={p.icon} alt={p.name} width={24} height={24} style={{ imageRendering: "pixelated" }} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DOCUMENTS */}
        <div
          className={styles.menu_item}
          onMouseEnter={() => setSubmenu("documents")}
          onMouseLeave={() => setSubmenu(null)}
        >
          <span>
            <Image className={styles.item_img} src="/windowsIcons/documents.svg" alt="Documents" height={50} width={50} />
            <span className={styles.item_name}><span className={styles.first_letter}>D</span>ocuments</span>
          </span>
          <Image className={styles.right_icon} src="/windowsIcons/right-icon.svg" alt="▶" height={32} width={32} />
          {submenu === "documents" && (
            <div className={styles.submenu}>
              {documentsSubmenu.map(d => (
                <div key={d.name} className={styles.submenu_item} onClick={() => openApp(DOCUMENTS_MAP[d.name])}>
                  <Image src={d.icon} alt={d.name} width={24} height={24} style={{ imageRendering: "pixelated" }} />
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <div className={styles.menu_item}>
          <span>
            <Image className={styles.item_img} src="/windowsIcons/settings.svg" alt="Settings" height={50} width={50} />
            <span className={styles.item_name}><span className={styles.first_letter}>S</span>ettings</span>
          </span>
          <Image className={styles.right_icon} src="/windowsIcons/right-icon.svg" alt="▶" height={32} width={32} />
        </div>

        {/* FIND */}
        <div className={styles.menu_item} onClick={() => { setShowFind(true); close(); }}>
          <span>
            <Image className={styles.item_img} src="/windowsIcons/find.svg" alt="Find" height={50} width={50} />
            <span className={styles.item_name}><span className={styles.first_letter}>F</span>ind</span>
          </span>
          <Image className={styles.right_icon} src="/windowsIcons/right-icon.svg" alt="▶" height={32} width={32} />
        </div>

        {/* HELP */}
        <div className={styles.menu_item} onClick={() => { setShowHelp(true); close(); }}>
          <span>
            <Image className={styles.item_img} src="/windowsIcons/help.svg" alt="Help" height={50} width={50} />
            <span className={styles.item_name}><span className={styles.first_letter}>H</span>elp</span>
          </span>
        </div>

        {/* RUN */}
        <div className={styles.menu_item} onClick={() => { setShowRun(true); close(); }}>
          <span>
            <Image className={styles.item_img} src="/windowsIcons/run.svg" alt="Run" height={50} width={50} />
            <span className={styles.item_name}><span className={styles.first_letter}>R</span>un</span>
          </span>
        </div>

        <div className={styles.line}></div>

        {/* SHUT DOWN */}
        <div className={styles.menu_item} onClick={() => { setShowBlueScreen(true); close(); }}>
          <span>
            <Image className={styles.item_img} src="/windowsIcons/shutdown.svg" alt="Shutdown" height={50} width={50} />
            <span className={styles.item_name}>Shut Down</span>
          </span>
        </div>
      </div>

      {showBlueScreen && <BlueScreen setShowBlueScreen={setShowBlueScreen} />}

      {/* FIND DIALOG */}
      {showFind && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog}>
            <div className={styles.dialog_title}>
              <Image src="/windowsIcons/find.svg" alt="find" width={16} height={16} />
              <span>Find — Search Portfolio</span>
              <button className={styles.dialog_close} onClick={() => { setShowFind(false); setFindResults(null); setFindQuery(""); }}>✕</button>
            </div>
            <div className={styles.dialog_body}>
              <p className={styles.dialog_label}>Search for anything:</p>
              <div className={styles.dialog_row}>
                <input
                  className={styles.dialog_input}
                  value={findQuery}
                  onChange={e => setFindQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleFind()}
                  placeholder="e.g. python, azure, chess, intern..."
                  autoFocus
                />
                <button className={styles.dialog_btn} onClick={handleFind}>Find Now</button>
              </div>
              {findResults !== null && (
                <div className={styles.find_results}>
                  {findResults.length === 0 ? (
                    <p className={styles.no_results}>🔍 No results for "{findQuery}"</p>
                  ) : (
                    <>
                      <p className={styles.results_label}>{findResults.length} result(s) found:</p>
                      {findResults.map(r => (
                        <div key={r.name} className={styles.result_item} onClick={() => openApp(r.id)} style={{ cursor: "pointer" }}>
                          <Image src={r.icon} alt={r.name} width={20} height={20} style={{ imageRendering: "pixelated" }} />
                          <span>{r.name}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RUN DIALOG */}
      {showRun && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog}>
            <div className={styles.dialog_title}>
              <Image src="/windowsIcons/run.svg" alt="run" width={16} height={16} />
              <span>Run</span>
              <button className={styles.dialog_close} onClick={() => { setShowRun(false); setRunResult(null); setRunInput(""); }}>✕</button>
            </div>
            <div className={styles.dialog_body}>
              <div className={styles.run_header}>
                <span className={styles.run_icon}>🖥️</span>
                <p>Type the name of a program and Windows will open it for you.</p>
              </div>
              <div className={styles.dialog_row}>
                <label className={styles.dialog_label}>Open:</label>
                <input
                  className={styles.dialog_input}
                  value={runInput}
                  onChange={e => setRunInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleRun()}
                  placeholder="try: hire prajwal"
                  autoFocus
                />
              </div>
              {runResult && <div className={styles.run_result}>{runResult}</div>}
              <div className={styles.dialog_footer}>
                <button className={styles.dialog_btn} onClick={handleRun}>OK</button>
                <button className={styles.dialog_btn} onClick={() => { setShowRun(false); setRunResult(null); setRunInput(""); }}>Cancel</button>
                <button className={styles.dialog_btn} onClick={() => setRunInput("hire prajwal")}>Browse...</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HELP DIALOG */}
      {showHelp && (
        <div className={styles.dialog_overlay}>
          <div className={styles.dialog} style={{ width: "32rem" }}>
            <div className={styles.dialog_title}>
              <Image src="/windowsIcons/help.svg" alt="help" width={16} height={16} />
              <span>Help — Portfolio Guide</span>
              <button className={styles.dialog_close} onClick={() => setShowHelp(false)}>✕</button>
            </div>
            <div className={styles.dialog_body}>
              <div className={styles.help_content}>
                <h3 className={styles.help_title}>📖 How to Navigate</h3>
                <div className={styles.help_item}><span className={styles.help_icon}>🖥️</span><div><strong>Desktop Icons</strong> — Click any icon to open</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>🖱️</span><div><strong>Drag Windows</strong> — Click and drag the title bar</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>✕</span><div><strong>Close Windows</strong> — Click ✕ on any window</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>🔍</span><div><strong>Find</strong> — Search anything in the portfolio</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>⌨️</span><div><strong>Run</strong> — Type commands like <em>hire prajwal</em></div></div>
                <hr className={styles.help_hr} />
                <h3 className={styles.help_title}>📂 What's on the Desktop</h3>
                <div className={styles.help_item}><span className={styles.help_icon}>👤</span><div><strong>About Me</strong> — Skills, certifications & bio</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>🔬</span><div><strong>Projects</strong> — DataForge Studio & more</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>💼</span><div><strong>Experience</strong> — Microsoft & Deloitte internships</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>🎓</span><div><strong>Education</strong> — Alliance University</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>✉️</span><div><strong>Talk to Me</strong> — Send a message</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>📄</span><div><strong>Download Résumé</strong> — Get Prajwal's CV</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>♟️</span><div><strong>Chess</strong> — Play chess vs CPU</div></div>
                <div className={styles.help_item}><span className={styles.help_icon}>🗿</span><div><strong>Meme Vault</strong> — You know why</div></div>
                <hr className={styles.help_hr} />
                <p className={styles.help_contact}>📧 <strong>prajwala27112005@gmail.com</strong></p>
              </div>
              <div className={styles.dialog_footer}>
                <button className={styles.dialog_btn} onClick={() => setShowHelp(false)}>OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StartMenu;