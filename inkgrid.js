const BOARD_SIZE = 9;

// let grid.halfSize;
// let quarterGridSize;
// let grid.eighthSize;
// let grid.sixteenthSize;
let boardCanvas;
let currentMatch;
let grid;

let palette;
let Grid = class Grid {
  constructor(){
    this.setSizeByWindow();
  }

  setSizeByWindow(){
    if (windowWidth < windowHeight) {
      this.size = windowWidth / BOARD_SIZE;
    }
    else {
      this.size = windowHeight / BOARD_SIZE;
    }
  }

  get halfSize() { return this.size / 2;}
  get quarterSize() { return this.size / 4;}
  get eighthSize() { return this.size / 8;}
  get sixteenthSize() { return this.size / 16;}

  fromCoord(x, y) {
    let column = Math.floor(x / grid.size);
    let row = Math.floor(y / grid.size );
    return { column, row };
  }
}

function setup() {
  noCursor();
  grid = new Grid();
  currentMatch = new Match(BOARD_SIZE);
  boardCanvas = createCanvas(BOARD_SIZE * grid.size, BOARD_SIZE * grid.size);
  boardCanvas.parent("board");
  boardCanvas.mouseClicked(boardClicked);

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
  drawCursorHighlight();

}

////// PLAYER \\\\\\
class Player {
  constructor(name, color, column, row) {
    this.name = name;
    this.color = color;
    this.column = column;
    this.row = row;
    this.speed = 2;
    this.range = 4;
  }
  draw() {
    let top_left = { x: this.column * grid.size, y: this.row * grid.size};
    strokeWeight(grid.sixteenthSize);
    stroke(color(10));
    this.color.setAlpha(255);
    fill(this.color);
    quad(top_left.x + grid.halfSize, top_left.y, top_left.x + grid.size, top_left.y + grid.halfSize, top_left.x + grid.halfSize, top_left.y + grid.size, top_left.x, top_left.y + grid.halfSize);
  }
  canMove(column, row) {
    let columnDistance = column - this.column;
    let rowDistance = row - this.row;
    if (Math.abs(columnDistance) + Math.abs(rowDistance) <= this.speed){
      return true;
    }
    return false;
  }
  moveTo(column, row) {
    this.column = column;
    this.row = row;
  }
  pop(){
    let cellBatch = []
    let diamond = [
      {column: 0, row: -2},
      {column: -1, row: -1},
      {column: 0, row: -1},
      {column: 1, row: -1},
      {column: -2, row: 0},
      {column: -1, row: 0},
      {column: 0, row: 0},
      {column: 1, row: 0},
      {column: 2, row: 0},
      {column: -1, row: 1},
      {column: 0, row: 1},
      {column: 1, row: 1},
      {column: 0, row: 2}
    ]
    for (let cell of diamond){
      cellBatch.push( {
        column: this.column + cell.column,
        row: this.row + cell.row});
    }
    return {cells: cellBatch, color: this.color};
  }
}

class Turf {
  constructor(){
    this._turf = ['a','b'];

  }
  get this(){
    return this._turf
  }
  draw() {};
}

class Board {
  constructor(size, color = (column, row) => undefined) {
    this.size = size;
    this.content = [];

    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {
        this.content[row * size + column] = color(column, row);
      }
    }
  }
  get(row, column) {
    return this.content[row * this.size + column];
  }
  set(row, column, color) {
    if (row >= 0 && row < this.size && column >= 0 && column < this.size) {
      this.content[row * this.size + column] = color;
      for (let player of currentMatch.players) {
        if (player != currentMatch.currentPlayer && row == player.row && column == player.column) {
          currentMatch.gameOver;
          console.log(currentMatch.currentPlayer.name, " wins!");
        }
      }
    }
  }
  setMultiple(cells, color){
    for (let cell of cells){
      this.set(cell.column, cell.row, color);
    }
  }

  draw() {
    for (let {column, row, color} of this){
      if (color) {
        color.setAlpha(125);
        drawGridSquare(column, row, color)
      }
    }
  }
  [Symbol.iterator]() {
    return new BoardIterator(this);
  }
}

