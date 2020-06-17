const BOARD_SIZE = 9;
let grid_size = 1;
let board;
let currentMatch;

function setup() {
  defineGridSize();
  board = createCanvas(BOARD_SIZE * grid_size, BOARD_SIZE * grid_size);
  board.mousePressed(mouseDown);
  board.mouseReleased(mouseUp);
  currentMatch = new Match();
  palette = {
    background: 10,
    playerOne: color(113, 5, 136),
    playerTwo: color(37, 105, 255)
  }
}

function draw(){
  background(palette.background);
  drawGrid();
  currentMatch.update();

}
var Match = function() {
  this.players = ["playerOne", "playerTwo"];
  this.currentPlayer = 0;
  this.turnComplete = true;
}

Match.prototype.update = function() {
  if (!currentMatch.turnComplete) {
    let currentPlayer = currentMatch.getCurrentPlayer();
    drawGridSquare(mouseX, mouseY, palette[currentPlayer]);
  }
}

Match.prototype.getCurrentPlayer = function() {
  return this.players[this.currentPlayer]
}

function mouseDown() {
  currentMatch.turnComplete = false;
}

function mouseUp(){
  currentMatch.turnComplete = true;
  currentMatch.currentPlayer = (currentMatch.currentPlayer == 0) ? 1 : 0;
}

function windowResized(){
  defineGridSize();
  createCanvas(BOARD_SIZE * grid_size, BOARD_SIZE * grid_size);
}

function defineGridSize(){
  if (windowWidth < windowHeight) {
    grid_size = windowWidth / BOARD_SIZE;
  }
  else {
    grid_size = windowHeight / BOARD_SIZE;
  }
}

function drawGrid(){
  for (let row = 0; row <= BOARD_SIZE; row++){
    for (let column = 0; column <= BOARD_SIZE; column ++){
        drawGridCorner(row * grid_size, column * grid_size);
    }
  }
}

function drawGridCorner(x, y){
  fill(40);
  circle(x,y, grid_size/4);
}

function drawGridSquare(x, y, color = 50){
  let cell = coordToCell(x, y);
  fill(color);
  square(cell.row * grid_size, cell.column * grid_size, grid_size);
}

function coordToCell(x, y){
  return {row: Math.floor(x / grid_size ), column: Math.floor(y / grid_size)};
}
