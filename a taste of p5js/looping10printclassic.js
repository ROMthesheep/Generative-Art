let x= 0;
let y = 0;
let espacio = 20;
let WIDTH=1080;
let HEIGHT=720;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  background(0);
}

function draw() {
  fill(0);
  stroke(0);
  rect(x,y,espacio,espacio)
  stroke(255);
  if (random(1) < 0.5) {
    line(x, y, x+espacio, y+espacio);
  } else {
    line(x, y+espacio, x+espacio, y);
  }
  x+=espacio;
  if(x==WIDTH){
    x=0;
    y+=espacio;
  }
  if (y==HEIGHT) {
    x=0;
    y=0;
  }
}