class BoardIterator {
  constructor(board) {
    this.column = 0;
    this.row = 0;
    this.board = board;
  }

  next() {
    if (this.row == this.board.size) return {done: true};

    let value = {
      column: this.column,
      row: this.row,
      color: this.board.get(this.column, this.row)};
    this.column++;
    if (this.column == this.board.size) {
      this.column = 0;
      this.row++;
    }
    return {value, done: false};
  }
}

////// MATCH \\\\\\
class Match {
  constructor(boardSize) {
    this.players = [
      new Player('bandaid', color(113, 5, 136), 1, 1),
      new Player('ointment', color(37, 105, 255), boardSize-2, boardSize - 2)];
    this.turnCount = 0;
    //this.currentPlayer;
    this.board = new Board(boardSize);
    this.gameOver = false;
  }

  get currentPlayerIndex(){
    return this.turnCount % this.players.length
  }
  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  update() {
  }
  draw(){
    //blendMode(ADD)
    this.board.draw();
    for (let player of this.players){
      player.draw();
    }
  }
  tryTurn(){
    let cursorPosition = grid.fromCoord(mouseX, mouseY);
    if (this.currentPlayer.column == cursorPosition.column && this.currentPlayer.row == cursorPosition.row ){
      let attack = this.currentPlayer.pop();
      this.board.setMultiple(attack.cells, attack.color);
      this.turnCount++;
    }
    else if (this.currentPlayer.canMove(cursorPosition.column, cursorPosition.row) ) {
      this.currentPlayer.moveTo(cursorPosition.column, cursorPosition.row);
      this.board.set(this.currentPlayer.column, this.currentPlayer.row, this.currentPlayer.color);
      this.turnCount++;
    }
  }

}
////// INPUT \\\\\\
// function mouseDown() {
//   currentMatch.turnComplete = false;
//   currentMatch.turnInProgress = true;
// }
//
// function mouseUp(){
//   currentMatch.turnComplete = true;
//   currentMatch.turnInProgress = false;
// }

function boardClicked(){
  currentMatch.tryTurn();
}

////// SCALING \\\\\\
function windowResized(){
  grid.setSizeByWindow();
  let boardCanvas = createCanvas(BOARD_SIZE * grid.size, BOARD_SIZE * grid.size);
  boardCanvas.parent("board");
}

//////  DRAWING \\\\\\

function drawGrid(){
  for (let row = 0; row <= BOARD_SIZE; row++){
    for (let column = 0; column <= BOARD_SIZE; column ++){
        drawGridIntersection(column * grid.size, row * grid.size);
    }
  }
}

function drawGridIntersection(x, y){
  fill(palette.neutral);
  noStroke();
  circle(x,y, grid.eighthSize);
}

function drawOutline() {
  let turnColor = palette.neutral;
  if (currentMatch.currentPlayer) {
    turnColor = currentMatch.currentPlayer.color;
  }
  noFill();
  stroke(turnColor);
  strokeWeight(grid.eighthSize);
  square(0,0, grid.size * BOARD_SIZE);
}

function drawGridOutline(x, y, color = 50){
  let cell = grid.fromCoord(x, y);
  noFill();
  stroke(color);
  strokeWeight(grid.size/16);
  square(cell.column * grid.size, cell.row * grid.size, grid.size);
}

function drawGridSquare(column, row, color = 50){
  fill(color);
  noStroke();
  square(column * grid.size, row * grid.size, grid.size);
}

function drawCursorHighlight(){
  //if currentMatch.currentPlayer.canMove
  let color = currentMatch.currentPlayer.color;
  drawGridOutline(mouseX, mouseY, color);
}
