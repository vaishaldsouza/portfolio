"use client";
import { constextMenuItems } from "./contextMenuItems";
import styles from "./contextmenu.module.scss";
import Image from "next/image";

const ContextMenu = ({ contextMenuPosition }) => {
  const handleClick = (id) => {
    switch (id) {
      case "refresh":
        window.location.reload();
        break;
      case "new_folder":
        alert("📁 New Folder created! (Just kidding, this is a portfolio 😄)");
        break;
      case "properties":
        alert("🖥️ Prajwal's Portfolio\nVersion: Windows 95 Edition\nBuilt with: Next.js + Love ❤️\nDeveloper: Prajwal A\nEmail: prajwala27112005@gmail.com");
        break;
      case "paste":
        alert("📋 Nothing to paste! Try copying something first 😄");
        break;
      default:
        break;
    }
  };

  const items = constextMenuItems.map((item, index) => (
    <div key={index} onClick={() => item.id && handleClick(item.id)}>
      {item.name && (
        <div className={styles.menu_item}>
          <span
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: item.name }}
          />
          <span>
            {item.options && (
              <Image
                className={styles.right_icon}
                src="/windowsIcons/right-icon.svg"
                alt="options"
                height={32}
                width={32}
              />
            )}
          </span>
        </div>
      )}
      {item.line && <div className={styles.line} />}
    </div>
  ));

  return (
    <div
      style={{
        width: "16rem",
        position: "absolute",
        top: contextMenuPosition.top + "px",
        left: contextMenuPosition.left + "px",
        display: "inline-flex",
        padding: "0.125rem 0.25rem 0.25rem 0.1875rem",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--mono-100, #C3C3C3)",
        boxShadow: "-4px -4px 0px 0px #7E7E7E inset, 2px 2px 0px 0px #F0F0F0 inset, -2px -2px 0px 0px #262626 inset",
        zIndex: 1000,
      }}
    >
      {items}
    </div>
  );
};

export default ContextMenu;