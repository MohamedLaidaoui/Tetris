// Dimensions de la grille
const ROWS = 21;
const COLS = 10;

var score = 0;
var level = 0;
var nbLignecompleteTotal = 0; //on augmente le niveau toutes les 10 ligne complète
const initialSpeed = 800; //vitesse initial du jeu
var gameSpeed=800; //vitesse du jeu
var gameStarted = false;


// Conteneur du jeu
const gameContainer = document.getElementById("game-container");

// niveau et score
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

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

var tetromino = getRandomTetromino();
var nextTetromino = getRandomTetromino(); // Prévisualisation du prochain tetromino

function start(){
  // Initialisation
addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
drawbackgroundGrid();
drawPreviewTetromino(nextTetromino);

gameloop = setInterval(updateGame, gameSpeed);
document.getElementById("start").disabled = true;
gameStarted=true;
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

function drawPreviewTetromino(tetromino) {
  const previewContainer = document.getElementById("preview");
  previewContainer.innerHTML = ""; // Réinitialiser la prévisualisation
  
  // Créer une grille de prévisualisation pour afficher le tétrimino
  for (let row = 0; row < 4; row++) { // La preview sera une grille 4x4
    for (let col = 0; col < 4; col++) {
      const cell = document.createElement("div");
      
      cell.classList.add("cell");

      // Dessiner le tétrimino dans la preview si la cellule est active
      if (tetromino[row] && tetromino[row][col] > 0) {
        // Ajout d'une classe active en fonction de la couleur
         cell.classList.add(`active${tetromino[row][col]}`);
      }
      else{

        cell.style="background-color: #222;"

      }
        

      previewContainer.appendChild(cell);
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
          coordonneeTetrominos[1] + col >= COLS ||
          coordonneeTetrominos[0] + row < 0 ||
          coordonneeTetrominos[1] + col < 0 

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
  coordonneeTetrominos[1]--;
}

function moveToDownTetromino() {
  
  if (isCollision()) {
    console.log("Collision détectée");
    addTetrominoTobackgroundGrid(tetromino);
    lockTetromino();

    // Passer au prochain tétrimino
    console.log("Changement de tétrimino");
    console.log("Tétrimino actuel avant changement:", tetromino);
    console.log("Tétrimino suivant:", nextTetromino);

    tetromino = nextTetromino; 
    nextTetromino = getRandomTetromino(); // Générer un nouveau tétrimino
    drawPreviewTetromino(nextTetromino); // Afficher le prochain tétrimino

    // Réinitialiser les coordonnées du tétrimino
    coordonneeTetrominos[0] = 0;
    coordonneeTetrominos[1] = 3;

    console.log("Tétrimino après changement:", tetromino);
    console.log("Next Tetromino (nouveau):", nextTetromino);
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


function checkLine() {
  
  let nbligneComplete = 0; //on compte le nombre de ligne complète pour le score

  for (let row = foregroundGrid.length - 1; row >= 0; row--) {
    let isComplete = true;

    //parcour la grille et verifie si une ligne est complete
    for (let col = 0; col < foregroundGrid[row].length; col++) {
      if (foregroundGrid[row][col] === 0) {
        isComplete = false;
        break;
      }
    }

    // Si la ligne est complète
    if (isComplete) {
      // Supprime la ligne 
      foregroundGrid.splice(row, 1);

      // Ajoute une nouvelle ligne vide en haut de la grille
      foregroundGrid.unshift(new Array(foregroundGrid[0].length).fill(0));

      // Vérifier la même ligne à nouveau car elle a été remplacée
      row++;
      nbligneComplete++;
    }
  }
  nbLignecompleteTotal += nbligneComplete;
  
  let newLevel = Math.floor(nbLignecompleteTotal / 2) + 1;

  if (newLevel > level) {
    level = newLevel;
    gameSpeed = initialSpeed - (level) * 50;
    levelElement.innerHTML = level;
  }

  score += nbligneComplete * (level + 1) * 100;
  scoreElement.innerHTML = score;

  console.log(nbLignecompleteTotal);
  console.log(level);
  console.log(gameSpeed);

}

function updateGame(){
  try {
  resetBackgroundGrid();
  moveToDownTetromino();
  addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
  } catch (error) {
    //Si tetrominoException a l'ajout c'est que l'on est gameOver
    if (error.message="colissionWithTetrominoException"){
      console.log("GameOver")
      alert("Game Over, score : "+score)
      location.reload();
      clearInterval(gameloop);
    }
  }
  drawbackgroundGrid();
  checkLine();
}

var gameloop;
drawbackgroundGrid();





function recordKey(e) {
  if (gameStarted){

  
  switch (e.key) {
    case "Up":
    case "ArrowUp":
      try {
        resetBackgroundGrid();
        rotateTetromino();
        addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
        drawbackgroundGrid();
        checkLine();

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
        checkLine();
      } catch (error) {
        //Si on a depasser donc on annule l'action
        if (error.message="colissionWithTetrominoException"){
          
        }
      }
      break;
    case "ArrowLeft":
      try {
        resetBackgroundGrid();
        moveToLeftTetromino();
        addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
        drawbackgroundGrid();
        checkLine();
      } catch (error) {
        //Si on a depasser donc on annule l'action
        if (error.message="colissionWithTetrominoException"){
          
        }
      }
      break;
    case "ArrowDown":
      try {
        resetBackgroundGrid();
        moveToDownTetromino();
        addTetrominoTobackgroundGrid(tetromino); // Ajouter un tétromino "T" à la grille
        drawbackgroundGrid();
        checkLine();
      } catch (error) {
        //Si on a depasser donc on annule l'action
      }
      break;
    default:
      return;
  }
}
}
