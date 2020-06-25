const BOARD_SIZE = 13;

let gridSize;
let halfGridSize;
let quarterGridSize;
let eighthGridSize;
let sixteenthGridSize;
let boardCanvas;
let currentMatch;

let p1;

function setup() {
  defineGridSize();
  boardCanvas = createCanvas(BOARD_SIZE * gridSize, BOARD_SIZE * gridSize);
  boardCanvas.mousePressed(mouseDown);
  boardCanvas.mouseReleased(mouseUp);
  currentMatch = new Match();
  palette = {
    background: 0,
    neutral: 30,
    playerOne: color(113, 5, 136),
    playerTwo: color(37, 105, 255)
  }
  p1 = new Player({row: Math.floor(Math.random()*BOARD_SIZE), column: BOARD_SIZE-1}, 'One', palette.playerOne);
}

function draw(){
  background(palette.background);
  drawGrid();
  drawOutline();
  //p1.draw();
  currentMatch.update();
}

class Cell {
  constructor(column, row, color){
    this.column = column;
    this.row = row;
    this.color = color;
   }
}

var Player = function(cell, name, color){
  this.cell = cell;
  this.name = name;
  this.color = color;
  this.territory = [];
}

Player.prototype.draw = function(){
  let top_left_coord = { x: this.cell.column * gridSize, y: this.cell.row * gridSize};
  strokeWeight(sixteenthGridSize);
  stroke(palette.neutral);
  fill(this.color);
  quad(top_left_coord.x + halfGridSize, top_left_coord.y,
    top_left_coord.x + gridSize, top_left_coord.y + halfGridSize,
    top_left_coord.x + halfGridSize, top_left_coord.y + gridSize,
    top_left_coord.x, top_left_coord.y + halfGridSize);
  text(this.name,top_left_coord.x, top_left_coord.y);
}

var Match = function() {
  this.players = ["playerOne", "playerTwo"];
  this.currentPlayer = 0;
  this.turnComplete = true;
  this.territory = [];
}

Match.prototype.update = function() {
  if (currentMatch.turnInProgress) {
    let currentPlayer = currentMatch.getCurrentPlayer();
    drawGridSquare(coordToCell(mouseX, mouseY), palette[currentPlayer]);
  }
  else if (currentMatch.turnComplete){
    let current_cell = coordToCell(mouseX, mouseY)
    let currentPlayer = currentMatch.getCurrentPlayer();
    let newCell = new Cell(current_cell.column, current_cell.row, palette[currentPlayer]);
    this.addCellToTerritory(newCell);
    currentMatch.turnComplete = false;
    currentMatch.currentPlayer = (currentMatch.currentPlayer == 0) ? 1 : 0;
  }
  for (cell of this.territory){
    drawGridSquare(cell, cell.color);
  }
}

Match.prototype.getCurrentPlayer = function() {
  return this.players[this.currentPlayer]
}

function mouseDown() {
  currentMatch.turnComplete = false;
  currentMatch.turnInProgress = true;
}

function mouseUp(){
  currentMatch.turnComplete = true;
  currentMatch.turnInProgress = false;
}

Match.prototype.addCellToTerritory = function(cell) {
  let existingCell = this.getCellfromTerritory(cell);
  if (existingCell) {
    this.territory[this.territory.indexOf(existingCell)] = cell
  }
  else{
    this.territory.push(cell);
  }
}
Match.prototype.getCellfromTerritory = function(cell){
  for (currentCell of this.territory) {
    if (cell.row == currentCell.row && cell.column == currentCell.column) {
      return currentCell;
    }
  }
  return false;
}

function windowResized(){
  defineGridSize();
  createCanvas(BOARD_SIZE * gridSize, BOARD_SIZE * gridSize);
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
  stroke(palette[currentMatch.getCurrentPlayer()]);
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

function drawPlayer(cell, color = palette.playerOne){
  let top_left = { x: cell.row * gridSize, y: cell.column * gridSize};
  strokeWeight(sixteenthGridSize);
  stroke(palette.neutral);
  fill(color);
  quad(top_left.x + halfGridSize, top_left.y, top_left.x + gridSize, top_left.y + halfGridSize, top_left.x + halfGridSize, top_left.y + gridSize, top_left.x, top_left.y + halfGridSize);
}

function coordToCell(x, y){
  return {row: Math.floor(y / gridSize ), column: Math.floor(x / gridSize)};
}
