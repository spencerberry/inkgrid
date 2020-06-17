const BOARD_SIZE = 9;
let grid_size = 1;

function setup(){
  define_grid_size();
  createCanvas(BOARD_SIZE * grid_size, BOARD_SIZE * grid_size);
}

function draw(){
  background(2);
  draw_grid();
  if (mouseIsPressed) {
    draw_grid_square(Math.floor(mouseX / grid_size),
      Math.floor(mouseY / grid_size));
  }
}

function windowResized(){
  define_grid_size();
  createCanvas(BOARD_SIZE * grid_size, BOARD_SIZE * grid_size);
}

function define_grid_size(){
  if (windowWidth < windowHeight) {
    grid_size = windowWidth / BOARD_SIZE;
  }
  else {
    grid_size = windowHeight / BOARD_SIZE;
  }
}

function draw_grid(){
  for (let row = 0; row <= BOARD_SIZE; row++){
    for (let column = 0; column <= BOARD_SIZE; column ++){
        draw_grid_corner(row * grid_size, column * grid_size);
    }
  }
}

function draw_grid_corner(x, y){
  fill(40);
  circle(x,y, grid_size/4);
}

function draw_grid_square(row, column, color = 50){
  fill(color);
  square(row * grid_size, column * grid_size, grid_size);
}
