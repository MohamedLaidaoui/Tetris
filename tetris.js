// Dimensions de la grille
const ROWS = 21;
const COLS = 10;

// Conteneur du jeu
const gameContainer = document.getElementById("game-container");

//Key bindings
document.addEventListener("keydown", recordKey);

// Initialiser la grille (tableau 2D)
console.log({ length: ROWS });
const backgroundGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const foregroundGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
const coordonneeTetrominos = [0, 3];

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

//genere un tetromino aleatoire
function getRandomTetromino() {
  const tetrominoKeys = Object.keys(tetrominos); // Récupère les clés (I, J, L, O, S, Z, T)
  const randomKey = tetrominoKeys[Math.floor(Math.random() * tetrominoKeys.length)]; // Sélectionne une clé au hasard
  return tetrominos[randomKey]; // Retourne le nom du tétriminos sous forme de chaîne
}

// Dessiner la grille dans le DOM
function drawbackgroundGrid() {
  gameContainer.innerHTML = ""; // Réinitialiser la grille
  
  for (let row = 1; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      
      // Vérifier d'abord la foregroundGrid
      if (foregroundGrid[row][col] !== 0) {
        cell.classList.add(`active${foregroundGrid[row][col]}`);
      } 
      // Si foregroundGrid est vide, vérifier la backgroundGrid
      else if (backgroundGrid[row][col] !== 0) {
        cell.classList.add(`active${backgroundGrid[row][col]}`);
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
  console.log("foregroundGrid");
  console.log(foregroundGrid);
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
          console.log("outOfBoundException");
          throw new Error("outOfBoundException");
        }

        if (foregroundGrid[coordonneeTetrominos[0] + row]
                          [coordonneeTetrominos[1] + col] >0 ) {
        console.log("colissionWithTetrominoException"); 
        throw new Error("colissionWithTetrominoException");
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
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col] > 0) {
        // Vérifie si une partie du tétrimino dépasserait la limite droite
        if (coordonneeTetrominos[1] + col + 1 >= COLS) {
          throw new Error("outOfBoundException");
        }
      }
    }
  }
  coordonneeTetrominos[1]++;
}


function moveToLeftTetromino() {
  //On verifie si on a pas atteint le mur de gauche 
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col] > 0) {
        if (coordonneeTetrominos[1] + col - 1 < 0) {
          throw new Error("outOfBoundException");
        }
      }
    }
  }

  //On verifie si on n'entre pas en colission avec un tetromino sur la gauche
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col] > 0) {
        if (coordonneeTetrominos[1] + col - 1 < 0) {
          throw new Error("CollisionWithTetromino");
        }
      }
    }
  }
  coordonneeTetrominos[1]--;
}

function moveToDownTetromino() {
  
  if (isCollision()) {
    // Ajouter le tétrimino à la grille
    addTetrominoTobackgroundGrid(tetromino);
    lockTetromino();
    // Générer un nouveau tétrimino
    // Réinitialiser les coordonnées du tétrimino
    coordonneeTetrominos[0] = 0;
    coordonneeTetrominos[1] = 3;
    tetromino = getRandomTetromino();
  }
  
  coordonneeTetrominos[0]++;
}

function isCollision() {
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col] > 0) {
        const newRow = coordonneeTetrominos[0] + row + 1;
        const newCol = coordonneeTetrominos[1] + col;

        // Vérifie si le bas de la grille est atteint
        if (newRow >= ROWS) {
          return true;
        }

        // Vérifie s'il y a une autre pièce en dessous
        if (foregroundGrid[newRow][newCol] > 0) {
          return true;
        }
      }
    }
  }
  return false;
}

//place le tetrominos dans la foregroundGrid (utilisé dans isColistion)
function lockTetromino() {
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col] > 0) {
        foregroundGrid[coordonneeTetrominos[0] + row][coordonneeTetrominos[1] + col] = tetromino[row][col];
      }
    }
  }
}

function updateGame(){
  resetBackgroundGrid();
  moveToDownTetromino();
  addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
  drawbackgroundGrid();
}


// Initialisation
var tetromino = getRandomTetromino();
addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
drawbackgroundGrid();

setInterval(updateGame, 1000);

function recordKey(e) {
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
        //Si on a depasser donc on annule l'action
        if (error.message="colissionWithTetrominoException"){
          rotateTetromino();
          rotateTetromino();
          rotateTetromino();
        }
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
        if (error.message="colissionWithTetrominoException"){
          moveToLeftTetromino();
        }
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
        if (error.message="colissionWithTetrominoException"){
          moveToRightTetromino();
        }
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
