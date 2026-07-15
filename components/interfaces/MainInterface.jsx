"use client";
import Compiler from "../compiler/Compiler";
import Paint from "../paint/Paint";
import { useState, useEffect } from "react";
import { mainInterfaceItems } from "./mainInterfaceItems";
import Wordpad from "../wordpad/Wordpad";
import Modal from "../modal/Modal";
import Image from "next/image";
import styles from "./mainInterface.module.scss";
import RickRoll from "../misc/RickRoll";
import Draggable from "react-draggable";
import Mail from "../mail/Mail";
import MusicPlayer from "../music/MusicPlayer";
import FileManager from "../fileManager/FileManager";
import Chess from "../chess/Chess";
import ResumePDF from "../../public/Prajwal_A_Resume.pdf";
import Notepad from "../notepad/Notepad";

const MainInterface = () => {
  const [activeWordpad, setActiveWordpad] = useState([]);
  const [activeModals, setActiveModals] = useState([
    { item: mainInterfaceItems.find(i => i.id === "myComputer") }
  ]);
  const [activeMail, setActiveMail] = useState(false);
  const [showFileManager, setShowFileManager] = useState([]);
  const [isRickRolled, setIsRickRolled] = useState(false);
  const [showChess, setShowChess] = useState(false);
  const [showPaint, setShowPaint] = useState(false);
  const [showCompiler, setShowCompiler] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [showNotepad, setShowNotepad] = useState(false);

  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = ResumePDF;
    link.download = "Prajwal_A_Resume.pdf";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectApp = (item) => {
    switch (item.id) {
      case "aboutMe":
      case "projects":
      case "experience":
      case "education":
        if (!activeWordpad.some((ele) => ele.item.id === item.id)) {
          setActiveWordpad([...activeWordpad, { item }]);
        }
        break;
      case "paint":
        setShowPaint(true);
        break;
      case "compiler":
        setShowCompiler(true);
        break;
      case "myComputer":
      case "networkNeighbourhood":
      case "recycleBin":
        if (!activeModals.some((modal) => modal.item.id === item.id)) {
          setActiveModals([...activeModals, { item }]);
        }
        break;
      case "mail":
        setActiveMail(true);
        break;
      case "memes":
        if (!showFileManager.some((file) => file.item.id === item.id)) {
          setShowFileManager([...showFileManager, { item }]);
        }
        break;
      case "xxxvids":
        setIsRickRolled(true);
        break;
      case "chess":
        setShowChess(true);
        break;
      case "resume":
        downloadResume();
        break;
      case "music":
        setShowMusic(true);
        break;
      case "notepad":
        setShowNotepad(true);
        break;
      default:
        console.log("Unknown app");
    }
  };

  // Listen for openApp events from StartMenu
  useEffect(() => {
    const handler = (e) => {
      const id = e.detail.id;
      const item = mainInterfaceItems.find(i => i.id === id) || { id };
      selectApp(item);
    };
    window.addEventListener("openApp", handler);
    return () => window.removeEventListener("openApp", handler);
  }, [activeWordpad, activeModals, showFileManager]);

  return (
    <div className={styles.interface}>
      <div className={styles.elementsList}>
        {mainInterfaceItems.map((item) => (
          <Draggable
            handle=".handle"
            key={item.id}
            defaultPosition={{ x: 0, y: 0 }}
            position={null}
            grid={[25, 25]}
            scale={1}
          >
            <div
              className={`${styles.item} handle`}
              onClick={() => selectApp(item)}
              onTouchStart={() => selectApp(item)}
            >
              <Image
                className={styles.icon}
                src={item.icon}
                alt={item.name}
                width={50}
                height={50}
              />
              <div className={styles.text}>{item.name}</div>
            </div>
          </Draggable>
        ))}
      </div>

      {activeWordpad.map((wordpadInfo) => (
        <Wordpad
          key={wordpadInfo.item.id}
          data={wordpadInfo.item}
          activeWordpad={activeWordpad}
          setActiveWordpad={setActiveWordpad}
        />
      ))}

      {activeModals.map((modalInfo) => (
        <Modal
          key={modalInfo.item.id}
          data={modalInfo.item}
          activeModals={activeModals}
          setActiveModals={setActiveModals}
        />
      ))}

      {activeMail && <Mail setActiveMail={setActiveMail} />}

      {showFileManager.map((fileInfo) => (
        <FileManager
          key={fileInfo.item.id}
          data={fileInfo.item}
          showFileManager={showFileManager}
          setShowFileManager={setShowFileManager}
        />
      ))}

      {isRickRolled && <RickRoll setIsRickRolled={setIsRickRolled} />}
      {showChess && <Chess setShowChess={setShowChess} />}
      {showPaint && <Paint setShowPaint={setShowPaint} />}
      {showCompiler && <Compiler setShowCompiler={setShowCompiler} />}
      {showMusic && <MusicPlayer setShowMusic={setShowMusic} />}
      {showNotepad && <Notepad setShowNotepad={setShowNotepad} />}
    </div>
  );
};

export default MainInterface;
