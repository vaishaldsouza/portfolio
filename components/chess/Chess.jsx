"use client";
import { useState } from "react";
import Draggable from "react-draggable";
import Image from "next/image";
import styles from "./chess.module.scss";

const PIECES = {
  wK:"♔",wQ:"♕",wR:"♖",wB:"♗",wN:"♘",wP:"♙",
  bK:"♚",bQ:"♛",bR:"♜",bB:"♝",bN:"♞",bP:"♟",
};

const initBoard = () => {
  const board = Array(8).fill(null).map(()=>Array(8).fill(null));
  const backRow = ["R","N","B","Q","K","B","N","R"];
  for(let i=0;i<8;i++){
    board[0][i]="b"+backRow[i]; board[1][i]="bP";
    board[6][i]="wP"; board[7][i]="w"+backRow[i];
  }
  return board;
};

const isValidMove = (board, fr, fc, tr, tc) => {
  const piece = board[fr][fc];
  if(!piece) return false;
  const color=piece[0], type=piece[1];
  const target=board[tr][tc];
  if(target&&target[0]===color) return false;
  const dr=tr-fr, dc=tc-fc;
  if(type==="P"){
    const dir=color==="w"?-1:1, start=color==="w"?6:1;
    if(fc===tc&&!board[tr][tc]){
      if(tr===fr+dir) return true;
      if(fr===start&&tr===fr+2*dir&&!board[fr+dir][fc]) return true;
    }
    if(Math.abs(dc)===1&&tr===fr+dir&&target&&target[0]!==color) return true;
    return false;
  }
  if(type==="N") return (Math.abs(dr)===2&&Math.abs(dc)===1)||(Math.abs(dr)===1&&Math.abs(dc)===2);
  if(type==="K") return Math.abs(dr)<=1&&Math.abs(dc)<=1;
  const slidingClear = (stepR, stepC) => {
    let r=fr+stepR, c=fc+stepC;
    while(r!==tr||c!==tc){if(board[r][c]) return false; r+=stepR; c+=stepC;}
    return true;
  };
  if(type==="R") return (dr===0||dc===0)&&slidingClear(dr===0?0:dr/Math.abs(dr), dc===0?0:dc/Math.abs(dc));
  if(type==="B") return Math.abs(dr)===Math.abs(dc)&&slidingClear(dr/Math.abs(dr), dc/Math.abs(dc));
  if(type==="Q"){
    if(dr===0||dc===0) return slidingClear(dr===0?0:dr/Math.abs(dr), dc===0?0:dc/Math.abs(dc));
    if(Math.abs(dr)===Math.abs(dc)) return slidingClear(dr/Math.abs(dr), dc/Math.abs(dc));
  }
  return false;
};

const Chess = ({ setShowChess }) => {
  const [board, setBoard] = useState(initBoard());
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("w");
  const [status, setStatus] = useState("Your turn — White ♙");

  const validMoves = selected ? (()=>{
    const moves=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(isValidMove(board,selected[0],selected[1],r,c)) moves.push([r,c]);
    return moves;
  })() : [];

  const cpuMove = (b) => {
    const moves=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(b[r][c]&&b[r][c][0]==="b"){
      for(let tr=0;tr<8;tr++) for(let tc=0;tc<8;tc++) if(isValidMove(b,r,c,tr,tc)) moves.push([r,c,tr,tc]);
    }
    if(!moves.length) return b;
    const [fr,fc,tr,tc]=moves[Math.floor(Math.random()*moves.length)];
    const nb=b.map(row=>[...row]); nb[tr][tc]=nb[fr][fc]; nb[fr][fc]=null;
    return nb;
  };

  const click = (r,c) => {
    if(turn!=="w") return;
    if(selected){
      const [sr,sc]=selected;
      if(isValidMove(board,sr,sc,r,c)){
        const nb=board.map(row=>[...row]);
        const captured=nb[r][c];
        nb[r][c]=nb[sr][sc]; nb[sr][sc]=null;
        setSelected(null);
        if(captured==="bK"){setBoard(nb);setStatus("🎉 You win! GG!");setTurn("done");return;}
        setTurn("b"); setStatus("CPU is thinking...");
        setTimeout(()=>{
          const cb=cpuMove(nb);
          setBoard(cb); setTurn("w"); setStatus("Your turn — White ♙");
        },500);
      } else if(board[r][c]&&board[r][c][0]==="w") setSelected([r,c]);
      else setSelected(null);
    } else {
      if(board[r][c]&&board[r][c][0]==="w") setSelected([r,c]);
    }
  };

  return (
    <Draggable handle=".chessHandle" defaultPosition={{x:80,y:20}} grid={[5,5]}>
      <div className={styles.window}>
        <div className={`${styles.titlebar} chessHandle`}>
          <div className={styles.titleLeft}>
            <Image src="/windowsIcons/programs.png" alt="chess" height={16} width={16} style={{imageRendering:"pixelated"}}/>
            <span>Chess — vs CPU</span>
          </div>
          <div className={styles.buttons}>
            <button className={styles.btn}><Image className={styles.btnIcon} alt="min" src="/windowsIcons/minimize.svg" height={50} width={50}/></button>
            <button className={styles.btn} onClick={()=>setShowChess(false)}><Image className={styles.btnIcon} src="/windowsIcons/close.svg" alt="close" height={50} width={50}/></button>
          </div>
        </div>
        <div className={styles.status}>{status}</div>
        <div className={styles.board}>
          {board.map((row,r)=>row.map((piece,c)=>{
            const light=(r+c)%2===0;
            const sel=selected&&selected[0]===r&&selected[1]===c;
            const valid=validMoves.some(([tr,tc])=>tr===r&&tc===c);
            return (
              <div key={r+"-"+c} className={`${styles.sq} ${light?styles.light:styles.dark} ${sel?styles.sel:""} ${valid?styles.valid:""}`} onClick={()=>click(r,c)}>
                {piece&&<span className={styles.p}>{PIECES[piece]}</span>}
              </div>
            );
          }))}
        </div>
        <div className={styles.footer}>
          <button className={styles.newGame} onClick={()=>{setBoard(initBoard());setSelected(null);setTurn("w");setStatus("Your turn — White ♙");}}>♻ New Game</button>
          <span>You = White ♙ &nbsp;|&nbsp; CPU = Black ♟</span>
        </div>
      </div>
    </Draggable>
  );
};

export default Chess;
