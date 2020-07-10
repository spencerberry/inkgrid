const BOARD_SIZE = 13;

// let halfGridSize;
// let quarterGridSize;
// let eighthGridSize;
// let sixteenthGridSize;
let boardCanvas;
let currentMatch;

let palette;
let Grid = {
  size: {
    full: 16,
    half: 8,
    quarter: 4,
    eight: 2,
    sixteenth: 1
    },
  coordToPosition: function(x, y){
    let column = Math.floor(x / gridSize);
    let row = Math.floor(y / gridSize );
    return { column, row };
  }
}

function setup() {
  noCursor();
  defineGridSize();
  boardCanvas = createCanvas(BOARD_SIZE * gridSize, BOARD_SIZE * gridSize);
  boardCanvas.parent("board");
  // boardCanvas.mousePressed(mouseDown);
  // boardCanvas.mouseReleased(mouseUp);
  boardCanvas.mouseClicked(boardClicked);
  currentMatch = new Match(BOARD_SIZE);
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
  drawCursorHighlight();
  currentMatch.update();
  currentMatch.draw();
}

// function mouseClicked(event){
//   currentMatch.tryTurn();
//   console.log(event);
// }

////// POSITION \\\\\\
// class Position {
//   constructor(column = 0, row = 0) {
//     this.column = column;
//     this.row = row;
//   }
// }
// ////// CELL \\\\\\
// class Cell {
//   constructor(position = new Position(), color) {
//     this.position = position;
//     this.color = color;
//    }
// }

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
    let top_left = { x: this.column * gridSize, y: this.row * gridSize};
    strokeWeight(sixteenthGridSize);
    stroke(color(10));
    fill(this.color);
    quad(top_left.x + halfGridSize, top_left.y, top_left.x + gridSize, top_left.y + halfGridSize, top_left.x + halfGridSize, top_left.y + gridSize, top_left.x, top_left.y + halfGridSize);
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
    //for {}
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
    this.content[row * this.size + column] = color;
  }

  draw() {
    for (let {column, row, color} of this){
      if (color) {
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

//
// class Territory{
//   constructor(boardSize){
//     this.turf = []
//     for (let i = 0; i < boardSize; i++){
//       this.turf[i]=[]
//         for (let j = 0; j < boardSize; j++){
//           this.turf[i][j];
//       }
//     }
//   }
//   contentsAt(position) {
//     return this.turf[position.column][position.row];
//   }
//   ink(position, value) {
//     this.turf[position.column][position.row] = value;
//   }
//
//   draw() {
//     for (let column = 0; column < this.turf.length; column++){
//       for ( let row = 0; row < this.turf[column].length; row++){
//         let color = this.turf[column][row];
//         if (color != undefined){
//           drawGridSquare(new Position(column, row), color);
//         }
//       }
//     }
//   }
// }


////// MATCH \\\\\\
class Match {
  constructor(boardSize) {
    this.players = [
      new Player('bandaid', color(113, 5, 136), 1, 1),
      new Player('ointment', color(37, 105, 255), boardSize-2, boardSize - 2)];
    this.turnCount = 0;
    //this.currentPlayer;
    this.board = new Board(boardSize);
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
    this.board.draw();
    for (let player of this.players){
      player.draw();
    }
  }
  tryTurn(){
    let cursorPosition = Grid.coordToPosition(mouseX, mouseY);
    if (this.currentPlayer.column == cursorPosition.column && this.currentPlayer.row == cursorPosition.row ){
      let color = this.currentPlayer.color;
      let column = this.currentPlayer.column;
      let row = this.currentPlayer.row;
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
        this.board.set(column + cell.column, row + cell.row, color);
      }
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
  let turnColor = palette.neutral;
  if (currentMatch.currentPlayer) {
    turnColor = currentMatch.currentPlayer.color;
  }
  noFill();
  stroke(turnColor);
  strokeWeight(eighthGridSize);
  square(0,0, gridSize * BOARD_SIZE);
}

function drawGridOutline(x, y, color = 50){
  let cell = Grid.coordToPosition(x, y);
  noFill();
  stroke(color);
  strokeWeight(gridSize/16);
  square(cell.column * gridSize, cell.row * gridSize, gridSize);
}

function drawGridSquare(column, row, color = 50){
  fill(color);
  noStroke();
  square(column * gridSize, row * gridSize, gridSize);
}

function drawCursorHighlight(){
  let color = currentMatch.currentPlayer.color;
  drawGridOutline(mouseX, mouseY, color);
}
