let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let currentPlayer = human;
let gameActive = true;

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive || currentPlayer !== human) return;

  makeMove(index, human);
  if (!checkGameOver()) {
    currentPlayer = ai;
    setTimeout(() => {
      const aiIndex = getBestMove(board, ai);
      makeMove(aiIndex, ai);
      checkGameOver();
      currentPlayer = human;
    }, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player); // Add styling class
}


function checkGameOver() {
  const winner = checkWinner();
  if (winner) {
    statusText.textContent = winner === human ? "You Win! 🎉" : "AI Wins 😈";
    gameActive = false;
    return true;
  }

  if (!board.includes("")) {
    statusText.textContent = "It's a Draw 🤝";
    gameActive = false;
    return true;
  }

  statusText.textContent = currentPlayer === human ? "Your Turn (X)" : "AI's Turn (O)";
  return false;
}

function checkWinner() {
  const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function getBestMove(newBoard, player) {
  const winner = checkWinner();
  if (winner === human) return -10;
  if (winner === ai) return 10;
  if (!newBoard.includes("")) return 0;

  const moves = [];

  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[i] === "") {
      newBoard[i] = player;
      let score = getBestMove(newBoard, player === ai ? human : ai);
      newBoard[i] = "";
      moves.push({ index: i, score });
    }
  }

  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    for (let move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move.index;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let move of moves) {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move.index;
      }
    }
  }

  return bestMove;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = human;
  gameActive = true;
  cells.forEach(cell => cell.textContent = "");
  statusText.textContent = "Your Turn (X)";
}
