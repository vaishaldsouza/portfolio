"use client";
import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import Image from "next/image";
import styles from "./paint.module.scss";

const COLORS = [
  "#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080",
  "#808040","#004040","#0000FF","#4040FF","#400040","#804040","#FF0080","#8000FF",
  "#FFFFFF","#C0C0C0","#FF0000","#FFFF00","#00FF00","#00FFFF","#0080FF","#FF00FF",
  "#FFFF80","#80FFFF","#80C0FF","#C0C0FF","#FFC0FF","#FFC0C0","#FF8040","#80FF40",
];

const TOOLS = [
  { id:"freeform", icon:"/images/paint/freeform.png", title:"Free-Form Select" },
  { id:"select", icon:null, title:"Select" },
  { id:"eraser", icon:"/images/paint/eraser.png", title:"Eraser" },
  { id:"fill", icon:"/images/paint/fill.png", title:"Fill" },
  { id:"eyedropper", icon:"/images/paint/eyedropper.png", title:"Pick Color" },
  { id:"magnifier", icon:"/images/paint/magnifier.png", title:"Magnifier" },
  { id:"pencil", icon:"/images/paint/pencil.png", title:"Pencil" },
  { id:"brush", icon:"/images/paint/brush.png", title:"Brush" },
  { id:"airbrush", icon:"/images/paint/airbrush.png", title:"Airbrush" },
  { id:"text", icon:"/images/paint/text.png", title:"Text" },
  { id:"line", icon:null, title:"Line" },
  { id:"curve", icon:"/images/paint/curve.png", title:"Curve" },
  { id:"rectangle", icon:null, title:"Rectangle" },
  { id:"polygon", icon:"/images/paint/polygon.png", title:"Polygon" },
  { id:"circle", icon:null, title:"Ellipse" },
  { id:"roundedRect", icon:null, title:"Rounded Rect" },
];

