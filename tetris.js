// Dimensions de la grille
const ROWS = 20;
const COLS = 10;

// Conteneur du jeu
const gameContainer = document.getElementById("game-container");

//Key bindings
document.addEventListener("keydown", recordKey);

// Initialiser la grille (tableau 2D)
console.log({ length: ROWS });
const backgroundGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const foregroundGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const coordonneeTetrominos = [6, 6];

// Tétrominos (tableaux 2D avec des 1 et des 0)
const tetrominos = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  O: [
    [4, 4],
    [4, 4],
  ],
  S: [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  Z: [
    [6, 6, 0],
    [0, 6, 6],
    [0, 0, 0],
  ],
  T: [
    [0, 7, 0],
    [7, 7, 7],
    [0, 0, 0],
  ],
};

// Dessiner la grille dans le DOM
function drawbackgroundGrid() {
  gameContainer.innerHTML = ""; // Réinitialiser la grillefor (let row = 0; row < ROWS; row++) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      switch (backgroundGrid[row][col]) {
        case 1:
          cell.classList.add("active1");
          break;
        case 2:
          cell.classList.add("active2");
          break;
        case 3:
          cell.classList.add("active3");
          break;
        case 4:
          cell.classList.add("active4");
          break;
        case 5:
          cell.classList.add("active5");
          break;
        case 6:
          cell.classList.add("active6");
          break;
        case 7:
          cell.classList.add("active7");
          break;
        default:
      }
      gameContainer.appendChild(cell);
    }
  }
}

function resetBackgroundGrid() {
  backgroundGrid.forEach((element) => {
    element.fill(0);
  });
  console.log(backgroundGrid);
}

// Ajouter un tétromino à la grille
function addTetrominoTobackgroundGrid(tetromino) {
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col] > 0) {
        if (
          coordonneeTetrominos[0] + row >= ROWS ||
          coordonneeTetrominos[1] + col >= COLS
        ) {
          throw new Error("outOfBoundException");
        }
        backgroundGrid[coordonneeTetrominos[0] + row][
          coordonneeTetrominos[1] + col
        ] = tetromino[row][col];
      }
    }
  }
}

function rotateTetromino() {
  let n = tetromino.length;
  for (let i = 0; i < n / 2; i++) {
    for (let j = i; j < n - i - 1; j++) {
      let temp = tetromino[i][j];
      tetromino[i][j] = tetromino[n - j - 1][i];
      tetromino[n - j - 1][i] = tetromino[n - i - 1][n - j - 1];
      tetromino[n - i - 1][n - j - 1] = tetromino[j][n - i - 1];
      tetromino[j][n - i - 1] = temp;
    }
  }
}

function moveToRightTetromino() {
  if (coordonneeTetrominos[1] == COLS-1) {
    throw new Error("outOfBoundException");
  }
  coordonneeTetrominos[1]++;
}

function moveToLeftTetromino() {
  if (coordonneeTetrominos[1] == 0) {
    throw new Error("outOfBoundException");
  }
  coordonneeTetrominos[1]--;
}

function moveToDownTetromino() {
  if (coordonneeTetrominos[0] == ROWS-1) {
    throw new Error("outOfBoundException");
  }
  coordonneeTetrominos[0]++;
}

// Initialisation
var tetromino = tetrominos.I;
addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
drawbackgroundGrid();

function recordKey(e) {
  console.log("testt");
  switch (e.key) {
    case "Up":
    case "ArrowUp":
      try {
        resetBackgroundGrid();
        rotateTetromino();
        addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
        drawbackgroundGrid();
      } catch (error) {
        console.log("Error");
      }
      console.log(tetromino);
      break;
    case " ":
    case "Spacebar":
      break;
    case "ArrowRight":
      try {
        resetBackgroundGrid();
        moveToRightTetromino();
        addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
        drawbackgroundGrid();
      } catch (error) {
        //Si on a depasser donc on annule l'action
      }
      break;
    case "ArrowLeft":
      try {
        resetBackgroundGrid();
        moveToLeftTetromino();
        addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
        drawbackgroundGrid();
      } catch (error) {
        //Si on a depasser donc on annule l'action
      }
      break;
    case "ArrowDown":
      try {
        resetBackgroundGrid();
        moveToDownTetromino();
        addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
        drawbackgroundGrid();
      } catch (error) {
        //Si on a depasser donc on annule l'action
      }
      break;
    default:
      return;
  }
}
