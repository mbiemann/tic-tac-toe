import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function another(player) {
  return (player === "X") ? "O" : "X";
}

function check(player, board) {
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let i in wins) {
    const win = wins[i];
    if (board[win[0]] == player && board[win[1]] == player && board[win[2]] == player)
        return true;
  }
  return false;
}

function available(board) {
  const resp = [];
  for (let i = 0; i < board.length; i++)
    if (board[i] === "")
      resp.push(i)
  return resp;
}

function flat(board) {
  let resp = "";
  for (const i in board)
    resp += (board[i] === "" ? "-" : board[i]);
  return resp;
}

function name(mode, player) {
  if (mode === "HvA" && player === "X")
    return "YOU - X"
  if (mode === "HvA" && player === "O")
    return "AI - O"
  if (mode === "AvH" && player === "X")
    return "AI - X"
  if (mode === "AvH" && player === "O")
    return "YOU - O"
  return player;
}

function minimax(player, board) {
  function loop(player, board, depth = 0, isMaximizing = false) {
      if (check(player, board))
          return 1;
      else if (check(another(player), board))
          return -1;
      else if (!board.flat().includes(""))
          return 0;
      if (isMaximizing) {
          let bestScore = -Infinity;
          for (let i = 0; i < 9; i++) {
              if (board[i] === "") {
                  board[i] = player;
                  const score = loop(player, board, depth + 1, false);
                  board[i] = "";
                  bestScore = Math.max(score, bestScore);
              }
          }
          return bestScore;
      } else {
          let bestScore = Infinity;
          for (let i = 0; i < 9; i++) {
              if (board[i] === "") {
                  board[i] = another(player);
                  const score = loop(player, board, depth + 1, true);
                  board[i] = "";
                  bestScore = Math.min(score, bestScore);
              }
          }
          return bestScore;
      }
  }
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
          board[i] = player;
          const score = loop(player, board);
          board[i] = "";
          if (score > bestScore) {
              bestScore = score;
              bestMove = i;
          }
      }
  }
  return bestMove;
}

