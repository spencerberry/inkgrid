const BOARD_SIZE = 13;

// let gridSize;
// let halfGridSize;
// let quarterGridSize;
// let eighthGridSize;
// let sixteenthGridSize;
let boardCanvas;
let currentMatch;

let palette
let Grid = {
  size: {
    full: 16,
    half: 8,
    quarter: 4,
    eight: 2,
    sixteenth: 1
    },
  coordToPosition: function(x, y){
    let position = new Position(Math.floor(x / gridSize), Math.floor(y / gridSize ));
    return position;
  },
  get size() {
    return this.size.full;
  }
}

function setup() {
  //noCursor();
  defineGridSize();
  boardCanvas = createCanvas(BOARD_SIZE * gridSize, BOARD_SIZE * gridSize);
  boardCanvas.parent("board");
  boardCanvas.mousePressed(mouseDown);
  boardCanvas.mouseReleased(mouseUp);
  boardCanvas.mouseClicked(boardClicked);
  currentMatch = new Match();
  palette = {
    background: 0,
    neutral: 30,
    playerOne: color(113, 5, 136),
    playerTwo: color(37, 105, 255)
  }

}

function draw(){
  background(palette.background);
  drawGrid();
  drawOutline();
  currentMatch.update();
  currentMatch.draw();
}

// function mouseClicked(event){
//   currentMatch.tryTurn();
//   console.log(event);
// }

////// POSITION \\\\\\
class Position {
  constructor(column = 0, row = 0) {
    this.column = column;
    this.row = row;
  }
}
////// CELL \\\\\\
class Cell {
  constructor(position = new Position(), color) {
    this.position = position;
    this.color = color;
   }
}

////// PLAYER \\\\\\
class Player {
  constructor(name, color, position = new Position()) {
    this.name = name;
    this.color = color;
    this.position = position;
  }
  draw() {
    let top_left = { x: this.position.column * gridSize, y: this.position.row * gridSize};
    strokeWeight(sixteenthGridSize);
    stroke(color(10));
    fill(this.color);
    quad(top_left.x + halfGridSize, top_left.y, top_left.x + gridSize, top_left.y + halfGridSize, top_left.x + halfGridSize, top_left.y + gridSize, top_left.x, top_left.y + halfGridSize);
  }
  canMove() {
    return true;
  }
  moveTo(position) {
    this.position = position;
  }
}

////// MATCH \\\\\\
class Match {
  constructor() {
    this.players = [
      new Player('bandaid', color(113, 5, 136), new Position(0,8)),
      new Player('ointment', color(37, 105, 255), new Position(0,0))];
    this.turnCount = 0;
    this.currentPlayer;
    this.turnComplete = true;
    this.territory = [];
  }
  update() {
    this.currentPlayer = this.players[this.turnCount % this.players.length];

    // if (this.turnInProgress) {
    //   drawGridSquare(Grid.coordToPosition(mouseX, mouseY), palette[this.currentPlayer]);
    // }
    // else if (this.turnComplete){
    //   let current_cell = Grid.coordToPosition(mouseX, mouseY)
    //   let currentPlayer = this.CurrentPlayer;
    //   let newCell = new Cell(current_cell.column, current_cell.row, palette[currentPlayer]);
    //   this.addCellToTerritory(newCell);
    //   this.turnComplete = false;
    //   this.currentPlayer = (currentMatch.currentPlayer == 0) ? 1 : 0;
    // }
  }
  draw(){
    for (let cell of this.territory){
      drawGridSquare(cell, cell.color);
    }
    for (let player of this.players){
      player.draw();
    }
  }
  tryTurn(){
    let currentPosition = Grid.coordToPosition(mouseX, mouseY);
    if ( currentMatch.currentPlayer.canMove(currentPosition) ) {
      currentMatch.currentPlayer.moveTo(currentPosition);
      currentMatch.turnCount++;
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

function boardClicked(){
  currentMatch.tryTurn();
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
  let cell = Grid.coordToPosition(x, y);
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
