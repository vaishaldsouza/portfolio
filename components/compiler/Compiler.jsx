"use client";
import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import Image from "next/image";
import styles from "./compiler.module.scss";

const STARTER_CODE = `# Welcome to Prajwal's Python Compiler! 🐍
# Powered by Pyodide — real Python in your browser!

print("Hello from Prajwal's portfolio! 👋")

# Try some ML stuff:
numbers = [1, 2, 3, 4, 5]
mean = sum(numbers) / len(numbers)
print(f"Mean: {mean}")

# Fibonacci
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b

print("\\nFibonacci:")
fib(10)
`;

export default function Compiler({ setShowCompiler }) {
  const [code, setCode] = useState(STARTER_CODE);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Click Run to load Python...");
  const pyodideRef = useRef(null);

  const loadPyodide = async () => {
    if (pyodideRef.current) return;
    setIsLoading(true);
    setLoadingMsg("Loading Python... (first run takes ~5 seconds)");
    try {
      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      });
      pyodideRef.current = pyodide;
      setPyodideReady(true);
      setLoadingMsg("Python ready! ✅");
    } catch (e) {
      setLoadingMsg("Failed to load Python ❌");
      setOutput("Error loading Pyodide: " + e.message);
    }
    setIsLoading(false);
  };

  const runCode = async () => {
    if (!pyodideRef.current) {
      await loadPyodide();
      if (!pyodideRef.current) return;
    }
    setIsLoading(true);
    setOutput("Running...");
    try {
      const pyodide = pyodideRef.current;
      // Capture stdout
      pyodide.runPython(`
import sys
import io
sys.stdout = io.StringIO()
`);
      try {
        pyodide.runPython(code);
        const stdout = pyodide.runPython("sys.stdout.getvalue()");
        setOutput(stdout || "✅ Code ran successfully (no output)");
      } catch (err) {
        setOutput("❌ Error:\n" + err.message);
      }
      // Reset stdout
      pyodide.runPython("sys.stdout = sys.__stdout__");
    } catch (e) {
      setOutput("❌ " + e.message);
    }
    setIsLoading(false);
  };

  const clearOutput = () => setOutput("");
  const clearCode = () => setCode("");

  return (
    <>
      {/* Load Pyodide script */}
      <script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" async />

      <Draggable handle=".compilerHandle" defaultPosition={{ x: 60, y: 20 }} grid={[5, 5]}>
        <div className={styles.window}>
          {/* Title Bar */}
          <div className={`${styles.titlebar} compilerHandle`}>
            <div className={styles.titleLeft}>
              <span>🐍</span>
              <span>Python Compiler — Prajwal's Portfolio</span>
            </div>
            <div className={styles.buttons}>
              <button className={styles.btn}>
                <Image className={styles.btnIcon} src="/windowsIcons/minimize.svg" alt="min" width={50} height={50} />
              </button>
              <button className={styles.btn} onClick={() => setShowCompiler(false)}>
                <Image className={styles.btnIcon} src="/windowsIcons/close.svg" alt="close" width={50} height={50} />
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button className={styles.toolBtn} onClick={runCode} disabled={isLoading}>
              {isLoading ? "⏳ Running..." : "▶ Run"}
            </button>
            <button className={styles.toolBtn} onClick={clearOutput}>🗑 Clear Output</button>
            <button className={styles.toolBtn} onClick={clearCode}>📄 New File</button>
            <button className={styles.toolBtn} onClick={() => setCode(STARTER_CODE)}>↩ Reset</button>
            <span className={styles.statusMsg}>
              {pyodideReady ? "🐍 Python 3.11 Ready" : loadingMsg}
            </span>
          </div>

          <div className={styles.body}>
            {/* Code Editor */}
            <div className={styles.editorPane}>
              <div className={styles.paneTitle}>📝 Editor</div>
              <div className={styles.lineNumbers}>
                {code.split("\n").map((_, i) => (
                  <div key={i} className={styles.lineNum}>{i + 1}</div>
                ))}
              </div>
              <textarea
                className={styles.editor}
                value={code}
                onChange={e => setCode(e.target.value)}
                spellCheck={false}
                onKeyDown={e => {
                  // Tab key inserts spaces
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const start = e.target.selectionStart;
                    const end = e.target.selectionEnd;
                    const newCode = code.substring(0, start) + "    " + code.substring(end);
                    setCode(newCode);
                    setTimeout(() => e.target.setSelectionRange(start + 4, start + 4), 0);
                  }
                  // Ctrl+Enter to run
                  if (e.ctrlKey && e.key === "Enter") runCode();
                }}
                placeholder="Write your Python code here..."
              />
            </div>

            {/* Output */}
            <div className={styles.outputPane}>
              <div className={styles.paneTitle}>📤 Output</div>
              <pre className={styles.output}>
                {output || "// Output will appear here after running code\n// Press ▶ Run or Ctrl+Enter"}
              </pre>
            </div>
          </div>

          <div className={styles.statusbar}>
            <span>Python 3.11 • Pyodide • Ctrl+Enter to Run</span>
            <span>Lines: {code.split("\n").length}</span>
          </div>
        </div>
      </Draggable>
    </>
  );
}