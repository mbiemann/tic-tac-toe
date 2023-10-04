import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';

function check(board, player) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
}

function draw(board) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      return false;
    }
  }
  return true;
}

function name(mode, player) {
  if (mode === 'HvA' && player === 'X')
    return 'YOU (X)'
  if (mode === 'HvA' && player === 'O')
    return 'AI (O)'
  if (mode === 'AvH' && player === 'X')
    return 'AI (X)'
  if (mode === 'AvH' && player === 'O')
    return 'YOU (O)'
  return player;
}

function App() {
  const [mode, setMode] = useState('HvA');
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState('');
  const [board, setBoard] = useState(Array(9).fill(''));
  const [nextPlayer, setNextPlayer] = useState('X');
  const [statusMessage, setStatusMessage] = useState(`Next Player: ${name('HvA', 'X')}`);

  function onModeClick(value) {
    setMode(value);
    setHistory([]);
    setResult('');
    setBoard(Array(9).fill(''));
    setNextPlayer('X');
    setStatusMessage(`Next Player: ${name(value, 'X')}`);
  }

  function onNewClick() {
    setResult('');
    setBoard(Array(9).fill(''));
    setNextPlayer('X');
    setStatusMessage(`Next Player: ${name(mode, 'X')}`);
  }

  function addToHistory(message) {
    const nextHistory = history.slice();
    nextHistory.push(message);
    setHistory(nextHistory);
  }

  function onSquareClick(i) {
    if (board[i] === '' && result === '' && (
      (mode === 'HvH') || (mode === 'HvA' && nextPlayer === 'X') || (mode === 'AvH' && nextPlayer === 'O')
    )) {
      const nextBoard = board.slice();
      nextBoard[i] = nextPlayer;
      setBoard(nextBoard);
      if (check(nextBoard, nextPlayer)) {
        setResult(nextPlayer);
        setStatusMessage(`${name(mode, nextPlayer)} wins!`);
        addToHistory(`${name(mode, nextPlayer)} wins!`)
      } else if (draw(nextBoard)) {
        setResult('draw');
        setStatusMessage('draw!');
        addToHistory('draw!')
      } else {
        if (nextPlayer === 'X') {
          setNextPlayer('O');
          setStatusMessage(`Next Player: ${name(mode, 'O')}`);
        } else {
          setNextPlayer('X');
          setStatusMessage(`Next Player: ${name(mode, 'X')}`);
        }
      }
    }
  }

  const divModes = (
    <div>
      <p>
        <button className="btn-primary m-2 w-60" onClick={() => onModeClick('HvH')}>
          Human vs Human
        </button>
      </p>
      <p>
        <button className="btn-primary m-2 w-60" onClick={() => onModeClick('HvA')}>
          Human vs AI
        </button>
      </p>
      <p>
        <button className="btn-primary m-2 w-60" onClick={() => onModeClick('AvH')}>
          AI vs Human
        </button>
      </p>
      <p>
        <button className="btn-primary m-2 w-60" onClick={() => onModeClick('AvA')}>
          AI vs AI
        </button>
      </p>
    </div>
  )

  const divBoard = (
    <div>
      <button className="btn-primary m-2 w-60" onClick={() => setMode('')}>
        &#8592; {(mode === 'HvH') ? 'Human vs Human' : (mode === 'HvA') ? 'Human vs AI' : (mode === 'AvH') ? 'AI vs Human' : (mode === 'AvA') ? 'AI vs AI' : 'INVALID MODE!'}
      </button>
      <table className="table-fixed">
        <tbody>
          <tr className="border-b-2">
            <td className="border-r-2"><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(0)}>{board[0]}</button></td>
            <td className="border-r-2"><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(1)}>{board[1]}</button></td>
            <td                       ><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(2)}>{board[2]}</button></td>
          </tr>
          <tr className="border-b-2">
            <td className="border-r-2"><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(3)}>{board[3]}</button></td>
            <td className="border-r-2"><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(4)}>{board[4]}</button></td>
            <td                       ><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(5)}>{board[5]}</button></td>
          </tr>
          <tr>
            <td className="border-r-2"><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(6)}>{board[6]}</button></td>
            <td className="border-r-2"><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(7)}>{board[7]}</button></td>
            <td                       ><button className="text-4xl h-20 w-20" onClick={() => onSquareClick(8)}>{board[8]}</button></td>
          </tr>
        </tbody>
      </table>
      <div>
        <button className="btn-primary m-2 w-20" onClick={onNewClick} disabled={((mode === 'AvA') || (mode === 'HvA' && nextPlayer === 'O') || (mode === 'AvH' && nextPlayer === 'X'))}>{(result === '') ? 'Reset' : 'New'}</button>
        {statusMessage}
      </div>
      <div>
        <p>History:</p>
        {history.map((hist) => <p>{hist}</p>)}
      </div>
    </div>
  )

  return (
    <div>
      {(mode === '') ? divModes : divBoard}
    </div>
  )
}

const root = createRoot(document.getElementById('app'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