function App() {
  const [mode, setMode] = useState("HvA");
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState("");
  const [board, setBoard] = useState(Array(9).fill(""));
  const [nextPlayer, setNextPlayer] = useState("X");
  const [statusMessage, setStatusMessage] = useState(`Next Player: ${name("HvA", "X")}`);
  const [selectedAIMood, setSelectedAIMood] = useState("random");
  const [consecutive, setConsecutive] = useState(0);
  const [startConsecutive, setStartConsecutive] = useState();

  function onModeClick(value) {
    console.log("running onModeClick...");
    setMode(value);
    setHistory([]);
    setResult("");
    setBoard(Array(9).fill(""));
    setNextPlayer("X");
    setStatusMessage(`Next Player: ${name(value, "X")}`);
    setConsecutive(value === "AvA" ? 1 : 0);
    setStartConsecutive();
  }

  function onNewClick() {
    console.log("running onNewClick...");
    if (available(board).length === 9)
      setHistory([]);
    setResult("");
    setBoard(Array(9).fill(""));
    setNextPlayer("X");
    setStatusMessage(`Next Player: ${name(mode, "X")}`);
  }

  function onStartClick() {
    console.log("running onStartClick...");
    setHistory([]);
    setResult("");
    setBoard(Array(9).fill(""));
    setNextPlayer("X");
    setStatusMessage(`Next Player: ${name(mode, "X")}`);
    setConsecutive(250);
    setStartConsecutive(new Date());
  }

  function addToHistory(message) {
    console.log("running addToHistory...");
    const nextHistory = history.slice();
    nextHistory.push(message);
    setHistory(nextHistory);
  }

  function makeMove(i) {
    console.log("running makeMove...");
    if (result === "" && board[i] === "") {
      const nextBoard = board.slice();
      nextBoard[i] = nextPlayer;
      setBoard(nextBoard);
      if (check(nextPlayer, nextBoard)) {
        setResult(nextPlayer);
        setStatusMessage(`${name(mode, nextPlayer)} wins!`);
        addToHistory(`${flat(board)} = ${name(mode, nextPlayer)} wins!`)
      } else if (available(nextBoard).length === 0) {
        setResult("draw");
        setStatusMessage("draw!");
        addToHistory(`${flat(board)} = draw!`)
      } else {
        const newPlayer = (nextPlayer === "X") ? "O" : "X"
        setNextPlayer(newPlayer);
        setStatusMessage(`Next Player: ${name(mode, newPlayer)}`);
      }
    } else
      console.error(`invalid move ${i}`);
  }

  function onSquareClick(i) {
    console.log("running onSquareClick...");
    if ((mode === "HvH") || (mode === "HvA" && nextPlayer === "X") || (mode === "AvH" && nextPlayer === "O"))
      makeMove(i);
  }

  useEffect(() => {
    console.log("running useEffect...");
    if (result === "" && ((mode === "AvA") || (mode === "HvA" && nextPlayer === "O") || (mode === "AvH" && nextPlayer === "X"))) {
      console.log(`playing as AI mood ${selectedAIMood}...`);
      const free = available(board);
      let index = -1;
      if (free.length !== 9) {
        if (selectedAIMood === "blocker") {
          for (const i of free) {
            const tempBoard = board.slice();
            tempBoard[i] = another(nextPlayer);
            if (check(another(nextPlayer), tempBoard)) {
              index = i;
              break;
            }
          }
        } else if (selectedAIMood === "minimax") {
          index = minimax(nextPlayer, board.slice());
        }
      }
      if (index === -1)
        index = free[Math.floor(Math.random() * free.length)];
      makeMove(index);
    } else if (mode === "AvA" && result !== "" && consecutive !== 0)
      if (history.length !== consecutive)
        onNewClick();
  }, [mode, nextPlayer, board, result]);

  const divModes = (
    <div>
      <p>
        <button className="btn-primary m-2 w-60" onClick={() => onModeClick("HvH")}>
          Human vs Human
        </button>
      </p>
      <p>
        <button className="btn-primary m-2 w-60" onClick={() => onModeClick("HvA")}>
          Human vs AI
        </button>
      </p>
      <p>
        <button className="btn-primary m-2 w-60" onClick={() => onModeClick("AvH")}>
          AI vs Human
        </button>
      </p>
      <p>
        <button className="btn-primary m-2 w-60" onClick={() => onModeClick("AvA")}>
          AI vs AI
        </button>
      </p>
    </div>
  )

  const divBoard = (
    <div>
      <button className="btn-primary m-2 w-60" onClick={() => setMode("")}>
        &#8592; {(mode === "HvH") ? "Human vs Human" : (mode === "HvA") ? "Human vs AI" : (mode === "AvH") ? "AI vs Human" : (mode === "AvA") ? "AI vs AI" : "INVALID MODE!"}
      </button>
      <table className="table-fixed">
        <tbody>
          <tr className="border-b-2">
            <td className="border-r-2"><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(0)}>{board[0]}</button></td>
            <td className="border-r-2"><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(1)}>{board[1]}</button></td>
            <td                       ><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(2)}>{board[2]}</button></td>
          </tr>
          <tr className="border-b-2">
            <td className="border-r-2"><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(3)}>{board[3]}</button></td>
            <td className="border-r-2"><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(4)}>{board[4]}</button></td>
            <td                       ><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(5)}>{board[5]}</button></td>
          </tr>
          <tr>
            <td className="border-r-2"><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(6)}>{board[6]}</button></td>
            <td className="border-r-2"><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(7)}>{board[7]}</button></td>
            <td                       ><button className="text-4xl h-20 w-20 disabled:opacity-50" disabled={(result !== "")} onClick={() => onSquareClick(8)}>{board[8]}</button></td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className="btn-primary m-2 w-20" onClick={onNewClick} disabled={((available(board).length === 9 && history.length === 0) || (result === "" && ((mode === "AvA") || (mode === "HvA" && nextPlayer === "O") || (mode === "AvH" && nextPlayer === "X"))))}>{(result !== "") ? "New" : (available(board).length === 9) ? "Clear" : "Reset"}</button>
        {statusMessage}
      </div>
      <div hidden={(mode === "HvH")}>
        AI mood &#8594; <select value={selectedAIMood} onChange={e => setSelectedAIMood(e.target.value)} className="btn-primary ml-1">
          <option value="random">Random</option>
          <option value="blocker">Blocker</option>
          <option value="minimax">Minimax</option>
        </select>
      </div>
      <div hidden={(mode !== "AvA")}>
        <button className="btn-primary m-2 w-60" onClick={onStartClick}>Start consecutive games</button>
      </div>
      <div>
        <p className="font-bold">Games: {history.length} <span hidden={(consecutive === 0)}>of {consecutive}</span></p>
        <p hidden={history.filter(s => s.includes("draw!")).length === 0}>Draws: {history.filter(s => s.includes("draw!")).length}</p>
        <p hidden={history.filter(s => s.includes("X wins!")).length === 0}>{name(mode, "X")} wins: {history.filter(s => s.includes("X wins!")).length}</p>
        <p hidden={history.filter(s => s.includes("O wins!")).length === 0}>{name(mode, "O")} wins: {history.filter(s => s.includes("O wins!")).length}</p>
        <p hidden={startConsecutive == null}>Duration {(new Date() - startConsecutive)/1000} second(s)</p>
        <p hidden={history.length === 0} className="font-bold">Historic:</p>
        {history.map((hist, index) => <p key={index} className="font-mono text-xs">{hist}</p>)}
      </div>
    </div>
  )

  return (
    <div className="flex justify-center">
      {(mode === "") ? divModes : divBoard}
    </div>
  )
}

const root = createRoot(document.getElementById("app"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
