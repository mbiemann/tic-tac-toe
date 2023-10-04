function flat(board) {
    let resp = "";
    for (const i in board)
        resp += (board[i]==="")?"-":board[i];
    return resp;
}

function another(player) {
    return (player === 'X') ? 'O' : 'X'
}

function check(player, board) {
    return (
        board[0] === player && board[1] === player && board[2] === player ||
        board[3] === player && board[4] === player && board[5] === player ||
        board[6] === player && board[7] === player && board[8] === player ||
        board[0] === player && board[3] === player && board[6] === player ||
        board[1] === player && board[4] === player && board[7] === player ||
        board[2] === player && board[5] === player && board[8] === player ||
        board[0] === player && board[4] === player && board[8] === player ||
        board[2] === player && board[4] === player && board[6] === player
    );
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

const board = ["X", "O", "X", "", "O", "", "O", "", "X"];
console.log(flat(board));

board[minimax("X", board)] = "X";
console.log(flat(board));
console.log(check("X", board));