export default function Paint({ setShowPaint }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [lineWidth, setLineWidth] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [fileName, setFileName] = useState("Untitled.bmp");
  const [isModified, setIsModified] = useState(false);
  const [fillStyle, setFillStyle] = useState("transparent");
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState(null);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, imageData]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length <= 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack(prev => [...prev, current]);
    const newStack = [...undoStack];
    newStack.pop();
    setUndoStack(newStack);
    ctx.putImageData(newStack[newStack.length - 1], 0, 0);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const newRedo = [...redoStack];
    const state = newRedo.pop();
    setRedoStack(newRedo);
    const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack(prev => [...prev, current]);
    ctx.putImageData(state, 0, 0);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    setIsModified(false);
    setFileName("Untitled.bmp");
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = fileName.replace(".bmp", ".png");
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsModified(false);
  };

  const floodFill = (startX, startY, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const hex = fillColor;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const sp = (startY * canvas.width + startX) * 4;
    const sr = data[sp], sg = data[sp+1], sb = data[sp+2];
    if (sr===r && sg===g && sb===b) return;
    const queue = [[startX, startY]];
    while (queue.length) {
      const [x, y] = queue.shift();
      const p = (y * canvas.width + x) * 4;
      if (x<0||x>=canvas.width||y<0||y>=canvas.height) continue;
      if (data[p]!==sr||data[p+1]!==sg||data[p+2]!==sb) continue;
      data[p]=r; data[p+1]=g; data[p+2]=b; data[p+3]=255;
      queue.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: Math.floor(e.clientX - rect.left), y: Math.floor(e.clientY - rect.top) };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getPos(e);
    setIsDrawing(true);
    setIsModified(true);
    setStartPos({ x, y });
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "fill") { floodFill(x, y, color); saveState(); setIsDrawing(false); return; }
    if (tool === "eyedropper") {
      const p = ctx.getImageData(x, y, 1, 1).data;
      setColor(`#${p[0].toString(16).padStart(2,"0")}${p[1].toString(16).padStart(2,"0")}${p[2].toString(16).padStart(2,"0")}`);
      setIsDrawing(false); return;
    }
    if (tool === "text") { setTextPosition({x,y}); setShowTextInput(true); setIsDrawing(false); return; }
    if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      ctx.lineWidth = tool === "brush" ? lineWidth * 3 : lineWidth;
    }
    if (tool === "airbrush") { drawAirbrush(x, y); }
  };

  const drawAirbrush = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    const radius = lineWidth * 5, density = lineWidth * 8;
    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      ctx.beginPath();
      ctx.arc(x + Math.cos(angle)*dist, y + Math.sin(angle)*dist, 0.5, 0, Math.PI*2);
      ctx.fill();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !startPos) return;
    const { x, y } = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      ctx.lineTo(x, y); ctx.stroke(); return;
    }
    if (tool === "airbrush") { drawAirbrush(x, y); return; }

    // Shape preview
    if (["line","rectangle","circle","roundedRect"].includes(tool)) {
      if (undoStack.length > 0) ctx.putImageData(undoStack[undoStack.length-1], 0, 0);
      ctx.strokeStyle = color; ctx.lineWidth = lineWidth;
      const w = x - startPos.x, h = y - startPos.y;
      if (tool === "line") {
        ctx.beginPath(); ctx.moveTo(startPos.x, startPos.y); ctx.lineTo(x, y); ctx.stroke();
      } else if (tool === "rectangle") {
        if (fillStyle==="solid") { ctx.fillStyle=color; ctx.fillRect(startPos.x,startPos.y,w,h); }
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (tool === "circle") {
        const r = Math.sqrt(w*w+h*h);
        ctx.beginPath(); ctx.arc(startPos.x, startPos.y, r, 0, 2*Math.PI);
        if (fillStyle==="solid") { ctx.fillStyle=color; ctx.fill(); }
        ctx.stroke();
      } else if (tool === "roundedRect") {
        const r = Math.min(10, Math.abs(w)/4, Math.abs(h)/4);
        ctx.beginPath();
        ctx.moveTo(startPos.x+r, startPos.y);
        ctx.lineTo(startPos.x+w-r, startPos.y);
        ctx.quadraticCurveTo(startPos.x+w, startPos.y, startPos.x+w, startPos.y+r);
        ctx.lineTo(startPos.x+w, startPos.y+h-r);
        ctx.quadraticCurveTo(startPos.x+w, startPos.y+h, startPos.x+w-r, startPos.y+h);
        ctx.lineTo(startPos.x+r, startPos.y+h);
        ctx.quadraticCurveTo(startPos.x, startPos.y+h, startPos.x, startPos.y+h-r);
        ctx.lineTo(startPos.x, startPos.y+r);
        ctx.quadraticCurveTo(startPos.x, startPos.y, startPos.x+r, startPos.y);
        ctx.closePath();
        if (fillStyle==="solid") { ctx.fillStyle=color; ctx.fill(); }
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (["pencil","brush","eraser","airbrush"].includes(tool)) { saveState(); return; }
    const { x, y } = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = x - startPos.x, h = y - startPos.y;
    ctx.strokeStyle = color; ctx.lineWidth = lineWidth;

    if (tool === "line") {
      ctx.beginPath(); ctx.moveTo(startPos.x,startPos.y); ctx.lineTo(x,y); ctx.stroke();
    } else if (tool === "rectangle") {
      if (fillStyle==="solid") { ctx.fillStyle=color; ctx.fillRect(startPos.x,startPos.y,w,h); }
      ctx.strokeRect(startPos.x,startPos.y,w,h);
    } else if (tool === "circle") {
      const r = Math.sqrt(w*w+h*h);
      ctx.beginPath(); ctx.arc(startPos.x,startPos.y,r,0,2*Math.PI);
      if (fillStyle==="solid") { ctx.fillStyle=color; ctx.fill(); }
      ctx.stroke();
    } else if (tool === "roundedRect") {
      const r = Math.min(10, Math.abs(w)/4, Math.abs(h)/4);
      ctx.beginPath();
      ctx.moveTo(startPos.x+r,startPos.y); ctx.lineTo(startPos.x+w-r,startPos.y);
      ctx.quadraticCurveTo(startPos.x+w,startPos.y,startPos.x+w,startPos.y+r);
      ctx.lineTo(startPos.x+w,startPos.y+h-r);
      ctx.quadraticCurveTo(startPos.x+w,startPos.y+h,startPos.x+w-r,startPos.y+h);
      ctx.lineTo(startPos.x+r,startPos.y+h);
      ctx.quadraticCurveTo(startPos.x,startPos.y+h,startPos.x,startPos.y+h-r);
      ctx.lineTo(startPos.x,startPos.y+r);
      ctx.quadraticCurveTo(startPos.x,startPos.y,startPos.x+r,startPos.y);
      ctx.closePath();
      if (fillStyle==="solid") { ctx.fillStyle=color; ctx.fill(); }
      ctx.stroke();
    }
    saveState();
    setStartPos(null);
  };

  const applyText = () => {
    if (!textPosition || !textInput) { setShowTextInput(false); return; }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "16px sans-serif"; ctx.fillStyle = color; ctx.textBaseline = "top";
    textInput.split("\n").forEach((line, i) => ctx.fillText(line, textPosition.x, textPosition.y + i*20));
    saveState(); setShowTextInput(false); setTextInput(""); setTextPosition(null);
  };

  return (
    <Draggable handle=".paintHandle" defaultPosition={{x:30,y:10}} grid={[5,5]}>
      <div className={styles.window}>
        {/* Title Bar */}
        <div className={`${styles.titlebar} paintHandle`}>
          <div className={styles.titleLeft}>
            <Image src="/windowsIcons/wordpad.svg" alt="paint" width={16} height={16} />
            <span>{fileName} — Paint</span>
          </div>
          <div className={styles.buttons}>
            <button className={styles.btn}><Image className={styles.btnIcon} src="/windowsIcons/minimize.svg" alt="min" width={50} height={50}/></button>
            <button className={styles.btn} onClick={() => setShowPaint(false)}><Image className={styles.btnIcon} src="/windowsIcons/close.svg" alt="close" width={50} height={50}/></button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className={styles.menubar}>
          <div className={styles.menuGroup}>
            <span className={styles.menuItem}>File</span>
            <div className={styles.dropdown}>
              <div className={styles.dropItem} onClick={clearCanvas}>New</div>
              <div className={styles.dropItem} onClick={saveImage}>Save</div>
              <div className={styles.dropDivider}/>
              <div className={styles.dropItem} onClick={() => setShowPaint(false)}>Exit</div>
            </div>
          </div>
          <div className={styles.menuGroup}>
            <span className={styles.menuItem}>Edit</span>
            <div className={styles.dropdown}>
              <div className={styles.dropItem} onClick={undo} style={{opacity: undoStack.length<=1?0.4:1}}>Undo</div>
              <div className={styles.dropItem} onClick={redo} style={{opacity: redoStack.length===0?0.4:1}}>Redo</div>
              <div className={styles.dropDivider}/>
              <div className={styles.dropItem} onClick={clearCanvas}>Clear Image</div>
            </div>
          </div>
        </div>

        <div className={styles.body}>
          {/* Left Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolGrid}>
              {TOOLS.map(t => (
                <button
                  key={t.id}
                  className={`${styles.toolBtn} ${tool===t.id?styles.toolActive:""}`}
                  onClick={() => setTool(t.id)}
                  title={t.title}
                >
                  {t.icon ? (
                    <Image src={t.icon} alt={t.title} width={20} height={20} style={{imageRendering:"pixelated"}}/>
                  ) : (
                    <span className={styles.toolShape}>
                      {t.id==="select" && <span style={{border:"1px dashed #000",width:14,height:12,display:"block"}}/>}
                      {t.id==="line" && <span style={{display:"block",width:16,height:1,background:"#000",transform:"rotate(45deg)"}}/>}
                      {t.id==="rectangle" && <span style={{border:"1px solid #000",width:14,height:10,display:"block"}}/>}
                      {t.id==="circle" && <span style={{border:"1px solid #000",width:14,height:10,borderRadius:"50%",display:"block"}}/>}
                      {t.id==="roundedRect" && <span style={{border:"1px solid #000",width:14,height:10,borderRadius:3,display:"block"}}/>}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Fill style */}
            <div className={styles.toolSection}>
              <button className={`${styles.fillBtn} ${fillStyle==="transparent"?styles.toolActive:""}`} onClick={()=>setFillStyle("transparent")} title="No Fill">
                <span style={{border:"1px solid #000",width:14,height:10,display:"block"}}/>
              </button>
              <button className={`${styles.fillBtn} ${fillStyle==="solid"?styles.toolActive:""}`} onClick={()=>setFillStyle("solid")} title="Solid Fill">
                <span style={{background:"#000",width:14,height:10,display:"block"}}/>
              </button>
            </div>

            {/* Line width */}
            <div className={styles.toolSection}>
              {[1,3,5].map(w => (
                <button key={w} className={`${styles.fillBtn} ${lineWidth===w?styles.toolActive:""}`} onClick={()=>setLineWidth(w)}>
                  <span style={{background:"#000",width:14,height:w,display:"block",margin:"auto"}}/>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className={styles.canvasArea}>
            <div className={styles.canvasWrapper}>
              <canvas
                ref={canvasRef}
                className={styles.canvas}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => { if(isDrawing){setIsDrawing(false);saveState();} }}
              />
              {showTextInput && textPosition && (
                <textarea
                  className={styles.textOverlay}
                  style={{left:textPosition.x, top:textPosition.y}}
                  value={textInput}
                  onChange={e=>setTextInput(e.target.value)}
                  onBlur={applyText}
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className={styles.palette}>
          <div className={styles.currentColors}>
            <div className={styles.fgColor} style={{background:color}} title="Foreground"/>
            <div className={styles.bgColor} style={{background:bgColor}} title="Background"/>
          </div>
          <div className={styles.colorGrid}>
            {COLORS.map(c => (
              <button
                key={c}
                className={styles.colorSwatch}
                style={{background:c}}
                onClick={()=>setColor(c)}
                onContextMenu={e=>{e.preventDefault();setBgColor(c);}}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div className={styles.statusbar}>
          <span>{TOOLS.find(t2=>t2.id===tool)?.title} — Left click: draw | Right click: bg color</span>
          <span>{isModified?"● ":""}{fileName}</span>
        </div>
      </div>
    </Draggable>
  );
}