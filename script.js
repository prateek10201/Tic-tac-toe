document.addEventListener("DOMContentLoaded", () => {
  // Game state
  const state = {
    board: Array(9).fill(""),
    currentPlayer: "X",
    gameActive: true,
    winningCombinations: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ],
    scores: {
      X: 0,
      O: 0,
      tie: 0,
    },
  };

  // DOM elements
  const cells = document.querySelectorAll(".cell");
  const statusDisplay = document.getElementById("status");
  const resetButton = document.getElementById("reset-button");
  const xScoreDisplay = document.getElementById("x-score");
  const oScoreDisplay = document.getElementById("o-score");
  const tieScoreDisplay = document.getElementById("tie-score");

  // Functions
  const handleCellClick = (clickedCellEvent) => {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    // Check if cell is already played or game is inactive
    if (state.board[clickedCellIndex] !== "" || !state.gameActive) {
      return;
    }

    // Update state and UI
    updateCell(clickedCell, clickedCellIndex);
    checkResult();
  };

  const updateCell = (cell, index) => {
    state.board[index] = state.currentPlayer;
    cell.textContent = state.currentPlayer;
    cell.classList.add(state.currentPlayer.toLowerCase());
  };

  const changePlayer = () => {
    state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = `Player ${state.currentPlayer}'s turn`;
  };

  const checkResult = () => {
    let roundWon = false;
    let winningCells = [];

    // Check winning combinations
    for (let i = 0; i < state.winningCombinations.length; i++) {
      const [a, b, c] = state.winningCombinations[i];
      const values = [state.board[a], state.board[b], state.board[c]];

      // Skip if any cell is empty
      if (values[0] === "") {
        continue;
      }

      // Check if all values are the same
      if (values.every((value) => value === values[0])) {
        roundWon = true;
        winningCells = [a, b, c];
        break;
      }
    }

    // Handle game outcomes
    if (roundWon) {
      highlightWinningCells(winningCells);
      statusDisplay.textContent = `Player ${state.currentPlayer} wins!`;
      state.scores[state.currentPlayer]++;
      updateScoreDisplay();
      state.gameActive = false;
      return;
    }

    // Check for tie
    if (!state.board.includes("")) {
      statusDisplay.textContent = "Game ended in a tie!";
      state.scores.tie++;
      updateScoreDisplay();
      state.gameActive = false;
      return;
    }

    // Continue game with next player
    changePlayer();
  };

  const highlightWinningCells = (cellIndices) => {
    cellIndices.forEach((index) => {
      cells[index].classList.add("winning");
    });
  };

  const updateScoreDisplay = () => {
    xScoreDisplay.textContent = state.scores.X;
    oScoreDisplay.textContent = state.scores.O;
    tieScoreDisplay.textContent = state.scores.tie;
  };

  const resetBoard = () => {
    state.board = Array(9).fill("");
    state.currentPlayer = "X";
    state.gameActive = true;

    // Reset UI
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "winning");
    });

    statusDisplay.textContent = `Player X's turn`;
  };

  // Event listeners
  cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });

  resetButton.addEventListener("click", resetBoard);

  // Prevent context menu on right-click to avoid confusion
  document.getElementById("board").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  // For accessibility
  cells.forEach((cell) => {
    cell.setAttribute("role", "button");
    cell.setAttribute("aria-label", "Empty cell");
    cell.setAttribute("tabindex", "0");

    // Add keyboard support
    cell.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCellClick({ target: cell });
      }
    });
  });

  // Optional: Add keyboard navigation with arrow keys
  document.addEventListener("keydown", (e) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      return;
    }

    e.preventDefault();

    // Find the currently focused element
    const focused = document.activeElement;
    if (!focused || !focused.classList.contains("cell")) {
      cells[0].focus();
      return;
    }

    const currentIndex = parseInt(focused.getAttribute("data-index"));
    let nextIndex;

    // Calculate next focus based on arrow key
    switch (e.key) {
      case "ArrowUp":
        nextIndex = currentIndex - 3;
        break;
      case "ArrowDown":
        nextIndex = currentIndex + 3;
        break;
      case "ArrowLeft":
        nextIndex =
          currentIndex % 3 === 0 ? currentIndex + 2 : currentIndex - 1;
        break;
      case "ArrowRight":
        nextIndex =
          currentIndex % 3 === 2 ? currentIndex - 2 : currentIndex + 1;
        break;
    }

    // Focus next cell if it's valid
    if (nextIndex >= 0 && nextIndex < 9) {
      cells[nextIndex].focus();
    }
  });

  // Initialize UI updates
  updateScoreDisplay();
});
