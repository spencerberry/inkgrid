const BOARD_SIZE = 13;

// let gridSize;
// let halfGridSize;
// let quarterGridSize;
// let eighthGridSize;
// let sixteenthGridSize;
let boardCanvas;
let currentMatch;
let p1


function setup() {
  defineGridSize();
  boardCanvas = createCanvas(BOARD_SIZE * gridSize, BOARD_SIZE * gridSize);
  boardCanvas.parent("board");
  boardCanvas.mousePressed(mouseDown);
  boardCanvas.mouseReleased(mouseUp);
  currentMatch = new Match();

  palette = {
    background: 0,
    neutral: 30,
    playerOne: color(113, 5, 136),
    playerTwo: color(37, 105, 255)
  }

  p1 = new Player({column: Math.floor(Math.random()*BOARD_SIZE), row: BOARD_SIZE-1}, 'One', palette.playerOne);
}

function draw(){
  background(palette.background);
  drawGrid();
  drawOutline();
  currentMatch.update();
  currentMatch.draw();
  p1.draw();
}

////// CELL \\\\\\
class Cell {
  constructor(column, row, color) {
    this.column = column;
    this.row = row;
    this.color = color;
   }
}

////// PLAYER \\\\\\
class Player {
  constructor(cell, name, color) {
    this.position = cell;
    this.name = name;
    this.color = color;
  }
  draw() {
    drawPlayer(this.position, this.color)
  }
}

////// MATCH \\\\\\
class Match {
  constructor() {
    this.players = [];
    this.currentTurnIndex = 0;
    this.currentPlayer;
    this.turnComplete = true;
    this.territory = [];
  }
  update() {
    this.currentPlayer = this.players[this.currentTurnIndex % this.players.length];

    if (this.turnInProgress) {
      drawGridSquare(coordToCell(mouseX, mouseY), palette[this.currentPlayer]);
    }
    else if (this.turnComplete){
      let current_cell = coordToCell(mouseX, mouseY)
      let currentPlayer = this.CurrentPlayer;
      let newCell = new Cell(current_cell.column, current_cell.row, palette[currentPlayer]);
      this.addCellToTerritory(newCell);
      this.turnComplete = false;
      this.currentPlayer = (currentMatch.currentPlayer == 0) ? 1 : 0;
    }
  }
  draw(){
    for (let cell of this.territory){
      drawGridSquare(cell, cell.color);
    }
  }
  addCellToTerritory(cell) {
    let existingCell = this.getCellfromTerritory(cell);
    if (existingCell) {
      this.territory[this.territory.indexOf(existingCell)] = cell
    }
    else{
      this.territory.push(cell);
    }
  }
  getCellfromTerritory(cell){
    for (let currentCell of this.territory) {
      if (cell.row == currentCell.row && cell.column == currentCell.column) {
        return currentCell;
      }
    }
    return false;
  }
}
////// INPUT \\\\\\
function mouseDown() {
  currentMatch.turnComplete = false;
  currentMatch.turnInProgress = true;
}

function mouseUp(){
  currentMatch.turnComplete = true;
  currentMatch.turnInProgress = false;
}


////// SCALING \\\\\\
function windowResized(){
  defineGridSize();
  let boardCanvas = createCanvas(BOARD_SIZE * gridSize, BOARD_SIZE * gridSize);
  boardCanvas.parent("board");

}

function defineGridSize(){
  if (windowWidth < windowHeight) {
    gridSize = windowWidth / BOARD_SIZE;
  }
  else {
    gridSize = windowHeight / BOARD_SIZE;
  }
  halfGridSize = gridSize / 2;
  quarterGridSize = gridSize / 4;
  eighthGridSize = gridSize / 8;
  sixteenthGridSize = gridSize / 16;
}

function coordToCell(x, y){
  return {row: Math.floor(y / gridSize ), column: Math.floor(x / gridSize)};
}

//////  DRAWING \\\\\\

function drawGrid(){
  for (let row = 0; row <= BOARD_SIZE; row++){
    for (let column = 0; column <= BOARD_SIZE; column ++){
        drawGridIntersection(column * gridSize, row * gridSize);
    }
  }
}

function drawGridIntersection(x, y){
  fill(palette.neutral);
  noStroke();
  circle(x,y, eighthGridSize);
}

function drawOutline() {
  noFill();
  stroke(palette.neutral);
  strokeWeight(eighthGridSize);
  square(0,0, gridSize * BOARD_SIZE);
}

function drawGridOutline(x, y, color = 50){
  let cell = coordToCell(x, y);
  noFill();
  stroke(color);
  strokeWeight(gridSize/16);
  square(cell.row * gridSize, cell.column * gridSize, gridSize);
}

function drawGridSquare(cell, color = 50){
  fill(color);
  noStroke();
  square(cell.column * gridSize, cell.row * gridSize, gridSize);
}

function drawPlayer(cell, color){
  let top_left = { x: cell.row * gridSize, y: cell.column * gridSize};
  strokeWeight(sixteenthGridSize);
  stroke(palette.neutral);
  fill(color);
  quad(top_left.x + halfGridSize, top_left.y, top_left.x + gridSize, top_left.y + halfGridSize, top_left.x + halfGridSize, top_left.y + gridSize, top_left.x, top_left.y + halfGridSize);
}
