const ROWS = 20;
const COLS = 10;

// Conteneur du jeu
const gameContainer = document.getElementById("game-container");

// Initialiser la grille (tableau 2D)
console.log({ length: ROWS })
const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
console.log(grid);

// Tétrominos (tableaux 2D avec des 1 et des 0)
const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };

// Dessiner la grille dans le DOM
function drawGrid() {
    gameContainer.innerHTML = ""; // Réinitialiser la grille
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (grid[row][col] === 1) {
          cell.classList.add("active");
        }
        gameContainer.appendChild(cell);
      }
    }
  }
  