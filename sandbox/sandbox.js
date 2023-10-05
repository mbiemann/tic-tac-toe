const start_dt = new Date();
console.log("start:", start_dt);

// const players = ["X","O"]
// const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
// const board = ["X","","X","O","O","O","X","",""];

// for (let p in players) {
//     const player = players[p];
//     console.log("player",player);
//     for (let w in wins) {
//         const win = wins[w];
//         if (board[win[0]] == player && board[win[1]] == player && board[win[2]] == player)
//             console.log("player",player,"wins!");
//     }
// }

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
  
const history = [
    "OO--XXOX- = YOU - X wins!",
    "-O-XX-O-- = YOU - X wins!",
    "O--XX---O = YOU - X wins!",
    "XXOXXOOO- = YOU - X wins!",
    "-XOOXXXOO = draw!",
    "-OXOXXOXO = draw!",
    "O--XO-XX- = AI - O wins!"
];

console.log("games:",history.length);
console.log("draws:",history.filter(s => s.includes("draw!")).length);
console.log(`${name("HvA", "X")} wins:`,history.filter(s => s.includes("X wins!")).length);
console.log(`${name("HvA", "O")} wins:`,history.filter(s => s.includes("O wins!")).length);

end_dt = new Date();
duration = end_dt - start_dt;
console.log("start:", start_dt, "| end:", end_dt, "| duration in seconds:", duration/1000);